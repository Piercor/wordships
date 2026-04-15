export default {
  method: 'POST',
  url: '{{baseUrl}}/api/game/join',
  body: {
    gameId: '{{gameId}}',
    playerName: 'Player2'
  }
};

export function postResponse() {
  pm.environment.set('player2name', 'Player2');

  pm.test('Status code is 200', () => pm.response.to.have.status(200));

  const json = pm.response.json();
  const gameInfo = json.gameInfo;
  const gameId = pm.environment.get('gameId');
  const player1name = pm.environment.get('player1name');
  const player2name = pm.environment.get('player2name');

  pm.test('Response contains gameId', () =>
    pm.expect(gameInfo).to.contain(gameId)
  );

  pm.test('Response contains player1 name', () =>
    pm.expect(gameInfo).to.contain(player1name)
  );

  pm.test('Response contains player2 name', () =>
    pm.expect(gameInfo).to.contain(player2name)
  );

}