using SecurityContext = ASC.Core.SecurityContext;

namespace ASC.Api.Core;

[Scope]
public class ApiContext : ICloneable
{
    public IHttpContextAccessor HttpContextAccessor { get; set; }
    public string[] Fields { get; set; }
    public string[] FilterValues { get; set; }
    public bool FromCache { get; set; }
    public Tenant Tenant => _tenant ??= _tenantManager.GetCurrentTenant(HttpContextAccessor?.HttpContext);
    public long? TotalCount
    {
        set
        {
            if (HttpContextAccessor.HttpContext.Items.ContainsKey(nameof(TotalCount)))
            {
                HttpContextAccessor.HttpContext.Items[nameof(TotalCount)] = value;
            }
            else
            {
                HttpContextAccessor.HttpContext.Items.Add(nameof(TotalCount), value);
            }
        }
    }

    /// <summary>
    /// Filters responce to specific type from request parameter "type"
    /// </summary>
    /// <remarks>
    /// The type name is retrieved from [DataContractAttribute] name
    /// </remarks>
    public string FilterToType { get; set; }

    /// <summary>
    /// Gets count to get item from collection. Request parameter "count"
    /// </summary>
    /// <remarks>
    /// Don't forget to call _context.SetDataPaginated() to prevent SmartList from filtering response if you fetch data from DB with TOP & COUNT
    /// </remarks>
    public long Count { get; set; }

    /// <summary>
    /// Gets start index to get item from collection. Request parameter "startIndex"
    /// </summary>
    /// <remarks>
    /// Don't forget to call _context.SetDataPaginated() to prevent SmartList from filtering response if you fetch data from DB with TOP & COUNT
    /// </remarks>
    public long StartIndex { get; set; }

    /// <summary>
    /// Gets field to sort by from request parameter "sortBy"
    /// </summary>
    public string SortBy { get; set; }

    /// <summary>
    /// Gets field to filter from request parameter "filterBy"
    /// </summary>
    public string FilterBy { get; set; }

    /// <summary>
    /// Gets filter operation from request parameter "filterOp"
    /// can be one of the following:"contains","equals","startsWith","present"
    /// </summary>
    public string FilterOp { get; set; }

    /// <summary>
    /// Gets value to filter from request parameter "filterValue"
    /// </summary>
    public string FilterValue { get; set; }

    /// <summary>
    /// Sort direction. From request parameter "sortOrder" can be "descending" or "ascending"
    /// Like ...&sortOrder=descending&...
    /// </summary>
    public bool SortDescending { get; set; }

    /// <summary>
    /// Gets value to filter from request parameter "updatedSince"
    /// </summary>
    public DateTime UpdatedSince { get; set; }

    internal long SpecifiedCount { get; private set; }
    internal long SpecifiedStartIndex { get; set; }

    private Tenant _tenant;
    private static int _maxCount = 1000;
    private readonly SecurityContext _securityContext;
    private readonly TenantManager _tenantManager;

    public ApiContext(IHttpContextAccessor httpContextAccessor, SecurityContext securityContext, TenantManager tenantManager)
    {
        _securityContext = securityContext;
        _tenantManager = tenantManager;
        HttpContextAccessor = httpContextAccessor;
        if (httpContextAccessor.HttpContext == null)
        {
            return;
        }

        Count = _maxCount;
        var query = HttpContextAccessor.HttpContext.Request.Query;
        //Try parse values
        var count = query.GetRequestValue("count");
        if (!string.IsNullOrEmpty(count) && ulong.TryParse(count, out var countParsed))
        {
            //Count specified and valid
            Count = Math.Min((long)countParsed, _maxCount); 
        }

        var startIndex = query.GetRequestValue("startIndex");
        if (startIndex != null && long.TryParse(startIndex, out var startIndexParsed))
        {
            StartIndex = Math.Max(0, startIndexParsed);
            SpecifiedStartIndex = StartIndex;
        }

        var sortOrder = query.GetRequestValue("sortOrder");
        if ("descending".Equals(sortOrder))
        {
            SortDescending = true;
        }

        FilterToType = query.GetRequestValue("type");
        SortBy = query.GetRequestValue("sortBy");
        FilterBy = query.GetRequestValue("filterBy");
        FilterOp = query.GetRequestValue("filterOp");
        FilterValue = query.GetRequestValue("filterValue");
        FilterValues = query.GetRequestArray("filterValue");
        Fields = query.GetRequestArray("fields");

        var updatedSince = query.GetRequestValue("updatedSince");
        if (updatedSince != null)
        {
            UpdatedSince = Convert.ToDateTime(updatedSince);
        }
    }

    /// <summary>
    /// Set mark that data is already paginated and additional filtering is not needed
    /// </summary>
    public ApiContext SetDataPaginated()
    {
        //Count = 0;//We always ask for +1 count so smart list should cut it
        StartIndex = 0;

        return this;
    }

    public ApiContext SetDataSorted()
    {
        SortBy = string.Empty;

        return this;
    }

    public ApiContext SetDataFiltered()
    {
        FilterBy = string.Empty;
        FilterOp = string.Empty;
        FilterValue = string.Empty;

        return this;
    }

    public ApiContext SetTotalCount(long totalCollectionCount)
    {
        TotalCount = totalCollectionCount;

        return this;
    }

    public ApiContext SetCount(int count)
    {
        HttpContextAccessor.HttpContext.Items[nameof(Count)] = count;

        return this;
    }

    public object Clone()
    {
        return MemberwiseClone();
    }

    public override string ToString()
    {
        return string.Format("C:{0},S:{1},So:{2},Sd:{3},Fb;{4},Fo:{5},Fv:{6},Us:{7},Ftt:{8}", Count, StartIndex,
                             SortBy, SortDescending, FilterBy, FilterOp, FilterValue, UpdatedSince.Ticks, FilterToType);
    }

    public void AuthByClaim()
    {
        var id = HttpContextAccessor.HttpContext.User.Claims.FirstOrDefault(r => r.Type == ClaimTypes.Sid);
        if (Guid.TryParse(id?.Value, out var userId))
        {
            _securityContext.AuthenticateMeWithoutCookie(userId);
        }
    }
}

public static class QueryExtension
{
    internal static string[] GetRequestArray(this IQueryCollection query, string key)
    {
        if (query != null)
        {
            var values = query[key + "[]"];
            if (values.Count > 0) return values;

            values = query[key];
            if (values.Count > 0)
            {
                if (values.Count == 1) //If it's only one element
                {
                    //Try split
                    if (!string.IsNullOrEmpty(values[0]))
                        return values[0].Split(',');
                }

                return values;
            }
        }

        return null;
    }

    public static string GetRequestValue(this IQueryCollection query, string key)
    {
        var reqArray = query.GetRequestArray(key);

        return reqArray?.FirstOrDefault();
    }
}

public static class ApiContextExtension
{
    public static bool Check(this ApiContext context, string field)
    {
        return context?.Fields == null 
            || (context.Fields != null 
            && context.Fields.Contains(field, StringComparer.InvariantCultureIgnoreCase));
    }
}