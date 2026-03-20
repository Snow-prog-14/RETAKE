using backend.Data;
using backend.Models;

namespace backend.Services;

public static class PermissionSeeder
{
    public static void Seed(AppDbContext context)
    {
        SeedTierPermissions(context);
        SeedDefaultSuperAdmin(context);
    }

    private static void SeedTierPermissions(AppDbContext context)
    {
        if (context.TierPermissions.Any())
        {
            return;
        }

        var permissions = new List<TierPermission>
        {
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "profile.view_own" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 1, PermissionId = "profile.view_own" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 2, PermissionId = "profile.view_own" },

            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "profile.edit_own" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 1, PermissionId = "profile.edit_own" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 2, PermissionId = "profile.edit_own" },

            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "profile_photo.update_own" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 1, PermissionId = "profile_photo.update_own" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 2, PermissionId = "profile_photo.update_own" },

            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "username.update_own" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 1, PermissionId = "username.update_own" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 2, PermissionId = "username.update_own" },

            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "password.update_own" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 1, PermissionId = "password.update_own" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 2, PermissionId = "password.update_own" },

            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "profile.deactivate_own" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 1, PermissionId = "profile.deactivate_own" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 2, PermissionId = "profile.deactivate_own" },

            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "student.list.view" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 1, PermissionId = "student.list.view" },

            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "student.profile.view" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 1, PermissionId = "student.profile.view" },

            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "student.info.edit" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 1, PermissionId = "student.info.edit" },

            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "student.status.update" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 1, PermissionId = "student.status.update" },

            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "admin.audit.view" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "admin.list.view" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "admin.info.edit" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "admin.status.update" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "admin.create" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "admin.create_tier" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "admin.edit_tier" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "profile.view_permission" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "profile.edit_permissions" },
            new() { ReferenceId = Guid.NewGuid().ToString(), UserTier = 0, PermissionId = "profile.delete_permission" }
        };

        context.TierPermissions.AddRange(permissions);
        context.SaveChanges();
    }

    private static void SeedDefaultSuperAdmin(AppDbContext context)
    {
        const string email = "superadmin@studybuddy.local";

        if (context.Users.Any(u => u.UserEmail == email))
        {
            return;
        }

        var passwordService = new PasswordService();

        var superAdmin = new User
        {
            UserId = Guid.NewGuid().ToString(),
            UserTier = 0,
            UserEmail = email,
            UserUsername = "superadmin",
            UserLastName = "System",
            UserFirstName = "SuperAdmin",
            MustChangePass = 1,
            UserPasswordHash = passwordService.HashPassword("Admin123!"),
            UserStatus = 0
        };

        context.Users.Add(superAdmin);

        context.AuditTrails.Add(new AuditTrail
        {
            AuditTrailId = Guid.NewGuid().ToString(),
            UserId = superAdmin.UserId,
            ActionType = "SEED_SUPER_ADMIN",
            TargetTable = "user_list_table",
            TargetId = superAdmin.UserId,
            OldValue = null,
            NewValue = $"UserEmail: {superAdmin.UserEmail}, UserUsername: {superAdmin.UserUsername}, UserTier: {superAdmin.UserTier}",
            Description = "Default Super Admin account seeded.",
            Status = "SUCCESS"
        });

        context.SaveChanges();
    }
}