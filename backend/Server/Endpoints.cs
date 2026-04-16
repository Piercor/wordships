using System.Text.Json;
using Dyndata;

namespace Server;

public static class Endpoints
{
  public static void GameEndpoints(this WebApplication App)
  {
    // Gets players id & name, with the game id as part of the API call.
    App.MapGet("/api/game/{id:guid}", (HttpContext context, Guid id) =>
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
        }
      };

      return Results.Ok(response);

    });

    // Takes a playerName and creates a game with the name of that player. Returns the game id as "GameId".
    App.MapPost("/api/game/create", (HttpContext context, JsonElement bodyJson) =>
    {
      var body = JSON.Parse(bodyJson.ToString());
      Game game = new(Guid.NewGuid());
      game.Player1 = Game.CreatePlayer(body.playerName);
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
    App.MapPost("/api/game/join", (HttpContext context, JsonElement bodyJson) =>
    {
      var body = JSON.Parse(bodyJson.ToString());
      GameEngine.Games[Guid.Parse(body.gameId)].Player2 = Game.CreatePlayer(body.playerName);

      var game = GameEngine.Games[Guid.Parse(body.gameId)];

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
    App.MapGet("/api/player/{id}", (HttpContext context, Guid id) =>
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

    // Takes gameId, playerId (the player to guess the letter from) and a letter and makes a guess.
    // Returns hit or miss. If hit, the state of the letter would change from "Found = false" to "Found = true".
    App.MapPost("/api/player/guess", (HttpContext context, JsonElement bodyJson) =>
    {
      var body = JSON.Parse(bodyJson.ToString());

      var response = GameEngine.PlayerHasLetter(Guid.Parse(body.gameId), Guid.Parse(body.playerId), char.Parse(body.letter));

      return Results.Ok(response);
    });


    App.MapPost("/api/player/place", (HttpContext context, JsonElement bodyJson) =>
  {
    var body = JSON.Parse(bodyJson.ToString());
    Guid playerId = Guid.Parse(body.playerId);

    Player? player = GameEngine.GetPlayer(playerId);
    if (player == null) return Results.NotFound();

    foreach (var placement in body.placements)
    {
      string wordName = placement.wordName;
      int row = (int)placement.row;
      int col = (int)placement.col;

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