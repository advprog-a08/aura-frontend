import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";

type Admin = {
  name: string;
  email: string;
};

export function useAdminRegisterMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { email: string; name: string; password: string }) => {
      const res = await fetch(process.env.NEXT_PUBLIC_SIGMA_AUTHENTICATION + "/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }

      return res.json();
    },
    onSuccess: (data) => {
      router.push("/admin/auth/login");
    },
  });
}

export function useLoginMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch(process.env.NEXT_PUBLIC_SIGMA_AUTHENTICATION + "/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }

      return res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      router.push("/admin/dashboard");
    },
  });
}

export function useAdminQuery() {
  const router = useRouter();
  return useQuery<Admin, Error>({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const token = localStorage?.getItem('token');

      const res = await fetch(process.env.NEXT_PUBLIC_SIGMA_AUTHENTICATION + "/admin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.status >= 400) {
        router.replace("/admin/auth/login");
        throw new Error("Unauthorized");
      }

      if (!res.ok) throw new Error("Failed to fetch admin data");

      return res.json();
    },
  });
}

export function useUpdateAdminMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (newName: string) => {
      const token = localStorage?.getItem('token');
      const res = await fetch(process.env.NEXT_PUBLIC_SIGMA_AUTHENTICATION + "/admin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ new_name: newName }),
      });

      if (res.status === 401) {
        router.replace("/admin/auth/login");
        throw new Error("Unauthorized");
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update profile");
      }

      return res.json();
    },
  });
}
