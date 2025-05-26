import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLoginMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { nomorMeja: string }) => {
      const resMeja = await fetch(process.env.NEXT_PUBLIC_OHIO_ORDER + "/api/v1/meja/nomor/" + data.nomorMeja, {
        method: "GET",
      });

      if (!resMeja.ok) {
        const err = await resMeja.json();
        throw new Error(err.message || "Login failed");
      }

      const mejaId = await resMeja.json().then(r => r.id);

      const res = await fetch(process.env.NEXT_PUBLIC_OHIO_ORDER + "/api/v1/meja/" + mejaId + "/session", {
        method: "POST",
      });

      return res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("session_id", data.sessionId);
      router.push("/menu");
    },
  });
}
