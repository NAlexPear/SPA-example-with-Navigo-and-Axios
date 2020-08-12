const http = require("http");

const server = http.createServer((request, response) => {
  const headers = { "Content-Type": "application/json" };
  let message = "Not Found";
  let status = 404;

  if (request.url === "/" && request.method === "POST") {
    // handle "correct" requests
    message = "";
    request.on("data", (chunk) => (message += chunk));

    request.on("end", () => {
      response.writeHead(200, headers);
      response.write(JSON.stringify({ message }));
      response.end();
    });

    request.on("error", () => {
      message = "Internal Server Error";
      response.writeHead(500, headers);
      response.write(JSON.stringify({ message }));
      response.end();
    });
  } else {
    response.writeHead(status, headers);
    response.write(JSON.stringify({ message }));
    response.end();
  }
});

server.listen(8675);

console.log("listening on port 8675");
