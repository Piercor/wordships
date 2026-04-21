export default {
  name: 'Guess Word',
  method: 'POST',
  url: '{{baseUrl}}/api/player/guess-word',
  body: {
    gameId: '{{gameId}}',
    playerGuessingId: '{{player1Id}}',
    playerToGuessId: '{{player2Id}}',
    word: '{{word}}'
  }
};

export function preRequest() {
  const player2Id = pm.environment.get('player2Id');
  const baseUrl = pm.variables.get('baseUrl');

  pm.sendRequest(`${baseUrl}/api/player/${player2Id}`, (err, response) => {
    if (err) {
      console.log('Error fetching player info:', err);
      return;
    }

    const playerData = response.json();
    const wordList = playerData.player.wordList;

    pm.environment.set('wordListLength', wordList.length);

    const index = parseInt(pm.environment.get('guessWordIndex') || '0', 10);

    if (index >= wordList.length) {
      return;
    }

    pm.environment.set('word', wordList[index].name);
  });
}

export function postResponse() {
  pm.test('Status code is 200', () => pm.response.to.have.status(200));

  const json = pm.response.json();
  pm.test('Response has correct guess, wrong guess, or winner', () =>
    pm.expect(json).to.be.oneOf(['Word guessed correctly!', 'Word guessed wrong!',
      `Winner: ${pm.environment.get("player1Id")}`])
  );

  let index = parseInt(pm.environment.get('guessWordIndex') || '0', 10) + 1;
  const wordListLength = parseInt(pm.environment.get('wordListLength') || '0', 10);

  if (index < wordListLength) {
    pm.environment.set('guessWordIndex', index);
  } else {
    pm.environment.unset('guessWordIndex');
    pm.environment.unset('wordListLength');
  }
}