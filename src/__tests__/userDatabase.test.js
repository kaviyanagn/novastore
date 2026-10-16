import {
  initUserDatabase,
  getDatabaseUsers,
  registerUser,
  authenticateUser,
  checkCrudAccess,
  CRUD_AUTHORIZED_EMAIL,
  resetDatabase,
} from "../services/userDatabase";

describe("User Database Service & Single Account CRUD Rule", () => {
  beforeEach(() => {
    localStorage.clear();
    resetDatabase();
  });

  test("initializes with default seeded accounts", () => {
    const users = getDatabaseUsers();
    expect(users.length).toBeGreaterThanOrEqual(2);

    const admin = users.find((u) => u.email === CRUD_AUTHORIZED_EMAIL);
    expect(admin).toBeDefined();
    expect(admin.role).toBe("Administrator");
    expect(admin.canAccessCrud).toBe(true);

    const customer = users.find((u) => u.email === "customer@novastore.com");
    expect(customer).toBeDefined();
    expect(customer.canAccessCrud).toBe(false);
  });

  test("verifies valid credentials during login", () => {
    const user = authenticateUser({
      emailOrUsername: "admin@novastore.com",
      password: "admin123",
    });
    expect(user).toBeDefined();
    expect(user.email).toBe("admin@novastore.com");
    expect(user.canAccessCrud).toBe(true);
  });

  test("rejects invalid password during login", () => {
    expect(() => {
      authenticateUser({
        emailOrUsername: "admin@novastore.com",
        password: "wrong_password",
      });
    }).toThrow(/Incorrect password/);
  });

  test("rejects non-existent account during login", () => {
    expect(() => {
      authenticateUser({
        emailOrUsername: "unknown@novastore.com",
        password: "password123",
      });
    }).toThrow(/No user found in the database/);
  });

  test("registers a new user and stores in the database as standard customer without CRUD access", () => {
    const newUser = registerUser({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "password123",
    });

    expect(newUser.email).toBe("jane.doe@example.com");
    expect(newUser.role).toBe("Customer");
    expect(newUser.canAccessCrud).toBe(false);

    // Verify user can now authenticate from database
    const authenticated = authenticateUser({
      emailOrUsername: "jane.doe@example.com",
      password: "password123",
    });
    expect(authenticated.email).toBe("jane.doe@example.com");

    // Verify single account rule for CRUD access
    expect(checkCrudAccess(authenticated)).toBe(false);
    expect(checkCrudAccess({ email: CRUD_AUTHORIZED_EMAIL, canAccessCrud: true })).toBe(true);
  });

  test("enforces single account rule for CRUD access", () => {
    const adminUser = { email: "admin@novastore.com", canAccessCrud: true };
    const customerUser = { email: "customer@novastore.com", canAccessCrud: false };
    const otherUser = { email: "someone.else@novastore.com", canAccessCrud: true }; // even if hacked flag

    expect(checkCrudAccess(adminUser)).toBe(true);
    expect(checkCrudAccess(customerUser)).toBe(false);
    expect(checkCrudAccess(otherUser)).toBe(false);
  });
});
