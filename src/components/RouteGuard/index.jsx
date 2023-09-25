import React from 'react'
import { isJwtExpired, parseJwt } from '../../utils/jwt';
import { Navigate, Outlet } from 'react-router-dom';

const RouteGuard = ({outlet}) => {
    const token = window.localStorage.getItem('token') || '';
    console.log(token);
    const isValidJwt = !isJwtExpired(token); 
    const user = parseJwt(token);
    if (!isValidJwt) {
        window.localStorage.removeItem('jwt');
        return <Navigate to='/login' replace />;
	}

    const isAdmin = user?.role === 'admin';

    if (!isAdmin) {
		return <Navigate to='/user-report' replace />;
	}

    return outlet ? outlet : <Outlet />;
}

export default RouteGuard;