namespace Server;

public class Letter
{
  public char Value { get; set; }
  public bool Found { get; set; } = false;
  public int Row { get; set; } = -1;
  public int Col { get; set; } = -1;

}