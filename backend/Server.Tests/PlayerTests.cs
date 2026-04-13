namespace Server.Tests;

public class PlayerTests
{
  private readonly Player _player = new(Guid.NewGuid(), "Player1", Game.GetWords());

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
  public void PlayerWordList_Test()
  {
    Assert.NotNull(_player.GetWordList());
    Assert.Equal(10, _player.WordList.Count);
  }

  [Theory]
  [InlineData(0, 3)]
  [InlineData(1, 3)]
  [InlineData(2, 3)]
  [InlineData(3, 3)]
  [InlineData(4, 4)]
  [InlineData(5, 4)]
  [InlineData(6, 4)]
  [InlineData(7, 5)]
  [InlineData(8, 5)]
  [InlineData(9, 6)]
  public void PlayerWordListLength_Test(int index, int expected)
  {
    Assert.Equal(_player.WordList[index].LetterList.Count, expected);
  }

}