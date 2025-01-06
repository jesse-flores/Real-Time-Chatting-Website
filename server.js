const WebSocket = require('ws');
const fs = require('fs');

const filePath = 'messages.json';
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
}

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('A new client connected');

    ws.on('message', (message) => {
        console.log('Received message: ', message);

        //Display message for all clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });

        storeMessage(message);
    });

    ws.on('close', () => {
        console.log('A client disconnected');
        // Uncomment if you want to broadcast a "user disconnected" message
        // wss.clients.forEach((client) => {
        //     if (client !== ws && client.readyState === WebSocket.OPEN) {
        //         client.send("A user disconnected");
        //     }
        // });
    });
});

//Message
const storeMessage = (message) => {
    try {
        const messages = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        messages.push(message);
        fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
    } catch (error) {
        console.error('Error storing message:', error);
    }
};

console.log('WebSocket server is running on ws://localhost:8080');