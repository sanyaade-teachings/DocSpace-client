// (c) Copyright Ascensio System SIA 2010-2022
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

namespace ASC.Core.Data;

[Scope]
public class DbSubscriptionService : ISubscriptionService
{
    private readonly IDbContextFactory<UserDbContext> _dbContextFactory;
    private readonly IMapper _mapper;

    public DbSubscriptionService(IDbContextFactory<UserDbContext> dbContextFactory, IMapper mapper)
    {
        _dbContextFactory = dbContextFactory;
        _mapper = mapper;
    }

    public async Task<string[]> GetRecipientsAsync(int tenant, string sourceId, string actionId, string objectId)
    {
        ArgumentNullException.ThrowIfNull(sourceId);
        ArgumentNullException.ThrowIfNull(actionId);

        using var userDbContext = _dbContextFactory.CreateDbContext();

        return await Queries.GetRecipientsAsync(userDbContext, tenant, sourceId, actionId, objectId ?? string.Empty).ToArrayAsync();
    }

    public async Task<IEnumerable<SubscriptionRecord>> GetSubscriptionsAsync(int tenant, string sourceId, string actionId)
    {
        ArgumentNullException.ThrowIfNull(sourceId);
        ArgumentNullException.ThrowIfNull(actionId);

        using var userDbContext = _dbContextFactory.CreateDbContext();

        var q = await Queries.GetSubscriptionsAsync(userDbContext, tenant, sourceId, actionId).ToListAsync();

        return GetSubscriptions(q, tenant);
    }

    public async Task<IEnumerable<SubscriptionRecord>> GetSubscriptionsAsync(int tenant, string sourceId, string actionId, string recipientId, string objectId)
    {
        ArgumentNullException.ThrowIfNull(sourceId);
        ArgumentNullException.ThrowIfNull(actionId);

        using var userDbContext = _dbContextFactory.CreateDbContext();

        var q = Queries.GetSubscriptionsByRecipientIdAsync(userDbContext, tenant, sourceId, actionId, recipientId, objectId ?? string.Empty);

        return GetSubscriptions(await q.ToListAsync(), tenant);
    }

    public async Task<SubscriptionRecord> GetSubscriptionAsync(int tenant, string sourceId, string actionId, string recipientId, string objectId)
    {
        ArgumentNullException.ThrowIfNull(recipientId);
        ArgumentNullException.ThrowIfNull(sourceId);
        ArgumentNullException.ThrowIfNull(actionId);

        using var userDbContext = _dbContextFactory.CreateDbContext();

        var q = Queries.GetSubscriptionsByRecipientAsync(userDbContext, tenant, sourceId, actionId, recipientId, objectId ?? string.Empty);

        return GetSubscriptions(await q.ToListAsync(), tenant).FirstOrDefault();
    }

    public async Task<bool> IsUnsubscribeAsync(int tenant, string sourceId, string actionId, string recipientId, string objectId)
    {
        ArgumentNullException.ThrowIfNull(recipientId);
        ArgumentNullException.ThrowIfNull(sourceId);
        ArgumentNullException.ThrowIfNull(actionId);

        using var userDbContext = _dbContextFactory.CreateDbContext();

        return await Queries.AnySubscriptionsByRecipientAsync(userDbContext, tenant, sourceId, actionId, recipientId, objectId ?? string.Empty);
    }

    public async Task<string[]> GetSubscriptionsAsync(int tenant, string sourceId, string actionId, string recipientId, bool checkSubscribe)
    {
        ArgumentNullException.ThrowIfNull(recipientId);
        ArgumentNullException.ThrowIfNull(sourceId);
        ArgumentNullException.ThrowIfNull(actionId);

        using var userDbContext = _dbContextFactory.CreateDbContext();

        return await Queries.GetObjectsAsync(userDbContext, tenant, sourceId, actionId, recipientId, checkSubscribe).ToArrayAsync();
    }

    public async Task SaveSubscriptionAsync(SubscriptionRecord s)
    {
        ArgumentNullException.ThrowIfNull(s);

        var subs = new Subscription
        {
            Action = s.ActionId,
            Object = s.ObjectId ?? string.Empty,
            Recipient = s.RecipientId,
            Source = s.SourceId,
            Unsubscribed = !s.Subscribed,
            Tenant = s.Tenant
        };

        using var userDbContext = _dbContextFactory.CreateDbContext();
        await userDbContext.AddOrUpdateAsync(q=> q.Subscriptions, subs);
        await userDbContext.SaveChangesAsync();
    }

    public async Task RemoveSubscriptionsAsync(int tenant, string sourceId, string actionId)
    {
        await RemoveSubscriptionsAsync(tenant, sourceId, actionId, string.Empty);
    }

    public async Task RemoveSubscriptionsAsync(int tenant, string sourceId, string actionId, string objectId)
    {
        ArgumentNullException.ThrowIfNull(sourceId);
        ArgumentNullException.ThrowIfNull(actionId);

        using var userDbContext = _dbContextFactory.CreateDbContext();

        var sub =  await Queries.GetSubscriptionsByObjectAsync(userDbContext, tenant, sourceId, actionId, objectId ?? string.Empty);

        if (sub != null)
        {
            userDbContext.Subscriptions.Remove(sub);
            await userDbContext.SaveChangesAsync();
        }
    }


    public async Task<IEnumerable<SubscriptionMethod>> GetSubscriptionMethodsAsync(int tenant, string sourceId, string actionId, string recipientId)
    {
        ArgumentNullException.ThrowIfNull(sourceId);
        ArgumentNullException.ThrowIfNull(actionId);

        using var userDbContext = _dbContextFactory.CreateDbContext();

        var methods = await Queries.GetDbSubscriptionMethodsAsync(userDbContext, tenant, sourceId, recipientId).ToListAsync();
        var result = new List<SubscriptionMethod>();
        var common = new Dictionary<string, SubscriptionMethod>();

        foreach (var r in methods)
        {
            var m = _mapper.Map<DbSubscriptionMethod, SubscriptionMethod>(r);
            var key = m.Source + m.Action + m.Recipient;
            if (m.Tenant == Tenant.DefaultTenant)
            {
                m.Tenant = tenant;
                common.Add(key, m);
                result.Add(m);
            }
            else
            {
                if (!common.TryGetValue(key, out var rec))
                {
                    result.Add(rec);
                }
            }
        }
        return result;
    }

    public async Task SetSubscriptionMethodAsync(SubscriptionMethod m)
    {
        ArgumentNullException.ThrowIfNull(m);

        using var userDbContext = _dbContextFactory.CreateDbContext();

        if (m.Methods == null || m.Methods.Length == 0)
        {
            var sm = await Queries.GetDbSubscriptionMethodAsync(userDbContext, m.Tenant, m.Source, m.Action, m.Recipient);

            if (sm != null)
            {
                userDbContext.SubscriptionMethods.Remove(sm);
            }
        }
        else
        {
            var sm = new DbSubscriptionMethod
            {
                Action = m.Action,
                Recipient = m.Recipient,
                Source = m.Source,
                Tenant = m.Tenant,
                Sender = string.Join("|", m.Methods)
            };
            await userDbContext.AddOrUpdateAsync(q => q.SubscriptionMethods, sm);
        }

        await userDbContext.SaveChangesAsync();
    }

    private IEnumerable<SubscriptionRecord> GetSubscriptions(List<Subscription> subs, int tenant)
    {
        var result = new List<SubscriptionRecord>();
        var common = new Dictionary<string, SubscriptionRecord>();

        foreach (var r in subs)
        {
            var s = _mapper.Map<Subscription, SubscriptionRecord>(r);
            var key = s.SourceId + s.ActionId + s.RecipientId + s.ObjectId;
            if (s.Tenant == Tenant.DefaultTenant)
            {
                s.Tenant = tenant;
                common.Add(key, s);
                result.Add(s);
            }
            else
            {
                if (!common.TryGetValue(key, out _))
                {
                    result.Add(s);
                }
            }
        }

        return result;
    }
}

static file class Queries
{
    public static readonly Func<UserDbContext, int, string, string, string, IAsyncEnumerable<string>> GetRecipientsAsync = Microsoft.EntityFrameworkCore.EF.CompileAsyncQuery(
    (UserDbContext ctx, int tenantId, string sourceId, string actionId, string objectId) =>
        ctx.Subscriptions
            .Where(r => r.Source == sourceId)
            .Where(r => r.Action == actionId)
            .Where(r => r.Tenant == -1 || r.Tenant == tenantId)
            .Where(r => r.Object == objectId)
            .Where(r => !r.Unsubscribed)
            .OrderBy(r => r.Tenant)
            .Select(r => r.Recipient)
            .Distinct());
    
    public static readonly Func<UserDbContext, int, string, string, IAsyncEnumerable<Subscription>> GetSubscriptionsAsync = Microsoft.EntityFrameworkCore.EF.CompileAsyncQuery(
    (UserDbContext ctx, int tenantId, string sourceId, string actionId) =>
        ctx.Subscriptions
            .Where(r => r.Source == sourceId)
            .Where(r => r.Action == actionId)
            .Where(r => r.Tenant == -1 || r.Tenant == tenantId)
            .OrderBy(r => r.Tenant)
            .AsQueryable());
    
    public static readonly Func<UserDbContext, int, string, string, string, string, IAsyncEnumerable<Subscription>> GetSubscriptionsByRecipientAsync = Microsoft.EntityFrameworkCore.EF.CompileAsyncQuery(
    (UserDbContext ctx, int tenantId, string sourceId, string actionId, string recipientId, string objectId) =>
        ctx.Subscriptions
            .Where(r => r.Source == sourceId)
            .Where(r => r.Action == actionId)
            .Where(r => r.Tenant == -1 || r.Tenant == tenantId)
            .Where(r => r.Recipient == recipientId)
            .Where(r => r.Object == objectId)
            .OrderBy(r => r.Tenant)
            .AsQueryable());
    
    public static readonly Func<UserDbContext, int, string, string, string, string, Task<bool>> AnySubscriptionsByRecipientAsync = Microsoft.EntityFrameworkCore.EF.CompileAsyncQuery(
    (UserDbContext ctx, int tenantId, string sourceId, string actionId, string recipientId, string objectId) =>
        ctx.Subscriptions
            .Where(r => r.Source == sourceId)
            .Where(r => r.Action == actionId)
            .Where(r => r.Tenant == tenantId)
            .Where(r => r.Recipient == recipientId)
            .Where(r => r.Unsubscribed)
            .Where(r => r.Object == objectId)
            .Any());
    
    public static readonly Func<UserDbContext, int, string, string, string, bool, IAsyncEnumerable<string>> GetObjectsAsync = Microsoft.EntityFrameworkCore.EF.CompileAsyncQuery(
    (UserDbContext ctx, int tenantId, string sourceId, string actionId, string recipientId, bool checkSubscribe) =>
        ctx.Subscriptions
            .Where(r => r.Source == sourceId)
            .Where(r => r.Action == actionId)
            .Where(r => r.Tenant == -1 || r.Tenant == tenantId)
            .Where(r => r.Recipient == recipientId)
            .Where(r => checkSubscribe && !r.Unsubscribed)
            .Distinct()
            .OrderBy(r => r.Tenant)
            .Select(r => r.Object));

    public static readonly Func<UserDbContext, int, string, string, string, Task<Subscription>> GetSubscriptionsByObjectAsync = Microsoft.EntityFrameworkCore.EF.CompileAsyncQuery(
    (UserDbContext ctx, int tenantId, string sourceId, string actionId, string objectId) =>
        ctx.Subscriptions
            .Where(r => r.Source == sourceId)
            .Where(r => r.Action == actionId)
            .Where(r => r.Tenant == tenantId)
            .Where(r => r.Object == objectId)
            .FirstOrDefault());
    
    public static readonly Func<UserDbContext, int, string, string, string, string, IAsyncEnumerable<Subscription>> GetSubscriptionsByRecipientIdAsync = Microsoft.EntityFrameworkCore.EF.CompileAsyncQuery(
    (UserDbContext ctx, int tenantId, string sourceId, string actionId, string recipientId, string objectId) =>
        ctx.Subscriptions
            .Where(r => r.Source == sourceId)
            .Where(r => r.Action == actionId)
            .Where(r => r.Tenant == -1 || r.Tenant == tenantId)
            .Where(r => recipientId != null && r.Recipient == recipientId || recipientId == null && r.Object == objectId)
            .OrderBy(r => r.Tenant)
            .AsQueryable());
    
    public static readonly Func<UserDbContext, int, string, string, IAsyncEnumerable<DbSubscriptionMethod>> GetDbSubscriptionMethodsAsync = Microsoft.EntityFrameworkCore.EF.CompileAsyncQuery(
    (UserDbContext ctx, int tenantId, string sourceId, string recipientId) =>
        ctx.SubscriptionMethods
            .Where(r => r.Tenant == -1 || r.Tenant == tenantId)
            .Where(r => r.Source == sourceId)
            .Where(r => recipientId != null && r.Recipient == recipientId)
            .OrderBy(r => r.Tenant)
            .Distinct()
            .AsQueryable());
    
    public static readonly Func<UserDbContext, int, string, string, string, Task<DbSubscriptionMethod>> GetDbSubscriptionMethodAsync = Microsoft.EntityFrameworkCore.EF.CompileAsyncQuery(
    (UserDbContext ctx, int tenantId, string sourceId, string actionId, string recipientId) =>
        ctx.SubscriptionMethods
            .Where(r => r.Tenant == tenantId)
            .Where(r => r.Source == sourceId)
            .Where(r => r.Action == actionId)
            .Where(r => r.Recipient == recipientId)
            .FirstOrDefault());
}