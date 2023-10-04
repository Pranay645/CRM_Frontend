import React from 'react'
import { AuthContext } from './../contexts/AuthContext'
import {Outlet,Navigate} from 'react-router-dom'

const PrivateRoute = () => {
    const{loginStatus}=React.useContext(AuthContext);
 
    return loginStatus ? <Outlet/>  : <Navigate to="/"/>
  
}

export default PrivateRoute
