using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class TierPermission
{
    [Key]
    public string ReferenceId { get; set; } = string.Empty;
    public int UserTier { get; set; }
    public string PermissionId { get; set; } = string.Empty;
}