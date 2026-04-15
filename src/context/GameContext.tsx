import { createContext, useContext, useEffect, useState } from "react";
import type { Player } from "../interface/User";
import type { Game } from "../interface/Game";

interface GameContextInterface {
  player: Player | null;
  gameId: string | null;
  registerPlayer: (name: string) => void;
  createGame: () => Promise<Game | null>;
  joinGame: (gameId: string) => Promise<boolean>;
  error: string | null;
  loading: boolean;
  setGameId: (id: string) => void;
}

const GameContext = createContext<GameContextInterface | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const registerPlayer = (name: string) => {
    setPlayer({ id: crypto.randomUUID(), name });
  };

  const createGame = async () => {
    if (!player) {
      setError("Player not registered");
      return null;
    }
    setLoading(true);
    setError("");
    try {
      return { gameId: crypto.randomUUID() };
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const joinGame = async (id: string) => {
    if (!player) {
      setError("Player not registered");
      return false;
    }

    setLoading(true);
    setError("");

    try {
      setGameId(id);
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <GameContext.Provider
      value={{
        player,
        registerPlayer,
        createGame,
        joinGame,
        error,
        loading,
        gameId,
        setGameId,
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
