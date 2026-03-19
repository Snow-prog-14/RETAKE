namespace backend.DTOs;

public class LoginRequestDto
{
    public string UserEmail { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}