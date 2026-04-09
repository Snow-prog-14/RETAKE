namespace backend.DTOs;

public class ManageUserPermissionRequestDto
{
    public string TargetUserId { get; set; } = string.Empty;
    public string PermissionId { get; set; } = string.Empty;
}