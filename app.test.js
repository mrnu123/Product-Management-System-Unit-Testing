const request = require("supertest");
const app = require("./app");
let testProductId;

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
  });
  it("should get product by query params", async () => {
    const product = { name: "Test Product" };
    const response = await request(app).get("/products").query(product);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach((product) => {
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("category");
      expect(product).toHaveProperty("price");
      expect(product).toHaveProperty("stock");
      testProductId = product._id;
    });
  });
});

describe("PUT /products/:id", () => {
  const updateProduct = {
    name: "Test Product",
    category: "Test Category",
    price: 20.99,
    stock: 200,
  };
  it("should updated product", async () => {
    const response = await request(app)
      .put(`/products/${testProductId}`)
      .send(updateProduct);
    expect(response.status).toBe(200);
    expect(response.text).toEqual("Updated successfully");
  });

  it("should return internal error", async () => {
    const response = await request(app)
      .put("/products/123")
      .send(updateProduct);
    expect(response.status).toBe(500);
  });
});

describe("DELETE /products/:id", () => {
  it("should deleted a product", async () => {
    const response = await request(app).delete(`/products/${testProductId}`);
    expect(response.status).toBe(200);
    expect(response.text).toEqual("Deleted successfully");
  });
});
