const express = require("express");
const request = require("supertest"); //access mock API
const booksRoute = require("../routes/books.route");

//server
const app = express();
app.use(express.json());
app.use("/api/books", booksRoute);

//tests
describe("Integration test books API", () => {
  it("Read  GET - api/books - success - get all the books list", async () => {
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

  it("Create POST - api/books - failure - invalid post body", async () => {
    const { body, statusCode } = await request(app).post("/api/books").send({
      name: "",
      author: "adfdsf",
    });

    expect(statusCode).toBe(400);

    // console.log(body);
    expect(body).toEqual({
      errors: [
        {
          value: "",
          msg: "Name is required",
          param: "name",
          location: "body",
        },
      ],
    });
  });
});
