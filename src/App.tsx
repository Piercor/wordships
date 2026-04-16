import RegisterPlayerPage from "./pages/RegisterPlayerPage";
import { GameProvider, useGame } from "./context/GameContext";
import CreateOrJoinPage from "./pages/CreateOrJoinPage";
import WaitingPage from "./pages/WaitingPage";
import PlacementPage from "./pages/PlacementPage";

const AppContent = () => {
  const { player, gameId, isReady, bothReady } = useGame();

  if (!player) {
    return <RegisterPlayerPage />;
  }

  if (!gameId) return <CreateOrJoinPage />;

  if (!isReady) return <PlacementPage />;
  if (!bothReady) return <WaitingPage />;

  //TODO: ska returnera sidan för själva spelet sen
  return <div>Game</div>;
};

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
