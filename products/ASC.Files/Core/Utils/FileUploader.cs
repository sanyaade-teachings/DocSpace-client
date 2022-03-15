namespace ASC.Web.Files.Utils;

[Scope]
public class FileUploader
{
    private readonly FilesSettingsHelper _filesSettingsHelper;
    private readonly FileUtility _fileUtility;
    private readonly UserManager _userManager;
    private readonly TenantManager _tenantManager;
    private readonly AuthContext _authContext;
    private readonly SetupInfo _setupInfo;
    private readonly TenantExtra _tenantExtra;
    private readonly TenantStatisticsProvider _tenantStatisticsProvider;
    private readonly FileMarker _fileMarker;
    private readonly FileConverter _fileConverter;
    private readonly IDaoFactory _daoFactory;
    private readonly Global _global;
    private readonly FilesLinkUtility _filesLinkUtility;
    private readonly FilesMessageService _filesMessageService;
    private readonly FileSecurity _fileSecurity;
    private readonly EntryManager _entryManager;
    private readonly IServiceProvider _serviceProvider;
    private readonly ChunkedUploadSessionHolder _chunkedUploadSessionHolder;
    private readonly FileTrackerHelper _fileTracker;

    public FileUploader(
        FilesSettingsHelper filesSettingsHelper,
        FileUtility fileUtility,
        UserManager userManager,
        TenantManager tenantManager,
        AuthContext authContext,
        SetupInfo setupInfo,
        TenantExtra tenantExtra,
        TenantStatisticsProvider tenantStatisticsProvider,
        FileMarker fileMarker,
        FileConverter fileConverter,
        IDaoFactory daoFactory,
        Global global,
        FilesLinkUtility filesLinkUtility,
        FilesMessageService filesMessageService,
        FileSecurity fileSecurity,
        EntryManager entryManager,
        IServiceProvider serviceProvider,
        ChunkedUploadSessionHolder chunkedUploadSessionHolder,
        FileTrackerHelper fileTracker)
    {
        _filesSettingsHelper = filesSettingsHelper;
        _fileUtility = fileUtility;
        _userManager = userManager;
        _tenantManager = tenantManager;
        _authContext = authContext;
        _setupInfo = setupInfo;
        _tenantExtra = tenantExtra;
        _tenantStatisticsProvider = tenantStatisticsProvider;
        _fileMarker = fileMarker;
        _fileConverter = fileConverter;
        _daoFactory = daoFactory;
        _global = global;
        _filesLinkUtility = filesLinkUtility;
        _filesMessageService = filesMessageService;
        _fileSecurity = fileSecurity;
        _entryManager = entryManager;
        _serviceProvider = serviceProvider;
        _chunkedUploadSessionHolder = chunkedUploadSessionHolder;
        _fileTracker = fileTracker;
    }

    public Task<File<T>> ExecAsync<T>(T folderId, string title, long contentLength, Stream data)
    {
        return ExecAsync(folderId, title, contentLength, data, !_filesSettingsHelper.UpdateIfExist);
    }

    public async Task<File<T>> ExecAsync<T>(T folderId, string title, long contentLength, Stream data, bool createNewIfExist, bool deleteConvertStatus = true)
    {
        if (contentLength <= 0)
        {
            throw new Exception(FilesCommonResource.ErrorMassage_EmptyFile);
        }

        var file = await VerifyFileUploadAsync(folderId, title, contentLength, !createNewIfExist);

        var dao = _daoFactory.GetFileDao<T>();
        file = await dao.SaveFileAsync(file, data);

        var linkDao = _daoFactory.GetLinkDao();
        await linkDao.DeleteAllLinkAsync(file.ID.ToString());

        await _fileMarker.MarkAsNewAsync(file);

        if (_fileConverter.EnableAsUploaded && _fileConverter.MustConvert(file))
        {
            await _fileConverter.ExecAsynchronouslyAsync(file, deleteConvertStatus);
        }

        return file;
    }

    public async Task<File<T>> VerifyFileUploadAsync<T>(T folderId, string fileName, bool updateIfExists, string relativePath = null)
    {
        fileName = Global.ReplaceInvalidCharsAndTruncate(fileName);

        if (_global.EnableUploadFilter && !_fileUtility.ExtsUploadable.Contains(FileUtility.GetFileExtension(fileName)))
        {
            throw new NotSupportedException(FilesCommonResource.ErrorMassage_NotSupportedFormat);
        }

        folderId = await GetFolderIdAsync(folderId, string.IsNullOrEmpty(relativePath) ? null : relativePath.Split('/').ToList());

        var fileDao = _daoFactory.GetFileDao<T>();
        var file = await fileDao.GetFileAsync(folderId, fileName);

        if (updateIfExists && await CanEditAsync(file))
        {
            file.Title = fileName;
            file.ConvertedType = null;
            file.Comment = FilesCommonResource.CommentUpload;
            file.Version++;
            file.VersionGroup++;
            file.Encrypted = false;
            file.ThumbnailStatus = Thumbnail.Waiting;

            return file;
        }

        var newFile = _serviceProvider.GetService<File<T>>();
        newFile.FolderID = folderId;
        newFile.Title = fileName;

        return newFile;
    }

    public async Task<File<T>> VerifyFileUploadAsync<T>(T folderId, string fileName, long fileSize, bool updateIfExists)
    {
        if (fileSize <= 0)
        {
            throw new Exception(FilesCommonResource.ErrorMassage_EmptyFile);
        }

        var maxUploadSize = await GetMaxFileSizeAsync(folderId);

        if (fileSize > maxUploadSize)
        {
            throw FileSizeComment.GetFileSizeException(maxUploadSize);
        }

        var file = await VerifyFileUploadAsync(folderId, fileName, updateIfExists);
        file.ContentLength = fileSize;

        return file;
    }

    private async Task<bool> CanEditAsync<T>(File<T> file)
    {
        return file != null
               && await _fileSecurity.CanEditAsync(file)
               && !_userManager.GetUsers(_authContext.CurrentAccount.ID).IsVisitor(_userManager)
               && !await _entryManager.FileLockedForMeAsync(file.ID)
               && !_fileTracker.IsEditing(file.ID)
               && file.RootFolderType != FolderType.TRASH
               && !file.Encrypted;
    }

    private async Task<T> GetFolderIdAsync<T>(T folderId, IList<string> relativePath)
    {
        var folderDao = _daoFactory.GetFolderDao<T>();
        var folder = await folderDao.GetFolderAsync(folderId);

        if (folder == null)
        {
            throw new DirectoryNotFoundException(FilesCommonResource.ErrorMassage_FolderNotFound);
        }

        if (!await _fileSecurity.CanCreateAsync(folder))
        {
            throw new SecurityException(FilesCommonResource.ErrorMassage_SecurityException_Create);
        }

        if (relativePath != null && relativePath.Count > 0)
        {
            var subFolderTitle = Global.ReplaceInvalidCharsAndTruncate(relativePath.FirstOrDefault());

            if (!string.IsNullOrEmpty(subFolderTitle))
            {
                folder = await folderDao.GetFolderAsync(subFolderTitle, folder.ID);

                if (folder == null)
                {
                    var newFolder = _serviceProvider.GetService<Folder<T>>();
                    newFolder.Title = subFolderTitle;
                    newFolder.FolderID = folderId;

                    folderId = await folderDao.SaveFolderAsync(newFolder);

                    folder = await folderDao.GetFolderAsync(folderId);
                    _filesMessageService.Send(folder, MessageAction.FolderCreated, folder.Title);
                }

                folderId = folder.ID;

                relativePath.RemoveAt(0);
                folderId = await GetFolderIdAsync(folderId, relativePath);
            }
        }

        return folderId;
    }

    #region chunked upload

    public async Task<File<T>> VerifyChunkedUploadAsync<T>(T folderId, string fileName, long fileSize, bool updateIfExists, ApiDateTime lastModified, string relativePath = null)
    {
        var maxUploadSize = await GetMaxFileSizeAsync(folderId, true);

        if (fileSize > maxUploadSize)
        {
            throw FileSizeComment.GetFileSizeException(maxUploadSize);
        }

        var file = await VerifyFileUploadAsync(folderId, fileName, updateIfExists, relativePath);
        file.ContentLength = fileSize;

        if (lastModified != null)
        {
            file.ModifiedOn = lastModified;
        }

        return file;
    }

    public async Task<ChunkedUploadSession<T>> InitiateUploadAsync<T>(T folderId, T fileId, string fileName, long contentLength, bool encrypted)
    {
        var file = _serviceProvider.GetService<File<T>>();
        file.ID = fileId;
        file.FolderID = folderId;
        file.Title = fileName;
        file.ContentLength = contentLength;

        var dao = _daoFactory.GetFileDao<T>();
        var uploadSession = await dao.CreateUploadSessionAsync(file, contentLength);

        uploadSession.Expired = uploadSession.Created + ChunkedUploadSessionHolder.SlidingExpiration;
        uploadSession.Location = _filesLinkUtility.GetUploadChunkLocationUrl(uploadSession.Id);
        uploadSession.TenantId = _tenantManager.GetCurrentTenant().Id;
        uploadSession.UserId = _authContext.CurrentAccount.ID;
        uploadSession.FolderId = folderId;
        uploadSession.CultureName = Thread.CurrentThread.CurrentUICulture.Name;
        uploadSession.Encrypted = encrypted;

        await _chunkedUploadSessionHolder.StoreSessionAsync(uploadSession);

        return uploadSession;
    }

    public async Task<ChunkedUploadSession<T>> UploadChunkAsync<T>(string uploadId, Stream stream, long chunkLength)
    {
        var uploadSession = await _chunkedUploadSessionHolder.GetSessionAsync<T>(uploadId);
        uploadSession.Expired = DateTime.UtcNow + ChunkedUploadSessionHolder.SlidingExpiration;

        if (chunkLength <= 0)
        {
            throw new Exception(FilesCommonResource.ErrorMassage_EmptyFile);
        }

        if (chunkLength > _setupInfo.ChunkUploadSize)
        {
            throw FileSizeComment.GetFileSizeException(_setupInfo.MaxUploadSize(_tenantExtra, _tenantStatisticsProvider));
        }

        var maxUploadSize = await GetMaxFileSizeAsync(uploadSession.FolderId, uploadSession.BytesTotal > 0);

        if (uploadSession.BytesUploaded + chunkLength > maxUploadSize)
        {
            await AbortUploadAsync(uploadSession);

            throw FileSizeComment.GetFileSizeException(maxUploadSize);
        }

        var dao = _daoFactory.GetFileDao<T>();
        await dao.UploadChunkAsync(uploadSession, stream, chunkLength);

        if (uploadSession.BytesUploaded == uploadSession.BytesTotal)
        {
            var linkDao = _daoFactory.GetLinkDao();
            await linkDao.DeleteAllLinkAsync(uploadSession.File.ID.ToString());

            await _fileMarker.MarkAsNewAsync(uploadSession.File);
            await _chunkedUploadSessionHolder.RemoveSessionAsync(uploadSession);
        }
        else
        {
            await _chunkedUploadSessionHolder.StoreSessionAsync(uploadSession);
        }

        return uploadSession;
    }

    public async Task AbortUploadAsync<T>(string uploadId)
    {
        await AbortUploadAsync(await _chunkedUploadSessionHolder.GetSessionAsync<T>(uploadId));
    }

    private async Task AbortUploadAsync<T>(ChunkedUploadSession<T> uploadSession)
    {
        await _daoFactory.GetFileDao<T>().AbortUploadSessionAsync(uploadSession);

        await _chunkedUploadSessionHolder.RemoveSessionAsync(uploadSession);
    }

    private Task<long> GetMaxFileSizeAsync<T>(T folderId, bool chunkedUpload = false)
    {
        var folderDao = _daoFactory.GetFolderDao<T>();

        return folderDao.GetMaxUploadSizeAsync(folderId, chunkedUpload);
    }

    #endregion
}
