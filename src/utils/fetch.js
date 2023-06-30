export const request = async (url, { method, body }, onSuccess, onError) => {
    try {
        const response = await fetch(`/api/${url}`, {
            method,
            body: body ? JSON.stringify(body) : null,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.localStorage.getItem('token') }`,
            }
        });
        if(response.ok) {
                const data = await response.json();
                onSuccess(data);
        } else {
            onError(response);
        }
    } catch(error) {
        onError(error);
    }
}