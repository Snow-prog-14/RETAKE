using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class UserPermission
{
    [Key]
    public string ReferenceId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string PermissionId { get; set; } = string.Empty;
}