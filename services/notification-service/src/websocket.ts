type WsClient = { send: (data: string) => void };

const clients = new Set<WsClient>();

export function addClient(client: WsClient) {
  clients.add(client);
  console.log(`WebSocket client connected. Total: ${clients.size}`);
}

export function removeClient(client: WsClient) {
  clients.delete(client);
  console.log(`WebSocket client disconnected. Total: ${clients.size}`);
}

export function broadcast(data: unknown) {
  const message = JSON.stringify(data);
  for (const client of clients) {
    client.send(message);
  }
  console.log(`Broadcasted to ${clients.size} clients`);
}
