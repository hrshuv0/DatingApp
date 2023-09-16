namespace API.Entities;

public class AppUser
{
    public int Id { get; set; }
    public string UserName { get; set; }
    
    // This is the password hash
    public byte[] PasswordHash { get; set; }
    public byte[] PasswordSalt { get; set; }
}