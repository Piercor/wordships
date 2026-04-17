import { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import type { PlayerResponse } from "../interface/Grid";

export function useGameData() {
  const { gameId, player } = useGame();
  const [opponentId, setOpponentId] = useState<string | null>(null);
  const [playerData, setPlayerData] = useState<PlayerResponse | null>(null);
  const [opponentData, setOpponentData] = useState<PlayerResponse | null>(null);

  useEffect(() => {
    async function fetchGame() {
      const result = await fetch(`/api/game/${gameId}`);
      const data = await result.json();

      if (!player) return;

      if (data.player1.id === player.id) {
        setOpponentId(data.player2.id);
      } else {
        setOpponentId(data.player1.id);
      }
    }

    if (gameId && player) {
      fetchGame();
    }
  }, [gameId, player]);

  useEffect(() => {
    async function fetchPlayers() {
      if (!player || !opponentId) return;

      const playerResult = await fetch(`/api/player/${player.id}`);
      const playerData = await playerResult.json();
      const opponentResult = await fetch(`/api/player/${opponentId}`);
      const opponentData = await opponentResult.json();

      setPlayerData(playerData);
      setOpponentData(opponentData);
    }
    if (player && opponentId) {
      fetchPlayers();
    }
  }, [player, opponentId]);

  return { playerData, opponentData };
}