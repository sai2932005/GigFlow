import {useState} from 'react' 
import {useNavigate,Navigate,Link} from 'react-router-dom' ;
import { loginUser } from '../api/auth';
import {useAuth} from '../context/AuthContext' ;
import "./LoginPage.css"




const LoginPage =()=>{
    const {login,user} = useAuth() ;
    const navigate = useNavigate() ;
    const [email,setEmail] = useState('');
    const [password,setPassword]= useState('');
    const [error,setError] = useState('') ;
    const [submitting,setSubmitting] = useState('') ;

    if(user) return <Navigate to="/jobs" replace/>



    const handleLogin =async (e)=>{
        e.preventDefault() ;
        setError("");
        setSubmitting(true) ;
        try{
            const res= await loginUser({email,password});
            login(res.data.user,res.data.token) ;
            console.log("Full login response:", res.data);
            navigate("/jobs" ,{replace:true});

        }catch(err){
            const errMessage = err.response?.data?.message || "Login Failed" ;
            setError(errMessage);
        }finally{
            setSubmitting(false) ;
        }
    }



    return(
        <div className='AuthWrapper'>
        <div className='loginContainer'>
            <h2>Login Page</h2>
            <form className='formEl' onSubmit={handleLogin}>
                <div className="auth-page-field">
                    <label className='auth-page-label'>Email</label>
                    <input value={email} className='auth-page-input' placeholder="Enter Your Email" required onChange={(e)=>setEmail(e.target.value)} />
                </div>

                <div className="auth-page-field">
                    <label className='auth-page-label'>Password</label>
                    <input value={password} placeholder="Enter Your Password" required onChange={(e)=>setPassword(e.target.value)} type="password" className='auth-page-input' />
                </div>

                <br/>
                {error && <p style = {{color:"red"}}>{error}</p>}

                <button className="loginBtn" type="submit" disabled={submitting}>
                    {submitting ? "Logging" : "Login"}
                </button>
                <br/>

                <p className='page-switch-text'>Dont have an account?<Link to="/register" className='page-switch-link'>Register</Link></p>




            </form>





        </div>
    </div>
    )

}


export default LoginPage ;