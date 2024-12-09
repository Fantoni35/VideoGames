using GamesDataAccess;
using Microsoft.EntityFrameworkCore;
using VideogamesWebApp.Models;
using Newtonsoft.Json;
public static class DbInitializer
{
    public static void Initialize(DatabaseContext context)
    {
        context.Database.EnsureCreated();

        if (!context.Stores.Any())
        {
            var stores = new Stores[]
            {
                new Stores
                {
                    StoreId = 1,
                    StoreName = "Steam",
                    StoreDescription = "Online game store for PC games",
                    StoreLink = "https://store.steampowered.com"
                },
                new Stores
                {
                    StoreId = 2,
                    StoreName = "PlayStation Store",
                    StoreDescription = "Sony's official PlayStation store",
                    StoreLink = "https://store.playstation.com"
                },
                new Stores
                { StoreId = 3,
                    StoreName = "Microsoft Store",
                    StoreDescription = "Microsoft's official Xbox and PC store",
                    StoreLink = "https://www.microsoft.com/store"
                },
                 new Stores {
                    StoreId = 4,
                    StoreName = "Instant Gaming",
                    StoreDescription = "An online store to buy games",
                    StoreLink = "https://www.instant-gaming.com/it"
                 },
                 new Stores {
                    StoreId = 5,
                    StoreName = "MediaWorld",
                    StoreDescription = "electronics store",
                    StoreLink = "https://www.mediaworld.it"
                 },
                 new Stores {
                    StoreId = 6,
                    StoreName = "Nintendo Store",
                    StoreDescription = "Official Nintendo Store",
                    StoreLink = "https://www.Nintendo.it"
                 },
                 new Stores {
                    StoreId = 7,
                    StoreName = "Games Store",
                    StoreDescription = "The classic phisical store of game",
                    StoreLink = "https://www.GameStop.it"
                 }


            };

            context.Stores.AddRange(stores);
        }

        if (!context.Platforms.Any())
        {
            var platforms = new Platforms[]
            {
                new Platforms
                {
                    PlatformId = 1,
                    PlatformName = "PC",
                    PlatformDescription = "Personal Computer"
                },
                new Platforms
                {
                    PlatformId = 2,
                    PlatformName = "PlayStation",
                    PlatformDescription = "Sony PlayStation console"
                },
                new Platforms
                {
                    PlatformId = 3,
                    PlatformName = "Xbox",
                    PlatformDescription = "Microsoft Xbox Console"
                },
                new Platforms
                { PlatformId = 4,
                    PlatformName = "Nintendo Switch",
                    PlatformDescription = "Nintendo console"
                }
            };

            context.Platforms.AddRange(platforms);
        }

        if (!context.Launchers.Any())
        {
            var launchers = new Launcher[]
            {
        new Launcher
        {
            LauncherId = 1,
            LauncherName = "Steam",
            LauncherDescription = "A popular gaming platform for PC",
            Link = "https://store.steampowered.com"
        },
        new Launcher
        {
            LauncherId = 2,
            LauncherName = "Ubisoft",
            LauncherDescription = "Ubisoft Launcher",
            Link = "https://www.Ubisoft.com"
        },
        new Launcher
        {
            LauncherId = 3,
            LauncherName = "Origin",
            LauncherDescription = "EA's game launcher",
            Link = "https://www.origin.com"
        },
        new Launcher
        {
            LauncherId = 4,
            LauncherName = "Rockstar Games",
            LauncherDescription = "Rockstar Games game launcher",
            Link = "https://www.Rockstar.com"
        }
            };
            context.Launchers.AddRange(launchers);
        }
        // Aggiungi giochi dal file JSON
        if (!context.Games.Any())
        {
            var games = ReadGamesFromJson("games.json");
            context.Games.AddRange(games);
        }

        context.SaveChanges();
    }
    private static List<Game> ReadGamesFromJson(string filePath)
    {
        var jsonData = File.ReadAllText(filePath);
        var games = JsonConvert.DeserializeObject<List<Game>>(jsonData);

        // Imposta IsImported a true per i giochi importati dal JSON
        foreach (var game in games)
        {
            game.IsImported = true;

            // Imposta un valore predefinito per CoverImageUrl se è NULL
            if (string.IsNullOrEmpty(game.CoverImageUrl))
            {
                game.CoverImageUrl = "/images/controller.jpg"; // Imposta un'immagine predefinita
            }
        }

        return games;
    }

}

