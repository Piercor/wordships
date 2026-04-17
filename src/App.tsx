import RegisterPlayerPage from "./pages/RegisterPlayerPage";
import { GameProvider, useGame } from "./context/GameContext";
import CreateOrJoinPage from "./pages/CreateOrJoinPage";
import WaitingPage from "./pages/WaitingPage";
import PlacementPage from "./pages/PlacementPage";
import GamePage from "./pages/GamePage";

const AppContent = () => {
  const { player, gameId, isReady, bothReady, opponent } = useGame();

  if (!player) {
    return <RegisterPlayerPage />;
  }

  if (!gameId || !opponent) return <CreateOrJoinPage />;

  if (!isReady) return <PlacementPage />;
  if (!bothReady) return <WaitingPage />;

  return <GamePage />;
};

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
