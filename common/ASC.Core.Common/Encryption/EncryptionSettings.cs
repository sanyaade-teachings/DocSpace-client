namespace ASC.Core.Encryption;

public class EncryptionSettings
{
    internal string Pass;
    public string Password
    {
        get => Pass;
        set => Pass = (value ?? string.Empty).Replace('#', '_');
    }

    public EncryprtionStatus Status { get; set; }
    public bool NotifyUsers { get; set; }

    public EncryptionSettings(EncryptionSettingsProto encryptionSettingsProto)
    {
        Password = encryptionSettingsProto.Password;
        Status = encryptionSettingsProto.Status;
        NotifyUsers = encryptionSettingsProto.NotifyUsers;
    }

    public EncryptionSettings()
    {
        Password = string.Empty;
        Status = EncryprtionStatus.Decrypted;
        NotifyUsers = true;
    }
}

[Scope]
public class EncryptionSettingsHelper
{
    private const string Key = "EncryptionSettings";

    private readonly CoreConfiguration _coreConfiguration;
    private readonly AscCacheNotify _ascCacheNotify;
    private readonly InstanceCrypto _instanceCrypto;

    public EncryptionSettingsHelper(CoreConfiguration coreConfiguration, AscCacheNotify ascCacheNotify, InstanceCrypto instanceCrypto)
    {
        _coreConfiguration = coreConfiguration;
        _ascCacheNotify = ascCacheNotify;
        _instanceCrypto = instanceCrypto;
    }

    public void Save(EncryptionSettings encryptionSettings)
    {
        var settings = Serialize(encryptionSettings);
        _coreConfiguration.SaveSetting(Key, settings);

        _ascCacheNotify.ClearCache();
    }

    public EncryptionSettings Load()
    {
        var settings = _coreConfiguration.GetSetting(Key);

        return Deserialize(settings);
    }

    public string Serialize(EncryptionSettings encryptionSettings)
    {
        return string.Join("#",
            string.IsNullOrEmpty(encryptionSettings.Pass) ? string.Empty : _instanceCrypto.Encrypt(encryptionSettings.Pass),
            (int)encryptionSettings.Status,
            encryptionSettings.NotifyUsers
        );
    }

    public EncryptionSettings Deserialize(string value)
    {
        if (string.IsNullOrEmpty(value))
        {
            return new EncryptionSettings();
        }

        var parts = value.Split(new[] { '#' }, StringSplitOptions.None);

        var password = string.IsNullOrEmpty(parts[0]) ? string.Empty : _instanceCrypto.Decrypt(parts[0]);
        var status = int.Parse(parts[1]);
        var notifyUsers = bool.Parse(parts[2]);

        return new EncryptionSettings
        {
            Password = password,
            Status = (EncryprtionStatus)status,
            NotifyUsers = notifyUsers
        };
    }

    // source System.Web.Security.Membership.GeneratePassword
    public string GeneratePassword(int length, int numberOfNonAlphanumericCharacters)
    {
        var punctuations = "!@#$%^&*()_-+=[{]};:>|./?".ToCharArray();

        if (length < 1 || length > 128)
        {
            throw new ArgumentException("password_length_incorrect", nameof(length));
        }

        if (numberOfNonAlphanumericCharacters > length || numberOfNonAlphanumericCharacters < 0)
        {
            throw new ArgumentException("min_required_non_alphanumeric_characters_incorrect", nameof(numberOfNonAlphanumericCharacters));
        }

        var array2 = new char[length];
        var num = 0;

        var array = RandomNumberGenerator.GetBytes(length);

        for (var i = 0; i < length; i++)
        {
            var num2 = array[i] % 87;
            if (num2 < 10)
            {
                array2[i] = (char)(48 + num2);
                continue;
            }

            if (num2 < 36)
            {
                array2[i] = (char)(65 + num2 - 10);
                continue;
            }

            if (num2 < 62)
            {
                array2[i] = (char)(97 + num2 - 36);
                continue;
            }

            array2[i] = punctuations[num2 - 62];
            num++;
        }

        if (num < numberOfNonAlphanumericCharacters)
        {
            for (var j = 0; j < numberOfNonAlphanumericCharacters - num; j++)
            {
                int num3;
                do
                {
                    num3 = RandomNumberGenerator.GetInt32(0, length);
                }
                while (!char.IsLetterOrDigit(array2[num3]));
                array2[num3] = punctuations[RandomNumberGenerator.GetInt32(0, punctuations.Length)];
            }
        }

        return new string(array2);
    }
}
