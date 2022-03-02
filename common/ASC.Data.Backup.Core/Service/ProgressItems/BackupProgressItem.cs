﻿/*
 *
 * (c) Copyright Ascensio System Limited 2010-2020
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU 
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html). 
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that 
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@onlyoffice.com
 *
 * The interactive user interfaces in modified source and object code versions of ONLYOFFICE must display 
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7 § 3(b) of the GNU GPL you must retain the original ONLYOFFICE logo which contains 
 * relevant author attributions when distributing the software. If the display of the logo in its graphic 
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by ONLYOFFICE" 
 * in every copy of the program you distribute. 
 * Pursuant to Section 7 § 3(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
*/

namespace ASC.Data.Backup.Services;

[Transient]
public class BackupProgressItem : BaseBackupProgressItem
{
    public bool BackupMail { get; set; }
    public Dictionary<string, string> StorageParams { get; set; }
    public string Link { get; private set; }
    public string TempFolder { get; set; }
    public override BackupProgressItemEnum BackupProgressItemEnum => BackupProgressItemEnum.Backup;

    private const string ArchiveFormat = "tar.gz";

    private bool _isScheduled;
    private Guid _userId;
    private BackupStorageType _storageType;
    private string _storageBasePath;
    private string _currentRegion;
    private Dictionary<string, string> _configPaths;
    private int _limit;

    private readonly TenantManager _tenantManager;
    private readonly BackupStorageFactory _backupStorageFactory;
    private readonly BackupRepository _backupRepository;
    private readonly BackupPortalTask _backupPortalTask;

    private readonly CoreBaseSettings _coreBaseSettings;
    private readonly NotifyHelper _notifyHelper;

    public BackupProgressItem(
        IOptionsMonitor<ILog> options,
        TenantManager tenantManager,
        BackupStorageFactory backupStorageFactory,
        BackupRepository backupRepository,
        BackupPortalTask backupPortalTask,
        CoreBaseSettings coreBaseSettings,
        NotifyHelper notifyHelper)
        : base(options)
    {
        _tenantManager = tenantManager;
        _backupStorageFactory = backupStorageFactory;
        _backupRepository = backupRepository;
        _backupPortalTask = backupPortalTask;
        _coreBaseSettings = coreBaseSettings;
        _notifyHelper = notifyHelper;
    }

    public void Init(BackupSchedule schedule, bool isScheduled, string tempFolder, int limit, string currentRegion, Dictionary<string, string> configPaths)
    {
        _userId = Guid.Empty;
        TenantId = schedule.TenantId;
        _storageType = schedule.StorageType;
        _storageBasePath = schedule.StorageBasePath;
        BackupMail = schedule.BackupMail;
        StorageParams = JsonConvert.DeserializeObject<Dictionary<string, string>>(schedule.StorageParams);
        _isScheduled = isScheduled;
        TempFolder = tempFolder;
        _limit = limit;
        _currentRegion = currentRegion;
        _configPaths = configPaths;
    }

    public void Init(StartBackupRequest request, bool isScheduled, string tempFolder, int limit, string currentRegion, Dictionary<string, string> configPaths)
    {
        _userId = request.UserId;
        TenantId = request.TenantId;
        _storageType = request.StorageType;
        _storageBasePath = request.StorageBasePath;
        BackupMail = request.BackupMail;
        StorageParams = request.StorageParams.ToDictionary(r => r.Key, r => r.Value);
        _isScheduled = isScheduled;
        TempFolder = tempFolder;
        _limit = limit;
        _currentRegion = currentRegion;
        _configPaths = configPaths;
    }

    protected override void DoJob()
    {
        if (ThreadPriority.BelowNormal < Thread.CurrentThread.Priority)
        {
            Thread.CurrentThread.Priority = ThreadPriority.BelowNormal;
        }

        var dateTime = _coreBaseSettings.Standalone ? DateTime.Now : DateTime.UtcNow;
        var backupName = string.Format("{0}_{1:yyyy-MM-dd_HH-mm-ss}.{2}", _tenantManager.GetTenant(TenantId).Alias, dateTime, ArchiveFormat);

        var tempFile = CrossPlatform.PathCombine(TempFolder, backupName);
        var storagePath = tempFile;

        try
        {
            var backupTask = _backupPortalTask;

            backupTask.Init(TenantId, _configPaths[_currentRegion], tempFile, _limit);
            if (!BackupMail)
            {
                backupTask.IgnoreModule(ModuleName.Mail);
            }

            backupTask.ProgressChanged += (sender, args) =>
            {
                Percentage = 0.9 * args.Progress;
                PublishChanges();
            };

            backupTask.RunJob();

            var backupStorage = _backupStorageFactory.GetBackupStorage(_storageType, TenantId, StorageParams);
            if (backupStorage != null)
            {
                storagePath = backupStorage.Upload(_storageBasePath, tempFile, _userId);
                Link = backupStorage.GetPublicLink(storagePath);
            }

            var repo = _backupRepository;

            repo.SaveBackupRecord(
                new BackupRecord
                {
                    Id = Guid.Parse(Id),
                    TenantId = TenantId,
                    IsScheduled = _isScheduled,
                    Name = Path.GetFileName(tempFile),
                    StorageType = _storageType,
                    StorageBasePath = _storageBasePath,
                    StoragePath = storagePath,
                    CreatedOn = DateTime.UtcNow,
                    ExpiresOn = _storageType == BackupStorageType.DataStore ? DateTime.UtcNow.AddDays(1) : DateTime.MinValue,
                    StorageParams = JsonConvert.SerializeObject(StorageParams),
                    Hash = BackupWorker.GetBackupHash(tempFile)
                });

            Percentage = 100;

            if (_userId != Guid.Empty && !_isScheduled)
            {
                _notifyHelper.SendAboutBackupCompleted(_userId);
            }

            IsCompleted = true;
            PublishChanges();
        }
        catch (Exception error)
        {
            Logger.ErrorFormat("RunJob - Params: {0}, Error = {1}", new { Id, Tenant = TenantId, File = tempFile, BasePath = _storageBasePath, }, error);
            Exception = error;
            IsCompleted = true;
        }
        finally
        {
            try
            {
                PublishChanges();
            }
            catch (Exception error)
            {
                Logger.Error("publish", error);
            }

            try
            {
                if (!(storagePath == tempFile && _storageType == BackupStorageType.Local))
                {
                    File.Delete(tempFile);
                }
            }
            catch (Exception error)
            {
                Logger.Error("can't delete file: {0}", error);
            }
        }
    }

    public override object Clone()
    {
        return MemberwiseClone();
    }
}
