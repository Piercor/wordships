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

  public static string PlayerHasLetter(Guid gameId, Guid playerId, char xChar)
  {
    bool found = false;
    var game = Games[gameId];
    Player? player = game.GetPlayer(playerId);

    foreach (Word word in player!.WordList)
    {
      foreach (Letter letter in word.LetterList)
      {
        if (letter.Value == xChar)
        {
          letter.Found = true;
          found = true;
        }
      }
    }

    game.Turn = game.Turn == game.Player1 ? game.Player2 : game.Player1;

    if (found) { return "Hit"; }
    else { return "Miss"; }
  }

  public static bool FoundAllWords(Guid gameId, Guid playerId)
  {
    Game? game = Games[gameId];
    Player? player = game.GetPlayer(playerId);

    foreach (Word word in player!.WordList)
    {
      foreach (Letter letter in word.LetterList)
      {
        if (!letter.Found)
        {
          return false;
        }
      }
    }
    return true;
  }
}