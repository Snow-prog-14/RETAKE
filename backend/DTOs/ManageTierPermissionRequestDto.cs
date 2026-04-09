namespace backend.DTOs;

public class ManageTierPermissionRequestDto
{
    public int TargetUserTier { get; set; }
    public string PermissionId { get; set; } = string.Empty;
}