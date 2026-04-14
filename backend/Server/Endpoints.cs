using System.Text.Json;
using Dyndata;

namespace Server;

public static class Endpoints
{
  public static void GameEndpoints(this WebApplication App)
  {
    App.MapGet("/api/game/{id}", (HttpContext context, Guid id) =>
    {
      string result = $"Player 1: {GameEngine.Games[id].Player1.Name}, Id: {GameEngine.Games[id].Player1.Id} - Player 2: {GameEngine.Games[id].Player2.Name}, Id: {GameEngine.Games[id].Player2.Id}";

      return Results.Ok(new { message = result });
    });

    App.MapGet("/api/player/{id}", (HttpContext context, Guid id) =>
    {
      Player? player = GameEngine.GetPlayer(id);
      try
      {
        return Results.Ok(new { message = player!.GetWordList() });
      }
      catch (Exception ex)
      {
        return Results.NotFound(new { message = ex });
      }

    });

    App.MapPost("/api/game/create", (HttpContext context, JsonElement bodyJson) =>
    {
      var body = JSON.Parse(bodyJson.ToString());
      Game game = new(Guid.NewGuid(), Game.CreatePlayer(body.PlayerName), null);
      GameEngine.Games.Add(game.Id, game);
      return Results.Ok(new { message = game.Id });
    });

    App.MapPost("/api/game/join", (HttpContext context, JsonElement bodyJson) =>
    {
      var body = JSON.Parse(bodyJson.ToString());
      GameEngine.Games[Guid.Parse(body.GameId)].Player2 = Game.CreatePlayer(body.PlayerName);

      Game game = GameEngine.Games[Guid.Parse(body.GameId)];

      return Results.Ok(new { message = $"GameId: {game.Id}, Player 1 Name: {game.Player1.Name}, Player 2 Name: {game.Player2.Name}" });
    });
  }
}