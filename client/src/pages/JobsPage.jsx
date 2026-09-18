import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import  {getJobs}  from "../api/job";
import { useAuth } from "../context/AuthContext";
import './JobsPage.css'

const JobsPage =()=>{
    const [jobs,setJobs] = useState([]) ;
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("") ;
    const [searchTerm,setSearchTerm] = useState("") ;
    const {user} = useAuth();

    useEffect(()=>{
        const fetchJobs = async()=>{
            try{
                const res = await getJobs();
                
                setJobs(res.data.jobs) ;

            }catch(err){
                setError("Failed to load jobs.")
            }finally{
                setLoading(false) ;
            }
        }

        fetchJobs();
    },[]);
    if(loading) return <p className="jobs-page-empty">Loading Jobs....</p>
    if(error) return <p className="jobs-page-empty">{error}</p>


    const filteredJobs = jobs.filter((job)=> job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                job.description.toLowerCase().includes(searchTerm.toLocaleLowerCase())) ;









    return(
        <div className="jobs-page-container">
            <div className="jobs-page-header">
                <h2 className="jobs-page-title">Open Jobs</h2>
                {user.role==="client" && <Link to="/post-job" className="jobs-page-post-link">Post a job</Link>}
            </div>
            <input type="text" className="jobs-page-search" placeholder="Search jobs by title or description..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
            
            {jobs.length === 0 && <p className="jobs-page-empty">No Open jobs currently</p>}

            {filteredJobs.length === 0 ? (<p className="jobs-page-empty">{jobs.length === 0 ? "No open jobs right now." : "No jobs match your search."}</p> ):(

            <div className="jobs-page-grid"> 
                {filteredJobs.map((job)=>{
                    return(
                         <div className="jobs-page-card" key={job._id} > 
                        <Link to={`/jobs/${job._id}`} className="jobs-page-card-title">{job.title}</Link>
                        <p className="jobs-page-card-description">{job.description}</p>
                        <div className="jobs-page-card-footer">
                        <p className="jobs-page-card-budget">₹{job.budget}</p>
                        <p className="jobs-page-card-client"> by : {job.client?.name}</p>
                        </div>



                    </div> 
                    )
                })}
                </div>  )}
            
           



        </div>
        
    )
}

export default JobsPage