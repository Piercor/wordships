export default {
  method: 'POST',
  url: '{{baseUrl}}/api/player/guess-word',
  body: {
    gameId: '{{gameId}}',
    playerGuessingId: '{{player1Id}}',
    playerToGuessId: '{{player2Id}}',
    word: 'engine'
  }
};

export function postResponse() {
  pm.test('Status code is 200', () => pm.response.to.have.status(200));

  const json = pm.response.json();
  pm.test('Response has guessed correctly or wrong, or winner ', () =>
    pm.expect(json).to.be.oneOf(['Word guessed correctly!', 'Word guessed wrong!',
      `Winner: ${pm.environment.get("player1Id")}`, `Winner: ${pm.environment.get("player2Id")}`])
  );
}