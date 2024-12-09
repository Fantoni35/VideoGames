using GamesDataAccess;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VideogamesWebApp.Models;


public class GamesController : Controller
{
    private readonly DatabaseContext _dbContext;

    public GamesController(DatabaseContext dbContext)
    {
        _dbContext = dbContext;
    }




    public IActionResult Index(string searchQuery, int pageNumber = 1)
    {
        var userId = GetUserId(); // Metodo per ottenere l'ID dell'utente
        var username = GetUsername(); // Metodo per ottenere il nome utente
        int pageSize = 5;

        // Recupera l'utente per ottenere anche l'immagine del profilo
        var user = _dbContext.Users.SingleOrDefault(u => u.UserId == userId);

        if (user == null)
        {
            return RedirectToAction("Login", "Account");
        }



        // Recupera la lista delle transazioni del gioco
        var transactionsQuery = from transaction in _dbContext.GameTransactions
                                join game in _dbContext.Games on transaction.GameId equals game.GameId
                                join store in _dbContext.Stores on transaction.StoreId equals store.StoreId
                                join platform in _dbContext.Platforms on transaction.PlatformId equals platform.PlatformId
                                join launcher in _dbContext.Launchers on transaction.LauncherId equals launcher.LauncherId
                                join mainGame in _dbContext.Games on game.MainGameId equals mainGame.GameId into mainGames
                                from mainGame in mainGames.DefaultIfEmpty()
                                where transaction.UserId == userId
                                orderby game.GameName
                                select new GameTransactionsViewModel
                                {
                                    TransactionId = transaction.TransactionId,
                                    GameId = transaction.GameId,
                                    GameName = game.GameName,
                                    PurchaseDate = transaction.PurchaseDate,
                                    Price = transaction.Price,
                                    IsVirtual = transaction.IsVirtual,
                                    StoreName = store.StoreName,
                                    PlatformName = platform.PlatformName,
                                    LauncherName = launcher.LauncherName,
                                    MainGameId = game.MainGameId,
                                    MainGameName = mainGame != null ? mainGame.GameName : null,
                                    CoverImageUrl = game.CoverImageUrl
                                };

        // Filtro di ricerca, se presente
        if (!string.IsNullOrWhiteSpace(searchQuery))
        {
            searchQuery = searchQuery.ToLower();
            transactionsQuery = transactionsQuery.Where(t =>
                t.GameName.ToLower().Contains(searchQuery) ||
                t.StoreName.ToLower().Contains(searchQuery) ||
                t.PlatformName.ToLower().Contains(searchQuery) ||
                t.LauncherName.ToLower().Contains(searchQuery) ||
                (t.MainGameName != null && t.MainGameName.ToLower().Contains(searchQuery))
            );
        }

        // Paginazione
        var totalTransactions = transactionsQuery.Count();
        var transactions = transactionsQuery
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();


        // Passa i dati alla vista
        ViewData["Username"] = username;
        ViewData["searchQuery"] = searchQuery;
        ViewData["TotalPages"] = (int)Math.Ceiling((double)totalTransactions / pageSize);
        ViewData["CurrentPage"] = pageNumber;
        ViewData["ProfileImage"] = user.ProfileImage;

        ViewData["AvailableGames"] = _dbContext.Games
                                        .Select(g => new { g.GameId, g.GameName })
                                        .ToList();

        ViewData["AvailableStores"] = _dbContext.Stores
                                         .Select(s => new { s.StoreId, s.StoreName })
                                         .ToList();
        ViewData["AvailablePlatforms"] = _dbContext.Platforms
                                                       .Select(p => new { p.PlatformId, p.PlatformName })
                                                       .ToList();
        ViewData["AvailableLaunchers"] = _dbContext.Launchers
                                                       .Select(l => new { l.LauncherId, l.LauncherName })
                                                       .ToList();

        return View("~/Views/Home/Index.cshtml", transactions);
    }





    [HttpPost]
    public IActionResult BuyGame(GamePurchaseViewModel model)
    {
        if (ModelState.IsValid)
        {

            var newTransaction = new GameTransactions
            {
                GameId = model.GameId,
                StoreId = model.StoreId,
                PlatformId = model.PlatformId,
                LauncherId = model.LauncherId,
                PurchaseDate = model.PurchaseDate,
                Price = model.Price,
                IsVirtual = model.IsVirtual,
                UserId = GetUserId(),
                Notes = string.IsNullOrEmpty(model.Notes) ? null : model.Notes
            };

            _dbContext.GameTransactions.Add(newTransaction);
            _dbContext.SaveChanges();

            TempData["SuccessMessage"] = "Purchase completed successfully.";
            return RedirectToAction("Index");
        }

        TempData["ErrorMessage"] = "An error occurred during the purchase. Check the data entered.";
        return RedirectToAction("Index");
    }


    public IActionResult ViewAllGames(int pageNumber = 1, string sortOrder = "GameNameAsc")
    {
        int pageSize = 5;
        var username = GetUsername();

        // Ensure the games are initialized (if not already in the database)
        if (!_dbContext.Games.Any())
        {
            DbInitializer.Initialize(_dbContext); // Initialize games from the JSON file if the database is empty
        }

        IQueryable<GameViewModel> allGamesQuery = _dbContext.Games
            .Select(game => new GameViewModel
            {
                GameId = game.GameId,
                GameName = game.GameName,
                GameDescription = game.GameDescription,
                MainGameId = game.MainGameId,
                MainGameName = game.MainGame != null ? game.MainGame.GameName : null,
                DLCCount = _dbContext.Games.Count(dlc => dlc.MainGameId == game.GameId),
                IsImported = game.IsImported,
                CoverImageUrl = game.CoverImageUrl


            });

        // Apply sorting based on the selected sort order
        allGamesQuery = sortOrder switch
        {
            "GameNameAsc" => allGamesQuery.OrderBy(game => game.GameName.ToLower()),
            "GameNameDesc" => allGamesQuery.OrderByDescending(game => game.GameName.ToLower()),
            "GameDescriptionAsc" => allGamesQuery.OrderBy(game => game.GameDescription),
            "GameDescriptionDesc" => allGamesQuery.OrderByDescending(game => game.GameDescription),
            "DLCCountAsc" => allGamesQuery.OrderBy(game => game.DLCCount),
            "DLCCountDesc" => allGamesQuery.OrderByDescending(game => game.DLCCount),
            _ => allGamesQuery.OrderBy(game => game.GameName.ToLower()) // Default alphabetical order
        };

        var mainGames = _dbContext.Games
            .Where(g => g.MainGameId == null)
            .OrderBy(g => g.GameName)
            .Select(g => new { g.GameId, g.GameName })
            .ToList();

        ViewBag.MainGames = mainGames;

        int totalGames = allGamesQuery.Count();
        var paginatedGames = allGamesQuery
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var gamesWithDLCs = _dbContext.Games
            .Where(g => g.MainGameId == null)
            .Select(g => new
            {
                GameId = g.GameId,
                HasDLCs = _dbContext.Games.Any(dlc => dlc.MainGameId == g.GameId)
            })
            .ToDictionary(g => g.GameId, g => g.HasDLCs);

        ViewBag.GamesWithDLCs = gamesWithDLCs;

        ViewData["Username"] = username;
        ViewData["TotalPages"] = (int)Math.Ceiling((double)totalGames / pageSize);
        ViewData["CurrentPage"] = pageNumber;
        ViewData["CurrentSortOrder"] = sortOrder;

        return View("~/Views/Home/ViewAllGames.cshtml", paginatedGames);
    }

    public IActionResult ViewStats(int? storeId, int? platformId, int? launcherId)
    {
        var userId = GetUserId();

        var filteredTransactionsQuery = _dbContext.GameTransactions
            .Where(t => t.UserId == userId);

        if (storeId.HasValue)
            filteredTransactionsQuery = filteredTransactionsQuery.Where(t => t.StoreId == storeId.Value);

        if (platformId.HasValue)
            filteredTransactionsQuery = filteredTransactionsQuery.Where(t => t.PlatformId == platformId.Value);

        if (launcherId.HasValue)
            filteredTransactionsQuery = filteredTransactionsQuery.Where(t => t.LauncherId == launcherId.Value);


        // Aggiorna le statistiche come prima
        var totalSpent = filteredTransactionsQuery.Sum(t => t.Price);
        ViewData["TotalSpent"] = totalSpent;


        // Giochi totali che ha l'utente
        var totalGames = filteredTransactionsQuery
            .Select(t => t.GameId)
            .Distinct()
            .Count();
        ViewData["TotalGames"] = totalGames;

        // Prezzo medio per ogni gioco
        var averagePrice = filteredTransactionsQuery.Any()
     ? Math.Round(filteredTransactionsQuery.Average(t => (double?)t.Price) ?? 0, 2)
     : 0;

        ViewData["AveragePrice"] = averagePrice.ToString("F2"); // Format to two decimal places

        // Giorno con il maggior numero di acquisti
        var mostActiveDay = filteredTransactionsQuery
            .GroupBy(t => t.PurchaseDate)
            .OrderByDescending(g => g.Count())
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .FirstOrDefault();
        ViewData["MostActiveDay"] = mostActiveDay != null
            ? $"{mostActiveDay.Date:dd/MM/yyyy} ({mostActiveDay.Count} shopping)"
            : "No transactions.";

        // Percentuale di giochi virtuali
        var totalVirtual = filteredTransactionsQuery
            .Count(t => t.IsVirtual);
        var totalTransactions = filteredTransactionsQuery.Count();
        var percentageVirtual = totalTransactions > 0
            ? Math.Ceiling((double)totalVirtual / totalTransactions * 100)
            : 0;
        ViewData["PercentageVirtual"] = $"{percentageVirtual}% ({totalVirtual} virtual games)";

        //most expensive game
        var mostExpensiveGame = filteredTransactionsQuery
    .Where(t => t.UserId == userId)
    .AsEnumerable()
    .OrderByDescending(t => t.Price)
    .Select(t => new { t.GameId, t.Price })
    .FirstOrDefault();

        if (mostExpensiveGame != null)
        {
            var gameName = _dbContext.Games
                .Where(g => g.GameId == mostExpensiveGame.GameId)
                .Select(g => g.GameName)
                .FirstOrDefault();

            ViewData["MostExpensiveGame"] = gameName != null
                ? $"{gameName} ({mostExpensiveGame.Price} €)"
                : "Nessun gioco trovato.";
        }
        else
        {
            ViewData["MostExpensiveGame"] = "No transactions.";
        }

        // Last purchase
        var lastPurchase = filteredTransactionsQuery
            .OrderByDescending(t => t.PurchaseDate)
            .Select(t => new { t.Game.GameName, t.PurchaseDate })
            .FirstOrDefault();
        ViewData["LastPurchase"] = lastPurchase != null
            ? $"{lastPurchase.GameName} on {lastPurchase.PurchaseDate:dd/MM/yyyy}"
            : "No transactions.";

        // Shopping by days of the week
        var activeDaysOfWeek = filteredTransactionsQuery
            .GroupBy(t => t.PurchaseDate.DayOfWeek)
            .OrderByDescending(g => g.Count())
            .Select(g => new { Day = g.Key, Count = g.Count() })
            .ToList();
        ViewData["ActiveDaysOfWeek"] = activeDaysOfWeek;

        // Shopping by month
        var activeMonths = filteredTransactionsQuery
            .GroupBy(t => new { Year = t.PurchaseDate.Year, Month = t.PurchaseDate.Month })
            .Select(g => new
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                Count = g.Count()
            })
            .ToList();
        ViewData["ActiveMonths"] = activeMonths;

        return View("~/Views/Home/ViewStats.cshtml");
    }


    private string GetUsername()
    {
        return HttpContext.Session.GetString("Username") ?? "Guest";
    }

    private int GetUserId()
    {
        return HttpContext.Session.GetInt32("UserId") ?? 0;
    }

    [HttpPost]
    public async Task<IActionResult> AddGame(string gameName, string gameDescription, int? mainGameId, bool fromViewAllGames = false)
    {
        if (!string.IsNullOrWhiteSpace(gameName) && !string.IsNullOrWhiteSpace(gameDescription))
        {
            var existingGame = await _dbContext.Games
            .FirstOrDefaultAsync(g => EF.Functions.Like(g.GameName, gameName));

            if (existingGame != null)
            {
                TempData["ErrorMessage"] = "A game with the same name. Enter different game.";
                return RedirectToAction("ViewAllGames", new { sortOrder = "alphabetical" });
            }

            var game = new Game
            {
                GameName = gameName,
                GameDescription = gameDescription,
                MainGameId = mainGameId,
                IsImported = false, // Imposta IsImported a false per i giochi aggiunti dall'utente
                CoverImageUrl = "/images/controller.jpg"


            };
            _dbContext.Games.Add(game);
            await _dbContext.SaveChangesAsync();

            TempData["SuccessMessage"] = "The game has been successfully added!";

            if (fromViewAllGames)
            {
                //  ritorna la pagina di ViewAllGames con il nome gioco
                return RedirectToAction("index", "Games", new { sortOrder = "alphabetical", gameName = gameName, gameId = game.GameId });
            }
            else
            {
                // Ritorna pagina Index 
                return RedirectToAction("ViewAllGames", "Games");
            }
        }

        TempData["ErrorMessage"] = "The game name and description cannot be empty.";
        return RedirectToAction("ViewAllGames", new { sortOrder = "alphabetical" });
    }

    [HttpPost]
    public IActionResult AddStore(string storeName, string storeDescription, string storeLink)
    {
        if (!string.IsNullOrWhiteSpace(storeName))
        {
            var existingStore = _dbContext.Stores.FirstOrDefault(s => s.StoreName.ToLower() == storeName.ToLower());
            if (existingStore != null)
            {
                return Json(new { success = false, message = "Store with this name already exists. Please enter a different name." });
            }

            var newStore = new Stores
            {
                StoreName = storeName,
                StoreDescription = storeDescription,
                StoreLink = storeLink
            };

            _dbContext.Stores.Add(newStore);
            _dbContext.SaveChanges();

            // Ritorna messaggio di successo con dettagli sullo store creato
            return Json(new
            {
                success = true,
                storeId = newStore.StoreId,
                storeName = newStore.StoreName,
                message = "Store added successfully!"
            });
        }

        return Json(new { success = false, message = "Store name cannot be empty." });
    }


    [HttpPost]
    public IActionResult AddPlatform(string platformName, string platformDescription)
    {
        if (!string.IsNullOrWhiteSpace(platformName))
        {
            var existingPlatform = _dbContext.Platforms
                .FirstOrDefault(p => p.PlatformName.ToLower() == platformName.ToLower());

            if (existingPlatform != null)
            {
                return Json(new { success = false, message = "A platform with this name already exists. Please enter a different name." });
            }

            var newPlatform = new Platforms
            {
                PlatformName = platformName,
                PlatformDescription = platformDescription
            };

            _dbContext.Platforms.Add(newPlatform);
            _dbContext.SaveChanges();
            return Json(new
            {
                success = true,
                platformId = newPlatform.PlatformId,
                platformName = newPlatform.PlatformName,
                message = "Platform added successfully!"
            });
        }

        return Json(new { success = false, message = "Platform name cannot be empty." });
    }

    [HttpPost]
    public IActionResult AddLauncher(string launcherName, string launcherDescription, string link)
    {
        if (!string.IsNullOrWhiteSpace(launcherName))
        {
            var existingLauncher = _dbContext.Launchers
                .FirstOrDefault(l => l.LauncherName.ToLower() == launcherName.ToLower());

            if (existingLauncher != null)
            {
                return Json(new { success = false, message = "A launcher with this name already exists. Please enter a different name." });
            }

            var newLauncher = new Launcher
            {
                LauncherName = launcherName,
                LauncherDescription = launcherDescription,
                Link = link
            };

            _dbContext.Launchers.Add(newLauncher);
            _dbContext.SaveChanges();
            return Json(new
            {
                success = true,
                launcherId = newLauncher.LauncherId,
                launcherName = newLauncher.LauncherName,
                message = "Launcher added successfully!"
            });
        }

        return Json(new { success = false, message = "Launcher name cannot be empty." });
    }

    [HttpPost]
    public IActionResult DeleteGame(int transactionId)
    {
        var transaction = _dbContext.GameTransactions.SingleOrDefault(t => t.TransactionId == transactionId);

        if (transaction == null)
        {
            TempData["ErrorMessage"] = "Transaction not found or already deleted.";
            return RedirectToAction("Index");
        }

        _dbContext.GameTransactions.Remove(transaction);
        _dbContext.SaveChanges();

        TempData["SuccessMessage"] = "Game deleted successfully.";
        return RedirectToAction("Index");
    }

    [HttpPost]
    public IActionResult DeleteAllGame(int GameId)
    {
        var game = _dbContext.Games.SingleOrDefault(t => t.GameId == GameId);

        if (game == null)
        {
            TempData["ErrorMessage"] = "Game not found or already deleted.";
            return RedirectToAction("Index");
        }

        // Verifica se il gioco ha DLC associati
        if (_dbContext.Games.Any(dlc => dlc.MainGameId == game.GameId))
        {
            TempData["ErrorMessage"] = "Cannot delete this game because it has at least one associated DLC.";
            return RedirectToAction("ViewAllGames");
        }

        _dbContext.Games.Remove(game);
        _dbContext.SaveChanges();

        TempData["SuccessMessage"] = "Game deleted successfully.";
        return RedirectToAction("ViewAllGames");
    }




    [HttpGet]
    public IActionResult SearchGames(string query)
    {
        var queryWords = query.ToLower().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

        var games = _dbContext.Games
            .Where(g => queryWords.All(word => g.GameName.ToLower().Contains(word)))
            .AsEnumerable()
            .Where(g => queryWords.All(word =>
                g.GameName.ToLower().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)
                    .Any(gameName => gameName.StartsWith(word))))
            .Select(g => new { gameId = g.GameId, gameName = g.GameName })
            .Take(10)
            .ToList();

        return Json(games);
    }
    [HttpGet]
    public IActionResult SearchStores(string query)
    {
        var queryWords = query.ToLower().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

        var stores = _dbContext.Stores
            .Where(s => queryWords.All(word => s.StoreName.ToLower().Contains(word)))
            .AsEnumerable()
            .Where(s => queryWords.All(word =>
                s.StoreName.ToLower().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)
                    .Any(storeName => storeName.StartsWith(word))))
            .Select(s => new { storeId = s.StoreId, storeName = s.StoreName })
            .Take(10)
            .ToList();

        return Json(stores);
    }

    [HttpGet]
    public IActionResult SearchPlatforms(string query)
    {
        var queryWords = query.ToLower().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

        var platforms = _dbContext.Platforms
            .Where(p => queryWords.All(word => p.PlatformName.ToLower().Contains(word)))
            .AsEnumerable()
            .Where(p => queryWords.All(word =>
                p.PlatformName.ToLower().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)
                    .Any(platformName => platformName.StartsWith(word))))
            .Select(p => new { platformId = p.PlatformId, platformName = p.PlatformName })
            .Take(10)
            .ToList();

        return Json(platforms);
    }

    [HttpGet]
    public IActionResult SearchLaunchers(string query)
    {
        var queryWords = query.ToLower().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

        var launchers = _dbContext.Launchers
            .Where(l => queryWords.All(word => l.LauncherName.ToLower().Contains(word)))
            .AsEnumerable()
            .Where(l => queryWords.All(word =>
                l.LauncherName.ToLower().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)
                    .Any(launcherName => launcherName.StartsWith(word))))
            .Select(l => new { launcherId = l.LauncherId, launcherName = l.LauncherName })
            .Take(10)
            .ToList();

        return Json(launchers);
    }
    [HttpGet]
    public IActionResult GetDLCs(int mainGameId, int page = 1, int pageSize = 5)
    {
        var dlcsQuery = _dbContext.Games
                        .Where(g => g.MainGameId == mainGameId)
                        .Select(g => new { g.GameId, g.GameName });

        int totalDLCs = dlcsQuery.Count();
        int totalPages = (int)Math.Ceiling((double)totalDLCs / pageSize);

        var dlcs = dlcsQuery
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

        return Json(new
        {
            dlcs = dlcs,
            currentPage = page,
            totalPages = totalPages
        });
    }

    public IActionResult GetAllStores(int page = 1, int pageSize = 5)
    {
        var stores = _dbContext.Stores.ToList();
        var totalStores = stores.Count();
        var pagedStores = stores.Skip((page - 1) * pageSize).Take(pageSize).ToList();

        var result = new
        {
            stores = pagedStores,
            totalCount = totalStores,
            currentPage = page,
            totalPages = (int)Math.Ceiling(totalStores / (double)pageSize)
        };

        return Json(result);
    }


    public IActionResult GetAllPlatforms(int page = 1, int pageSize = 5)
    {
        var platforms = _dbContext.Platforms.ToList();
        var totalPlatforms = platforms.Count();
        var pagedPlatforms = platforms.Skip((page - 1) * pageSize).Take(pageSize).ToList();

        var result = new
        {
            platforms = pagedPlatforms,
            TotalCount = totalPlatforms,
            currentPage = page,
            totalPages = (int)Math.Ceiling(totalPlatforms / (double)pageSize)
        };

        return Json(result);
    }

    public IActionResult GetAllLaunchers(int page = 1, int pageSize = 5)
    {
        var launchers = _dbContext.Launchers
            .Select(l => new
            {
                l.LauncherId,
                l.LauncherName,
                l.LauncherDescription,
                l.Link
            })
            .ToList();

        var totalLaunchers = launchers.Count();
        var pagedLaunchers = launchers.Skip((page - 1) * pageSize).Take(pageSize).ToList();

        var result = new
        {
            launchers = pagedLaunchers,
            TotalCount = totalLaunchers,
            currentPage = page,
            totalPages = (int)Math.Ceiling(totalLaunchers / (double)pageSize)
        };

        return Json(result);
    }

    [HttpGet]
    public JsonResult CheckDuplicatePurchase(int gameId, int storeId)
    {
        var userId = GetUserId();
        var isDuplicate = _dbContext.GameTransactions
            .Any(t => t.GameId == gameId && t.StoreId == storeId && t.UserId == userId);

        return Json(new { isDuplicate });
    }


}


