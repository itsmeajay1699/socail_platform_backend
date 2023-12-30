import websocket from "websocket";
import ChatRoom from "../model/schema/chat/ChatRoom.js";
import Messages from "../model/schema/chat/Message.js";

let activeConnections = {};
console.log(activeConnections);
export function setupWebSocketServer(server) {
  const wss = new websocket.server({
    httpServer: server,
    autoAcceptConnections: false,
  });

  wss.on("request", (req) => {
    const connection = req.accept(null, req.origin);

    connection.on("error", (err) => {
      console.log(err, "hello world");
    });

    connection.on("open", () => {
      console.log("WebSocket Connection opened");
    });

    connection.on("close", () => {
      console.log("WebSocket Connection closed");
    });

    // type: "message",
    //     chatRoom: chatRoom,
    //     message: message,
    //     sender: userId,

    connection.on("message", async (message) => {
      try {
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
            // { type: 'message', chatRoom: 1, message: 'hello world', sender: 1 }
            const { chatRoom, message, sender } = data;
            console.log(activeConnections, "activeConnections");

            return;
            const chatRoomToSendMessage = await ChatRoom.findOne({
              where: {
                id: chatRoom,
              },
            });

            if (!chatRoomToSendMessage) {
              return;
            }

            const receiver =
              chatRoomToSendMessage.user_id_1 === sender
                ? chatRoomToSendMessage.user_id_2
                : chatRoomToSendMessage.user_id_1;

            const receiverConnection = activeConnections[receiver];

            const newMessage = await Messages.create({
              chat_room_id: chatRoom,
              sender_id: sender,
              content: message,
            });

            console.log(newMessage, "newMessage");

            if (receiverConnection) {
              receiverConnection.send(
                JSON.stringify({
                  type: "message",
                  chatRoom: chatRoom,
                  message: message,
                  sender: sender,
                  message_id: newMessage.id,
                })
              );
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

export { activeConnections };

// socket.send(
//     JSON.stringify({
//       type: "message",
//       message: message,
//       receiver: receiver,
//       user_id: user_id,
//     })
//   );
