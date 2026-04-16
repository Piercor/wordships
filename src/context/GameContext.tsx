import { createContext, useContext, useEffect, useState } from "react";
import type { Player } from "../interface/Player";
import type { Game } from "../interface/Game";

interface GameContextInterface {
  player: Player | null;
  gameId: string | null;
  registerPlayer: (name: string) => void;
  createGame: () => Promise<Game | null>;
  joinGame: (gameId: string) => Promise<Game | null>;
  error: string | null;
  loading: boolean;
  setGameId: (id: string) => void;
}

const GameContext = createContext<GameContextInterface | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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
    setPlayer({ id: "", name });
  };

  const createGame = async (): Promise<Game | null> => {
    if (!player) {
      setError("Player not registered");
      return null;
    }
    setLoading(true);
    setError("");

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
    setError("");

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
