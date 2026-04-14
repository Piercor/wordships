namespace Server.Tests;

public class GameTests
{
  private readonly Game _game = new(Guid.NewGuid());

  [Fact]
  public void GetId_Test()
  {
    Assert.Equal(_game.GetId(), _game.Id);
  }

  [Fact]
  public void GetPlayer_Test()
  {
    _game.Player1 = Game.CreatePlayer("Player1");
    _game.Player2 = Game.CreatePlayer("Player2");
    Assert.Equal(_game.GetPlayer(_game.Player1.Id), _game.Player1);
    Assert.Equal(_game.GetPlayer(_game.Player2.Id), _game.Player2);
  }

  [Fact]
  public void GetWords_Test()
  {
    _game.Player1 = Game.CreatePlayer("Player1");
    _game.Player2 = Game.CreatePlayer("Player2");
    Assert.NotNull(_game.Player1.WordList);
    Assert.NotNull(_game.Player2.WordList);
  }
}