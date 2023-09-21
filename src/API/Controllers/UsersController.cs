using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly IPhotoService _photoService;

    public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
    {
        _userRepository = userRepository;
        _mapper = mapper;
        _photoService = photoService;
    }
    
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users =  await _userRepository.GetMembersAsync();

        return Ok(users);
    }
    
    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        var user = await _userRepository.GetMemberAsync(username);

        return user;
    }
    
    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
    {
        var username = User.GetUsername();
        var user = await _userRepository.GetUserByUsernameAsync(username);
        
        if (user is null) return null;
        
        _mapper.Map(memberUpdateDto, user);

        _userRepository.Update(user);

        if (await _userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Failed to update user");
    }
    
    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
        var username = User.GetUsername();
        var user = await _userRepository.GetUserByUsernameAsync(username);
        
        if (user is null) return NotFound();

        var result = await _photoService.AddPhotoAsync(file);

        if (result.Error is not null) return BadRequest(result.Error.Message);

        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };

        if (user.Photos.Count == 0)
        {
            photo.IsMain = true;
        }

        user.Photos.Add(photo);

        if (await _userRepository.SaveAllAsync())
        {
            return _mapper.Map<PhotoDto>(photo);
        }

        return BadRequest("Problem adding photo");
    }
    
    
    
    
    
    
    
}