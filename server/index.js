const http = require("http");

// HERE BE DATABASE CONFIGURATION
const path = require("path");
const lowdb = require("lowdb");
const lodashId = require("lodash-id");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync(path.join(__dirname, "db.json"));
const db = lowdb(adapter);

db._.mixin(lodashId);
db.defaults({ posts: [] }).write();
// HERE ENDS DATABASE CONFIGURATION

const HANDLERS = {
  GET(request, response) {
    // handle /posts (the whole collection)
    if (request.url === "/posts") {
      const posts = db.get("posts").value();

      ok(response, posts);
    } else {
      // handle a single post by ID
      const parts = request.url.split("/");

      if (parts.length === 3) {
        const id = parts[2];
        const post = db.get("posts").getById(id).value();

        if (post) {
          ok(response, post);
        } else {
          notFound(response);
        }
      } else {
        notFound(response);
      }
    }
  },
  POST(request, response) {
    let contents = "";

    request.on("data", (chunk) => (contents += chunk));

    request.on("end", () => {
      const post = db.get("posts").insert({ body: contents }).write();

      ok(response, post);
    });

    request.on("error", () => internalServerError(response));
  },
  PATCH(request, response) {
    const parts = request.url.split("/");

    if (parts.length === 3) {
      const id = parts[2];

      let contents = "";

      request.on("data", (chunk) => (contents += chunk));

      request.on("end", () => {
        const post = db.get("posts").updateById(id, { body: contents }).write();

        if (post) {
          ok(response, post);
        } else {
          notFound(response);
        }
      });

      request.on("error", () => internalServerError(response));
    } else {
      notFound(response);
    }
  },
  DELETE(request, response) {
    const parts = request.url.split("/");

    if (parts.length === 3) {
      const id = parts[2];
      const post = db.get("posts").removeById(id).write();

      if (post) {
        ok(response, post);
      } else {
        notFound(response);
      }
    } else {
      notFound(response);
    }
  },
};

const internalServerError = (response) => {
  response.writeHead(500, { "Content-Type": "application/json" });
  response.write(JSON.stringify({ message: "Internal Server Error" }));
  response.end();
};

const ok = (response, payload) => {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.write(JSON.stringify(payload));
  response.end();
};

const notFound = (response) => {
  response.writeHead(404, { "Content-Type": "application/json" });
  response.write(JSON.stringify({ message: "Not Found" }));
  response.end();
};

const server = http.createServer((request, response) => {
  if (request.url.startsWith("/posts")) {
    const handler = HANDLERS[request.method];

    if (handler) {
      handler(request, response);
    } else {
      notFound(response);
    }
  } else {
    notFound(response);
  }
});

server.listen(8675);

console.log("listening on port 8675");
