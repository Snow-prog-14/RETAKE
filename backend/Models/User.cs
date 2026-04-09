namespace backend.Models;

public class User
{
    public string UserId { get; set; } = string.Empty;
    public int UserTier { get; set; } = 2;
    public string UserEmail { get; set; } = string.Empty;
    public string UserUsername { get; set; } = string.Empty;
    public string UserLastName { get; set; } = string.Empty;
    public string UserFirstName { get; set; } = string.Empty;
    public int MustChangePass { get; set; } = 0;
    public string UserPasswordHash { get; set; } = string.Empty;
    public int UserStatus { get; set; } = 0;
    public string UserPhoto { get; set; } = string.Empty;
}