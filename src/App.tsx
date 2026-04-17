import RegisterPlayerPage from "./pages/RegisterPlayerPage";
import { GameProvider, useGame } from "./context/GameContext";
import CreateOrJoinPage from "./pages/CreateOrJoinPage";
import GamePage from "./pages/GamePage";

const AppContent = () => {
  const { player, gameId } = useGame();

  if (!player) {
    return <RegisterPlayerPage />;
  }

  if (!gameId) {
    return <CreateOrJoinPage />;
  }
  return <GamePage />;
  // //TODO: ska returnera sidan för själva spelet sen
  // return <div>Väntar på motspelare... (Game ID: {gameId})</div>;
};

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
