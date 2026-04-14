namespace Server;

public static class GameEngine
{
  public static Dictionary<Guid, Game> Games { get; } = new();

  public static Player? GetPlayer(Guid playerId)
  {
    foreach ((Guid key, Game game) in Games)
    {
      if (game?.Player1?.Id == playerId)
      {
        return game.Player1;
      }
      else if (game?.Player2?.Id == playerId)
      {
        return game.Player2;
      }
    }
    return null;
  }

  /* public static bool PlayerHasLetter(Guid gameId, Guid playerId, char letter)
  {
    var player = GameEngine.GetPlayer(playerId);

    foreach (Word word in player.WordList)
    {
      if (word.LetterList.Contains(letter))
      {
        
      }
    }
  } */
}