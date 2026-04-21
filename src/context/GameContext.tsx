import { createContext, useContext, useEffect, useState } from "react";
import type { Player } from "../interface/Player";
import type { Game, GuessResult } from "../interface/Game";
import type { Word } from "../interface/Word";
import type { Placement } from "../interface/Placement";

interface GameContextInterface {
  player: Player | null;
  opponent: Player | null;
  gameId: string | null;
  registerPlayer: (name: string) => void;
  createGame: () => Promise<Game | null>;
  joinGame: (id: string) => Promise<Game | null>;
  error: string | null;
  loading: boolean;
  setGameId: (id: string) => void;
  playerWords: Word[];
  opponentWords: Word[];
  isReady: boolean;
  bothReady: boolean;
  setReady: (placements: Placement[]) => Promise<void>;
  guessLetter: (letter: string) => Promise<GuessResult>;
  turn: string | null;
}

const GameContext = createContext<GameContextInterface | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playerWords, setPlayerWords] = useState<Word[]>([]);
  const [opponentWords, setOpponentWords] = useState<Word[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [bothReady, setBothReady] = useState(false);
  const [turn, setTurn] = useState<string | null>(null);

  // Registrera spelare med namn
  const registerPlayer = (name: string) => {
    setPlayer({ id: "", name });
  };

  // Skapa ett nytt spel
  const createGame = async (): Promise<Game | null> => {
    if (!player) {
      setError("Player not registered");
      return null;
    }
    setLoading(true);
    setError(null);

    try {
      const result = await fetch("/api/game/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: player.name }),
      });

      if (!result.ok) throw new Error("Failed to create game");
      const data = await result.json();
      setPlayer({ id: data.player.id, name: data.player.name });

      sessionStorage.setItem("game", JSON.stringify({ gameId: data.gameId }));

      const playerResult = await fetch(`/api/player/${data.player.id}`);
      const playerData = await playerResult.json();
      setPlayerWords(playerData.player.wordList);

      return data;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Joina ett befintligt spel
  const joinGame = async (id: string): Promise<Game | null> => {
    if (!player) {
      setError("Player not registered");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetch("/api/game/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: id, playerName: player.name }),
      });

      if (!result.ok) {
        const errorData = await result.json();
        throw new Error(errorData.error || "Failed to join game");
      }

      const data = await result.json();
      setPlayer({ id: data.player.id, name: data.player.name });

      const playerResult = await fetch(`/api/player/${data.player.id}`);
      const playerData = await playerResult.json();
      setPlayerWords(playerData.player.wordList);

      return data;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Placera ut ord och sätt spelaren som redo
  const setReady = async (placements: Placement[]) => {
    if (!player?.id || !gameId) return;

    const result = await fetch("/api/player/place", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId: player.id,
        placements,
      }),
    });

    if (!result.ok) {
      const errorData = await result.json();
      setError(errorData.error || "Failed to place words");
      return;
    }

    setIsReady(true);
  };

  // Skicka en gissning på en bokstav och returnera om det var träff eller miss
  const guessLetter = async (letter: string): Promise<GuessResult> => {
    const result = await fetch("/api/player/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId,
        playerGuessingId: player?.id,
        playerToGuessId: opponent?.id,
        letter,
      }),
    });

    if (!result.ok) throw new Error("Failed to guess letter");

    const data = await result.json();
    const gameResult = await fetch(`/api/game/${gameId}`);
    const gameData = await gameResult.json();
    setTurn(gameData.turn);

    return data;
  };

  // Ladda in sparad state från sessionStorage
  useEffect(() => {
    const saved =
      sessionStorage.getItem("player") ?? localStorage.getItem("player");

    if (saved) {
      try {
        const parsedPlayer = JSON.parse(saved);
        setPlayer(parsedPlayer);
        sessionStorage.setItem("player", JSON.stringify(parsedPlayer));
      } catch (e) {
        console.error("Failed to load saved player ", e);
      }
    }

    const savedGame =
      sessionStorage.getItem("game") ?? localStorage.getItem("game");

    if (savedGame) {
      try {
        const game = JSON.parse(savedGame);
        setGameId(game.gameId);

        sessionStorage.setItem("game", JSON.stringify({ gameId: game.gameId }));
      } catch (e) {
        console.error("Failed to load saved game", e);
      }
    }

    if (sessionStorage.getItem("isReady")) setIsReady(true);
    if (sessionStorage.getItem("bothReady")) setBothReady(true);
  }, []);

  // Spara player till sessionStorage
  useEffect(() => {
    if (player) {
      sessionStorage.setItem("player", JSON.stringify(player));
    }
  }, [player]);

  // Spara gameId till sessionStorage
  useEffect(() => {
    if (gameId) {
      sessionStorage.setItem("game", JSON.stringify({ gameId }));
    }
  }, [gameId]);

  // Spara isReady till sessionStorage
  useEffect(() => {
    if (isReady) sessionStorage.setItem("isReady", "true");
  }, [isReady]);

  // Spara bothReady till sessionStorage
  useEffect(() => {
    if (bothReady) sessionStorage.setItem("bothReady", "true");
  }, [bothReady]);

  // Hämta spelstate – opponent och turn
  useEffect(() => {
    if (!gameId || !player?.id) return;

    const fetchGameState = async () => {
      const result = await fetch(`/api/game/${gameId}`);
      const data = await result.json();

      setTurn(data.turn);
      const opponentData =
        data.player1.id === player.id ? data.player2 : data.player1;
      if (opponentData?.id) setOpponent(opponentData);
    };

    fetchGameState();
    const interval = setInterval(fetchGameState, 3000);
    return () => clearInterval(interval);
  }, [gameId, player?.id]);

  // Vänta på att båda spelarna är redo
  useEffect(() => {
    if (!gameId || !player?.id || !isReady || bothReady) return;

    const checkReady = async () => {
      const result = await fetch(`/api/game/${gameId}/ready`);
      const data = await result.json();
      if (data.bothReady) {
        setBothReady(true);

        const opponentResult = await fetch(`/api/player/${opponent?.id}`);
        const opponentData = await opponentResult.json();

        setOpponentWords(opponentData.player.wordList);
      }
    };

    const interval = setInterval(checkReady, 3000);
    return () => clearInterval(interval);
  }, [gameId, player?.id, isReady, bothReady, opponent?.id]);

  // Hämta motståndarens ord när båda spelarna är redo
  useEffect(() => {
    if (!bothReady || !opponent?.id) return;

    const fetchOpponentWords = async () => {
      const result = await fetch(`/api/player/${opponent.id}`);
      const data = await result.json();
      setOpponentWords(data.player.wordList);
    };

    fetchOpponentWords();
  }, [bothReady, opponent?.id]);

  // Hämta egna ord under spelet
  useEffect(() => {
    if (!player?.id) return;

    const fetchPlayerWords = async () => {
      const result = await fetch(`/api/player/${player.id}`);
      const data = await result.json();
      setPlayerWords(data.player.wordList);
    };

    fetchPlayerWords();
    const interval = setInterval(fetchPlayerWords, 3000);
    return () => clearInterval(interval);
  }, [player?.id]);

  return (
    <GameContext.Provider
      value={{
        player,
        opponent,
        gameId,
        registerPlayer,
        createGame,
        joinGame,
        error,
        loading,
        setGameId,
        playerWords,
        opponentWords,
        isReady,
        bothReady,
        setReady,
        guessLetter,
        turn,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
};
