namespace Server;

public class Game
{
  public Guid Id;
  public Player? Player1;
  public Player? Player2;
  public bool BothReady => Player1?.IsReady == true && Player2?.IsReady == true;
  public Player? Turn;

  public Game(Guid id)
  {
    Id = id;
  }
  public Guid GetId()
  {
    return Id;
  }
  public Player? GetPlayer(Guid playerId)
  {
    if (Player1?.Id == playerId)
    {
      return Player1;
    }
    else if (Player2?.Id == playerId)
    {
      return Player2;
    }
    else
    {
      return null;
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
            wordList.RemoveAt(index);
          }
          break;
        case 4:
          for (int i = 0; i < 3; i++)
          {
            int index = rnd.Next(0, wordList.Count);
            randomWords.Add(new(wordList[index]));
            wordList.RemoveAt(index);
          }
          break;
        case 5:
          for (int i = 0; i < 2; i++)
          {
            int index = rnd.Next(0, wordList.Count);
            randomWords.Add(new(wordList[index]));
            wordList.RemoveAt(index);
          }
          break;
        case 6:
          {
            int index = rnd.Next(0, wordList.Count);
            randomWords.Add(new(wordList[index]));
            wordList.RemoveAt(index);

          }
          break;
      }
    }
    randomWords.Reverse();
    return randomWords;
  }
  public static Player CreatePlayer(string name)
  {
    return new(Guid.NewGuid(), name, GetWords());
  }

  public Player? FirstTurn()
  {
    Random rnd = new Random();
    return rnd.Next(2) == 0 ? Player1 : Player2;
  }
}