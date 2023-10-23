import io from "socket.io-client";

const sockets = {};
let callbacks = {};

class SocketIOHelper {
  socket = null;
  socketUrl = null;
  hub = null;

  constructor(url, publicRoomKey, hub = "/files") {
    this.hub = hub;

    if (!callbacks[hub]) {
      callbacks[hub] = [];
    }

    if (!url) return;

    this.socketUrl = url;
    this.socket = sockets[hub];

    if (this.socket) return;

    const origin = window.location.origin;

    const config = {
      withCredentials: true,
      transports: ["websocket", "polling"],
      eio: 4,
      path: url + hub,
    };

    if (publicRoomKey) {
      config.query = {
        share: publicRoomKey,
      };
    }

    sockets[hub] = io(origin, config);
    this.socket = sockets[hub];

    this.socket.on("connect", () => {
      console.log("socket is connected");
      if (callbacks[this.hub]?.length > 0) {
        callbacks[this.hub].forEach(({ eventName, callback }) =>
          this.socket.on(eventName, callback)
        );
        callbacks[this.hub] = [];
      }
    });
    this.socket.on("connect_error", (err) =>
      console.log("socket connect error", err)
    );
    this.socket.on("disconnect", () => console.log("socket is disconnected"));
  }

  get isEnabled() {
    return this.socketUrl !== null;
  }

  emit = ({ command, data, room = null }) => {
    if (!this.isEnabled) return;

    if (!this.socket.connected) {
      this.socket.on("connect", () => {
        if (room !== null) {
          this.socket.to(room).emit(command, data);
        } else {
          this.socket.emit(command, data);
        }
      });
    } else {
      room
        ? this.socket.to(room).emit(command, data)
        : this.socket.emit(command, data);
    }
  };

  on = (eventName, callback) => {
    if (!this.isEnabled) {
      callbacks[this.hub].push({ eventName, callback });
      return;
    }

    if (!this.socket.connected) {
      this.socket.on("connect", () => {
        this.socket.on(eventName, callback);
      });
    } else {
      this.socket.on(eventName, callback);
    }
  };
}

export default SocketIOHelper;
