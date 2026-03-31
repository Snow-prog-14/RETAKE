using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly PasswordService _passwordService;

    public AuthController(AppDbContext context, PasswordService passwordService)
    {
        _context = context;
        _passwordService = passwordService;
    }

    [HttpPost("register")]
    public IActionResult Register(RegisterRequestDto request)
    {
        var normalizedEmail = request.UserEmail.Trim().ToLower();

        var existingUser = _context.Users.FirstOrDefault(
            u => u.UserEmail != null && u.UserEmail.ToLower() == normalizedEmail
        );

        if (existingUser != null)
        {
            return BadRequest(new AuthResponseDto
            {
                Success = false,
                Message = "Email is already registered."
            });
        }

        var allowedTier = request.UserTier == 0 || request.UserTier == 1 || request.UserTier == 2
       ? request.UserTier
       : 2;

        var user = new User
        {
            UserId = Guid.NewGuid().ToString(),
            UserEmail = normalizedEmail,
            UserUsername = request.UserUsername,
            UserLastName = request.UserLastName,
            UserFirstName = request.UserFirstName,
            MustChangePass = request.MustChangePass,
            UserPasswordHash = _passwordService.HashPassword(request.Password),
            UserTier = allowedTier,
            UserStatus = 0
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        var auditLog = new AuditTrail
        {
            AuditTrailId = Guid.NewGuid().ToString(),
            UserId = user.UserId,
            ActionType = "REGISTER",
            TargetTable = "user_list_table",
            TargetId = user.UserId,
            OldValue = null,
            NewValue = $"UserEmail: {user.UserEmail}, UserUsername: {user.UserUsername}",
            Description = "New user account registered.",
            Status = "SUCCESS"
        };

        _context.AuditTrails.Add(auditLog);
        _context.SaveChanges();

        return Ok(new AuthResponseDto
        {
            Success = true,
            Message = "Account created successfully.",
            UserId = user.UserId,
            UserEmail = user.UserEmail,
            UserUsername = user.UserUsername,
            UserLastName = user.UserLastName,
            UserFirstName = user.UserFirstName,
            UserTier = user.UserTier,
            MustChangePass = user.MustChangePass,
            UserStatus = user.UserStatus
        });
    }
    [HttpPost("login")]
    public IActionResult Login(LoginRequestDto request)
    {
        var loginInput = request.Login.Trim().ToLower();

        var user = _context.Users.FirstOrDefault(u =>
            (u.UserEmail != null && u.UserEmail.ToLower() == loginInput) ||
            (u.UserUsername != null && u.UserUsername.ToLower() == loginInput)
        );

        if (user == null)
        {
            return Unauthorized(new AuthResponseDto
            {
                Success = false,
                Message = "Invalid email, username, or password."
            });
        }

        var isPasswordValid = _passwordService.VerifyPassword(request.Password, user.UserPasswordHash);

        if (!isPasswordValid)
        {
            return Unauthorized(new AuthResponseDto
            {
                Success = false,
                Message = "Invalid email, username, or password."
            });
        }

        if (user.UserStatus == 1)
        {
            return BadRequest(new AuthResponseDto
            {
                Success = false,
                Message = "Account is inactive.",
                UserId = user.UserId,
                UserEmail = user.UserEmail,
                UserUsername = user.UserUsername,
                UserLastName = user.UserLastName,
                UserFirstName = user.UserFirstName,
                UserTier = user.UserTier,
                MustChangePass = user.MustChangePass,
                UserStatus = user.UserStatus
            });
        }

        var auditLog = new AuditTrail
        {
            AuditTrailId = Guid.NewGuid().ToString(),
            UserId = user.UserId,
            ActionType = "LOGIN",
            TargetTable = "user_list_table",
            TargetId = user.UserId,
            OldValue = null,
            NewValue = $"UserEmail: {user.UserEmail}, UserUsername: {user.UserUsername}",
            Description = "User logged in successfully.",
            Status = "SUCCESS"
        };

        _context.AuditTrails.Add(auditLog);
        _context.SaveChanges();

        return Ok(new AuthResponseDto
        {
            Success = true,
            Message = user.MustChangePass == 1 ? "Password change required." : "Login successful.",
            UserId = user.UserId,
            UserEmail = user.UserEmail,
            UserUsername = user.UserUsername,
            UserLastName = user.UserLastName,
            UserFirstName = user.UserFirstName,
            UserTier = user.UserTier,
            MustChangePass = user.MustChangePass,
            UserStatus = user.UserStatus
        });
    }
    [HttpPut("change-password/{id}")]
    public IActionResult ChangePassword(string id, ChangePasswordRequestDto request)
    {
        var user = _context.Users.FirstOrDefault(u => u.UserId == id);

        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        var isCurrentPasswordValid = _passwordService.VerifyPassword(request.CurrentPassword, user.UserPasswordHash);

        if (!isCurrentPasswordValid)
        {
            return BadRequest(new { message = "Current password is incorrect." });
        }

        user.UserPasswordHash = _passwordService.HashPassword(request.NewPassword);
        user.MustChangePass = 0;
        _context.SaveChanges();

        var auditLog = new AuditTrail
        {
            AuditTrailId = Guid.NewGuid().ToString(),
            UserId = user.UserId,
            ActionType = "CHANGE_PASSWORD",
            TargetTable = "user_list_table",
            TargetId = user.UserId,
            OldValue = "Password updated",
            NewValue = "Password updated",
            Description = "User changed password successfully.",
            Status = "SUCCESS"
        };

        _context.AuditTrails.Add(auditLog);
        _context.SaveChanges();

        return Ok(new
        {
            message = "Password changed successfully.",
            userId = user.UserId,
            mustChangePass = user.MustChangePass
        });
    }
}