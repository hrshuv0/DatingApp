using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class UserRepository : IUserRepository
{
    private readonly DataContext _context;

    public UserRepository(DataContext context)
    {
        _context = context;
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
}