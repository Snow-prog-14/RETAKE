namespace backend.DTOs;

public class AuditTrailResponseDto
{
    public string AuditTrailId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string ActionType { get; set; } = string.Empty;
    public string TargetTable { get; set; } = string.Empty;
    public string TargetId { get; set; } = string.Empty;
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public string? Description { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime DateTime { get; set; }
}