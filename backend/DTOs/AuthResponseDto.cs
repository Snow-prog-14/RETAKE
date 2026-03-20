namespace backend.DTOs;

public class AuthResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string? UserEmail { get; set; }
    public string? UserUsername { get; set; }
    public string? UserLastName { get; set; }
    public string? UserFirstName { get; set; }
    public int UserTier { get; set; }
    public int MustChangePass { get; set; }
    public int UserStatus { get; set; }
}