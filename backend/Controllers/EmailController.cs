using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmailController : ControllerBase
{
    private readonly EmailService _emailService;

    public EmailController(EmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost("test")]
    public IActionResult SendTestEmail(SendTestEmailRequestDto request)
    {
        _emailService.SendEmail(
            request.ToEmail,
            "Study Buddy Test Email",
            "This is a test email from the Study Buddy backend."
        );

        return Ok(new { message = "Test email sent successfully." });
    }
}