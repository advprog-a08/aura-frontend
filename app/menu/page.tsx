import { Suspense } from "react";
import MenuModule from ".";

export default async function MenuPage() {
  return (
    <Suspense>
      <MenuModule />
    </Suspense>
  )
}