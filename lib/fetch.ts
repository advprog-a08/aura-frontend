export default async function customFetch(url: string, options: RequestInit = {}) {
    const baseUrl = "https://api.rizzserve.site/v1";
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
        throw new Error(`Fetch failed: ${(error as Error).message}`);
    }
}