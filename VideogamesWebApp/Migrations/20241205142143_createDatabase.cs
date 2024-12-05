using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VideogamesWebApp.Migrations
{
    /// <inheritdoc />
    public partial class createDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    GameId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    GameName = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    GameDescription = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    MainGameId = table.Column<int>(type: "INTEGER", nullable: true),
                    CoverImageUrl = table.Column<string>(type: "TEXT", nullable: false),
                    IsImported = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.GameId);
                    table.ForeignKey(
                        name: "FK_Games_Games_MainGameId",
                        column: x => x.MainGameId,
                        principalTable: "Games",
                        principalColumn: "GameId");
                });

            migrationBuilder.CreateTable(
                name: "Launchers",
                columns: table => new
                {
                    LauncherId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LauncherName = table.Column<string>(type: "TEXT", maxLength: 15, nullable: false),
                    LauncherDescription = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    Link = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Launchers", x => x.LauncherId);
                });

            migrationBuilder.CreateTable(
                name: "Platforms",
                columns: table => new
                {
                    PlatformId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PlatformName = table.Column<string>(type: "TEXT", maxLength: 15, nullable: false),
                    PlatformDescription = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Platforms", x => x.PlatformId);
                });

            migrationBuilder.CreateTable(
                name: "Stores",
                columns: table => new
                {
                    StoreId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    StoreName = table.Column<string>(type: "TEXT", maxLength: 15, nullable: false),
                    StoreDescription = table.Column<string>(type: "TEXT", maxLength: 15, nullable: false),
                    StoreLink = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stores", x => x.StoreId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Username = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    ProfileImage = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "GameTransactions",
                columns: table => new
                {
                    TransactionId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PurchaseDate = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    IsVirtual = table.Column<bool>(type: "INTEGER", nullable: false),
                    Price = table.Column<decimal>(type: "TEXT", nullable: false),
                    StoreId = table.Column<int>(type: "INTEGER", nullable: false),
                    PlatformId = table.Column<int>(type: "INTEGER", nullable: false),
                    GameId = table.Column<int>(type: "INTEGER", nullable: false),
                    LauncherId = table.Column<int>(type: "INTEGER", nullable: false),
                    Notes = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameTransactions", x => x.TransactionId);
                    table.ForeignKey(
                        name: "FK_GameTransactions_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "GameId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GameTransactions_Launchers_LauncherId",
                        column: x => x.LauncherId,
                        principalTable: "Launchers",
                        principalColumn: "LauncherId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GameTransactions_Platforms_PlatformId",
                        column: x => x.PlatformId,
                        principalTable: "Platforms",
                        principalColumn: "PlatformId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GameTransactions_Stores_StoreId",
                        column: x => x.StoreId,
                        principalTable: "Stores",
                        principalColumn: "StoreId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Games_MainGameId",
                table: "Games",
                column: "MainGameId");

            migrationBuilder.CreateIndex(
                name: "IX_GameTransactions_GameId",
                table: "GameTransactions",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_GameTransactions_LauncherId",
                table: "GameTransactions",
                column: "LauncherId");

            migrationBuilder.CreateIndex(
                name: "IX_GameTransactions_PlatformId",
                table: "GameTransactions",
                column: "PlatformId");

            migrationBuilder.CreateIndex(
                name: "IX_GameTransactions_StoreId",
                table: "GameTransactions",
                column: "StoreId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GameTransactions");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.DropTable(
                name: "Launchers");

            migrationBuilder.DropTable(
                name: "Platforms");

            migrationBuilder.DropTable(
                name: "Stores");
        }
    }
}
