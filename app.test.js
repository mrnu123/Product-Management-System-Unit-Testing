const request = require("supertest");
const app = require("./app");
describe("GET /products", function () {
  it("responds with json", function (done) {
    request(app)
      .get("/products")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});
