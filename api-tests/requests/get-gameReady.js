export default {
  method: "GET",
    url: '{{baseUrl}}/api/game/{{gameId}}/ready'
};

export function postResponse () {
  pm.test("Status code is 200", () => pm.response.to.have.status(200));

  const json = pm.response.json();

  pm.test("Response contains bothReady", () => 
    pm.expect(json.bothReady).to.exist);

  pm.test("bothReady is a boolean", () =>
    pm.expect(json.bothReady).to.be.a("boolean"));

};

