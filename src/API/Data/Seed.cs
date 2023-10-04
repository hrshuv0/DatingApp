﻿using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
    {
        if (await userManager.Users.AnyAsync()) return;

        var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
        var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

        var roles = new List<AppRole>()
        {
            new AppRole() { Name = "Member" },
            new AppRole() { Name = "Admin" },
            new AppRole() { Name = "Moderator"},
        };

        foreach (var role in roles)
        {
            await roleManager.CreateAsync(role);
        }

        if (users == null) return;

        foreach (var user in users)
        {
            user.UserName = user.UserName!.ToLower();

            var success = await userManager.CreateAsync(user, "1234");
            if (!success.Succeeded) continue;
            
            await userManager.AddToRoleAsync(user, "Member");
        }
        
        var admin = new AppUser()
        {
            UserName = "admin"
        };
        
        await userManager.CreateAsync(admin, "1234");
        await userManager.AddToRolesAsync(admin, new[] {"Admin", "Moderator"});
    }
}