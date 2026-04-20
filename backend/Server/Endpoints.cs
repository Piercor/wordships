using System.Text.Json;

namespace Server;

public static class Endpoints
{
  public static void GameEndpoints(this WebApplication App)
  {
    // Gets players id & name, with the game id as part of the API call.
    App.MapGet("/api/game/{id}", (Guid id) =>
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
        turn = game?.Turn?.Id
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
              found = letter.Found
            })
          })
        }
      };

      return Results.Ok(response);
    });

    // Takes gameId, playerId (the player to guess the letter from) and a letter and makes a guess.
    // Returns hit or miss. If hit, the state of the letter would change from "Found = false" to "Found = true".
    App.MapPost("/api/player/guess", (JsonElement bodyJson) =>
    {
      var response = GameEngine.PlayerHasLetter(
         Guid.Parse(bodyJson.GetProperty("gameId").GetString()!),
         Guid.Parse(bodyJson.GetProperty("playerId").GetString()!),
         char.Parse(bodyJson.GetProperty("letter").GetString()!)
       );

      return Results.Ok(response);
    });
  }
}