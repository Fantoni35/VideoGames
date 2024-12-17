using Microsoft.EntityFrameworkCore;
using VideogamesWebApp.Models;
using System.Linq;
using GamesDataAccess;

namespace VideogamesWebApp.Services
{
    public class StatisticsService
    {
        private readonly DatabaseContext _dbContext;

        public StatisticsService(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<dynamic> GetFilteredStatisticsAsync(int userId, int? storeId, int? platformId, int? launcherId)
        {
            var filteredTransactionsQuery = _dbContext.GameTransactions
                .Where(t => t.UserId == userId);

            if (storeId.HasValue)
                filteredTransactionsQuery = filteredTransactionsQuery.Where(t => t.StoreId == storeId.Value);

            if (platformId.HasValue)
                filteredTransactionsQuery = filteredTransactionsQuery.Where(t => t.PlatformId == platformId.Value);

            if (launcherId.HasValue)
                filteredTransactionsQuery = filteredTransactionsQuery.Where(t => t.LauncherId == launcherId.Value);

            var totalSpent = await filteredTransactionsQuery.SumAsync(t => t.Price);
            var totalGames = await filteredTransactionsQuery
                .Select(t => t.GameId)
                .Distinct()
                .CountAsync();

            var averagePrice = filteredTransactionsQuery.Any()
                ? Math.Round(await filteredTransactionsQuery.AverageAsync(t => (double?)t.Price) ?? 0, 2)
                : 0;

            var mostActiveDay = await filteredTransactionsQuery
                .GroupBy(t => t.PurchaseDate)
                .OrderByDescending(g => g.Count())
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .FirstOrDefaultAsync();

            var totalVirtual = await filteredTransactionsQuery.CountAsync(t => t.IsVirtual);
            var totalTransactions = await filteredTransactionsQuery.CountAsync();
            var percentageVirtual = totalTransactions > 0
                ? Math.Ceiling((double)totalVirtual / totalTransactions * 100)
                : 0;

            var mostExpensiveGame = await filteredTransactionsQuery
                .Select(t => new { t.GameId, Price = (double)t.Price }) // Conversione a double
                .OrderByDescending(t => t.Price)
                .FirstOrDefaultAsync();


            var lastPurchase = await filteredTransactionsQuery
                .OrderByDescending(t => t.PurchaseDate)
                .Select(t => new { t.Game.GameName, t.PurchaseDate })
                .FirstOrDefaultAsync();

            var activeDaysOfWeek = await filteredTransactionsQuery
                .GroupBy(t => t.PurchaseDate.DayOfWeek)
                .OrderByDescending(g => g.Count())
                .Select(g => new { Day = g.Key, Count = g.Count() })
                .ToListAsync();

            var activeMonths = await filteredTransactionsQuery
                .GroupBy(t => new { Year = t.PurchaseDate.Year, Month = t.PurchaseDate.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count()
                })
                .ToListAsync();

            return new
            {
                TotalSpent = totalSpent,
                TotalGames = totalGames,
                AveragePrice = averagePrice,
                MostActiveDay = mostActiveDay != null ? $"{mostActiveDay.Date:dd/MM/yyyy} ({mostActiveDay.Count} shopping)" : "No transactions.",
                PercentageVirtual = $"{percentageVirtual}% ({totalVirtual} virtual games)",
                MostExpensiveGame = mostExpensiveGame != null
                    ? $"{(await _dbContext.Games.Where(g => g.GameId == mostExpensiveGame.GameId).Select(g => g.GameName).FirstOrDefaultAsync())} ({mostExpensiveGame.Price} €)"
                    : "No transactions.",
                LastPurchase = lastPurchase != null
                    ? $"{lastPurchase.GameName} on {lastPurchase.PurchaseDate:dd/MM/yyyy}"
                    : "No transactions.",
                ActiveDaysOfWeek = activeDaysOfWeek,
                ActiveMonths = activeMonths
            };
        }
    }
}
