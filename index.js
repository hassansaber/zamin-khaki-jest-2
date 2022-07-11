const express = require("express");
const app = express();
const booksRouter = require("./routes/books.route");

app.use(express.json());
//---
app.use("/api/books", booksRouter);
//----
const PORT = 8000;
app.listen(PORT, () => console.log(`listening to port ${PORT}`));
