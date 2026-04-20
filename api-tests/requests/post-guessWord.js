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
  pm.test('Response has guessed correctly or wrong', () =>
    pm.expect(json.message).to.be.oneOf(['Word guessed correctly!', 'Word guessed wrong!'])
  );
}