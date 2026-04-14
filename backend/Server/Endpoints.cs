using System.Text.Json;
using Dyndata;

namespace Server;

public static class Endpoints
{
  public static void GameEndpoints(this WebApplication App)
  {
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

    App.MapPost("/api/game/create", (HttpContext context, JsonElement bodyJson) =>
    {
      var body = JSON.Parse(bodyJson.ToString());
      Game game = new(Guid.NewGuid());
      game.Player1 = Game.CreatePlayer(body.PlayerName);
      GameEngine.Games.Add(game.Id, game);

      return Results.Ok(new { message = game.Id });
    });

    App.MapPost("/api/game/join", (HttpContext context, JsonElement bodyJson) =>
    {
      var body = JSON.Parse(bodyJson.ToString());
      GameEngine.Games[Guid.Parse(body.GameId)].Player2 = Game.CreatePlayer(body.PlayerName);

      var game = GameEngine.Games[Guid.Parse(body.GameId)];

      return Results.Ok(new { message = $"GameId: {game.Id}, Player 1 Name: {game.Player1.Name}, Player 2 Name: {game.Player2.Name}" });
    });
  }

  public static void PlayerEndpoints(this WebApplication App)
  {
    App.MapGet("/api/player/{id}", (HttpContext context, Guid id) =>
    {
      var player = GameEngine.GetPlayer(id);

      var response = new
      {
        player = new
        {
          id = player?.Id,
          name = player?.Name,
          wordList = player?.WordList
        }
      };

      return Results.Ok(response);
    });
  }
}