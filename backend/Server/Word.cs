namespace Server;

public record Word(string Name)
{
  public List<char> LetterList => Name.ToList();
  /*   public List<Letter> LetterList => Name
    .Select(c => new Letter { Value = c })
    .ToList(); */
}