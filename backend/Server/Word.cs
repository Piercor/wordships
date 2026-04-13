namespace Server;

public record Word(string Name)
{
  public List<char> LetterList => Name.ToList();
}