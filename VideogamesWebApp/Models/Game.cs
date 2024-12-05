using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VideogamesWebApp.Models;

public class Game
{
    [Required]
    public int GameId { get; set; }

    [MaxLength(25)]
    public string GameName { get; set; }

    [MaxLength(50)]
    public string GameDescription { get; set; }

    public int? MainGameId { get; set; }

    [ForeignKey("MainGameId")]
    public Game MainGame { get; set; }

    public string CoverImageUrl { get; set; }

    public bool IsImported { get; set; }
    

}

