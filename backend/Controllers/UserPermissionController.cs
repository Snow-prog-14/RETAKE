using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserPermissionController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly PermissionService _permissionService;

    public UserPermissionController(AppDbContext context, PermissionService permissionService)
    {
        _context = context;
        _permissionService = permissionService;
    }

    [HttpGet("{targetUserId}")]
    public IActionResult GetUserPermissions(string targetUserId, [FromQuery] int userTier)
    {
        var hasPermission = _permissionService.HasPermission(userTier, "profile.view_permission");

        if (!hasPermission)
        {
            return StatusCode(403, new { message = "You do not have permission to view user permissions." });
        }

        var permissions = _context.UserPermissions
            .Where(up => up.UserId == targetUserId)
            .ToList();

        return Ok(permissions);
    }

    [HttpPost("grant")]
    public IActionResult GrantPermission([FromQuery] int userTier, ManageUserPermissionRequestDto request)
    {
        var hasPermission = _permissionService.HasPermission(userTier, "profile.edit_permissions");

        if (!hasPermission)
        {
            return StatusCode(403, new { message = "You do not have permission to grant user permissions." });
        }

        var targetUser = _context.Users.FirstOrDefault(u => u.UserId == request.TargetUserId);

        if (targetUser == null)
        {
            return NotFound(new { message = "Target user not found." });
        }

        var exists = _context.UserPermissions.Any(up =>
            up.UserId == request.TargetUserId &&
            up.PermissionId == request.PermissionId);

        if (exists)
        {
            return BadRequest(new { message = "Permission already exists for this user." });
        }

        var newPermission = new UserPermission
        {
            ReferenceId = Guid.NewGuid().ToString(),
            UserId = request.TargetUserId,
            PermissionId = request.PermissionId
        };

        _context.UserPermissions.Add(newPermission);
        _context.SaveChanges();

        return Ok(new
        {
            message = "User permission granted successfully.",
            referenceId = newPermission.ReferenceId,
            userId = newPermission.UserId,
            permissionId = newPermission.PermissionId
        });
    }

    [HttpDelete("revoke/{referenceId}")]
    public IActionResult RevokePermission(string referenceId, [FromQuery] int userTier)
    {
        var hasPermission = _permissionService.HasPermission(userTier, "profile.delete_permission");

        if (!hasPermission)
        {
            return StatusCode(403, new { message = "You do not have permission to revoke user permissions." });
        }

        var permission = _context.UserPermissions.FirstOrDefault(up => up.ReferenceId == referenceId);

        if (permission == null)
        {
            return NotFound(new { message = "User permission entry not found." });
        }

        _context.UserPermissions.Remove(permission);
        _context.SaveChanges();

        return Ok(new { message = "User permission revoked successfully." });
    }
}