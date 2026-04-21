export default {
  method: 'POST',
  url: '{{baseUrl}}/api/player/guess',
  body: {
    gameId: '{{gameId}}',
    playerGuessingId: '{{player1Id}}',
    playerToGuessId: '{{player2Id}}',
    letter: 'a'
  }
};

export function postResponse() {
  pm.test('Status code is 200', () => pm.response.to.have.status(200));

  const json = pm.response.json();
  pm.test('Response has Hit, Miss or Winner', () =>
    pm.expect(json).to.be.oneOf(['Hit', 'Miss', `Winner: ${pm.environment.get("player1Id")}`, `Winner: ${pm.environment.get("player2Id")}`])
  );
}