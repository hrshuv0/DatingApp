namespace API.SignalR;

public class PresenceTracker
{
    private static readonly Dictionary<string, List<string>> OnlineUsers = new();

    public Task UserConnected(string username, string connectedId)
    {
        lock (OnlineUsers)
        {
            if (OnlineUsers.ContainsKey(username)!)
            {
                OnlineUsers[username].Add(connectedId);
            }
            else
            {
                OnlineUsers.Add(username, new List<string>{connectedId});
            }
        }

        return Task.CompletedTask;
    }
    
    
    public Task UserDisconnected(string username, string connectedId)
    {
        lock (OnlineUsers)
        {
            if (!OnlineUsers.ContainsKey(username)!) return Task.CompletedTask;
            
            OnlineUsers[username].Remove(connectedId);
            if (OnlineUsers[username].Count == 0)
            {
                OnlineUsers.Remove(username);
            }
        }

        return Task.CompletedTask;
    }
    
    public Task<string[]> GetOnlineUsers()
    {
        string[] onlineUsers;
        lock (OnlineUsers)
        {
            onlineUsers = OnlineUsers.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
        }

        return Task.FromResult(onlineUsers);
    }
    
    
}