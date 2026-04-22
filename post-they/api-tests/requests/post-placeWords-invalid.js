export  default  {
  method: 'POST',
  url: '{{baseUrl}}/api/player/place',
  body: {
    playerId: '00000000-0000-0000-0000-000000000000',
    placements: [
      { wordName: 'cat', row: 0, col: 0 }
    ]
  }
};
export function postResponse  () {
  pm.test("Status code is 404 when player not found", () => 
    pm.response.to.have.status(404))
}