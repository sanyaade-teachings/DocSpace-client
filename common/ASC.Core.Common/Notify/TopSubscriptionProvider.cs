namespace ASC.Notify.Model;

public class TopSubscriptionProvider : ISubscriptionProvider
{
    private readonly string[] _defaultSenderMethods = Array.Empty<string>();
    private readonly ISubscriptionProvider _subscriptionProvider;
    private readonly IRecipientProvider _recipientProvider;


    public TopSubscriptionProvider(IRecipientProvider recipientProvider, ISubscriptionProvider directSubscriptionProvider)
    {
        _recipientProvider = recipientProvider ?? throw new ArgumentNullException(nameof(recipientProvider));
        _subscriptionProvider = directSubscriptionProvider ?? throw new ArgumentNullException(nameof(directSubscriptionProvider));
    }

    public TopSubscriptionProvider(IRecipientProvider recipientProvider, ISubscriptionProvider directSubscriptionProvider, string[] defaultSenderMethods)
        : this(recipientProvider, directSubscriptionProvider)
    {
        _defaultSenderMethods = defaultSenderMethods;
    }


    public virtual string[] GetSubscriptionMethod(INotifyAction action, IRecipient recipient)
    {
        ArgumentNullException.ThrowIfNull(action);
        ArgumentNullException.ThrowIfNull(recipient);

        var senders = _subscriptionProvider.GetSubscriptionMethod(action, recipient);
        if (senders == null || senders.Length == 0)
        {
            var parents = WalkUp(recipient);
            foreach (var parent in parents)
            {
                senders = _subscriptionProvider.GetSubscriptionMethod(action, parent);
                if (senders != null && senders.Length != 0)
                {
                    break;
                }
            }
        }

        return senders != null && 0 < senders.Length ? senders : _defaultSenderMethods;
    }

    public virtual IRecipient[] GetRecipients(INotifyAction action, string objectID)
    {
        ArgumentNullException.ThrowIfNull(action);

        var recipents = new List<IRecipient>(5);
        var directRecipients = _subscriptionProvider.GetRecipients(action, objectID) ?? new IRecipient[0];
        recipents.AddRange(directRecipients);

        return recipents.ToArray();
    }

    public virtual bool IsUnsubscribe(IDirectRecipient recipient, INotifyAction action, string objectID)
    {
        ArgumentNullException.ThrowIfNull(action);
        ArgumentNullException.ThrowIfNull(recipient);

        return _subscriptionProvider.IsUnsubscribe(recipient, action, objectID);
    }


    public virtual void Subscribe(INotifyAction action, string objectID, IRecipient recipient)
    {
        ArgumentNullException.ThrowIfNull(action);
        ArgumentNullException.ThrowIfNull(recipient);

        _subscriptionProvider.Subscribe(action, objectID, recipient);
    }

    public virtual void UnSubscribe(INotifyAction action, string objectID, IRecipient recipient)
    {
        ArgumentNullException.ThrowIfNull(action);
        ArgumentNullException.ThrowIfNull(recipient);

        _subscriptionProvider.UnSubscribe(action, objectID, recipient);
    }

    public void UnSubscribe(INotifyAction action, string objectID)
    {
        ArgumentNullException.ThrowIfNull(action);

        _subscriptionProvider.UnSubscribe(action, objectID);
    }

    public void UnSubscribe(INotifyAction action)
    {
        ArgumentNullException.ThrowIfNull(action);

        _subscriptionProvider.UnSubscribe(action);
    }

    public virtual void UnSubscribe(INotifyAction action, IRecipient recipient)
    {
        var objects = GetSubscriptions(action, recipient);
        foreach (var objectID in objects)
        {
            _subscriptionProvider.UnSubscribe(action, objectID, recipient);
        }
    }

    public virtual void UpdateSubscriptionMethod(INotifyAction action, IRecipient recipient, params string[] senderNames)
    {
        ArgumentNullException.ThrowIfNull(action);
        ArgumentNullException.ThrowIfNull(recipient);
        ArgumentNullException.ThrowIfNull(senderNames);

        _subscriptionProvider.UpdateSubscriptionMethod(action, recipient, senderNames);
    }

    public virtual object GetSubscriptionRecord(INotifyAction action, IRecipient recipient, string objectID)
    {
        ArgumentNullException.ThrowIfNull(action);
        ArgumentNullException.ThrowIfNull(recipient);

        var subscriptionRecord = _subscriptionProvider.GetSubscriptionRecord(action, recipient, objectID);

        if (subscriptionRecord != null)
        {
            return subscriptionRecord;
        }

        var parents = WalkUp(recipient);

        foreach (var parent in parents)
        {
            subscriptionRecord = _subscriptionProvider.GetSubscriptionRecord(action, parent, objectID);

            if (subscriptionRecord != null)
            {
                break;
            }
        }

        return subscriptionRecord;
    }

    public virtual string[] GetSubscriptions(INotifyAction action, IRecipient recipient, bool checkSubscription = true)
    {
        ArgumentNullException.ThrowIfNull(action);
        ArgumentNullException.ThrowIfNull(recipient);

        var objects = new List<string>();
        var direct = _subscriptionProvider.GetSubscriptions(action, recipient, checkSubscription) ?? Array.Empty<string>();
        MergeObjects(objects, direct);
        var parents = WalkUp(recipient);
        foreach (var parent in parents)
        {
            direct = _subscriptionProvider.GetSubscriptions(action, parent, checkSubscription) ?? Array.Empty<string>();
            if (recipient is IDirectRecipient)
            {
                foreach (var groupsubscr in direct)
                {
                    if (!objects.Contains(groupsubscr) && !_subscriptionProvider.IsUnsubscribe(recipient as IDirectRecipient, action, groupsubscr))
                    {
                        objects.Add(groupsubscr);
                    }
                }
            }
            else
            {
                MergeObjects(objects, direct);
            }
        }

        return objects.ToArray();
    }


    private List<IRecipient> WalkUp(IRecipient recipient)
    {
        var parents = new List<IRecipient>();
        var groups = _recipientProvider.GetGroups(recipient) ?? new IRecipientsGroup[0];
        foreach (var group in groups)
        {
            parents.Add(group);
            parents.AddRange(WalkUp(group));
        }

        return parents;
    }

    private void MergeActions(List<INotifyAction> result, IEnumerable<INotifyAction> additions)
    {
        foreach (var addition in additions)
        {
            if (!result.Contains(addition))
            {
                result.Add(addition);
            }
        }
    }

    private void MergeObjects(List<string> result, IEnumerable<string> additions)
    {
        foreach (var addition in additions)
        {
            if (!result.Contains(addition))
            {
                result.Add(addition);
            }
        }
    }
}
