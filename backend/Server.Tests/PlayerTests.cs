namespace Server.Tests;

public class PlayerTests
{
  private readonly Player _player = new(Guid.NewGuid(), "player1", Game.GetWords());

  [Fact]
  public void GetId_Test()
  {
    Assert.Equal(_player.GetId(), _player.Id);
  }

  [Fact]
  public void GetName_Test()
  {
    Assert.Equal(_player.GetName(), _player.Name);
  }

  [Fact]
  public void GetWordList_Test()
  {
    Assert.NotNull(_player.WordList);
  }

}