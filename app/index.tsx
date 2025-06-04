'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLoginMutation } from "./hooks";

export default function HomeModule() {
    const [tableName, setTableName] = useState("")
    const mutation = useLoginMutation();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (tableName.trim()) {
            mutation.mutate({ nomorMeja: tableName });
        }
        else {
            toast.error("Please enter a valid table name.");
        }
    }

    useEffect(() => {
        if (typeof window !== undefined) {
            const session = localStorage.getItem("session_id");
            if (session && session !== undefined && session !== "undefined") {
                router.replace("/menu")
            }
        }
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
            <Image
                src={'https://www.eatingwell.com/thmb/088YHsNmHkUQ7iNGP4375MiAXOY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_7866255_foods-you-should-eat-every-week-to-lose-weight_-04-d58e9c481bce4a29b47295baade4072d.jpg'}
                alt="Restaurant Background"
                className="absolute inset-0 object-cover w-full h-full opacity-10 z-0"
                width={1500}
                height={1000}
            />
            <form onSubmit={handleSubmit} className="flex flex-col items-center bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md relative z-20">
                <label htmlFor="tableName" className="mb-4 text-2xl font-bold text-green-800 dark:text-green-300">Enter Table Name</label>
                <input
                    id="tableName"
                    type="text"
                    value={tableName}
                    onChange={e => setTableName(e.target.value)}
                    className="mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-lg dark:bg-gray-800 dark:text-white"
                    placeholder="e.g. M05"
                    autoFocus
                />
                <Button type="submit" className="w-full">
                    Enjoy Meal!
                </Button>
            </form>
        </div>
    )
}
