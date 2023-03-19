// server.js
const http = require("http");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));



const server = http.createServer((req, res) => {
  if (req.url === "/events") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    });

    // Send a message every second
    const timer = setInterval(() => {
      res.write(`data: ${new Date().toLocaleTimeString()}\n\n`);
    }, 1000);

    // Clear the timer and end the response when the connection is closed
    req.on("close", () => {
      clearInterval(timer);
      res.end();
    });
  } else if (req.url === "/pages") {

    const url = "https://tink.b4a.io/classes/Page";
    const options = {
      method: "GET",
      headers: {
        "X-Parse-Application-Id": "chAL4fw8kKILIVm04YmpOJdWkGxix71cz4yY8jcb",
        "X-Parse-REST-API-Key": "MMLtze5TgugIBMqUMWxoCSTQAplpqNy9uNDAIrMu"
      }
    };

    // Define a function to send a request to the Parse API with fetch
    const sendRequest = () => {
      fetch(url, options)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          // Send an html event to the client with the html data
          res.write(`event: html\n`);
          res.write(`data: ${JSON.stringify(data)}\n\n`);
          // Set a new timer to send another request after 5 seconds
          setTimeout(sendRequest, 10000);
        });
    };

    // Send the first request and set the headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    });
    
     sendRequest();

     // End the response when the connection is closed
     req.on("close", () => {
       res.end();
     });
  } else {
   // End the response for any other request
   res.end();
 }
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});