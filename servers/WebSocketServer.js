const WebSocket = require('ws');

class WebSocketServer {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = new Map(); // Используем Map для хранения клиентов по их IP-адресу

        this.wss.on('connection', this.handleConnection.bind(this));
    }

    handleConnection(ws, req) {
        const ip = req.socket.remoteAddress; // Получаем IP-адрес клиента
        console.log(`Client joined with IP: ${ip}`);

        this.clients.set(ip, ws);

        ws.on('message', this.handleMessage.bind(this));
        ws.on('close', () => this.handleClose(ip));
        ws.on('error', this.handleError.bind(this));
    }

    handleMessage(message) {
        if (typeof message === "string") {
            console.log("String received from client -> '" + message + "'");
        } else {
            console.log("Binary received from client -> " + Array.from(message).join(", "));
        }
    }

    handleClose(ip) {
        console.log(`Client with IP ${ip} left.`);
        this.clients.delete(ip);
    }

    handleError(error) {
        console.error("WebSocket error:", error);
    }

    broadcast(data) {
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }

    sendToClientByIp(ip, data) {
        const client = this.clients.get(ip);
        if (client && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        } else {
            console.log(`Client with IP ${ip} not found or connection is closed.`);
        }
    }
}

module.exports = WebSocketServer;
