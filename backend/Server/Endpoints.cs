using System.Text.Json;
using Dyndata;

namespace Server;

public static class Endpoints
{
  public static void GameEndpoints(this WebApplication App)
  {
    App.MapPost("/api/game/create", (HttpContext context, JsonElement bodyJson) =>
    {
      var body = JSON.Parse(bodyJson.ToString());
      Game game = new(Guid.NewGuid(), Game.CreatePlayer(body.PlayerName), null);
      GameEngine.Games.Add(game.Id.ToString(), game);
      return Results.Ok(new { message = game.Id });
    });

    App.MapPost("/api/game/join", (HttpContext context, JsonElement bodyJson) =>
    {
      var body = JSON.Parse(bodyJson.ToString());
      GameEngine.Games[body.GameId].Player2 = Game.CreatePlayer(body.PlayerName);

      Game game = GameEngine.Games[body.GameId];

      return Results.Ok(new { message = $"GameId: {game.Id}, Player 1 Name: {game.Player1.Name}, Player 2 Name: {game.Player2.Name}" });
    });
  }
}