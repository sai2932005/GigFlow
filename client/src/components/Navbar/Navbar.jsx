import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import "./Navbar.css"

const Navbar =()=>{

    const [menuOpen,setmenuOpen] = useState(false) ;

    const{logout,user} = useAuth();
    const Navigate = useNavigate();

    const handleLogout = ()=>{
        logout() ;
        Navigate("/login",{replace:true});
    }

    return(
        <nav className="navbar-container">
            <Link to= {user ? "/login" :"/jobs"} className="navbar-logo">GigFlow</Link>
            <button onClick={() =>setmenuOpen(!menuOpen)} className='ToggleBtn'>☰</button> 
            <div className={`navbar-links ${menuOpen?"open":""}`}>

                
               
                
                    <Link to="/jobs" className="navbar-link" onClick={()=>setmenuOpen(false)}>Jobs</Link>
                    {user?.role==="client" && <Link to="/post-job" className="navbar-link" onClick={()=>setmenuOpen(false)}>Post a Job</Link>}
                    {user?.role === "freelancer" && <Link to="/my-applications" className="navbar-link">My Applications</Link>}
                    {user?.role === "client" && <Link to="/my-jobs" className="navbar-link">My Jobs</Link>}
                    <Link to="/profile" className="navbar-link" onClick={()=>setmenuOpen(false)}>Profile</Link>
                    
                    <button className="navbar-logout-btn" onClick={handleLogout} >Logout</button>

                
                
            </div>




        </nav>
    )


}


export default Navbar