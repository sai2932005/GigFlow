import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../api/applications";
import "./MyApplicationsPage.css";

const MyApplicationsPage =()=>{


    const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


    useEffect(()=>{
        
            const fetchMyApplications = async()=>{
                try{
                const res = await getMyApplications();
                
                setApplications(res.data);

            }
        catch(err){
            console.log(err)
            setError("Failed to Load Applications")
        }finally{
            setLoading(false)
        }
    }

        fetchMyApplications();
    },[])


    if (loading) return <p className="my-apps-empty">Loading...</p>;
  if (error){
    
     

    return <p className="my-apps-empty">{error}</p>;
    }

    return(
        <div  className="my-apps-container">
            <h2 className="my-apps-title">My Applications</h2>

            {applications.length === 0 ? (<p className="my-apps-empty">You haven't applied to any jobs yet</p>) :
            (
                applications.map((app)=>(
                    <Link to={`/jobs/${app.job._id}`} key={app._id} className="my-apps-card">
                        <div className="my-apps-card-header">
                             <span className="my-apps-job-title">{app.job.title}</span>
                            <span className={`my-apps-badge my-apps-badge-${app.status}`}>{app.status}</span>
                        </div>
                        <p className="my-apps-meta">Job status: {app.job.status} · Budget: ₹{app.job.budget}</p>
                        
                    
                    
                    </Link>
                ))
            )}



        </div>
    );
}


export default MyApplicationsPage ;