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
  [InlineData(0, 6)]
  [InlineData(1, 5)]
  [InlineData(2, 5)]
  [InlineData(3, 4)]
  [InlineData(4, 4)]
  [InlineData(5, 4)]
  [InlineData(6, 3)]
  [InlineData(7, 3)]
  [InlineData(8, 3)]
  [InlineData(9, 3)]
  public void PlayerWordListLength_Test(int index, int expected)
  {
    Assert.Equal(_player.WordList[index].LetterList.Count, expected);
  }

}