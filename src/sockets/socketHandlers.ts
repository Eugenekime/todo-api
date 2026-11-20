import type { Server, Socket } from 'socket.io';
import {
  addUser,
  removeUser,
  getUsers,
  getUserWorkspaces,
} from './presence.js';

export const WORKSPACE = 'workspace:default';
const getRoomName = (workspace: string) => `workspace:${workspace}`;

const emitPresence = (io: Server, workspace: string) => {
  const users = getUsers(workspace);

  io.to(getRoomName(workspace)).emit('presence:update', {
    workspace,
    online: users.length,
    users,
  });
};

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`Connected: ${socket.id}`);

    socket.on(
      'workspace:join',
      ({ workspace, username }: { workspace: string; username: string }) => {
        const room = getRoomName(workspace);

        socket.join(room);

        addUser(workspace, socket.id, username);

        emitPresence(io, workspace);

        console.log(`${username} joined ${room}`);
      }
    );

    socket.on('workspace:leave', ({ workspace }: { workspace: string }) => {
      const room = getRoomName(workspace);

      removeUser(workspace, socket.id);

      socket.leave(room);

      emitPresence(io, workspace);

      console.log(`${socket.id} left ${room}`);
    });

    socket.on('disconnect', () => {
      const workspaces = getUserWorkspaces(socket.id);

      for (const workspace of workspaces) {
        removeUser(workspace, socket.id);

        emitPresence(io, workspace);
      }

      console.log('Disconnected:', socket.id);
    });
  });
};
