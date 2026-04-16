export default {
  method: 'GET',
  url: '{{baseUrl}}/api/game/{{gameId}}'
};

export function postResponse() {
  pm.test('Status code is 200', () => pm.response.to.have.status(200));

  const json = pm.response.json();
  const player1 = json.player1;
  const player2 = json.player2;

  pm.test('Response contains player1 name', () =>
    pm.expect(player1.name).to.equal(pm.environment.get('player1name'))
  );

  pm.test('Response contains player2 name', () =>
    pm.expect(player2.name).to.equal(pm.environment.get('player2name'))
  );

  pm.test('player1 has a valid id', () => {
    pm.expect(player1.id).to.exist;
    pm.expect(player1.id).to.be.a('string').that.is.not.empty;
  });

  pm.test('player2 has a valid id', () => {
    pm.expect(player2.id).to.exist;
    pm.expect(player2.id).to.be.a('string').that.is.not.empty;
  });

  pm.environment.set('player1Id', player1.id);
  pm.environment.set('player2Id', player2.id);
}