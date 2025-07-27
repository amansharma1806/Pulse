import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { JSX } from 'react/jsx-runtime';
interface PublicRouteProps{
    children:JSX.Element
}
const PublicRoute :React.FC<PublicRouteProps>=({children})=>{
const token=useSelector((state:any)=>state.jwt)
if(token){
    const user:any = jwtDecode(token);
    // console.log(user?.role?.toLowerCase());
    
    return<Navigate to={`/${user?.role?.toLowerCase()}/dashboard`} />
    
}
return children;
}

export default PublicRoute;