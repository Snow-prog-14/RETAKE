namespace backend.DTOs;

public class AuthResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string UserUsername { get; set; } = string.Empty;
    public string UserLastName { get; set; } = string.Empty;
    public string UserFirstName { get; set; } = string.Empty;
    public int UserTier { get; set; }
    public int MustChangePass { get; set; }
    public int UserStatus { get; set; }
    public string UserPhoto { get; set; } = string.Empty;
}