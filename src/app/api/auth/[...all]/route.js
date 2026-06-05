// Mock Auth API route handler to completely isolate server from database connections
export async function GET(request) {
  return new Response(JSON.stringify({ message: "Auth API is mocked" }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

export async function POST(request) {
  return new Response(JSON.stringify({ message: "Auth API is mocked" }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}