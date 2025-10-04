import { initSocketIO } from "@/lib/socket";

let io;

export async function GET() {
  return new Response(JSON.stringify({ message: "Socket.IO is running" }), {
    status: 200,
  });
}

export async function POST(request) {
  // This is for initializing socket with server
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
}

// Socket.IO server initialization
export function registerSocket(server) {
  io = initSocketIO(server);
  return io;
}