export default {
  name: 'Guess Letter',
  method: 'POST',
  url: '{{baseUrl}}/api/player/guess',
  body: {
    gameId: '{{gameId}}',
    playerGuessingId: '{{player1Id}}',
    playerToGuessId: '{{player2Id}}',
    letter: '{{letter}}'
  }
};

export function preRequest() {
  const alphabet = 'zyxwvutsrqponmlkjigfedcba'.split('');
  const index = parseInt(pm.environment.get('guessLetterIndex') || '0', 10);

  if (index >= alphabet.length) {
    return;
  }

  pm.environment.set('letter', alphabet[index]);
}

export function postResponse() {
  pm.test('Status code is 200', () => pm.response.to.have.status(200));

  const json = pm.response.json();
  pm.test('Response has Hit, Miss or Winner', () =>
    pm.expect(json).to.be.oneOf(['Hit', 'Miss', `Winner: ${pm.environment.get("player1Id")}`, `Winner: ${pm.environment.get("player2Id")}`])
  );

  let index = parseInt(pm.environment.get('guessLetterIndex') || '0', 10) + 1;
  if (index < 26) {
    pm.environment.set('guessLetterIndex', index);
  } else {
    pm.environment.unset('guessLetterIndex');
  }
}