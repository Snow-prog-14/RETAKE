using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class ForgotPasswordCode
{
    [Key]
    public string ForgotPasswordCodeId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public int IsUsed { get; set; } = 0;
}