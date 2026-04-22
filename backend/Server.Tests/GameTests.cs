namespace Server.Tests;

public class GameTests
{
  private readonly Game _game = new(Guid.NewGuid());
  private readonly Player _player1;
  private readonly Player _player2;

  public GameTests()
  {
    _player1 = Game.CreatePlayer("Player1");
    _player2 = Game.CreatePlayer("Player2");
    _game.Player1 = _player1;
    _game.Player2 = _player2;
  }

  [Fact]
  public void GetId_Test()
  {
    Assert.Equal(_game.GetId(), _game.Id);
  }

  [Fact]
  public void GetPlayer_Test()
  {
    Assert.Equal(_game.GetPlayer(_player1.Id), _player1);
    Assert.Equal(_game.GetPlayer(_player2.Id), _player2);
  }

  [Fact]
  public void GetWords_Test()
  {
    Assert.NotNull(_player1.WordList);
    Assert.NotNull(_player2.WordList);
  }

  [Fact]
  public void FirstTurn_Test()
  {
    var first = _game.FirstTurn();
    Assert.True(first == _player1 || first == _player2);
  }

  [Fact]
  public void BothReady_False_Test()
  {
    Assert.False(_game.BothReady);

    _player1.IsReady = true;
    Assert.False(_game.BothReady);
  }

  [Fact]
  public void BothReady_True_Test()
  {
    _player1.IsReady = true;
    _player2.IsReady = true;
    Assert.True(_game.BothReady);
  }
}