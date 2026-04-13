namespace Server;

public static class GameEngine
{
  public static Dictionary<Guid, Game> Games { get; } = new();
}