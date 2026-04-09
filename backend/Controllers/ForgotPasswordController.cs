using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ForgotPasswordController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ForgotPasswordService _forgotPasswordService;
    private readonly EmailService _emailService;
    private readonly PasswordService _passwordService;

    public ForgotPasswordController(
        AppDbContext context,
        ForgotPasswordService forgotPasswordService,
        EmailService emailService,
        PasswordService passwordService)
    {
        _context = context;
        _forgotPasswordService = forgotPasswordService;
        _emailService = emailService;
        _passwordService = passwordService;
    }

    [HttpPost]
    public IActionResult SendCode(ForgotPasswordRequestDto request)
    {
        var normalizedEmail = request.UserEmail.Trim().ToLower();

        var user = _context.Users.FirstOrDefault(u =>
            u.UserEmail != null && u.UserEmail.ToLower() == normalizedEmail);

        if (user == null)
        {
            return NotFound(new { message = "Email not found." });
        }

        var code = _forgotPasswordService.GenerateCode();

        var forgotPasswordCode = new ForgotPasswordCode
        {
            ForgotPasswordCodeId = Guid.NewGuid().ToString(),
            UserId = user.UserId,
            UserEmail = user.UserEmail,
            Code = code,
            ExpiresAt = DateTime.UtcNow.AddMinutes(10),
            IsUsed = 0
        };

        _context.ForgotPasswordCodes.Add(forgotPasswordCode);
        _context.SaveChanges();

        _emailService.SendEmail(
            user.UserEmail,
            "Study Buddy Forgot Password Code",
            $"Your password reset code is: {code}"
        );

        return Ok(new { message = "Password reset code sent successfully." });
    }

    [HttpPost("reset")]
    public IActionResult ResetPassword(ResetPasswordRequestDto request)
    {
        var normalizedEmail = request.UserEmail.Trim().ToLower();

        var user = _context.Users.FirstOrDefault(u =>
            u.UserEmail != null && u.UserEmail.ToLower() == normalizedEmail);

        if (user == null)
        {
            return NotFound(new { message = "Email not found." });
        }

        var codeEntry = _context.ForgotPasswordCodes
            .Where(c =>
                c.UserEmail.ToLower() == normalizedEmail &&
                c.Code == request.Code &&
                c.IsUsed == 0)
            .OrderByDescending(c => c.ExpiresAt)
            .FirstOrDefault();

        if (codeEntry == null)
        {
            return BadRequest(new { message = "Invalid reset code." });
        }

        if (codeEntry.ExpiresAt < DateTime.UtcNow)
        {
            return BadRequest(new { message = "Reset code has expired." });
        }

        user.UserPasswordHash = _passwordService.HashPassword(request.NewPassword);
        user.MustChangePass = 0;
        codeEntry.IsUsed = 1;

        _context.SaveChanges();

        var auditLog = new AuditTrail
        {
            AuditTrailId = Guid.NewGuid().ToString(),
            UserId = user.UserId,
            ActionType = "RESET_PASSWORD",
            TargetTable = "user_list_table",
            TargetId = user.UserId,
            OldValue = "Forgot password reset",
            NewValue = "Password updated",
            Description = "User reset password using email code.",
            Status = "SUCCESS"
        };

        _context.AuditTrails.Add(auditLog);
        _context.SaveChanges();

        return Ok(new { message = "Password reset successfully." });
    }
}