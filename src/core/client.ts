// api-client.ts

interface ServerResponse {
    status: string;
    message: string;
}

interface SendObjectOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    route?: string;
    serverUrl?: string;
}

/**
 * Sends an object to the bash server
 * @param obj - The object to send to the server
 * @param options - Configuration options for the request
 * @returns Promise with server response
 */
export async function sendObjectToServer<T = any>(
    obj: T,
    options: SendObjectOptions = {}
): Promise<ServerResponse> {
    const {
        method = 'POST',
        route = '/',
        serverUrl = 'http://192.168.1.87:8080'
    } = options;

    const url = `${serverUrl}${route}`;

    try {
        console.log(`Sending ${method} request to ${url}:`, obj);

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: method !== 'GET' ? JSON.stringify(obj) : undefined,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ServerResponse = await response.json();
        console.log('Server response:', result);

        return result;
    } catch (error) {
        console.error('Error sending object to server:', error);
        throw error;
    }
}