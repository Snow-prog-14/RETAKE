using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<AuditTrail> AuditTrails { get; set; }
    public DbSet<TierPermission> TierPermissions { get; set; }
    public DbSet<ForgotPasswordCode> ForgotPasswordCodes { get; set; }
    public DbSet<UserPermission> UserPermissions { get; set; }
}