import { createContext, useContext, useEffect, useState } from "react";
import type { Player } from "../interface/Player";
import type { Game } from "../interface/Game";
import type { Word } from "../interface/Word";
import type { Placement } from "../interface/Placement";

interface GameContextInterface {
  player: Player | null;
  opponent: Player | null;
  gameId: string | null;
  registerPlayer: (name: string) => void;
  createGame: () => Promise<Game | null>;
  joinGame: (gameId: string) => Promise<Game | null>;
  error: string | null;
  loading: boolean;
  setGameId: (id: string) => void;
  playerWords: Word[];
  isReady: boolean;
  bothReady: boolean;
  setReady: (placements: Placement[]) => Promise<void>;
}

const GameContext = createContext<GameContextInterface | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playerWords, setPlayerWords] = useState<Word[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [bothReady, setBothReady] = useState(false);

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
  }, []);

  useEffect(() => {
    if (player) {
      sessionStorage.setItem("player", JSON.stringify(player));
    }
  }, [player]);

  useEffect(() => {
    if (gameId) {
      sessionStorage.setItem("game", JSON.stringify({ gameId }));
    }
  }, [gameId]);

  useEffect(() => {
    if (!gameId || !player?.id || !isReady || bothReady) return;

    const checkReady = async () => {
      const result = await fetch(`/api/game/${gameId}/ready`);
      const data = await result.json();
      if (data.bothReady) setBothReady(true);
    };

    const interval = setInterval(checkReady, 3000);
    return () => clearInterval(interval);
  }, [gameId, player?.id, isReady, bothReady]);

  const setReady = async (placements: Placement[]) => {
    if (!player?.id || !gameId) return;

    const result = await fetch("/api/player/place", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId: player.id,
        gameId,
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

  const registerPlayer = (name: string) => {
    setPlayer({ id: "", name });
  };

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

      return data;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

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

      return data;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!player?.id) return;

    const fetchWords = async () => {
      const playerResult = await fetch(`/api/player/${player.id}`);
      const playerData = await playerResult.json();
      setPlayerWords(playerData.player.wordList);
    };

    fetchWords();
  }, [player?.id]);

  useEffect(() => {
    if (!gameId || !player?.id || opponent) return;

    const fetchOpponent = async () => {
      const result = await fetch(`/api/game/${gameId}`);
      const data = await result.json();

      const opponentData =
        data.player1.id === player.id ? data.player2 : data.player1;
      if (opponentData?.id) setOpponent(opponentData);
    };
    fetchOpponent();
    const interval = setInterval(fetchOpponent, 3000);
    return () => clearInterval(interval);
  }, [gameId, player?.id, opponent]);

  return (
    <GameContext.Provider
      value={{
        player,
        opponent,
        registerPlayer,
        createGame,
        joinGame,
        error,
        loading,
        gameId,
        setGameId,
        playerWords,
        isReady,
        bothReady,
        setReady,
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
