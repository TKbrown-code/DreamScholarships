import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faLockOpen, faPaperPlane, faUser, faHome } from "@fortawesome/free-solid-svg-icons";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../style/form.css";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import { useFormValidation } from "../hooks/useFormValidation";
import { useModal } from "../hooks/useModal";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase"; 

export default function Form() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    first_name: "",
    second_name: "",
    number: "",
    email: "",
    password: "",
    password_verify: "",
    policy: false,
  });


  const navigate = useNavigate();
  const fullName = form.first_name + " " + form.second_name;
  const { validateForm } = useFormValidation(form, isSignUp);
  const { modal, showModal, closeModal } = useModal();

  const signChange = () => setIsSignUp((prev) => !prev);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
  
      setErrors({});

      if (isSignUp) {
        await signUpUser();
      } else {
        await signInUser();
      }
    } finally {
      setIsLoading(false);
    }
  }

  const signUpUser = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) {
        if (error.message?.toLowerCase().includes("already registered")) {
          showModal("Profile Already Exists", "You already have an account. Please login.", [
            { label: "Go to Login", onClick: signChange },
            { label: "Close", onClick: closeModal },
          ]);
        } else {
          toast.error("Signup failed: " + error.message);
        }
        return;
      }

      showModal("Signup Successful", "Check your email to verify before signing in.", [
        { label: "Close", onClick: closeModal },
        {
          label: modalLoading ? "Signing in..." : "Complete Sign In",
          onClick: async () => {
            try {
              setModalLoading(true);
              await signInUser();
              closeModal();
            } finally {
              setModalLoading(false);
            }
          },
          style: { backgroundColor: "green", color: "white" },
          disabled: modalLoading,
        },
      ]);
    } catch (err) {
      toast.error("Unexpected signup error: " + (err?.message || String(err)));
    }
  };

  const signInUser = async () => {
    
    if(!isSignUp) 
    {
      
    try {
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
       
      if (error) {
        setIsLoading(false);
        toast.error("Sign in failed: " + error.message);
        return;
      }

      setIsLoading(false);
        showModal("Signed in successfully!", [
        { label: "Close", onClick: navigate("/dashboard")},
      ])

    } catch (err) {
      toast.error("Unexpected sign-in error: " + (err?.message || String(err)));
    }
  }

    if(isSignUp){
        
        try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) {
        setIsLoading(false);
        toast.error("Sign in failed: " + error.message);
        return;
      }

      const user = data?.user;
      if (!user) {
        toast.error("Sign in failed: Unknown error");
        return;
      }

      if (!user.email_confirmed_at) {
        toast.info("Please verify your email before signing in.");
        return;
      }
      
      // Insert profile if needed
       showModal("Signed in successfully!", [
        { label: "Continue", onClick: navigate("/completeProfile")},
       ])
      await insertUserProfile(user);
      
     // Redirect after everything is done
      }catch (err) {
      toast.error("Unexpected sign-in error: " + (err?.message || String(err)));}
    }
  };

  const insertUserProfile = async (user) => {
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("full_name, user_email, user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchError) return toast.error("Error checking profile: " + fetchError.message);

      if (!existingProfile) {
        const { error } = await supabase.from("profiles").insert([
          {
            user_id: user.id,
            full_name: fullName,
            first_name: form.first_name,
            second_name: form.second_name,
            phone_number: form.number,
            user_email: user.email,
          },
        ]);

        if (error) toast.error("Profile creation failed: " + error.message);
        else toast.success("Profile created successfully!");
      }
    } catch (err) {
      toast.error("Unexpected profile error: " + (err?.message || String(err)));
    }
  };

  return (
   <>
   <section className="form-holder">
      <div className="form-container">
        <div className="formheader">
          <h1>{isSignUp ? "Create Account" : "Welcome Back"}</h1>
          <span>{isSignUp ? "Join for an adventure into Education with class!" : "Please Sign in"}</span>
        </div>

        <form>
          {isSignUp && (
            <>
              <div>
                <label>
                  <FontAwesomeIcon icon={faUser} style={{marginRight: '3px'}}/>
                  <input type="text" name="first_name" value={form.first_name} placeholder="First name" onChange={handleChange} disabled={isLoading} />
                </label>
                {errors.first_name && <p className="error">{errors.first_name}</p>}
              </div>
              <div>
                <label>
                  <FontAwesomeIcon icon={faUser} style={{marginRight: '3px'}}/>
                  <input type="text" name="second_name" value={form.second_name} placeholder="Second name" onChange={handleChange} disabled={isLoading} />
                </label>
                {errors.second_name && <p className="error">{errors.second_name}</p>}
              </div>
              <div>
                <PhoneInput country="cm" value={form.number} onChange={(phone) => setForm((prev) => ({ ...prev, number: phone }))} inputStyle={{ width: "100%" }} disabled={isLoading} />
                {errors.number && <p className="error">{errors.number}</p>}
              </div>
            </>
          )}

          <div>
            <label>
              <FontAwesomeIcon icon={faEnvelope} style={{marginRight: '3px'}}/>
              <input type="email" name="email" value={form.email} placeholder="Email" onChange={handleChange} disabled={isLoading} />
            </label>
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div>
            <label>
              <FontAwesomeIcon icon={faLock} style={{marginRight: '3px'}}/>
              <input type="password" name="password" value={form.password} placeholder="Password, Minimum 6 characters" onChange={handleChange} disabled={isLoading} />
            </label>
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
       
          {!isSignUp && (
          <div className="resetpws">
            <span onClick={() => navigate("/reset")}>Forgot Password?</span>
          </div>
          )}

          {isSignUp && (
            <>
              <div>
                <label>
                  <FontAwesomeIcon icon={faLockOpen} style={{marginRight: '3px'}}/>
                  <input type="password" name="password_verify" value={form.password_verify} placeholder="Verify password" onChange={handleChange} disabled={isLoading} />
                </label>
                {errors.password_verify && <p className="error">{errors.password_verify}</p>}
              </div>
              <div className="policy">
                <input type="checkbox" name="policy" checked={form.policy} onChange={handleChange} disabled={isLoading} />
                <span>Accept our policies</span>
                {errors.policy && <p className="error">{errors.policy}</p>}
              </div>
            </>
          )}
        </form>
          <div className="signbtn">
            {isSignUp ? 
            (
              <button onClick={handleSubmit} disabled={isLoading || (isSignUp && form.checked)}>
              {isLoading ? "Processing..." : "Sign up" } <FontAwesomeIcon icon={faPaperPlane} />
            </button>
            ) : 
            (
              <button onClick={signInUser} disabled={isLoading || (isSignUp)}>
              {isLoading ? "Processing..." : "Sign In" } <FontAwesomeIcon icon={faPaperPlane} />
             </button>
            )}
            <button onClick={() => navigate("/")}>
              <FontAwesomeIcon icon={faHome}/>
              <span>Home</span>
            </button>
            <span>
              {isSignUp ? (
                <>
                  Already have an account? <span onClick={signChange} className="link">Sign In</span>
                </>
              ) : (
                <>
                  Don't have an account? <span onClick={signChange} className="link">Sign Up</span>
                </>
              )}
            </span>
          </div>
        

        <div className="actual-policies">
          <p>
            Click <span className="link">here</span> to see our privacy and policies
          </p>
        </div>
      </div>
    
  
      <AnimatePresence>
        {modal.visible && (
    <div className="Modal-container">
        
          <motion.div
            className="signup-modal-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="modal">
              <h2>{modal.title} ✅</h2>
              <p>{modal.message}</p>
              <div className="modal-buttons">
                {modal.buttons?.map((btn, idx) => (
                  <button key={idx} onClick={btn.onClick} style={btn.style || {}} disabled={btn.disabled || false}>
                    {btn.label}
                  </button>
                ))}
                {!modal.buttons?.length && <button onClick={closeModal}>Close</button>}
              </div>
            </div>
          </motion.div>
        
      </div>
      )}
      </AnimatePresence>
    
      <div style={{position:"absolute"}}>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </div>
  </section>
  </>
  );
      }
