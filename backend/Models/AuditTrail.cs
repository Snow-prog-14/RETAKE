namespace backend.Models;

public class AuditTrail
{
    public int AuditTrailId { get; set; }
    public int UserId { get; set; }
    public string ActionType { get; set; } = string.Empty;
    public string TargetTable { get; set; } = string.Empty;
    public string TargetId { get; set; } = string.Empty;
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public string? Description { get; set; }
    public int Status { get; set; }
    public DateTime DateTime { get; set; } = DateTime.UtcNow;
}