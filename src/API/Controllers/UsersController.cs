using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUserRepository _userRepository;

    public UsersController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users =  await _userRepository.GetUsersAsync();

        return Ok(users);
    }
    
    [HttpGet("{username}")]
    public async Task<ActionResult<AppUser>> GetUser(string username)
    {
        var user = await _userRepository.GetUserByUsernameAsync(username);

        return user;
    }
    
    
    
    
    
    
    
}