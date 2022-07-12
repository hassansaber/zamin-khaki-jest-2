const express = require("express");
const request = require("supertest"); //access mock API
const booksRoute = require("../routes/books.route");

//server
const app = express();
app.use(express.json());
app.use("/api/books", booksRoute);

//tests
describe("use Integration test to check  access to books", () => {
  it("Read  GET - api/books - success - books list", async () => {
    const { body, statusCode } = await request(app).get("/api/books");

    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          author: expect.any(String),
          id: expect.any(Number),
        }),
      ])
    );

    expect(statusCode).toBe(200);
  });
});
