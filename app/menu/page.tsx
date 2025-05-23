import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MenuModule from ".";

export default async function MenuPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("tableId")?.value;

  if (!token) { 
    redirect("/session");
  }

  return <MenuModule token={token} />
}