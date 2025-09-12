import request from "supertest";
import app from "../server";

describe("User API", () => {
  it("should return 404 for non-existent user profile", async () => {
    const res = await request(app)
      .get("/api/v1/user/profile")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
