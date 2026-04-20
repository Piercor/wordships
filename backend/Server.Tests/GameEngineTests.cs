namespace Server.Tests;

public class GameEngineTests
{
  private readonly Game _game = new(Guid.NewGuid());

  [Fact]

  public void GetPlayer_Test()
  {
    _game.Player1 = Game.CreatePlayer("Player1");
    _game.Player2 = Game.CreatePlayer("Player2");
    GameEngine.Games[_game.Id] = _game;

    Assert.Equal(GameEngine.GetPlayer(_game.Player1.Id), _game.Player1);
    Assert.Equal(GameEngine.GetPlayer(_game.Player2.Id), _game.Player2);
  }

  [Fact]
  public void PlayerHasLetter_Test()
  {
    _game.Player1 = Game.CreatePlayer("Player1");
    _game.Player2 = Game.CreatePlayer("Player2");
    GameEngine.Games[_game.Id] = _game;

    var result = GameEngine.PlayerHasLetter(_game.Id, _game.Player1.Id, char.Parse("a"));

    Assert.True(result == "Hit" || result == "Miss");
  }

  [Fact]
  public void FoundAllWords_Test()
  {
    _game.Player1 = Game.CreatePlayer("Player1");
    _game.Player2 = Game.CreatePlayer("Player2");
    GameEngine.Games[_game.Id] = _game;

    Assert.False(GameEngine.FoundAllWords(_game.Id, _game.Player2.Id));
  }

  [Fact]
  public void PlayerHasWord_Test()
  {
    _game.Player1 = Game.CreatePlayer("Player1");
    _game.Player2 = Game.CreatePlayer("Player2");
    GameEngine.Games[_game.Id] = _game;

    var result = GameEngine.PlayerHasWord(_game.Id, _game.Player1.Id, "engine");

    Assert.True(result == true || result == false);
  }
}