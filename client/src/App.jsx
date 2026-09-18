import {Route,Routes,Navigate,useLocation} from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import PostJobPage from './pages/PostJobPage'
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar/Navbar';
import MyApplicationsPage from './pages/MyApplicationsPage';
import MyJobsPage from './pages/MyJobsPage';


const App = ()=>{
  const location = useLocation() ;
  const hideNav = location.pathname === '/login' || location.pathname==="/register"



  return(
    <>
    {!hideNav && <Navbar/>}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace/> } />
        <Route path="/login" element={<LoginPage/> } />
        <Route path="/register" element={<RegisterPage/>}/> 
        <Route path="/jobs" element={<ProtectedRoute><JobsPage/></ProtectedRoute>}/>
        <Route path="/jobs/:id" element={<ProtectedRoute><JobDetailPage/></ProtectedRoute>}/>
        <Route path="post-job" element={<ProtectedRoute><PostJobPage/></ProtectedRoute>}/>
        <Route path="/my-applications" element={<ProtectedRoute><MyApplicationsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/my-jobs" element={<ProtectedRoute><MyJobsPage/></ProtectedRoute>}/>
      </Routes>
    </>

  )
}
export default App
