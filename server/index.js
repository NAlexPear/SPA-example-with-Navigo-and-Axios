const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const FileSync = require("lowdb/adapters/FileSync");
const lodashId = require("lodash-id");
const lowdb = require("lowdb");
const morgan = require("morgan");

const app = express();
const adapter = new FileSync(path.join(__dirname, "db.json"));
const db = lowdb(adapter);

db._.mixin(lodashId);
db.defaults({ posts: [] }).write();

const PORT = process.env.PORT || 8675;

app.use(bodyParser.json()).use(morgan("dev"));

app
  .route("/posts")
  .get((_request, response) => {
    const posts = db.get("posts").value();

    response.json(posts);
  })
  .post((request, response) => {
    const post = db.get("posts").insert(request.body).write();

    response.json(post);
  });

app
  .route("/posts/:id")
  .get((request, response) => {
    const id = request.params.id;
    const post = db.get("posts").getById(id).value();

    if (post) {
      response.json(post);
    } else {
      response.status(404).json({ message: "Not Found" });
    }
  })
  .patch((request, response) => {
    const id = request.params.id;
    const post = db.get("posts").updateById(id, request.body).write();

    if (post) {
      response.json(post);
    } else {
      response.status(404).json({ message: "Not Found" });
    }
  })
  .delete((request, response) => {
    const id = request.params.id;
    const post = db.get("posts").removeById(id).write();

    if (post) {
      response.json(post);
    } else {
      response.status(404).json({ message: "Not Found" });
    }
  });

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
