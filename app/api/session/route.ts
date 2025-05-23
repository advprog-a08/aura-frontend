import { cookies } from "next/headers";

export async function POST(req: Request) {
    const body = await req.json();

    const { tableId } = body;
    
    const cookieStore = await cookies();

    // FETCH COOKIES FROM SIGMA
    const token = tableId;

    // Set cookie
    cookieStore.set("tableId", token)

    return new Response(JSON.stringify({ success: true, message: "Table ID set successfully" }));
}