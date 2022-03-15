namespace ASC.Files.Thirdparty.Box;

[Transient]
[DebuggerDisplay("{CustomerTitle}")]
internal class BoxProviderInfo : IProviderInfo
{
    public OAuth20Token Token { get; set; }
    private string _rootId;

    internal Task<BoxStorage> StorageAsync
    {
        get
        {
            if (_wrapper.Storage == null || !_wrapper.Storage.IsOpened)
            {
                return _wrapper.CreateStorageAsync(Token, ID);
            }

            return Task.FromResult(_wrapper.Storage);
        }
    }

    internal bool StorageOpened => _wrapper.Storage != null && _wrapper.Storage.IsOpened;
    public int ID { get; set; }
    public Guid Owner { get; set; }
    public string CustomerTitle { get; set; }
    public DateTime CreateOn { get; set; }
    public string RootFolderId => "box-" + ID;
    public string ProviderKey { get; set; }
    public FolderType RootFolderType { get; set; }

    public string BoxRootId
    {
        get
        {
            if (string.IsNullOrEmpty(_rootId))
            {
                var storage = StorageAsync.Result;
                _rootId = storage.GetRootFolderIdAsync().Result;
            }

            return _rootId;
        }
    }

    private BoxStorageDisposableWrapper _wrapper;
    private BoxProviderInfoHelper _boxProviderInfoHelper;

    public BoxProviderInfo(
        BoxStorageDisposableWrapper wrapper,
        BoxProviderInfoHelper boxProviderInfoHelper)
    {
        _wrapper = wrapper;
        _boxProviderInfoHelper = boxProviderInfoHelper;
    }

    public void Dispose()
    {
        if (StorageOpened)
        {
            StorageAsync.Result.Close();
        }
    }

    public Task<bool> CheckAccessAsync()
    {
        try
        {
            return Task.FromResult(!string.IsNullOrEmpty(BoxRootId));
        }
        catch (UnauthorizedAccessException)
        {
            return Task.FromResult(false);
        }
    }

    public Task InvalidateStorageAsync()
    {
        if (_wrapper != null)
        {
            _wrapper.Dispose();
        }

        return CacheResetAsync();
    }

    public void UpdateTitle(string newtitle)
    {
        CustomerTitle = newtitle;
    }

    internal async Task<BoxFolder> GetBoxFolderAsync(string dropboxFolderPath)
    {
        var storage = await StorageAsync;

        return await _boxProviderInfoHelper.GetBoxFolderAsync(storage, ID, dropboxFolderPath);
    }

    internal async ValueTask<BoxFile> GetBoxFileAsync(string dropboxFilePath)
    {
        var storage = await StorageAsync;

        return await _boxProviderInfoHelper.GetBoxFileAsync(storage, ID, dropboxFilePath);
    }

    internal async Task<List<BoxItem>> GetBoxItemsAsync(string dropboxFolderPath)
    {
        var storage = await StorageAsync;

        return await _boxProviderInfoHelper.GetBoxItemsAsync(storage, ID, dropboxFolderPath);
    }

    internal Task CacheResetAsync(BoxItem boxItem)
    {
        return _boxProviderInfoHelper.CacheResetAsync(ID, boxItem);
    }

    internal Task CacheResetAsync(string boxPath = null, bool? isFile = null)
    {
        return _boxProviderInfoHelper.CacheResetAsync(BoxRootId, ID, boxPath, isFile);
    }
}

[Scope]
internal class BoxStorageDisposableWrapper : IDisposable
{
    public BoxStorage Storage { get; private set; }

    private readonly ConsumerFactory _consumerFactory;
    private readonly TempStream _tempStream;
    private readonly IServiceProvider _serviceProvider;

    public BoxStorageDisposableWrapper(ConsumerFactory consumerFactory, TempStream tempStream, IServiceProvider serviceProvider)
    {
        _consumerFactory = consumerFactory;
        _tempStream = tempStream;
        _serviceProvider = serviceProvider;
    }

    internal Task<BoxStorage> CreateStorageAsync(OAuth20Token token, int id)
    {
        if (Storage != null && Storage.IsOpened)
        {
            return Task.FromResult(Storage);
        }

        return InternalCreateStorageAsync(token, id);
    }

    private async Task<BoxStorage> InternalCreateStorageAsync(OAuth20Token token, int id)
    {
        var boxStorage = new BoxStorage(_tempStream);
        await CheckTokenAsync(token, id).ConfigureAwait(false);

        boxStorage.Open(token);

        return Storage = boxStorage;
    }

    private Task CheckTokenAsync(OAuth20Token token, int id)
    {
        if (token == null)
        {
            throw new UnauthorizedAccessException("Cannot create Box session with given token");
        }

        return InternalCheckTokenAsync(token, id);
    }

    private async Task InternalCheckTokenAsync(OAuth20Token token, int id)
    {
        if (token.IsExpired)
        {
            token = OAuth20TokenHelper.RefreshToken<BoxLoginProvider>(_consumerFactory, token);

            var dbDao = _serviceProvider.GetService<ProviderAccountDao>();
            await dbDao.UpdateProviderInfoAsync(id, new AuthData(token: token.ToJson())).ConfigureAwait(false);
        }
    }

    public void Dispose()
    {
        if (Storage != null)
        {
            Storage.Close();
            Storage = null;
        }
    }
}

[Singletone]
public class BoxProviderInfoHelper
{
    private readonly TimeSpan _cacheExpiration = TimeSpan.FromMinutes(1);
    private readonly ICache _cacheFile;
    private readonly ICache _cacheFolder;
    private readonly ICache _cacheChildItems;
    private readonly ICacheNotify<BoxCacheItem> _cacheNotify;

    public BoxProviderInfoHelper(ICacheNotify<BoxCacheItem> cacheNotify, ICache cache)
    {
        _cacheFile = cache;
        _cacheFolder = cache;
        _cacheChildItems = cache;
        _cacheNotify = cacheNotify;
        _cacheNotify.Subscribe((i) =>
        {
            if (i.ResetAll)
            {
                _cacheChildItems.Remove(new Regex("^box-" + i.Key + ".*"));
                _cacheFile.Remove(new Regex("^boxf-" + i.Key + ".*"));
                _cacheFolder.Remove(new Regex("^boxd-" + i.Key + ".*"));
            }

            if (!i.IsFileExists)
            {
                _cacheChildItems.Remove("box-" + i.Key);

                _cacheFolder.Remove("boxd-" + i.Key);
            }
            else
            {
                if (i.IsFileExists)
                {
                    _cacheFile.Remove("boxf-" + i.Key);
                }
                else
                {
                    _cacheFolder.Remove("boxd-" + i.Key);
                }
            }
        }, CacheNotifyAction.Remove);
    }

    internal async Task<BoxFolder> GetBoxFolderAsync(BoxStorage storage, int id, string boxFolderId)
    {
        var folder = _cacheFolder.Get<BoxFolder>("boxd-" + id + "-" + boxFolderId);
        if (folder == null)
        {
            folder = await storage.GetFolderAsync(boxFolderId).ConfigureAwait(false);
            if (folder != null)
            {
                _cacheFolder.Insert("boxd-" + id + "-" + boxFolderId, folder, DateTime.UtcNow.Add(_cacheExpiration));
            }
        }

        return folder;
    }

    internal async ValueTask<BoxFile> GetBoxFileAsync(BoxStorage storage, int id, string boxFileId)
    {
        var file = _cacheFile.Get<BoxFile>("boxf-" + id + "-" + boxFileId);
        if (file == null)
        {
            file = await storage.GetFileAsync(boxFileId).ConfigureAwait(false);
            if (file != null)
            {
                _cacheFile.Insert("boxf-" + id + "-" + boxFileId, file, DateTime.UtcNow.Add(_cacheExpiration));
            }
        }

        return file;
    }

    internal async Task<List<BoxItem>> GetBoxItemsAsync(BoxStorage storage, int id, string boxFolderId)
    {
        var items = _cacheChildItems.Get<List<BoxItem>>("box-" + id + "-" + boxFolderId);

        if (items == null)
        {
            items = await storage.GetItemsAsync(boxFolderId).ConfigureAwait(false);
            _cacheChildItems.Insert("box-" + id + "-" + boxFolderId, items, DateTime.UtcNow.Add(_cacheExpiration));
        }

        return items;
    }

    internal async Task CacheResetAsync(int id, BoxItem boxItem)
    {
        if (boxItem != null)
        {
            await _cacheNotify.PublishAsync(new BoxCacheItem { IsFile = boxItem is BoxFile, Key = id + "-" + boxItem.Id }, Common.Caching.CacheNotifyAction.Remove).ConfigureAwait(false);
        }
    }

    internal async Task CacheResetAsync(string boxRootId, int id, string boxId = null, bool? isFile = null)
    {
        var key = id + "-";
        if (boxId == null)
        {
            await _cacheNotify.PublishAsync(new BoxCacheItem { ResetAll = true, Key = key }, Common.Caching.CacheNotifyAction.Remove).ConfigureAwait(false);
        }
        else
        {
            if (boxId == boxRootId)
            {
                boxId = "0";
            }

            key += boxId;

            await _cacheNotify.PublishAsync(new BoxCacheItem { IsFile = isFile ?? false, IsFileExists = isFile.HasValue, Key = key }, Common.Caching.CacheNotifyAction.Remove).ConfigureAwait(false);
        }
    }
}
