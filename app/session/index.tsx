'use client';

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AskTableModule() {
    const [tableId, setTableId] = useState("");
    const router = useRouter();

    const handleSubmit = async () => {
        const response = await fetch("/api/session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tableId }),
        });

        const data = await response.json();
        if (data.success) {
            router.push("/menu");
        }
        else {
            alert("Error setting table ID");
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-green-50">
            <Card className="w-96 p-6 shadow-lg">
                <CardTitle>
                    Fill your table ID
                </CardTitle>
                <div className="flex flex-col gap-4">
                    <div className="w-full mt-4">
                        <Input
                            placeholder="Table ID"
                            className="w-full"
                            value={tableId}
                            onChange={(e) => setTableId(e.target.value)}
                        />
                    </div>
                    <Button className="w-full" onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
            </Card>
        </div>
    )
}