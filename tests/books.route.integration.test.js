const express = require("express");
const request = require("supertest"); //access mock API
const booksRoute = require("../routes/books.route");

//server
const app = express();
app.use(express.json());
app.use("/api/books", booksRoute);

// JEST
jest.mock("../data/books.json", () => [
  { name: "call of the wild2", author: "louis wilder white", id: 1 },
  { name: "love like no other", author: "charlie bronson", id: 2 },
  { name: "dream", author: "jamie phillips", id: 3 },
]);
// no {} for json in mocks return

//tests
describe("Integration test books API", () => {
  //---GET
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

  //----POST
  it("Create POST - api/books - failure - invalid post body", async () => {
    const { body, statusCode } = await request(app).post("/api/books").send({
      name: "",
      author: "adfdsf",
    });

    expect(statusCode).toBe(400);

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

  test("Create POST - api/books - success - book added to list", async () => {
    const { body, statusCode } = await request(app).post("/api/books").send({
      name: "Face Off",
      author: "John Travolta",
    });

    expect(statusCode).toBe(200);

    expect(body).toEqual({
      message: "Success",
    });
  });

  // ----PUT
  it("Update PUT - api/bools/:bookid - failure - when book is not found", async () => {
    const { body, statusCode } = await request(app)
      .put("/api/books/5000")
      .send({
        name: "Love Me Like You Do",
        author: "John Travolta",
      });

    expect(statusCode).toBe(404);

    expect(body).toEqual({
      error: true,
      message: "Book not found",
    });
  });

  test("Update PUT - /api/books/:bookid - Success - when book is found and edited", async () => {
    const { body, statusCode } = await request(app).put("/api/books/1").send({
      name: "call of the wild2",
      author: "louis wilder white",
    });

    expect(statusCode).toBe(201);

    expect(body).toEqual({
      name: "call of the wild2",
      author: "louis wilder white",
      id: 1,
    });
  });

  //----DELETE
  it("Delete - /api/books/:bookid - failure - can not found book to remove from list ", async () => {
    const { statusCode, body } = await request(app).delete(
      "/api/books/1987987"
    );

    expect(statusCode).toBe(404);

    expect(body).toEqual({
      error: true,
      message: "Book not found",
    });
  });

  test("Delete - /api/books/:bookid - Success - remove book from list ", async () => {
    const { statusCode, body } = await request(app).delete("/api/books/1");

    expect(statusCode).toBe(201);

    expect(body).toEqual({
      message: "Success",
    });
  });
});
