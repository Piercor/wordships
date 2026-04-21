export default {
  method: 'GET',
  url: '{{baseUrl}}/api/player/{{player1Id}}'
};

export function postResponse() {
  pm.test('Status code is 200', () => pm.response.to.have.status(200));

  const json = pm.response.json();
  const player = json.player;

  pm.test('Response contains player name', () =>
    pm.expect(player.name).to.equal(pm.environment.get('player1name'))
  );

  pm.test('Response contains wordList', () => {
    pm.expect(player).to.have.property('wordList');
    pm.expect(player.wordList).to.be.an('array');
    pm.expect(player.wordList.length).to.be.greaterThan(0);
  });

  pm.environment.set('player1', JSON.stringify(player));
}