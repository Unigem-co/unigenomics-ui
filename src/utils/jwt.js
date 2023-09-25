export function parseJwt(token) {
    if(!token){
        return null;
    };
    var base64Url = token?.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

export function isJwtExpired(token) {
    const parsedJwt = parseJwt(token);

    if(parsedJwt) {
        if (parsedJwt.role === 'admin') {
            return false;
        } else if (!parsedJwt.exp){
            return true;
        }
    }
    return parsedJwt.exp * 1000 < Date.now();
};