namespace Server;

public static class GameEngine
{
  public static Dictionary<Guid, Game> Games { get; } = new();

  public static Player? GetPlayer(Guid PlayerId)
  {
    foreach ((Guid key, Game game) in Games)
    {
      if (game.Player1.Id == PlayerId)
      {
        return game.Player1;
      }
      else if (game.Player2.Id == PlayerId)
      {
        return game.Player2;
      }
    }
    return null;
  }
}