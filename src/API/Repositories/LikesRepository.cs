using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class LikesRepository : ILikesRepository
{
    private readonly DataContext _context;

    public LikesRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
    {
        var result = await _context.Likes.FindAsync(sourceUserId, likedUserId);
        
        return result;
    }

    public Task<AppUser> GetUserWithLikes(int userId)
    {
        var result = _context.Users
            .Include(x => x.LikedUsers)
            .FirstOrDefaultAsync(x => x.Id == userId);
        
        return result;
    }

    public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
    {
        var users = _context.Users.OrderBy(x => x.UserName).AsQueryable();
        var likes = _context.Likes.AsQueryable();
        
        if (likesParams.Predicate == "liked")
        {
            likes = likes.Where(x => x.SourceUserId == likesParams.UserId);
            users = likes.Select(x => x.TargetUser);
        }
        else if (likesParams.Predicate == "likedBy")
        {
            likes = likes.Where(x => x.TargetUserId == likesParams.UserId);
            users = likes.Select(x => x.SourceUser);
        }
        
        var likedUsers = users.Select(user => new LikeDto
        {
            Id = user.Id,
            UserName = user.UserName,
            Age = user.DateOfBirth.CalculateAge(),
            KnownAs = user.KnownAs,
            City = user.City,
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain).Url
        });

        var result = await PagedList<LikeDto>.CreateAsync(likedUsers, likesParams.PageNumber, likesParams.PageSize);
            
        return result;
    }
    
}