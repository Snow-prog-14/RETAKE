using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace backend.Services;

public class EmailService
{
    private readonly EmailSettings _emailSettings;

    public EmailService(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }

    public void SendEmail(string toEmail, string subject, string body)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Study Buddy", _emailSettings.Email));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = subject;

        message.Body = new TextPart("plain")
        {
            Text = body
        };

        using var client = new SmtpClient();

        var secureSocket = _emailSettings.UseTls
            ? SecureSocketOptions.StartTls
            : SecureSocketOptions.Auto;

        client.Connect(_emailSettings.Host, _emailSettings.Port, secureSocket);
        client.Authenticate(_emailSettings.Email, _emailSettings.Password);
        client.Send(message);
        client.Disconnect(true);
    }
}