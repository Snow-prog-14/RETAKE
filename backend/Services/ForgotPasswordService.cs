namespace backend.Services;

public class ForgotPasswordService
{
    public string GenerateCode()
    {
        var random = new Random();
        return random.Next(100000, 999999).ToString();
    }
}