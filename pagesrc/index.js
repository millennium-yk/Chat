import "./style.css"
import logger from "./logger";
import util from "./util";
import Reader from "./reader"
import Writer from "./writer"

((e, j, t) => {
    class WebSocketConnection {
        static init() {
            this.protocol = process.env.protocol ? process.env.protocol : "ws://",
            this.address = process.env.address ? process.env.address : "127.0.0.1",
            this.port = process.env.port ? process.env.port : 3000,
            this.connected = !1,
            this.connect()
        };
        static connect() {
            this.ws = new WebSocket(`${this.protocol}${this.address}:${this.port}`),
            this.ws.binaryType = "arraybuffer",
            this.ws.onopen = () => {
                this.onOpen()
            },
            this.ws.onmessage = (msg) => {
                this.onMessage(msg)
            },
            this.ws.onerror = () => {
                this.onError()
            },
            this.ws.onclose = () => {
                this.onClose()
            },
            logger.log("Connecting to server.")
        };
        static onOpen() {
            logger.log("Connected to server.");
            this.connected = !0;
            let name = util.get("nick") ? window.unescape(window.encodeURIComponent(util.get("nick"))) : "Unnamed";
            let data = new Writer(2 + name.length);
            data.writeUint8(0);
            data.writeString(name);
            this.send(data.dataView.buffer);
        };
        static onMessage(msg) {
            const buffer = new Reader(new DataView(msg.data));
            switch (buffer.readUInt8()) {
                case 0:
                    let content = decodeURIComponent(escape(buffer.readUTF8string()));
                    App.chatbox.value += "\n" + `[${util.getTime()}] ${content}`;
                    App.chatbox.scrollTop = App.chatbox.scrollHeight;
                    logger.log(`[Chat] ${content}`);
                    break;
                case 1:
                    App.chatbox.value += "\n" + "Server is full!";
                    break;
                case 2:
                    App.chatbox.value += "\n" + "You've been kicked!";
                    break;
                default:
                    break;
            };
        };
        static onError = () => {
            logger.error("Error occured!");
        };
        static onClose = () => {
            logger.log("Disconnected.");
            App.chatbox.value += "\n" + "Disconnected!";
            this.connected = !1;
        };
        static send(msg) {
            (this.ws && this.ws.readyState === WebSocket.OPEN) && this.ws.send(msg);
        };
    };
    class App {
        static init() {
            this.chatbox = t.getElementById("chatbox"),
            this.nick = t.getElementById("nick"),
            this.newNick = t.getElementById("newNick"),
            this.nickBtn = t.getElementById("submitNick"),
            this.nickVal = this.nick.value || util.get("nick") || "Unnamed",
            this.text = t.getElementById("text"),
            this.checkNick(),
            this.addEvents()
        };
        static checkNick() {
            util.get("nick") ? ($("#main").show(), $("#noNick").hide()) : ($("#main").hide(), $("#noNick").show());
        };
        static addEvents() {
            this.nick.value = util.get("nick");
            this.nick.addEventListener("change", () => {
                util.set("nick", this.nick.value);
                this.nickChange();
            });
            this.nickBtn.addEventListener("click", () => {
                util.set("nick", this.newNick.value);
                this.checkNick();
                this.nick.value = this.newNick.value;
                this.nickChange();
            });
            this.text.addEventListener("keypress", e => {
                event.keyCode === 13 && (e.preventDefault(), this.text.value != "" && this.chat());
            });
        };
        static chat() {
            let client = window.unescape(window.encodeURIComponent(this.nick.value));
            let content = window.unescape(window.encodeURIComponent(this.text.value));
            let data = new Writer(3 + client.length + content.length);
            data.writeUint8(1);
            data.writeString(client);
            data.writeString(content);
            WebSocketConnection.send(data.dataView.buffer);
            this.text.value = "";
        };
        static nickChange() {
            let oldNick = window.unescape(window.encodeURIComponent(this.nickVal)) || "Unnamed";
            let newNick = window.unescape(window.encodeURIComponent(this.nick.value)) || "Unnamed";
            let data = new Writer(3 + oldNick.length + newNick.length);
            data.writeUint8(2);
            data.writeString(oldNick);
            data.writeString(newNick);
            WebSocketConnection.send(data.dataView.buffer);
            this.nickVal = this.nick.value;
        };
    };
    e.onload = () => {
        WebSocketConnection.init();
        App.init();
        logger.log("Loading...")
    };
    e.WebSocketConnection = WebSocketConnection;
    e.App = App;
})(window, window.jquery, document);