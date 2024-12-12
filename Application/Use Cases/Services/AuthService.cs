using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.DTOs;
using Application.Utils;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.IdentityModel.Tokens;

public class AuthService
{
  private readonly ApplicationDbContext _context;
  private readonly JwtSettings _jwtSettings;

  public AuthService(ApplicationDbContext context, JwtSettings jwtSettings)
  {
    _context = context;
    _jwtSettings = jwtSettings;
  }

  public async Task<string> Register(RegisterDto registerDto)
  {
    if (_context.Users.Any(u => u.Username == registerDto.Username))
    {
      throw new Exception("User already exists");
    }

    var user = new User
    {
      Username = registerDto.Username,
      PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password)
    };

    _context.Users.Add(user);
    await _context.SaveChangesAsync();

    return "User registered successfully";
  }

  public async Task<string> Login(LoginDto loginDto)
  {
    var user = _context.Users.SingleOrDefault(u => u.Username == loginDto.Username);
    if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
    {
      throw new Exception("Invalid username or password");
    }

    return GenerateJwtToken(user);
  }

  private string GenerateJwtToken(User user)
  {
    var claims = new[]
    {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        _jwtSettings.Issuer,
        _jwtSettings.Audience,
        claims,
        expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryInHours),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
  }
}
