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
    pm.environment.set('player2id', json.player.id);

  const gameId = pm.environment.get('gameId');
  const player2id = pm.environment.get('player2id');
  const player2name = pm.environment.get('player2name');

  pm.test('Response contains gameId', () =>
    pm.expect(json.gameId).to.contain(gameId)
  );

  pm.test('Response contains player2 id', () =>
    pm.expect(json.player.id).to.contain(player2id)
  );

  pm.test('Response contains player2 name', () =>
    pm.expect(json.player.name).to.contain(player2name)
  );

}