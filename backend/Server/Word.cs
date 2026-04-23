namespace Server;

public class Word
{
  public string Name;
  public List<Letter> LetterList { get; }
  public bool Found { get; set; } = false;
  public Word(string name)
  {
    Name = name;
    LetterList = name.Select(c => new Letter { Value = c }).ToList();
  }
}