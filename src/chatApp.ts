// import socketio from 'socket.io';
// import { App } from './app';
// import chatRoutes from './routes/chatRoutes';


// export class chatApp {
//     private io: socketio.Server;

//     constructor() {
//         super();
//         this.io = new socketio.Server(this.server);
//         this.chatRoutes();
//         this.handleSocketConnections();
//     }

//     private chatRoutes(): void {
//         this.app.use('/api/chat', chatRoutes);
//     }

//     handleSocketConnections(): void {
//         this.io.on('connection', (socket: socketio.Socket) => {
//             console.log('socketio에 연결되었습니다.');

//             socket.on('disconnect', () => {
//                 console.log('socketio와 연결해제 되었습니다.');
//             });

//             socket.on('chat_message', (msg: string) => {
//                 console.log(`메세지: ${msg}`);
//                 this.io.emit('chat_message', msg);  // 모든 클라이언트에세 메세지 전달.
//             });
//         });
//     };
// }