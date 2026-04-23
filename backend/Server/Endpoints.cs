using System.Text.Json;

namespace Server;

public static class Endpoints
{
  public static void GameEndpoints(this WebApplication App)
  {
    // Gets players id & name, with the game id as part of the API call.
    App.MapGet("/api/game/{id:guid}", (Guid id) =>
    {
      var game = GameEngine.Games[id];

      var response = new
      {
        player1 = new
        {
          id = game?.Player1?.Id,
          name = game?.Player1?.Name
        },
        player2 = new
        {
          id = game?.Player2?.Id,
          name = game?.Player2?.Name
        },
        turn = game?.Turn?.Id,
        winner = game?.Winner == null ? null : new
        {
          id = game.Winner.Id,
          name = game.Winner.Name
        }
      };

      return Results.Ok(response);

    });

    // Takes a playerName and creates a game with the name of that player. Returns the game id as "GameId".
    App.MapPost("/api/game/create", (JsonElement bodyJson) =>
    {
      Game game = new(Guid.NewGuid());
      game.Player1 = Game.CreatePlayer(bodyJson.GetProperty("playerName").GetString()!);
      GameEngine.Games.Add(game.Id, game);

      return Results.Ok(new
      {
        gameId = game.Id,
        player = new
        {
          id = game.Player1.Id,
          name = game.Player1.Name
        }
      });
    });

    // Takes a gameId and a playerName and creates a second player to join the game. Returns GameInfo with players names.
    App.MapPost("/api/game/join", (JsonElement bodyJson) =>
    {
      var game = GameEngine.Games[Guid.Parse(bodyJson.GetProperty("gameId").GetString()!)];
      game.Player2 = Game.CreatePlayer(bodyJson.GetProperty("playerName").GetString()!);
      game.Turn = game.FirstTurn();

      var response = new
      {
        gameId = game.Id,
        player = new
        {
          id = game.Player2.Id,
          name = game.Player2.Name
        }
      };

      return Results.Ok(response);
    });

    // Checks if both players have placed their words and are ready to start the game.
    App.MapGet("/api/game/{id:guid}/ready", (HttpContext context, Guid id) =>
  {
    var game = GameEngine.Games[id];
    return Results.Ok(new { bothReady = game.BothReady });

  });
  }

  public static void PlayerEndpoints(this WebApplication App)
  {
    // Gets a player id, name & word list with player's id as API call.
    App.MapGet("/api/player/{id}", (Guid id) =>
    {
      var player = GameEngine.GetPlayer(id);

      var response = new
      {
        player = new
        {
          id = player?.Id,
          name = player?.Name,
          wordList = player?.WordList.Select(word => new
          {
            name = word.Name,
            letters = word.LetterList.Select(letter => new
            {
              value = letter.Value,
              found = letter.Found,
              row = letter.Row,
              col = letter.Col
            })
          })
        }
      };

      return Results.Ok(response);
    });

    // Takes gameId, playerGuessingId (the player guessing), playerToGuessId (the player to guess the letter from) and a letter and makes a guess.
    // Returns hit or miss. If hit, the state of the letter would change from "Found = false" to "Found = true".
    // Also checks if all the letters of a player have been found, and if so, set the guessing player as the winner 
    // and returns "Winner: (winner id)"
    App.MapPost("/api/player/guess", (JsonElement bodyJson) =>
    {
      Game game = GameEngine.Games[Guid.Parse(bodyJson.GetProperty("gameId").GetString()!)];
      Guid playerGuessingId = Guid.Parse(bodyJson.GetProperty("playerGuessingId").GetString()!);
      Guid playerToGuessId = Guid.Parse(bodyJson.GetProperty("playerToGuessId").GetString()!);
      char letter = char.Parse(bodyJson.GetProperty("letter").GetString()!);

      var response = GameEngine.PlayerHasLetter(game.Id, playerToGuessId, letter);

      if (GameEngine.FoundAllWords(game.Id, playerToGuessId))
      {
        game.Winner = game.GetPlayer(playerGuessingId);
        response = $"Winner: {game?.Winner?.Id}";
      }

      return Results.Ok(response);
    });


    App.MapPost("/api/player/place", (JsonElement bodyJson) =>
    {
      Guid playerId = Guid.Parse(bodyJson.GetProperty("playerId").GetString()!);

      Player? player = GameEngine.GetPlayer(playerId);
      if (player == null) return Results.NotFound();

      foreach (var placement in bodyJson.GetProperty("placements").EnumerateArray())
      {
        string wordName = placement.GetProperty("wordName").GetString()!;
        int row = placement.GetProperty("row").GetInt32();
        int col = placement.GetProperty("col").GetInt32();

        foreach (Word word in player.WordList)
        {
          if (word.Name == wordName)
          {
            for (int i = 0; i < word.LetterList.Count; i++)
            {
              word.LetterList[i].Row = row;
              word.LetterList[i].Col = col + i;
            }
          }
        }
      }

      player.IsReady = true;
      return Results.Ok(new { ready = player.IsReady });
    });
  }
}