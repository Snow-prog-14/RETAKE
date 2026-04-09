namespace backend.DTOs;

public class ResetPasswordRequestDto
{
    public string UserEmail { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}