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
        var existingUser = _context.Users.FirstOrDefault(u => u.UserEmail == request.UserEmail);

        if (existingUser != null)
        {
            return BadRequest(new AuthResponseDto
            {
                Success = false,
                Message = "Email is already registered."
            });
        }

        var user = new User
        {
            UserEmail = request.UserEmail,
            UserUsername = request.UserUsername,
            UserLastName = request.UserLastName,
            UserFirstName = request.UserFirstName,
            UserPasswordHash = _passwordService.HashPassword(request.Password),
            UserTier = 2,
            UserStatus = 0
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        var auditLog = new AuditTrail
        {
            UserId = user.UserId,
            ActionType = "REGISTER",
            TargetTable = "Users",
            TargetId = user.UserId.ToString(),
            OldValue = null,
            NewValue = $"UserEmail: {user.UserEmail}, UserUsername: {user.UserUsername}",
            Description = "New user account registered.",
            Status = 1
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
            UserStatus = user.UserStatus
        });
    }

    [HttpPost("login")]
    public IActionResult Login(LoginRequestDto request)
    {
        var user = _context.Users.FirstOrDefault(u => u.UserEmail == request.UserEmail);

        if (user == null)
        {
            return Unauthorized(new AuthResponseDto
            {
                Success = false,
                Message = "Invalid email or password."
            });
        }

        var isPasswordValid = _passwordService.VerifyPassword(request.Password, user.UserPasswordHash);

        if (!isPasswordValid)
        {
            return Unauthorized(new AuthResponseDto
            {
                Success = false,
                Message = "Invalid email or password."
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
                UserStatus = user.UserStatus
            });
        }

        var auditLog = new AuditTrail
        {
            UserId = user.UserId,
            ActionType = "LOGIN",
            TargetTable = "Users",
            TargetId = user.UserId.ToString(),
            OldValue = null,
            NewValue = $"UserEmail: {user.UserEmail}, UserUsername: {user.UserUsername}",
            Description = "User logged in successfully.",
            Status = 1
        };

        _context.AuditTrails.Add(auditLog);
        _context.SaveChanges();

        return Ok(new AuthResponseDto
        {
            Success = true,
            Message = "Login successful.",
            UserId = user.UserId,
            UserEmail = user.UserEmail,
            UserUsername = user.UserUsername,
            UserLastName = user.UserLastName,
            UserFirstName = user.UserFirstName,
            UserTier = user.UserTier,
            UserStatus = user.UserStatus
        });
    }
}