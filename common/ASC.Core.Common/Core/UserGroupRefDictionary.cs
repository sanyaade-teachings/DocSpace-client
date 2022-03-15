namespace ASC.Core;

public class UserGroupRefDictionary : IDictionary<string, UserGroupRef>
{
    private readonly IDictionary<string, UserGroupRef> _dict = new Dictionary<string, UserGroupRef>();
    private IDictionary<Guid, IEnumerable<UserGroupRef>> _byUsers;
    private IDictionary<Guid, IEnumerable<UserGroupRef>> _byGroups;


    public int Count => _dict.Count;

    public bool IsReadOnly => _dict.IsReadOnly;

    public ICollection<string> Keys => _dict.Keys;

    public ICollection<UserGroupRef> Values => _dict.Values;

    public UserGroupRef this[string key]
    {
        get => _dict[key];
        set
        {
            _dict[key] = value;
            BuildIndexes();
        }
    }


    public UserGroupRefDictionary(IDictionary<string, UserGroupRef> dic)
    {
        foreach (var p in dic)
        {
            _dict.Add(p);
        }

        BuildIndexes();
    }


    public void Add(string key, UserGroupRef value)
    {
        _dict.Add(key, value);
        BuildIndexes();
    }

    public void Add(KeyValuePair<string, UserGroupRef> item)
    {
        _dict.Add(item);
        BuildIndexes();
    }

    public bool Remove(string key)
    {
        var result = _dict.Remove(key);
        BuildIndexes();

        return result;
    }

    public bool Remove(KeyValuePair<string, UserGroupRef> item)
    {
        var result = _dict.Remove(item);
        BuildIndexes();

        return result;
    }

    public void Clear()
    {
        _dict.Clear();
        BuildIndexes();
    }


    public bool TryGetValue(string key, out UserGroupRef value)
    {
        return _dict.TryGetValue(key, out value);
    }

    public bool ContainsKey(string key)
    {
        return _dict.ContainsKey(key);
    }

    public bool Contains(KeyValuePair<string, UserGroupRef> item)
    {
        return _dict.Contains(item);
    }

    public void CopyTo(KeyValuePair<string, UserGroupRef>[] array, int arrayIndex)
    {
        _dict.CopyTo(array, arrayIndex);
    }

    public IEnumerator<KeyValuePair<string, UserGroupRef>> GetEnumerator()
    {
        return _dict.GetEnumerator();
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return ((IEnumerable)_dict).GetEnumerator();
    }

    public IEnumerable<UserGroupRef> GetByUser(Guid userId)
    {
        return _byUsers.ContainsKey(userId) ? _byUsers[userId].ToList() : new List<UserGroupRef>();
    }

    public IEnumerable<UserGroupRef> GetByGroups(Guid groupId)
    {
        return _byGroups.ContainsKey(groupId) ? _byGroups[groupId].ToList() : new List<UserGroupRef>();
    }

    private void BuildIndexes()
    {
        _byUsers = _dict.Values.GroupBy(r => r.UserId).ToDictionary(g => g.Key, g => g.AsEnumerable());
        _byGroups = _dict.Values.GroupBy(r => r.GroupId).ToDictionary(g => g.Key, g => g.AsEnumerable());
    }
}
