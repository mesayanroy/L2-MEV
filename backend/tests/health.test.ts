import request from "supertest";
import express from "express";
import { healthRouter } from "../src/routes/health";

const app = express();
app.use(express.json());
app.use("/health", healthRouter);

describe("GET /health", () => {
  it("returns 200 with status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(typeof res.body.timestamp).toBe("number");
  });
});
