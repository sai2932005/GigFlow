import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import  {getJobById}  from "../api/job";
import { applyToJob, getApplicationsForJob, acceptApplication } from "../api/applications";
import { useAuth } from "../context/AuthContext";
import "./JobDetailPage.css" 


const JobDetailPage = ()=>{

    const {id} = useParams();
    const {user} = useAuth() ;

    const [job,setJobs] = useState(null);
    const [applications , setApplications]  = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");

    const [message,setMessage]=  useState('');
    const [applySubmitting,setApplySubmitting] = useState(false);
    const [applyError,setApplyError] = useState('');
    const [applySuccess,setsApplySuccess] = useState(false);

    const isOwner = job && user && job.client._id === user.id ;

    const isFreelancer = user.role ==="freelancer" ;
    console.log(localStorage.getItem("token1")) ;

    useEffect(()=>{
        const fetchJobs = async()=>{
            try{
                const res =await getJobById(id) ;
                setJobs(res.data);
                console.log(res.data);
            }
            catch(err){
                setError("Failed to load Job")
            }
            finally{
                setLoading(false);
            } 
        }
        fetchJobs();
    },[id])

    useEffect(()=>{
        const fetchApplications  = async()=>{
            if(!job || !isOwner){
                return;
            }
            try{
                const res= await getApplicationsForJob(job._id);
                setApplications(res.data) ;

            }catch(err){
                console.log(err);
                setError(err) ;
            }
            
        }
    fetchApplications();

    },[job,isOwner]);

    const handleApply = async(e)=>{
        e.preventDefault();
        setApplySubmitting(true);
        setApplyError("");
        try{
            await applyToJob(job._id,{message}) ;
            setsApplySuccess(true) ;

        }catch(err){
            setApplyError(err.response?.data?.message|| "failed to Apply")
        }finally{
            setApplySubmitting(false);
        }
    }


    const handleAccept = async(applicationId)=>{
        try{
            await acceptApplication(applicationId) ;
            const res = await getApplicationsForJob(id);
            setApplications(res.data);
            const res2 = await getJobById(id);
            setJobs(res2.data) ;
        }
        catch(err){
            console.error(err) ;
        }
        finally{
            console.log(applications)
        }
    }

    if (loading) return <p className="job-detail-container">Loading job...</p>;
  if (error) return <p className="job-detail-container">{error}</p>;
  if (!job) return <p className="job-detail-container">Job not found.</p>;


    return(
        <div className="job-detail-container">
            <div className="job-detail-info-card">
            <div className="job-detail-header">
                <h2 className="job-detail-title">{job.title}</h2>
                <p className={`job-detail-status job-detail-status${job.status}`}>Status : {job.status}</p>
                
            </div>
            
            <p className="job-detail-meta">Posted By: {job.client.name}</p>
            <p className="job-detail-description">{job.description}</p>
            <p className="job-detail-budget">Budget : {job.budget}</p>
        </div>

                    {(job.status === "assigned" || job.status ==="completed") && (
            <div className="job-detail-contact-box">
                {isOwner && job.assignedTo && (
                <p className="job-detail-contact-text">
                    <strong>Contact freelancer : </strong> {job.assignedTo.email}
                </p>
                )}
                {!isOwner && isFreelancer && (
                <p className="job-detail-contact-text">
                    <strong>Contact client : </strong> {job.client.email}
                </p>
                )}
            </div>
            )}

            {isFreelancer && job.status=== "open" && !applySuccess &&(
                <form onSubmit= {handleApply} className="job-detail-apply-form">
                    <textarea
                        placeholder="Why are you a good fit for this job"
                        value={message}
                        onChange={(e)=> setMessage(e.target.value)}
                        required    
                        className="job-detail-textarea"                
                    />
                    {applyError && <p  className="job-detail-error-text">{applyError}</p>}
                    <button type="submit" disabled={applySubmitting} className="job-detail-apply-btn">
                        {applySubmitting? "Applying":"Apply"}
                    </button>



                </form>

            )}

            {applySuccess && <p className="job-detail-success-text">Application submitted..!</p>}



            {isOwner&& (
                <div>
                    <h3 className="job-detail-section-title">Applications</h3>
                    {applications.length === 0 && <p className="job-detail-meta">No Applications for this job</p>}
                    {
                        applications.map((app)=>(
                            <div key={app._id} className="job-detail-application-card">
                                <p className="job-detail-applicant-name">{app.applicant.name}</p> 
                                <p className="job-detail-applicant-email"> {app.applicant.email}</p>

                                {app.applicant.portfolioUrl && <p className="job-detail-applicant-detail">Portfolio Url: {app.applicant.portfolioUrl}</p>}
                                {app.applicant.skills?.length>0 && <p className="job-detail-applicant-detail">Skills : {app.applicant.skills.join(", ")}</p>}

                                <p className="job-detail-application-message">{app.message} </p>
                                <div className="job-detail-application-footer">
                                <p className="job-detail-application-status">Status: {app.status}</p>

                                { job.status === "open" && app.status === "pending" && (
                                    <button onClick={()=>handleAccept(app._id)} className="job-detail-accept-btn">Accept</button>
                                )

                                }
                                </div>

                            </div>
                        ))
                    }
                </div>
            )}
        </div> 
    )
}


export default JobDetailPage ;