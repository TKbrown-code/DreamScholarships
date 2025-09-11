import { useState } from "react";
import { supabase } from "../lib/supabase";
import emailjs from "emailjs-com";
import { Navigate } from "react-router-dom";

export default function Apply() {
  const [formData, setFormData] = useState({
    applicant_full_name: "",
    applicant_email: "",
    contact: "",
    applicant_country: "",
    city: "",
    date_of_birth: "",
  });

  const emailjs_service_id = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const emailjs_template_id = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const emailjs_user_id = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [goHome, setGoHome] = useState(false);

  const validate = () => {
    if (!formData.applicant_full_name.trim()) return "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.applicant_email))
      return "Please enter a valid email.";
    if (!/^\+?[0-9]{7,15}$/.test(formData.contact))
      return "Contact number must be 7–15 digits.";
    if (!formData.applicant_country.trim()) return "Country is required.";
    if (!formData.city.trim()) return "City is required.";
    if (!formData.date_of_birth) return "Date of birth is required.";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const errorMsg = validate();
    if (errorMsg) {
      setMessage({ type: "error", text: errorMsg });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("agent_applicant").insert([formData]);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      try {
        await emailjs.send(
          emailjs_service_id,
          emailjs_template_id,
          {
            to_email: formData.applicant_email,
            applicant_full_name: formData.applicant_full_name,
            applicant_email: formData.applicant_email,
            contact: formData.contact,
            applicant_country: formData.applicant_country,
            city: formData.city,
            date_of_birth: formData.date_of_birth,
          },
          emailjs_user_id
        );

        setMessage({
          type: "success",
          text: "Application submitted & confirmation email sent!",
        });

        setFormData({
          applicant_full_name: "",
          applicant_email: "",
          contact: "",
          applicant_country: "",
          city: "",
          date_of_birth: "",
        });
      } catch (err) {
        setMessage({
          type: "error",
          text: "Saved to database, but email failed: " + err.text,
        });
      }
    }

    setLoading(false);
  };

  if (goHome) {
    return <Navigate to="/" />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Agent Applicant Form</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="applicant_full_name"
            placeholder="Full Name"
            value={formData.applicant_full_name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="email"
            name="applicant_email"
            placeholder="Email"
            value={formData.applicant_email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Number (+123456789)"
            value={formData.contact}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="applicant_country"
            placeholder="Country"
            value={formData.applicant_country}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
            style={styles.input}
          />

          {/* Explicit Date of Birth field */}
          <label style={styles.label}>Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>

          {/* Go Back Home button full width */}
          <button
            type="button"
            onClick={() => setGoHome(true)}
            style={styles.backButton}
          >
            Go Back Home
          </button>
        </form>
        {message && (
          <p
            style={{
              marginTop: "15px",
              textAlign: "center",
              color: message.type === "error" ? "red" : "green",
            }}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f9f9f9",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "22px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "-10px",
    color: "#333",
  },
  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
  },
  backButton: {
    padding: "12px",
    backgroundColor: "#ccc",
    color: "#333",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
  },
};
