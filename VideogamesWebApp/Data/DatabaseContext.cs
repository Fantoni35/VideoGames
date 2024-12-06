using Microsoft.EntityFrameworkCore;
using VideogamesWebApp.Models;

namespace GamesDataAccess
{
    public class DatabaseContext : DbContext
    {
        public DbSet<Game> Games { get; set; }
        public DbSet<Stores> Stores { get; set; }
        public DbSet<Platforms> Platforms { get; set; }
        public DbSet<GameTransactions> GameTransactions { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Launcher> Launchers { get; set; }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasKey(u => u.UserId);
            modelBuilder.Entity<User>().Property(u => u.Username).IsRequired();
            modelBuilder.Entity<User>().Property(u => u.PasswordHash).IsRequired();

            modelBuilder.Entity<Game>().HasKey(g => g.GameId);
            modelBuilder.Entity<Game>().Property(g => g.GameName).IsRequired();
            modelBuilder.Entity<Game>().Property(g => g.GameDescription).IsRequired();


            modelBuilder.Entity<Stores>().HasKey(s => s.StoreId);
            modelBuilder.Entity<Platforms>().HasKey(p => p.PlatformId);

            modelBuilder.Entity<GameTransactions>().HasKey(t => t.TransactionId);

            modelBuilder.Entity<GameTransactions>()
                .HasOne<Stores>()
                .WithMany()
                .HasForeignKey(t => t.StoreId);

            modelBuilder.Entity<GameTransactions>()
                .HasOne<Platforms>()
                .WithMany()
                .HasForeignKey(t => t.PlatformId);

            modelBuilder.Entity<GameTransactions>()
         .HasOne(t => t.Game)
                .WithMany()
                .HasForeignKey(t => t.GameId);



            modelBuilder.Entity<GameTransactions>()
                .HasOne<Launcher>()
                .WithMany()
                .HasForeignKey(t => t.LauncherId);

            

            modelBuilder.Entity<Launcher>().HasKey(l => l.LauncherId);
            modelBuilder.Entity<Launcher>().Property(l => l.LauncherName).IsRequired();
        }
    }
}
