import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AskTableModule from ".";

export default async function SessionPage() {
    const cookieStore = await cookies();
    const tableId = cookieStore.get("tableId")?.value;

    if (tableId) {
        // Redirect to menu page if tableId is already set
        return redirect("/menu");
    }

    return <AskTableModule />
}