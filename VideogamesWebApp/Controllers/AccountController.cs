
using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using VideogamesWebApp.Models;
using GamesDataAccess;
using System.Text.RegularExpressions;


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

        // Validazione della password
        var passwordRequirements = new Regex(@"^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
        if (!passwordRequirements.IsMatch(regPassword))
        {
            ViewData["RegisterError"] = "La password deve contenere almeno 8 caratteri, un numero e un carattere speciale.";
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
            PasswordHash = HashPassword(regPassword),
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

    [HttpGet]
    public IActionResult EditAccount()
    {
        return View();
    }



    [HttpPost]
    public IActionResult ChangePassword(string currentPassword, string newPassword, string confirmNewPassword)
    {
        if (newPassword != confirmNewPassword)
        {
            TempData["ErrorMessage"] = "The new passwords do not match.";
            return RedirectToAction("Index", "Games");
        }

        var passwordRequirements = new Regex(@"^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
        if (!passwordRequirements.IsMatch(newPassword))
        {
            TempData["ErrorMessage"] = "La password deve contenere almeno 8 caratteri, un numero e un carattere speciale.";
            return RedirectToAction("Index", "Games");
        }

        var userId = HttpContext.Session.GetInt32("UserId");
        if (userId == null)
        {
            TempData["ErrorMessage"] = "User  not found.";
            return RedirectToAction("Index", "Games");
        }

        var user = _context.Users.SingleOrDefault(u => u.UserId == userId);
        if (user == null)
        {
            TempData["ErrorMessage"] = "User  not found.";
            return RedirectToAction("Index", "Games");
        }

        if (!VerifyPasswordHash(currentPassword, user.PasswordHash))
        {
            TempData["ErrorMessage"] = "Current password is incorrect.";
            return RedirectToAction("Index", "Games");
        }

        user.PasswordHash = HashPassword(newPassword);
        _context.SaveChanges();

        TempData["SuccessMessage"] = "Password changed successfully!";
        return RedirectToAction("Index", "Games");
    }




    [HttpPost]
    public IActionResult EditAvatar(string profileImage, IFormFile customImage)
    {
        var userId = HttpContext.Session.GetInt32("UserId");

        if (userId == null)
        {
            TempData["ErrorMessage"] = "User not found.";
            return RedirectToAction("Index", "Games");
        }

        var user = _context.Users.Single(u => u.UserId == userId);

        if (customImage != null && customImage.Length > 0)
        {
            // Define the directory to save uploaded files
            var uploadsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/customAvatars");

            if (!Directory.Exists(uploadsDirectory))
            {
                Directory.CreateDirectory(uploadsDirectory);
            }

            // Ensure a unique filename
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(customImage.FileName);
            var filePath = Path.Combine(uploadsDirectory, fileName);

            // Save the file to the server
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                customImage.CopyTo(stream);
            }

            // Update the user's profile image path
            user.ProfileImage = $"/images/customAvatars/{fileName}";
        }
        else if (!string.IsNullOrEmpty(profileImage))
        {
            // Use the selected pre-defined avatar
            user.ProfileImage = profileImage;
        }
        else
        {
            TempData["ErrorMessage"] = "No image selected or uploaded.";
            return RedirectToAction("Index", "Games");
        }

        try
        {
            _context.SaveChanges();
        }
        catch (Exception)
        {
            TempData["ErrorMessage"] = "An error occurred while updating the profile image.";
            return RedirectToAction("Index", "Games");
        }

        TempData["SuccessMessage"] = "Profile image updated successfully!";
        return RedirectToAction("Index", "Games");
    }


}


