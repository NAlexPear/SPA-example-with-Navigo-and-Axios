const http = require("http");
const path = require("path");
const FileSync = require("lowdb/adapters/FileSync");
const lodashId = require("lodash-id");
const lowdb = require("lowdb");
const adapter = new FileSync(path.join(__dirname, "db.json"));
const db = lowdb(adapter);

db._.mixin(lodashId);
db.defaults({ posts: [] }).write();

const PORT = 8675;

const HANDLERS = {
  GET(request, response) {
    const posts = db.get("posts");

    if (request.url === "/posts") {
      ok(response, { posts: posts.value() });
    } else {
      const parts = request.url.split("/");

      if (parts.length === 3) {
        const id = parts[2];
        const post = posts.getById(id).value();

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
      let contents = "";

      request.on("data", (chunk) => (contents += chunk));

      request.on("end", () => {
        const id = parts[2];
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

const notFound = (response) => {
  response.writeHead(404);
  response.write(JSON.stringify({ message: "Not Found" }));
  response.end();
};

const internalServerError = (response) => {
  response.writeHead(500);
  response.write(JSON.stringify({ message: "Internal Server Error" }));
  response.end();
};

const ok = (response, payload) => {
  response.writeHead(200);
  response.write(JSON.stringify(payload));
  response.end();
};

const server = http.createServer((request, response) => {
  response.setHeader("Content-Type", "application/json");

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

server.listen(PORT);

console.log(`Listening on port ${PORT}`);
