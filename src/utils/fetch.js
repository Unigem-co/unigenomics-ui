export const request = async (url, { method, body }, onSuccess, onError) => {
    try {
        const response = await fetch(`/api/${url}`, {
            method,
            body: body ? JSON.stringify(body) : null,
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
        onSuccess(data);
    } catch(error) {
        onError(error);
    }
}