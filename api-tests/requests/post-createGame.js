export default {
  method: 'POST',
  url: '{{baseUrl}}/api/game/create',
  body: { playerName: 'Player1' }
};

export function postResponse() {
  pm.test('Status code is 200', () => pm.response.to.have.status(200));

  const json = pm.response.json();
  pm.environment.set('gameId', json.gameId);
  pm.environment.set('player1name', 'Player1');
  pm.test('Response has gameId', () => pm.expect(json).to.have.property('gameId'));
  pm.test('gameId is a non-empty string', () =>
    pm.expect(json.gameId).to.be.a('string').that.is.not.empty
  );
}