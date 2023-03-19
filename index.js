// server.js
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/events") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    });

    // Send a message every second
    setInterval(() => {
      res.write(`data: ${new Date().toLocaleTimeString()}\n\n`);
    }, 1000);
  } else {
    res.end();
  }
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});