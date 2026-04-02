using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialMySql : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AuditTrails",
                columns: table => new
                {
                    AuditTrailId = table.Column<string>(type: "varchar(255)", nullable: false),
                    UserId = table.Column<string>(type: "longtext", nullable: false),
                    ActionType = table.Column<string>(type: "longtext", nullable: false),
                    TargetTable = table.Column<string>(type: "longtext", nullable: false),
                    TargetId = table.Column<string>(type: "longtext", nullable: false),
                    OldValue = table.Column<string>(type: "longtext", nullable: true),
                    NewValue = table.Column<string>(type: "longtext", nullable: true),
                    Description = table.Column<string>(type: "longtext", nullable: true),
                    Status = table.Column<string>(type: "longtext", nullable: false),
                    DateTime = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditTrails", x => x.AuditTrailId);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "TierPermissions",
                columns: table => new
                {
                    ReferenceId = table.Column<string>(type: "varchar(255)", nullable: false),
                    UserTier = table.Column<int>(type: "int", nullable: false),
                    PermissionId = table.Column<string>(type: "longtext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TierPermissions", x => x.ReferenceId);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "varchar(255)", nullable: false),
                    UserTier = table.Column<int>(type: "int", nullable: false),
                    UserEmail = table.Column<string>(type: "longtext", nullable: false),
                    UserUsername = table.Column<string>(type: "longtext", nullable: false),
                    UserLastName = table.Column<string>(type: "longtext", nullable: false),
                    UserFirstName = table.Column<string>(type: "longtext", nullable: false),
                    MustChangePass = table.Column<int>(type: "int", nullable: false),
                    UserPasswordHash = table.Column<string>(type: "longtext", nullable: false),
                    UserStatus = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                })
                .Annotation("MySQL:Charset", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditTrails");

            migrationBuilder.DropTable(
                name: "TierPermissions");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
