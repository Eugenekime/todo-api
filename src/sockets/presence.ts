const presence = new Map<string, Map<string, string>>();

export const addUser = (
  workspace: string,
  socketId: string,
  username: string
) => {
  if (!presence.has(workspace)) {
    presence.set(workspace, new Map());
  }

  presence.get(workspace)!.set(socketId, username);
};
export const removeUser = (workspace: string, socketId: string) => {
  const users = presence.get(workspace);

  if (!users) return;

  users.delete(socketId);

  if (users.size === 0) {
    presence.delete(workspace);
  }
};
export const getUsers = (workspace: string): string[] => {
  const users = presence.get(workspace);

  if (!users) return [];

  return Array.from(users.values());
};
export const getUserWorkspaces = (socketId: string): string[] => {
  const workspaces: string[] = [];

  for (const [workspace, users] of presence) {
    if (users.has(socketId)) {
      workspaces.push(workspace);
    }
  }

  return workspaces;
};
