﻿using System.Linq;
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

        var userId = HttpContext.Session.GetInt32("UserId");
        if (userId == null)
        {
            TempData["ErrorMessage"] = "User not found.";
            return RedirectToAction("Login", "Account");
        }

        var user = _context.Users.SingleOrDefault(u => u.UserId == userId);
        if (user == null)
        {
            TempData["ErrorMessage"] = "User not found.";
            return RedirectToAction("Login", "Account");
        }

        if (!VerifyPasswordHash(currentPassword, user.PasswordHash))
        {
            TempData["ErrorMessage"] = "Current password is incorrect.";
            return RedirectToAction("Index", "Games");
        }

        // Aggiorna la password
        user.PasswordHash = HashPassword(newPassword);
        _context.SaveChanges();

        TempData["SuccessMessage"] = "Password changed successfully!";
        return RedirectToAction("Index", "Games");
    }


}
