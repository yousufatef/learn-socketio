import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3003, {
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;


    handleConnection(client: Socket, ...args: any[]) {
        console.log('Client connected:', client.id);

        client.broadcast.emit("Welcome", "Welcome message")

    }
    handleDisconnect(client: Socket, reason?: string) {
        console.log('Client disconnected:', client.id, reason);

        this.server.emit("Goodbye", "Goodbye message")
    }

    @SubscribeMessage('newMessage')
    handleNewMessage(client: Socket, message: any) {
        console.log(message);

        // 1. Send only to the client that sent the message
        client.emit('reply', "This is a reply to sender");

        // 2. Broadcast to ALL connected clients (including sender)
        this.server.emit('reply', "Broadcasting to everyone...");

    }
}

