using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
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
                UserStatus = u.UserStatus
            })
            .ToList();

        return Ok(users);
    }

    [HttpPut("deactivate/{id}")]
    public IActionResult DeactivateUser(int id)
    {
        var user = _context.Users.FirstOrDefault(u => u.UserId == id);

        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        user.UserStatus = 1;
        _context.SaveChanges();

        var auditLog = new AuditTrail
        {
            UserId = user.UserId,
            ActionType = "DEACTIVATE",
            TargetTable = "Users",
            TargetId = user.UserId.ToString(),
            OldValue = "UserStatus: 0",
            NewValue = "UserStatus: 1",
            Description = "User account deactivated.",
            Status = 1
        };

        _context.AuditTrails.Add(auditLog);
        _context.SaveChanges();

        return Ok(new { message = "User deactivated successfully." });
    }

    [HttpPut("reactivate/{id}")]
    public IActionResult ReactivateUser(int id)
    {
        var user = _context.Users.FirstOrDefault(u => u.UserId == id);

        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        user.UserStatus = 0;
        _context.SaveChanges();

        var auditLog = new AuditTrail
        {
            UserId = user.UserId,
            ActionType = "REACTIVATE",
            TargetTable = "Users",
            TargetId = user.UserId.ToString(),
            OldValue = "UserStatus: 1",
            NewValue = "UserStatus: 0",
            Description = "User account reactivated.",
            Status = 1
        };

        _context.AuditTrails.Add(auditLog);
        _context.SaveChanges();

        return Ok(new { message = "User reactivated successfully." });
    }
}