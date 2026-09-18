import {useState,useEffect} from 'react'
import {Link} from 'react-router-dom' 
import { getMyJobs } from '../api/job'
import "./MyJobsPage.css"


const MyJobsPage = ()=>{

    const [jobs,setJobs] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    useEffect(()=>{
        const fetchJobs = async()=>{
            setLoading(true);
            try{
                const res =await  getMyJobs();
                setJobs(res.data);


            }catch(err){
                setError("Failed to load jobs");
            }finally{
                setLoading(false);
               
            
        }
        }

        fetchJobs();

    },[]) ;

      if (loading) return <p className="my-jobs-empty">Loading...</p>;
  if (error) return <p className="my-jobs-empty">{error}</p>;


  return(
    <div className="my-jobs-container">
        <h2 className="my-jobs-title">My Posted Jobs</h2>

        {jobs.length === 0 ?( <p className="my-jobs-empty">You havent posted any jobs yet...</p>):(

            jobs.map((job)=>(
                <Link to={`/jobs/${job._id}`} className="my-jobs-card">
                    <div className="my-jobs-card-header">
                        <span className="my-jobs-job-title">{job.title}</span>
                        <span className={`my-jobs-badge my-jobs-badge-${job.status}`}>{job.status}</span>
                    </div>
                    <p className="my-jobs-meta">
                        Budget: ₹{job.budget}
                        {job.assignedTo && ` · Assigned to ${job.assignedTo.name}`}
                    </p>
                            
                
                
                
                </Link>
            ))






        )
        
    
    
    
    
    
    }





    </div>
  )


}


export default MyJobsPage ;