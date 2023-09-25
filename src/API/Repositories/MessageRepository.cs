using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class MessageRepository : IMessageRepository
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public MessageRepository(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    
    public void AddMessage(Message message)
    {
        _context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        _context.Messages.Remove(message);
    }

    public async Task<Message> GetMessage(int id)
    {
        var result = await _context.Messages.FindAsync(id);

        return result;
    }

    public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
    {
        var query = _context.Messages
            .OrderByDescending(m => m.MessageSent)
            .AsQueryable();
        
        query = messageParams.Container switch
        {
            "Inbox" => query.Where(u => u.Recipient.UserName == messageParams.Username),
            "Outbox" => query.Where(u => u.Sender.UserName == messageParams.Username),
            _ => query.Where(u => u.Recipient.UserName == messageParams.Username && u.DateRead == null)
        };

        var message = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
            .AsNoTracking();

        var result = await PagedList<MessageDto>.CreateAsync(message, messageParams.PageNumber, messageParams.PageSize);
        
        return result;
    }

    public Task<IEnumerable<MessageDto>> GetMessageThread(int currentUserId, int recipientId)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> SaveAllAsync()
    {
        var result = await _context.SaveChangesAsync();
        
        return result > 0;
    }
}