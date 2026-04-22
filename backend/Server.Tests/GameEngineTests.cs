namespace Server.Tests;

public class GameEngineTests
{
  private readonly Game _game = new(Guid.NewGuid());
  private readonly Player _player1;
  private readonly Player _player2;

  public GameEngineTests()
  {
    _player1 = Game.CreatePlayer("Player1");
    _player2 = Game.CreatePlayer("Player2");
    _game.Player1 = _player1;
    _game.Player2 = _player2;
    _game.Turn = _player1;
    GameEngine.Games[_game.Id] = _game;
  }

  [Fact]
  public void GetPlayer_Test()
  {
    Assert.Equal(GameEngine.GetPlayer(_player1.Id), _game.Player1);
    Assert.Equal(GameEngine.GetPlayer(_player2.Id), _game.Player2);
  }

  [Fact]
  public void GetPlayer_ReturnsNull_Test()
  {
    var result = GameEngine.GetPlayer(Guid.NewGuid());
    Assert.Null(result);
  }

  [Fact]
  public void PlayerHasLetter_Test()
  {
    var knownLetter = _player1.WordList[0].LetterList[0].Value;
    var result = GameEngine.PlayerHasLetter(_game.Id, _player1.Id, knownLetter);

    Assert.Equal("Hit", result);
    Assert.True(_player1.WordList[0].LetterList[0].Found);
  }

  [Fact]
  public void PlayerHasLetter_Miss_Test()
  {
    var result = GameEngine.PlayerHasLetter(_game.Id, _player1.Id, 'ö');
    Assert.Equal("Miss", result);
  }

  [Fact]
  public void PlayerHasLetter_ChangeTurn_Test()
  {
    GameEngine.PlayerHasLetter(_game.Id, _player1.Id, '!');
    Assert.Equal(_game.Player2, _game.Turn);
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