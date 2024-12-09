using System.ComponentModel.DataAnnotations;

namespace VideogamesWebApp.Models;

public class GameTransactionsViewModel
{
    public int GameId { get; set; }
    public int TransactionId { get; set; }

    public string GameName { get; set; }
    public DateOnly PurchaseDate { get; set; }
    public decimal Price { get; set; }
    public bool IsVirtual { get; set; }
    public string StoreName { get; set; }
    public string PlatformName { get; set; }
    public string LauncherName { get; set; }
    public int? MainGameId { get; set; }

    public string MainGameName { get; set; }
    public string CoverImageUrl { get; set; }

}