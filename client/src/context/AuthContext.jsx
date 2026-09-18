import {createContext, useContext, useState , useEffect} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    useEffect(()=>{
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if(storedToken && storedUser){
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
           
        }
        setLoading(false);
        
    },[])

    const login = (userData,jwt)=>{
        setUser(userData);
        setToken(jwt);
        console.log("login() called with:", userData, jwt);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', jwt);
    }

    const updateUser =(userData)=>{
        setUser(userData) ;
        localStorage.setItem('user',JSON.stringify(userData));
    }


    const logout = ()=>{
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    return (
        <AuthContext.Provider value={{user, token, login, logout,loading,updateUser}}>
            {children}
        </AuthContext.Provider>
    )

}



export const useAuth = ()=> useContext(AuthContext);
