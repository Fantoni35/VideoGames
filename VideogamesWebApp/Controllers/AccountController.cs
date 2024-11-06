using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using VideogamesWebApp.Models;
using GamesDataAccess;

namespace VideogamesWebApp.Controllers;

public class AccountController : Controller
{
    private readonly DatabaseContext _context;

    public AccountController(DatabaseContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Login()
    {
        return View();
    }

    [HttpPost]
    public IActionResult Login(string username, string password)
    {
        var user = _context.Users.SingleOrDefault(u => u.Username == username);
        if (user != null && VerifyPasswordHash(password, user.PasswordHash))
        {
            HttpContext.Session.SetInt32("UserId", user.UserId);
            HttpContext.Session.SetString("Username", user.Username);
            return RedirectToAction("Index", "Games");
        }

        ViewData["Error"] = "Invalid username or password";
        return View();
    }

    [HttpPost]
    public IActionResult Register(string regUsername, string regPassword)
    {
        if (string.IsNullOrEmpty(regUsername) || string.IsNullOrEmpty(regPassword))
        {
            ViewData["RegisterError"] = "Username and password are required.";
            return View("Login");
        }

        if (_context.Users.Any(u => u.Username == regUsername))
        {
            ViewData["RegisterError"] = "Username already exists.";
            ViewBag.ShowRegisterModal = true;
            return View("Login");
        }

        var newUser = new User
        {
            Username = regUsername,
            PasswordHash = HashPassword(regPassword)
        };

        _context.Users.Add(newUser);
        _context.SaveChanges();

        ViewData["RegisterSuccess"] = "Registration successful! You can now log in.";
        return View("Login");
    }


    private string HashPassword(string password)
    {
        using (var sha256 = SHA256.Create())
        {
            var bytes = System.Text.Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }

    private bool VerifyPasswordHash(string password, string storedHash)
    {
        var hashOfInput = HashPassword(password);
        return hashOfInput == storedHash;
    }
     [HttpPost]
    public IActionResult Logout()
    {
        HttpContext.Session.Clear(); 

        return RedirectToAction("Login", "Account");
    }
}
