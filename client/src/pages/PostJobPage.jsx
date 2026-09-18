import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../api/job";
import { useAuth } from "../context/AuthContext"; 
import './PostJobPage.css'

const PostJobPage = ()=>{

    const [title,setTitle] = useState('');
    const [budget,setBudget] = useState('');
    const [message,setMessage] = useState('');
    const [error,setError] = useState('');
    const [submit,setSubmitting] = useState('');

    const navigate = useNavigate();
    const {user} = useAuth();

    if(user?.role === "freelancer") return <p className="post-job-denied">Only Clients has access</p>
 
    const handleSubmit= async(e)=>{
        e.preventDefault();
        setSubmitting(true) ;
        setError('');

        try{
            const res= await createJob({title,description:message,budget:Number(budget)});
            navigate(`/jobs/${res.data.job._id}`)
        }catch(err){
            setError(err.response.data.message || "Failed to Post a job")
        }
        finally{
            setSubmitting(false) ;
        }

    }



    return(
        <div className="post-job-container">
        <div  className="post-job-card">
            <h2 className="post-job-title">Post A Job</h2>
            <form onSubmit={handleSubmit}>
                <div className="post-job-field">
                <label className="post-job-label">Title</label>
                <input className="post-job-input" value={title} onChange={(e)=>setTitle(e.target.value)}/>
                </div>

                <div className="post-job-field">
                    <label className="post-job-label">Message</label>
                    <textarea  className="post-job-textarea" value={message} onChange={(e)=>setMessage(e.target.value)} required/>

                </div>

                <div className="post-job-field">
                    <label className="post-job-label">Budget</label>
                    <input className="post-job-input" type="number" value={budget} onChange={(e)=>setBudget(e.target.value)} required/>
                </div>
                {error && <p className="post-job-error">{error}</p>}
                <button className="post-job-submit-btn" type="submit" disabled={submit}>{submit ? "Posting" : "Post Job"}</button>

            </form>
        </div>
    </div>
    )
}


export default PostJobPage