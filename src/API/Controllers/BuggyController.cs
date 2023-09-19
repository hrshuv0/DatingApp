using API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
    private readonly DataContext _context;

    public BuggyController(DataContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpGet("auth")]
    public ActionResult<string> GetSecret()
    {
        return "secret test";
    }

    
    [HttpGet("not-found")]
    public ActionResult<string> GetNotFound()
    {
        var thing = _context.Users.Find(-1);

        if (thing == null) return NotFound();

        return Ok(thing);
    }

    
    [HttpGet("server-error")]
    public ActionResult<string> GetServerError()
    {
        var thing = _context.Users.Find(-1);

        var thingToReturn = thing!.ToString();

        return Ok(thingToReturn);
    }

    
    [HttpGet("bad-request")]
    public ActionResult<string> GetBadRequest()
    {
        return BadRequest("This was not a good request");
    }
    
}