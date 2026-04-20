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

    // Takes gameId, playerGuessingId (the player guessing), playerToGuessId (the player to guess the word from) and a word and makes a guess.
    // Returns true or false. If true, the state of all the letters of the word would change from "Found = false" to "Found = true".
    // If false, a penalty is applied to the guessing player and one of their letters (previously Found = false) becomes Found = true;
    // With each guess the system checks if any player won (if oponent list of words is completely found).
    // NOTE: guessing an already guessed word would result in a wrong guess and therefore a penalty.
    App.MapPost("/api/player/guess-word", (JsonElement bodyJson) =>
    {
      Game? game = GameEngine.Games[Guid.Parse(bodyJson.GetProperty("gameId").GetString()!)];
      Guid playerGuessingId = Guid.Parse(bodyJson.GetProperty("playerGuessingId").GetString()!);
      Guid playerToGuessId = Guid.Parse(bodyJson.GetProperty("playerToGuessId").GetString()!);
      string word = bodyJson.GetProperty("word").GetString()!;

      string response = "";
      if (GameEngine.PlayerHasWord(game.Id, playerToGuessId, word))
      {
        if (GameEngine.FoundAllWords(game.Id, playerToGuessId))
        {
          game.Winner = game.GetPlayer(playerGuessingId);
          response = $"Winner: {game?.Winner?.Id}";
        }
        else { response = "Word guessed correctly!"; }
      }
      else
      {
        GameEngine.Penalty(game.Id, playerGuessingId);
        if (GameEngine.FoundAllWords(game.Id, playerGuessingId))
        {
          game.Winner = game.GetPlayer(playerToGuessId);
          response = $"Winner: {game?.Winner?.Id}";
        }
        else { response = "Word guessed wrong!"; }
      }

      return Results.Ok(response);
    });
  }
}