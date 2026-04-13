namespace Server;

public record Game(Guid Id, Player Player1, Player Player2)
{
  public Guid GetId()
  {
    return Id;
  }
  public Player? GetPlayer(int PlayerNumber)
  {
    switch (PlayerNumber)
    {
      case 1: return Player1;
      case 2: return Player2;
      default: return null;
    }

  }
  public static List<Word> GetWords()
  {
    Dictionary<int, List<string>> words = new();
    string[] wordsCsv = File.ReadAllLines(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "..", "Server", "src", "words.csv"));

    foreach (string line in wordsCsv)
    {
      string[] wordsSplitData = line.Split(",");

      foreach (string word in wordsSplitData)
      {
        int length = word.Length;
        if (!words.ContainsKey(length))
        {
          words[length] = new List<string>();
        }
        words[length].Add(word);
      }
    }

    List<Word> randomWords = new();

    foreach ((int key, List<string> wordList) in words)
    {
      Random rnd = new Random();
      switch (key)
      {
        case 3:
          for (int i = 0; i < 4; i++)
          {
            int index = rnd.Next(0, wordList.Count);
            randomWords.Add(new(wordList[index]));
          }
          break;
        case 4:
          for (int i = 0; i < 3; i++)
          {
            int index = rnd.Next(0, wordList.Count);
            randomWords.Add(new(wordList[index]));
          }
          break;
        case 5:
          for (int i = 0; i < 2; i++)
          {
            int index = rnd.Next(0, wordList.Count);
            randomWords.Add(new(wordList[index]));
          }
          break;
        case 6:
          for (int i = 0; i < 1; i++)
          {
            int index = rnd.Next(0, wordList.Count);
            randomWords.Add(new(wordList[index]));
          }
          break;
      }
    }
    return randomWords;
  }
  public static Player CreatePlayer(string Name)
  {
    return new(Guid.NewGuid(), Name, GetWords());
  }
}