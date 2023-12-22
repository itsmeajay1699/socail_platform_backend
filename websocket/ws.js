import websocket from "websocket";

let activeConnections = {};
console.log(activeConnections);
export function setupWebSocketServer(server) {
  const wss = new websocket.server({
    httpServer: server,
  });

  wss.on("request", (req) => {
    const connection = req.accept(null, req.origin);

    connection.on("error", (err) => {
      console.log(err,"hello world");
    });

    connection.on("open", () => {
      console.log("WebSocket Connection opened");
    });

    connection.on("close", () => {
      console.log("WebSocket Connection closed");
    });

    connection.on("message", (message) => {
      try {
        console.log("message", message);
        if (message.type === "utf8") {
          const data = JSON.parse(message.utf8Data);
          if (data.type === "connect") {
            activeConnections = {
              ...activeConnections,
              [data.user_id]: connection,
            };
          }
          if (data.type === "closed") {
            delete activeConnections[data.user_id];
          }
          if (data.type === "message") {
            const receiver = activeConnections[data.receiver];
            if (receiver) {
              receiver.send(JSON.stringify(data));
            }
          } else {
            const receiver = activeConnections[data.receiver];
            if (receiver) {
              receiver.send(JSON.stringify(data));
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    });
  });
}

// socket.send(
//     JSON.stringify({
//       type: "message",
//       message: message,
//       receiver: receiver,
//       user_id: user_id,
//     })
//   );
