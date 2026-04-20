import RegisterPlayerPage from "./pages/RegisterPlayerPage";
import { GameProvider, useGame } from "./context/GameContext";
import CreateOrJoinPage from "./pages/CreateOrJoinPage";
import WaitingPage from "./pages/WaitingPage";
import PlacementPage from "./pages/PlacementPage";
import GamePage from "./pages/GamePage";
import ResultPage from "./pages/ResultPage";

const AppContent = () => {
  const { player, gameId, isReady, bothReady, opponent, winner } = useGame();

  if (!player) {
    return <RegisterPlayerPage />;
  }

  if (!gameId || !opponent) return <CreateOrJoinPage />;

  if (!isReady) return <PlacementPage />;
  if (!bothReady) return <WaitingPage />;
  if (winner) return <ResultPage />;

  return <GamePage />;
};

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
