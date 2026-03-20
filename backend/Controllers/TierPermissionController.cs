using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TierPermissionController : ControllerBase
{
    private readonly AppDbContext _context;

    public TierPermissionController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var permissions = _context.TierPermissions.ToList();
        return Ok(permissions);
    }
}