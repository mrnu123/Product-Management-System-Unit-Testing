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

describe("POST /products", function () {
  it("responds with json", function (done) {
    const expectedData = {
      name: "Strawberry",
      category: "Fruit",
      price: 150,
      stock: 20,
    };
    request(app)
      .post("/products")
      .send(expectedData)
      .set("Acccept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toEqual(expect.objectContaining(expectedData));
        done();
      });
  });
});
