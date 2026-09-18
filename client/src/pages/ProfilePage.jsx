

import { useState ,useEffect} from "react";
import { updateProfile,getStats} from "../api/user";
import { useAuth } from "../context/AuthContext";

import "./ProfilePage.css" 

const ProfilePage = ()=>{
    const {user,token,login,updateUser} = useAuth();

    if(user.role === "freelancer"){const isFreelancer = true}

    const [stats,setStats] = useState(null);

    const[name,setName] = useState(user?.name || '');
    const[portfolioUrl,setPortfolioUrl] = useState(user?.portfolioUrl || '');
    const[bio,setBio] = useState(user?.bio || '');
    const [skills,setSkills] = useState(user?.skills?.join(", ") || '');
    const [error,setError] = useState('');
    const [isEditing,setIsEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(()=>{
        const fetchStats = async()=>{
            try{

            
            const res = await getStats();
            setStats(res.data);
            }catch(err){
                console.log(err);
            }
        }
        fetchStats();

    },[])
    const handleEditProfile=()=>{
        setName(user?.name || "");
        setPortfolioUrl(user?.portfolioUrl || '');
        setBio(user?.bio || '');
        setSkills(user?.skills?.join(", ") || "") ;
        setIsEditing(true) ;
    }

    const handleCancel=()=>{
        setIsEditing(false);
        setError("");
    }

    const handleSubmit=async (e)=>{
        e.preventDefault();
        setError('');
        setSubmitting(true)

        try{
            const skillsArray = skills.split(",").map((s) => s.trim()).filter(Boolean);
            const res = await updateProfile({name , portfolioUrl,bio ,skills:skillsArray});
            updateUser(res.data)
            

        }catch(err){
            setError(err.response?.data?.message || "Failed to Update Profile")
        }
        finally{
            setSubmitting(false);
            setIsEditing(false)

        }

    }



    if(!isEditing){
        return(
            <div className="profile-container">
                <div className="profile-card">
                <h2 className="profile-title">Profile</h2>
                <p className="profile-view-row"><strong>Name : </strong>{user?.name}</p>
                <p className="profile-view-row"><strong>Bio : </strong>{user?.bio || "Not Set"}</p>
                { user.role === "freelancer" && ( <>
                    <p className="profile-view-row"><strong>PortfolioUrl : </strong>{user?.portfolioUrl || "NotSet"}</p>
                    <p className="profile-view-row"><strong>Skills : </strong>{user?.skills?.join(", ") || "Not Set"}</p>
                </>  )}
                <button onClick={handleEditProfile} className="profile-edit-btn">Edit Profile</button>
            </div>

            {stats && (
                <div className="profile-stats">
                    {user.role === "freelancer" ? (
                    <>
                        <p className="profile-stat"><strong>{stats.total}</strong> jobs applied</p>
                        <p className="profile-stat-sub">{stats.pending} pending</p>
                        <p className="profile-stat-sub"> {stats.accepted} accepted </p>
                        <p className="profile-stat-sub">{stats.rejected} rejected</p>
                    </>
                    ) : (
                    <>
                        <p className="profile-stat"><strong>{stats.total}</strong> jobs posted</p>
                        <p className="profile-stat-sub">{stats.open} open </p>
                        <p className="profile-stat-sub"> {stats.assigned} assigned</p>
                         <p className="profile-stat-sub" > {stats.completed} completed</p>
                    </>
                    )}
                </div>
                )}
            </div>
        )
    }

    return(
        <div className="profile-container">
            <div className="profile-card">
            <h2 className="profile-title">Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="profile-field">
                    <label className="profile-label">Name</label>
                    <input className="profile-input" onChange={(e)=>setName(e.target.value)} value={name} required/>
                </div>

                <div className="profile-field">
                    <label className="profile-label">Bio</label>
                    <textarea className="profile-textarea" placeholder={user.role==="client" ? "Tell freelancers about your business" : "Tell clients about your skills"}value={bio} onChange={(e)=>setBio(e.target.value)}/>
                </div>


                {user.role === "freelancer" && (<>
                    <div className="profile-field">
                        <label className="profile-label">Portfolio Url</label>
                        <input className="profile-input" value={portfolioUrl} onChange={(e)=>setPortfolioUrl(e.target.value)}/>
                    </div>
                    <div className="profile-field">
                        <label className="profile-label">Skills</label>
                        <input className="profile-input" placeholder="React, Node.js, Figma" value={skills} onChange={(e)=>setSkills(e.target.value)} />
                    </div>
                </>)}



                {error && <p  className="profile-error">{error}</p>}

                <button className="profile-submit-btn" type="submit" disabled={submitting}>
                    {submitting ? "Saving" : "Save"}
                </button>
                <button type="button" onClick={handleCancel} className="profile-cancel-btn">Cancel</button>

            </form>
        </div>
        </div>
    )


    




}

export default ProfilePage