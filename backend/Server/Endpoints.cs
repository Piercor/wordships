using System.Text.Json;
using Dyndata;

namespace Server;

public static class Endpoints
{
  public static void GameEndpoints(this WebApplication App)
  {
    // Gets players id & name, with the game id as part of the API call.
    App.MapGet("/api/game/{id}", (HttpContext context, Guid id) =>
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
              found = letter.Found
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
  }
}