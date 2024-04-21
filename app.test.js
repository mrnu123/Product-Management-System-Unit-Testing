const request = require("supertest");
const app = require("./app");

describe("POST /products", () => {
  it("should create a new product", async () => {
    const newProduct = {
      name: "Test Product",
      category: "Test Category",
      price: 9.99,
      stock: 100,
    };

    const response = await request(app).post("/products").send(newProduct);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(newProduct));
  });

  it("should return 400 on invalid product data", async () => {
    const invalidProduct = {
      name: "Invalid Product",
      category: "Invalid Category",
      price: "invalid_price", // Invalid price format
      stock: "invalid_stock", // Invalid stock format
    };

    const response = await request(app).post("/products").send(invalidProduct);

    expect(response.status).toBe(400);
  });
});

describe("GET /products", () => {
  it("should get all products", async () => {
    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    // Assert response body or length of products array
  });

  // Add more test cases for GET, PUT, DELETE as needed
});
