"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAdminRegisterMutation } from "../../hooks";
import Link from "next/link";
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().max(255, { message: "Name must be at most 255 characters" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(passwordRegex, { message: "Password must contain uppercase, lowercase, number, and special character" }),
});

type RegisterForm = z.infer<typeof schema>;

export default function AdminRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", name: "", password: "" },
  });

  const mutation = useAdminRegisterMutation();

  async function onSubmit(data: RegisterForm) {
    setError(null);
    try {
      await mutation.mutateAsync(data);
    } catch (e: any) {
      setError(e.message || "Registration failed");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Admin Register</h2>
        {error && <div className="text-red-600 text-center">{error}</div>}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="admin@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Register</Button>
      </form>
      <Link href="/admin/auth/login" className="text-sm text-blue-500 hover:text-blue-700">Already have an account? Login</Link>
    </Form>
  );
}
