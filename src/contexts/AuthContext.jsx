import React from 'react';
import Cookies from 'js-cookie';
export const AuthContext=React.createContext(null);

const AuthContextProvider=(props)=>{
const[userRole,setUserRole]=React.useState()
const[loginStatus,setLoginStatus]=React.useState(Cookies.get('jwtToken') || false)
// const[jwtToken,setjwtToken]=React.useState()
const updateRole=(userRole)=>{
    setUserRole(userRole)
}
const updateStatus=(loginStatus)=>{
    setLoginStatus(loginStatus)
}

const checkUserToken = () => {
    const userToken = Cookies.get('jwtToken');
    if (!userToken || userToken === 'undefined') {
        setLoginStatus(false);
    }
    setLoginStatus(true);
}
// const doRefreshToken=()
React.useEffect(() => {
    checkUserToken();
    console.log("Hello")
}, [loginStatus]);


    const contextValue={userRole,updateRole,loginStatus,updateStatus};

    return<AuthContext.Provider value={contextValue}>
        {props.children}
    </AuthContext.Provider>
}

export default AuthContextProvider