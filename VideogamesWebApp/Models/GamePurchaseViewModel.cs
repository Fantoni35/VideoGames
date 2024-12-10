namespace VideogamesWebApp.Models
{
    public class GamePurchaseViewModel
    {
        public int GameId { get; set; }
        public int StoreId { get; set; }
        public int PlatformId { get; set; }
        public int LauncherId { get; set; }
       
        public DateOnly PurchaseDate { get; set; }
        public decimal Price { get; set; }
        public bool IsVirtual { get; set; }
        public string Notes { get; set; } 
        public string? MainGameId { get; set; }
        public List<int> DlcIds { get; set; } = new List<int>(); 

    }

}
