using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly PermissionService _permissionService;

    public UserController(AppDbContext context, PermissionService permissionService)
    {
        _context = context;
        _permissionService = permissionService;
    }

    [HttpGet]
    public IActionResult GetAll([FromQuery] int userTier)
    {
        var hasPermission = _permissionService.HasPermission(userTier, "student.list.view");

        if (!hasPermission)
        {
            return StatusCode(403, new { message = "You do not have permission to view users." });
        }

        var users = _context.Users
            .Select(u => new AuthResponseDto
            {
                Success = true,
                Message = "User retrieved.",
                UserId = u.UserId,
                UserEmail = u.UserEmail,
                UserUsername = u.UserUsername,
                UserLastName = u.UserLastName,
                UserFirstName = u.UserFirstName,
                UserTier = u.UserTier,
                MustChangePass = u.MustChangePass,
                UserStatus = u.UserStatus
            })
            .ToList();

        return Ok(users);
    }

    [HttpPut("deactivate/{id}")]
    public IActionResult DeactivateUser(string id, [FromQuery] int userTier)
    {
        var hasPermission = _permissionService.HasPermission(userTier, "student.status.update");

        if (!hasPermission)
        {
            return StatusCode(403, new { message = "You do not have permission to deactivate users." });
        }

        var user = _context.Users.FirstOrDefault(u => u.UserId == id);

        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        user.UserStatus = 1;
        _context.SaveChanges();

        var auditLog = new AuditTrail
        {
            AuditTrailId = Guid.NewGuid().ToString(),
            UserId = user.UserId,
            ActionType = "DEACTIVATE",
            TargetTable = "user_list_table",
            TargetId = user.UserId,
            OldValue = "UserStatus: 0",
            NewValue = "UserStatus: 1",
            Description = "User account deactivated.",
            Status = "SUCCESS"
        };

        _context.AuditTrails.Add(auditLog);
        _context.SaveChanges();

        return Ok(new { message = "User deactivated successfully." });
    }

    [HttpPut("reactivate/{id}")]
    public IActionResult ReactivateUser(string id, [FromQuery] int userTier)
    {
        var hasPermission = _permissionService.HasPermission(userTier, "student.status.update");

        if (!hasPermission)
        {
            return StatusCode(403, new { message = "You do not have permission to reactivate users." });
        }

        var user = _context.Users.FirstOrDefault(u => u.UserId == id);

        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        user.UserStatus = 0;
        _context.SaveChanges();

        var auditLog = new AuditTrail
        {
            AuditTrailId = Guid.NewGuid().ToString(),
            UserId = user.UserId,
            ActionType = "REACTIVATE",
            TargetTable = "user_list_table",
            TargetId = user.UserId,
            OldValue = "UserStatus: 1",
            NewValue = "UserStatus: 0",
            Description = "User account reactivated.",
            Status = "SUCCESS"
        };

        _context.AuditTrails.Add(auditLog);
        _context.SaveChanges();

        return Ok(new { message = "User reactivated successfully." });
    }

    [HttpPut("change-tier/{id}")]
    public IActionResult ChangeUserTier(string id, [FromQuery] int userTier, ChangeUserTierRequestDto request)
    {
        var hasPermission = _permissionService.HasPermission(userTier, "admin.edit_tier");

        if (!hasPermission)
        {
            return StatusCode(403, new { message = "You do not have permission to change user tiers." });
        }

        var user = _context.Users.FirstOrDefault(u => u.UserId == id);

        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        var oldTier = user.UserTier;
        user.UserTier = request.NewUserTier;
        _context.SaveChanges();

        var auditLog = new AuditTrail
        {
            AuditTrailId = Guid.NewGuid().ToString(),
            UserId = user.UserId,
            ActionType = "CHANGE_TIER",
            TargetTable = "user_list_table",
            TargetId = user.UserId,
            OldValue = $"UserTier: {oldTier}",
            NewValue = $"UserTier: {user.UserTier}",
            Description = "User tier updated.",
            Status = "SUCCESS"
        };

        _context.AuditTrails.Add(auditLog);
        _context.SaveChanges();

        return Ok(new
        {
            message = "User tier updated successfully.",
            userId = user.UserId,
            oldUserTier = oldTier,
            newUserTier = user.UserTier
        });
    }

    [HttpPut("edit/{id}")]
    public IActionResult EditUser(string id, [FromQuery] int userTier, EditUserRequestDto request)
    {
        var hasPermission = _permissionService.HasPermission(userTier, "admin.info.edit");

        if (!hasPermission)
        {
            return StatusCode(403, new { message = "You do not have permission to edit users." });
        }

        var user = _context.Users.FirstOrDefault(u => u.UserId == id);

        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        var oldValue =
            $"UserFirstName: {user.UserFirstName}, UserLastName: {user.UserLastName}, UserEmail: {user.UserEmail}, UserUsername: {user.UserUsername}, UserTier: {user.UserTier}, UserStatus: {user.UserStatus}";

        user.UserFirstName = request.UserFirstName.Trim();
        user.UserLastName = request.UserLastName.Trim();
        user.UserEmail = request.UserEmail.Trim().ToLower();
        user.UserUsername = request.UserUsername.Trim();
        user.UserTier = request.UserTier;
        user.UserStatus = request.UserStatus;

        _context.SaveChanges();

        var newValue =
            $"UserFirstName: {user.UserFirstName}, UserLastName: {user.UserLastName}, UserEmail: {user.UserEmail}, UserUsername: {user.UserUsername}, UserTier: {user.UserTier}, UserStatus: {user.UserStatus}";

        var auditLog = new AuditTrail
        {
            AuditTrailId = Guid.NewGuid().ToString(),
            UserId = user.UserId,
            ActionType = "EDIT_USER",
            TargetTable = "user_list_table",
            TargetId = user.UserId,
            OldValue = oldValue,
            NewValue = newValue,
            Description = "User information updated.",
            Status = "SUCCESS"
        };

        _context.AuditTrails.Add(auditLog);
        _context.SaveChanges();

        return Ok(new { message = "User updated successfully." });
    }
}