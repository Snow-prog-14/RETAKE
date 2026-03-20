using backend.Data;

namespace backend.Services;

public class PermissionService
{
    private readonly AppDbContext _context;

    public PermissionService(AppDbContext context)
    {
        _context = context;
    }

    public bool HasPermission(int userTier, string permissionId)
    {
        return _context.TierPermissions.Any(tp =>
            tp.UserTier == userTier &&
            tp.PermissionId == permissionId);
    }
}