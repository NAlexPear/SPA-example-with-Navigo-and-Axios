const http = require("http");

const PORT = 8675;

const server = http.createServer((request, response) => {
  response.setHeader("Content-Type", "application/json");

  if (request.url === "/" && request.method === "POST") {
    let message = "";

    request.on("data", (chunk) => (message += chunk));

    request.on("end", () => {
      response.writeHead(200);
      response.write(JSON.stringify({ message }));
      response.end();
    });

    request.on("error", () => {
      response.writeHead(500);
      response.write(JSON.stringify({ message: "Internal Server Error" }));
      response.end();
    });
  } else {
    response.writeHead(404);
    response.write(JSON.stringify({ message: "Not Found" }));
    response.end();
  }
});

server.listen(PORT);

console.log(`Listening on port ${PORT}`);
