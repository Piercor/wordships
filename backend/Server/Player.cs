namespace Server;

public record Player(Guid Id, string Name, List<Word> WordList)
{
  public bool IsReady { get; set; } = false;
  public Guid GetId()
  {
    return Id;
  }
  public string GetName()
  {
    return Name;
  }

  public List<Word> GetWordList()
  {
    return WordList;
  }
}
