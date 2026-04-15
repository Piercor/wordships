import { useState } from "react";
import CreateGamePage from "./CreateGamePage";
import JoinGamePage from "./JoinGamePage";

const CreateOrJoinPage = () => {
  const [showJoin, setShowJoin] = useState(false);

  return (
    <main>
      <div className="card">
        <div className="create-join-header">
          <img
            src="https://8upload.com/image/ff8d99e3244799c9/Wordships-grey.png"
            alt="Wordship"
            className="logo"
          />
        </div>

        {!showJoin ? (
          <>
            <CreateGamePage />
            <button data-testid="toggle-join" onClick={() => setShowJoin(true)}>
              Already have a Game ID? Join instead
            </button>
          </>
        ) : (
          <>
            <JoinGamePage />
            <button
              data-testid="toggle-create"
              onClick={() => setShowJoin(false)}
            >
              Create a new game instead
            </button>
          </>
        )}
      </div>
    </main>
  );
};

export default CreateOrJoinPage;
