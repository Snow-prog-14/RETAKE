using backend.Data;
using backend.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditTrailController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuditTrailController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var auditLogs = _context.AuditTrails
            .Select(a => new AuditTrailResponseDto
            {
                AuditTrailId = a.AuditTrailId,
                UserId = a.UserId,
                ActionType = a.ActionType,
                TargetTable = a.TargetTable,
                TargetId = a.TargetId,
                OldValue = a.OldValue,
                NewValue = a.NewValue,
                Description = a.Description,
                Status = a.Status,
                DateTime = a.DateTime
            })
            .ToList();

        return Ok(auditLogs);
    }
}