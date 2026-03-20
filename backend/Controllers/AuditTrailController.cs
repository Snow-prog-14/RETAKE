using backend.Data;
using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditTrailController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly PermissionService _permissionService;

    public AuditTrailController(AppDbContext context, PermissionService permissionService)
    {
        _context = context;
        _permissionService = permissionService;
    }

    [HttpGet]
    public IActionResult GetAll([FromQuery] int userTier)
    {
        var hasPermission = _permissionService.HasPermission(userTier, "admin.audit.view");

        if (!hasPermission)
        {
           return StatusCode(403, new { message = "You do not have permission to view audit trails." });
        }

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