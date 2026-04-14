namespace Server;

public class Word
{
  public string Name;
  public List<Letter> LetterList { get; }
  public Word(string name)
  {
    Name = name;
    LetterList = name.Select(c => new Letter { Value = c }).ToList();
  }
}