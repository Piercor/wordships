namespace Server.Tests;

public class GameTests
{
  private readonly Game _game = new(Guid.NewGuid(), Game.CreatePlayer("Player1"), Game.CreatePlayer("Player2"));

  [Fact]
  public void GetId_Test()
  {
    Assert.Equal(_game.GetId(), _game.Id);
  }

  [Fact]
  public void GetPlayer_Test()
  {
    Assert.Equal(_game.GetPlayer(1), _game.Player1);
    Assert.Equal(_game.GetPlayer(2), _game.Player2);
  }

  [Fact]
  public void GetWords_Test()
  {
    Assert.NotNull(_game.Player1.WordList);
    Assert.NotNull(_game.Player2.WordList);
  }
}