import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  resetCrudProductsDatabase,
} from "../services/productCrudApi";

// Mock axios so network calls succeed
jest.mock("axios", () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
  get: jest.fn(() =>
    Promise.resolve({
      status: 200,
      data: {
        products: [
          { id: 1, title: "Product 1", price: 10, category: "Test", brand: "Brand A" },
          { id: 2, title: "Product 2", price: 20, category: "Test", brand: "Brand B" },
        ],
      },
    })
  ),
  post: jest.fn((url, payload) =>
    Promise.resolve({
      status: 201,
      data: { id: 999, ...payload },
    })
  ),
  put: jest.fn((url, payload) =>
    Promise.resolve({
      status: 200,
      data: { id: 999, ...payload },
    })
  ),
  delete: jest.fn(() =>
    Promise.resolve({
      status: 200,
      data: { success: true },
    })
  ),
}));

describe("Product CRUD API & Persistence for GET Method", () => {
  beforeEach(() => {
    localStorage.clear();
    // Simulate active admin session
    localStorage.setItem(
      "novastore_auth_user",
      JSON.stringify({
        email: "admin@novastore.com",
        canAccessCrud: true,
        role: "Administrator",
      })
    );
    localStorage.setItem("novastore_auth_token", "admin_test_token");
    resetCrudProductsDatabase();
  });

  test("GET method returns initial products", async () => {
    const data = await getProducts();
    expect(data.status).toBe(200);
    expect(data.products.length).toBeGreaterThan(0);
  });

  test("GET method returns newly added product after POST", async () => {
    const newProductData = {
      name: "Custom Gaming Mechanical Keyboard",
      price: "199.99",
      category: "Electronics",
      brand: "NovaStore Pro",
      stock: "25",
      description: "Hot swappable switches with RGB.",
    };

    // 1. Add product using POST
    const addResult = await addProduct(newProductData);
    expect(addResult.status).toBe(201);
    expect(addResult.product.name).toBe("Custom Gaming Mechanical Keyboard");

    // 2. Fetch products using GET - newly created product MUST be included!
    const getResult = await getProducts();
    expect(getResult.status).toBe(200);

    const found = getResult.products.find((p) => p.name === "Custom Gaming Mechanical Keyboard");
    expect(found).toBeDefined();
    expect(found.id).toBe(addResult.product.id);
    expect(found.price).toBe(199.99);
  });

  test("GET method reflects updated product after PUT", async () => {
    const addResult = await addProduct({
      name: "Original Title",
      price: "50",
      category: "Tools",
      brand: "Brand X",
    });

    const targetId = addResult.product.id;

    // Update using PUT
    await updateProduct(targetId, {
      name: "Updated Title After PUT",
      price: "75",
      category: "Tools",
      brand: "Brand X",
    });

    // Check GET returns the updated values
    const getResult = await getProducts();
    const updated = getResult.products.find((p) => p.id === targetId);
    expect(updated).toBeDefined();
    expect(updated.name).toBe("Updated Title After PUT");
    expect(updated.price).toBe(75);
  });

  test("GET method excludes product after DELETE", async () => {
    const addResult = await addProduct({
      name: "Temporary Item",
      price: "10",
      category: "Misc",
      brand: "Brand Y",
    });

    const targetId = addResult.product.id;

    // Delete using DELETE
    await deleteProduct(targetId);

    // Verify GET no longer contains this item
    const getResult = await getProducts();
    const deleted = getResult.products.find((p) => p.id === targetId);
    expect(deleted).toBeUndefined();
  });
});
