namespace backend.Models;

public class User
{
    public int UserId { get; set; }
    public int UserTier { get; set; } = 2;
    public string UserEmail { get; set; } = string.Empty;
    public string UserUsername { get; set; } = string.Empty;
    public string UserLastName { get; set; } = string.Empty;
    public string UserFirstName { get; set; } = string.Empty;
    public string UserPasswordHash { get; set; } = string.Empty;
    public int UserStatus { get; set; } = 0;
}