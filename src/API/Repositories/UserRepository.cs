using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class UserRepository : IUserRepository
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public UserRepository(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public void Update(AppUser user)
    {
        _context.Entry(user).State = EntityState.Modified;
    }

    public async Task<bool> SaveAllAsync()
    {
        var result = await _context.SaveChangesAsync();
        
        return result > 0;
    }

    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
        var result = await _context.Users
            .Include(u => u.Photos).ToListAsync();
        
        return result;
    }

    public async Task<AppUser> GetUserByIdAsync(int id)
    {
        var result = await _context.Users.FindAsync(id);
        
        return result;
    }

    public async Task<AppUser> GetUserByUsernameAsync(string username)
    {
        var result = await _context.Users
            .Include(u => u.Photos).FirstOrDefaultAsync(x => x.UserName == username);
        
        return result;
    }

    public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
    {
        var query = _context.Users.AsQueryable();
        query = query.Where(u => u.UserName != userParams.CurrentUsername);
        query = query.Where(u => u.Gender == userParams.Gender);
        
        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge - 1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));
        
        query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
        
        query = userParams.OrderBy switch
        {
            "created" => query.OrderByDescending(u => u.Created),
            _ => query.OrderByDescending(u => u.LastActive)
        };

        var result = query.AsNoTracking().ProjectTo<MemberDto>(_mapper.ConfigurationProvider);
        
        return await PagedList<MemberDto>.CreateAsync(result, userParams.PageNumber, userParams.PageSize);
    }

    public async Task<MemberDto> GetMemberAsync(string username)
    {
        var result = await _context.Users
            .Where(x => x.UserName == username)
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
        
        return result;
    }
}