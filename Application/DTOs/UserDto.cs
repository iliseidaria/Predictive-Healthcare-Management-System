namespace Application.DTOs
{
  public class UserDto
  {
    public Guid Id { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string Role { get; set; }
  }
}
