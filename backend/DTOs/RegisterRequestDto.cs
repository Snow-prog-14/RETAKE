namespace backend.DTOs;

public class RegisterRequestDto
{
    public string UserEmail { get; set; } = string.Empty;
    public string UserUsername { get; set; } = string.Empty;
    public string UserLastName { get; set; } = string.Empty;
    public string UserFirstName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}