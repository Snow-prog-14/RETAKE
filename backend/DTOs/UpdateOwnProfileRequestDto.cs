namespace backend.DTOs;

public class UpdateOwnProfileRequestDto
{
    public string UserFirstName { get; set; } = string.Empty;
    public string UserLastName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string UserUsername { get; set; } = string.Empty;
}