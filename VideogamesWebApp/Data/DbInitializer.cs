using GamesDataAccess;
using Microsoft.EntityFrameworkCore;
using VideogamesWebApp.Models;

public static class DbInitializer
{
    public static void Initialize(DatabaseContext context)
    {
        context.Database.EnsureCreated();

        if (!context.Games.Any())
        {
            var games = new Game[]
            {
                new Game
                {
                    GameId = 1,
                    GameName = "Grand Theft Auto V",
                    GameDescription = "An open-world game",
                    MainGameId = null
                },
                 new Game
                {
                    GameId = 2,
                    GameName = "Gta Online",
                    GameDescription = "An open-world game",
                    MainGameId = 1
                },

                new Game
                {
                    GameId = 3,
                    GameName = "Formula 1",
                    GameDescription = "A car game.",
                    MainGameId = null
                },
                new Game
                {
                    GameId = 4,
                    GameName = "Call Of Duty",
                    GameDescription = "Shooter game",
                    MainGameId = null
                },
                  new Game
                {
                    GameId = 5,
                    GameName = "Awakeing",
                    GameDescription = "Shooter game",
                    MainGameId = 4
                },
                   new Game
                {
                    GameId = 6,
                    GameName = "Splash",
                    GameDescription = "Shooter game",
                    MainGameId = 4
                },
                new Game
                {
                    GameId = 7,
                    GameName = "Fifa",
                    GameDescription = "football game",
                    MainGameId = null
                },
                new Game
                {
                   GameId = 8,
                   GameName = "Battlefield",
                   GameDescription = "war game",
                   MainGameId = null
                },
                new Game
                {
                   GameId = 9,
                   GameName = "Just dance",
                   GameDescription = "Dance music",
                   MainGameId = null
                },
                 new Game
                {
                   GameId = 10,
                   GameName = "Just dance New song",
                   GameDescription = "Dance music",
                   MainGameId = 9
                },
                new Game
                {
                   GameId = 11,
                   GameName = "Elden Ring",
                   GameDescription = "RPG game",
                   MainGameId = null
                },
                  new Game
                {
                   GameId = 12,
                   GameName = "Elden Ring Shadow of The Erdtree",
                   GameDescription = "RPG game",
                   MainGameId = 11
                },
                new Game
                {
                   GameId = 13,
                   GameName = "Valorant",
                   GameDescription = "war game",
                   MainGameId = null
                },
                new Game
                {
                   GameId = 14,
                   GameName = "Minecraft",
                   GameDescription = "cube game",
                   MainGameId = null
                },
                new Game
                {
                   GameId = 15,
                   GameName = "Rocket League",
                   GameDescription = "car football game",
                   MainGameId = null
                },
                new Game
                {
                   GameId = 16,
                   GameName = "Dragon Ball Z: Kakarot",
                   GameDescription = "Anime Game",
                   MainGameId = null
                },
                 new Game
                {
                   GameId = 17,
                   GameName = "Dragon Ball Z: Kakarot A New Power",
                   GameDescription = "Anime Game",
                   MainGameId = 16
                },
            };

            context.Games.AddRange(games);
        }

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
        context.SaveChanges();
    }
}







