using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TierPermissionController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly PermissionService _permissionService;

    public TierPermissionController(AppDbContext context, PermissionService permissionService)
    {
        _context = context;
        _permissionService = permissionService;
    }

    [HttpGet]
    public IActionResult GetAll([FromQuery] int userTier)
    {
        var hasPermission = _permissionService.HasPermission(userTier, "profile.view_permission");

        if (!hasPermission)
        {
            return StatusCode(403, new { message = "You do not have permission to view tier permissions." });
        }

        var permissions = _context.TierPermissions.ToList();
        return Ok(permissions);
    }

    [HttpPost("grant")]
    public IActionResult GrantPermission([FromQuery] int userTier, ManageTierPermissionRequestDto request)
    {
        var hasPermission = _permissionService.HasPermission(userTier, "profile.edit_permissions");

        if (!hasPermission)
        {
            return StatusCode(403, new { message = "You do not have permission to grant permissions." });
        }

        var exists = _context.TierPermissions.Any(tp =>
            tp.UserTier == request.TargetUserTier &&
            tp.PermissionId == request.PermissionId);

        if (exists)
        {
            return BadRequest(new { message = "Permission already exists for this tier." });
        }

        var newPermission = new TierPermission
        {
            ReferenceId = Guid.NewGuid().ToString(),
            UserTier = request.TargetUserTier,
            PermissionId = request.PermissionId
        };

        _context.TierPermissions.Add(newPermission);
        _context.SaveChanges();

        return Ok(new
        {
            message = "Permission granted successfully.",
            referenceId = newPermission.ReferenceId,
            userTier = newPermission.UserTier,
            permissionId = newPermission.PermissionId
        });
    }

    [HttpDelete("revoke/{referenceId}")]
    public IActionResult RevokePermission(string referenceId, [FromQuery] int userTier)
    {
        var hasPermission = _permissionService.HasPermission(userTier, "profile.delete_permission");

        if (!hasPermission)
        {
            return StatusCode(403, new { message = "You do not have permission to revoke permissions." });
        }

        var permission = _context.TierPermissions.FirstOrDefault(tp => tp.ReferenceId == referenceId);

        if (permission == null)
        {
            return NotFound(new { message = "Permission entry not found." });
        }

        _context.TierPermissions.Remove(permission);
        _context.SaveChanges();

        return Ok(new { message = "Permission revoked successfully." });
    }
}