export default async function customFetch(url: string, options: RequestInit = {}, type: "mewing_menu" | "ohio_order" | "sigma_authentication" = "mewing_menu") {

    // Set base URLs for each type
    const baseUrls: Record<"mewing_menu" | "ohio_order" | "sigma_authentication", string> = {
        mewing_menu: process.env.NEXT_PUBLIC_MEWING_MENU || "http://localhost:8080",
        ohio_order: process.env.NEXT_PUBLIC_OHIO_ORDER || "http://localhost:8081",
        sigma_authentication: process.env.NEXT_PUBLIC_SIGMA_AUTHENTICATION || "http://localhost:8082",
    };
    const baseUrl = baseUrls[type];

    const fetchUrl = new URL(url, baseUrl).toString();
    
    try {
        const response = await fetch(fetchUrl, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        // You can customize error handling here if needed
        return {
            success: false,
            data: null
        }
    }
}