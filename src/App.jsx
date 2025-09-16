import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfilePic from "./hooks/profilepic"
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./context/ProtectedRouth";
import Home from "./pages/Home";
import Form from "./pages/form";
import UserDashboard from "./pages/user_dashboard";
import ErrorBoundary from "./context/ErrorBoundary";
import SecondForm from "./components/secondForm";
import Dictionary from "./components/dictionary";
import Resource from "./components/StudentResource";
import Applicant from "./components/agentApplicaant";
import Reset from "./components/resetpassword";
import Newpws from "./components/newpassword";
import Applyform from "./components/applyform"

function App() {
  return (
    <AuthProvider> 
      <ErrorBoundary>
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/completeProfile" element={<SecondForm/>}/>
          <Route path="/Profilepic" element={<ProfilePic/>}/>
          <Route path="/dictionary" element={<Dictionary/>}/>
          <Route path="/resource" element={<Resource/>}/>
          <Route path="/apply" element={<Applicant/>}/>
          <Route path="/reset" element={<Reset/>}/>
          <Route path="/new-password" element={<Newpws/>}/>
          <Route path="/applyform" element={<Applyform/>}/>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </ErrorBoundary>
      <div style={{position: 'absolute'}}>
          <ToastContainer position="top-right" autoClose={3000} theme="colored"/>
      </div>
    </AuthProvider>
  );
}

export default App;
