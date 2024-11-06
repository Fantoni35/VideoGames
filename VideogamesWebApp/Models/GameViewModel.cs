
namespace VideogamesWebApp.Models;

public class GameViewModel
{

    public int GameId { get; set; }
    public string GameName { get; set; }
    public string GameDescription { get; set; }
    public int? MainGameId { get; set; }
    public string MainGameName { get; set; }
}
