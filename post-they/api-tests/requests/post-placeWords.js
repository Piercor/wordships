export default {
  method: 'POST',
  url: '{{baseUrl}}/api/player/place',
  body: {
    playerId: '{{player1Id}}',
    gameId: '{{gameId}}',
    placements: [
      { wordName: 'cat', row: 0, col: 0 },
      { wordName: 'dog', row: 2, col: 0 }
    ]
  }
};

export function postResponse ()  {
  pm.test('Status code is 200', () => pm.response.to.have.status(200));

  const json = pm.response.json();

  pm.test("Player is ready", () => {
    pm.expect(json.ready).to.be.true;
  })

  pm.test("ready is a boolean", () => 
    pm.expect(json.ready).to.be.a("boolean"));
  
};
