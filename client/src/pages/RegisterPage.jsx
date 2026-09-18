import { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";
import { registerUser } from "../api/auth";
import { useAuth } from "../context/AuthContext"; 

import "./LoginPage.css"

const RegisterPage = ()=>{
    const {login} = useAuth() ;
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [role,setRole] = useState('freelancer') ;
    const [error,setError] = useState('');
    const [submitting,setSubmitting] = useState('');

    const navigate = useNavigate() ;

    const handleRegister = async(e)=>{
        e.preventDefault();
        setSubmitting(true);
        setError('')

        try{
            const res = await registerUser({name,email,password,role}) ;
            login(res.data.user,res.data.token) ;
            navigate('/jobs');

        }catch(err){
            const message = err.response?.data?.message || "Registration Failed"
            setError(message) ;
        }finally{
            setSubmitting(true) ;
        }
        



    }

    return(
        <div className="AuthWrapper">
        <div className="loginContainer">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div className="auth-page-field">
                    <label className="auth-page-label">Name</label>
                    <input  className="auth-page-input" value={name} placeholder="Enter Name" onChange={(e)=>setName(e.target.value)} required/>
                </div>


                <div className="auth-page-field">
                    <label className="auth-page-label">Email</label>
                    <input className="auth-page-input" type="email" value={email} placeholder="Enter Email" onChange={(e)=> setEmail(e.target.value)} required/>
                </div>


                <div className="auth-page-field">
                    <label className="auth-page-label">Password</label>
                    <input className="auth-page-input"  type="password" value={password} placeholder="Enter Password" onChange={(e)=> setPassword(e.target.value)} required/>
                </div>


                <div className="auth-page-field">
                    <label className="auth-page-label">Iam :</label>
                    <select className="auth-page-select" value={role} onChange={(e)=> setRole(e.target.value)}>
                        <option value="client">Client</option>
                        <option value="freelancer">FreeLancer</option>

                    </select>
                </div>

                {error && <p style={{color:"red"}}>{error}</p>}
                <button type="submit" disabled={submitting} className="loginBtn">
                    {submitting ? "Registering" : "Register"}
                </button>
                <p className="page-switch-text">Already have an account?<Link to='/login' className="page-switch-link">Login</Link></p>



            </form>




        </div>
    </div>
    )


}


export default RegisterPage ;