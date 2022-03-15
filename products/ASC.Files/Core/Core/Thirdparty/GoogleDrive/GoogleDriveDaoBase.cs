using DriveFile = Google.Apis.Drive.v3.Data.File;

namespace ASC.Files.Thirdparty.GoogleDrive;

internal abstract class GoogleDriveDaoBase : ThirdPartyProviderDao<GoogleDriveProviderInfo>
{
    protected override string Id => "drive";

    protected GoogleDriveDaoBase(
        IServiceProvider serviceProvider,
        UserManager userManager,
        TenantManager tenantManager,
        TenantUtil tenantUtil,
        DbContextManager<FilesDbContext> dbContextManager,
        SetupInfo setupInfo,
        IOptionsMonitor<ILog> monitor,
        FileUtility fileUtility,
        TempPath tempPath)
        : base(serviceProvider, userManager, tenantManager, tenantUtil, dbContextManager, setupInfo, monitor, fileUtility, tempPath)
    {
    }

    protected static string MakeDriveId(object entryId)
    {
        var id = Convert.ToString(entryId, CultureInfo.InvariantCulture);

        return string.IsNullOrEmpty(id)
                   ? "root"
                   : id.TrimStart('/');
    }

    protected static string GetParentDriveId(DriveFile driveEntry)
    {
        return driveEntry == null || driveEntry.Parents == null || driveEntry.Parents.Count == 0
                   ? null
                   : driveEntry.Parents[0];
    }

    protected string MakeId(DriveFile driveEntry)
    {
        var path = string.Empty;
        if (driveEntry != null)
        {
            path = IsRoot(driveEntry) ? "root" : driveEntry.Id;
        }

        return MakeId(path);
    }

    protected override string MakeId(string path = null)
    {
        var p = string.IsNullOrEmpty(path) || path == "root" || path == ProviderInfo.DriveRootId ? "" : ("-|" + path.TrimStart('/'));

        return $"{PathPrefix}{p}";
    }

    protected string MakeFolderTitle(DriveFile driveFolder)
    {
        if (driveFolder == null || IsRoot(driveFolder))
        {
            return ProviderInfo.CustomerTitle;
        }

        return Global.ReplaceInvalidCharsAndTruncate(driveFolder.Name);
    }

    protected string MakeFileTitle(DriveFile driveFile)
    {
        if (driveFile == null || string.IsNullOrEmpty(driveFile.Name))
        {
            return ProviderInfo.ProviderKey;
        }

        var title = driveFile.Name;

        var gExt = MimeMapping.GetExtention(driveFile.MimeType);
        if (GoogleLoginProvider.GoogleDriveExt.Contains(gExt))
        {
            var downloadableExtension = FileUtility.GetGoogleDownloadableExtension(gExt);
            if (!downloadableExtension.Equals(FileUtility.GetFileExtension(title)))
            {
                title += downloadableExtension;
            }
        }

        return Global.ReplaceInvalidCharsAndTruncate(title);
    }

    protected Folder<string> ToFolder(DriveFile driveEntry)
    {
        if (driveEntry == null)
        {
            return null;
        }

        if (driveEntry is ErrorDriveEntry)
        {
            //Return error entry
            return ToErrorFolder(driveEntry as ErrorDriveEntry);
        }

        if (driveEntry.MimeType != GoogleLoginProvider.GoogleDriveMimeTypeFolder)
        {
            return null;
        }

        var isRoot = IsRoot(driveEntry);

        var folder = GetFolder();

        folder.ID = MakeId(driveEntry);
        folder.FolderID = isRoot ? null : MakeId(GetParentDriveId(driveEntry));
        folder.CreateOn = isRoot ? ProviderInfo.CreateOn : (driveEntry.CreatedTime ?? default);
        folder.ModifiedOn = isRoot ? ProviderInfo.CreateOn : (driveEntry.ModifiedTime ?? default);

        folder.Title = MakeFolderTitle(driveEntry);

        if (folder.CreateOn != DateTime.MinValue && folder.CreateOn.Kind == DateTimeKind.Utc)
        {
            folder.CreateOn = TenantUtil.DateTimeFromUtc(folder.CreateOn);
        }

        if (folder.ModifiedOn != DateTime.MinValue && folder.ModifiedOn.Kind == DateTimeKind.Utc)
        {
            folder.ModifiedOn = TenantUtil.DateTimeFromUtc(folder.ModifiedOn);
        }

        return folder;
    }

    protected static bool IsRoot(DriveFile driveFolder)
    {
        return IsDriveFolder(driveFolder) && GetParentDriveId(driveFolder) == null;
    }

    private static bool IsDriveFolder(DriveFile driveFolder)
    {
        return driveFolder != null && driveFolder.MimeType == GoogleLoginProvider.GoogleDriveMimeTypeFolder;
    }

    private File<string> ToErrorFile(ErrorDriveEntry driveEntry)
    {
        if (driveEntry == null)
        {
            return null;
        }

        var file = GetErrorFile(new ErrorEntry(driveEntry.Error, driveEntry.ErrorId));

        file.Title = MakeFileTitle(driveEntry);

        return file;
    }

    private Folder<string> ToErrorFolder(ErrorDriveEntry driveEntry)
    {
        if (driveEntry == null)
        {
            return null;
        }

        var folder = GetErrorFolder(new ErrorEntry(driveEntry.Error, driveEntry.ErrorId));

        folder.Title = MakeFolderTitle(driveEntry);

        return folder;
    }

    public File<string> ToFile(DriveFile driveFile)
    {
        if (driveFile == null)
        {
            return null;
        }

        if (driveFile is ErrorDriveEntry)
        {
            //Return error entry
            return ToErrorFile(driveFile as ErrorDriveEntry);
        }

        var file = GetFile();

        file.ID = MakeId(driveFile.Id);
        file.ContentLength = driveFile.Size.HasValue ? (long)driveFile.Size : 0;
        file.CreateOn = driveFile.CreatedTime.HasValue ? TenantUtil.DateTimeFromUtc(driveFile.CreatedTime.Value) : default;
        file.FolderID = MakeId(GetParentDriveId(driveFile));
        file.ModifiedOn = driveFile.ModifiedTime.HasValue ? TenantUtil.DateTimeFromUtc(driveFile.ModifiedTime.Value) : default;
        file.NativeAccessor = driveFile;
        file.Title = MakeFileTitle(driveFile);

        return file;
    }

    public async Task<Folder<string>> GetRootFolderAsync(string folderId)
    {
        return ToFolder(await GetDriveEntryAsync(""));
    }

    protected DriveFile GetDriveEntry(string entryId)
    {
        var driveId = MakeDriveId(entryId);
        try
        {
            var entry = ProviderInfo.GetDriveEntryAsync(driveId).Result;

            return entry;
        }
        catch (Exception ex)
        {
            return new ErrorDriveEntry(ex, driveId);
        }
    }

    protected async Task<DriveFile> GetDriveEntryAsync(string entryId)
    {
        var driveId = MakeDriveId(entryId);
        try
        {
            var entry = await ProviderInfo.GetDriveEntryAsync(driveId);

            return entry;
        }
        catch (Exception ex)
        {
            return new ErrorDriveEntry(ex, driveId);
        }
    }

    protected override async Task<IEnumerable<string>> GetChildrenAsync(string folderId)
    {
        var entries = await GetDriveEntriesAsync(folderId);

        return entries.Select(entry => MakeId(entry.Id));
    }

    protected List<DriveFile> GetDriveEntries(object parentId, bool? folder = null)
    {
        var parentDriveId = MakeDriveId(parentId);
        var entries = ProviderInfo.GetDriveEntriesAsync(parentDriveId, folder).Result;

        return entries;
    }

    protected async Task<List<DriveFile>> GetDriveEntriesAsync(object parentId, bool? folder = null)
    {
        var parentDriveId = MakeDriveId(parentId);
        var entries = await ProviderInfo.GetDriveEntriesAsync(parentDriveId, folder);

        return entries;
    }


    protected sealed class ErrorDriveEntry : DriveFile
    {
        public string Error { get; set; }
        public string ErrorId { get; private set; }

        public ErrorDriveEntry(Exception e, object id)
        {
            ErrorId = id.ToString();
            if (id.ToString() == "root")
            {
                MimeType = GoogleLoginProvider.GoogleDriveMimeTypeFolder;
            }
            if (e != null)
            {
                Error = e.Message;
            }
        }
    }
}
