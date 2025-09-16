import { useState } from "react";
import { supabase } from "../lib/Supabase";
import emailjs from "emailjs-com";

export default function Applyform() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    education_level: "",
    programs: "",
    country: "",
    phone_number: "",
  });

  const [errors, setErrors] = useState({});
  const [shakeFields, setShakeFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let newErrors = {};
    let newShake = {};

    if (!form.full_name.trim()) {
      newErrors.full_name = "Full name is required";
      newShake.full_name = true;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      newShake.email = true;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
      newShake.email = true;
    }

    if (!form.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
      newShake.phone_number = true;
    } else if (!/^[0-9]{7,15}$/.test(form.phone_number)) {
      newErrors.phone_number = "Phone number must be 7-15 digits";
      newShake.phone_number = true;
    }

    if (!form.country.trim()) {
      newErrors.country = "Country is required";
      newShake.country = true;
    }

    if (!form.programs) {
      newErrors.programs = "Please select a program";
      newShake.programs = true;
    }

    if (!form.education_level) {
      newErrors.education_level = "Please select your academic level";
      newShake.education_level = true;
    }

    setErrors(newErrors);
    setShakeFields(newShake);
    setTimeout(() => setShakeFields({}), 400);

    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);

  try {
    // Insert into Supabase and return inserted row
    const { data, error } = await supabase
      .from("scholarship_applicant")
      .insert([{ ...form }])
      .select("id"); // returns the inserted id

    if (error) throw error;

    const id = data[0].id; // get the inserted record ID

    // Send confirmation email via EmailJS
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ONE,
      {
        to_email: form.email,
        applicant_name: form.full_name,
        program: form.programs,
        country: form.country,
        education_level: form.education_level,
        registration_id: id,
        whatsapp_link: "https://wa.me/+8615241647328", // Replace with your WhatsApp number
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    setModalMessage(
      `Thank you ${form.full_name}, your application was submitted successfully! A confirmation email has been sent to ${form.email}. Please contact us via WhatsApp to complete your registration.`
    );
    setShowModal(true);

    // Reset form
    setForm({
      full_name: "",
      email: "",
      education_level: "",
      programs: "",
      country: "",
      phone_number: "",
    });
  } catch (err) {
    console.error(err);
    setModalMessage("⚠️ Something went wrong. Please try again.");
    setShowModal(true);
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <div className="form-container">
        <h2>Students Application Form</h2>

        <form onSubmit={handleSubmit}>
          {/* Row 1: Full Name + Email */}
          <div className="form-row">
            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                name="full_name"
                placeholder="Enter full name"
                value={form.full_name}
                onChange={handleChange}
                className={errors.full_name ? "error" : ""}
                data-shake={shakeFields.full_name ? "true" : "false"}
              />
              {errors.full_name && <small>{errors.full_name}</small>}
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
                data-shake={shakeFields.email ? "true" : "false"}
              />
              {errors.email && <small>{errors.email}</small>}
            </div>
          </div>

          {/* Row 2: Phone + Country */}
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="tel"
                name="phone_number"
                placeholder="Phone number"
                value={form.phone_number}
                onChange={handleChange}
                className={errors.phone_number ? "error" : ""}
                data-shake={shakeFields.phone_number ? "true" : "false"}
              />
              {errors.phone_number && <small>{errors.phone_number}</small>}
            </div>
            <div className="form-group">
              <label>Country:</label>
              <input
                type="text"
                name="country"
                placeholder="Enter your country"
                value={form.country}
                onChange={handleChange}
                className={errors.country ? "error" : ""}
                data-shake={shakeFields.country ? "true" : "false"}
              />
              {errors.country && <small>{errors.country}</small>}
            </div>
          </div>

          {/* Row 3: Program */}
          <div className="form-group">
            <label>Program Applying For:</label>
            <select
              name="programs"
              value={form.programs}
              onChange={handleChange}
              className={errors.programs ? "error" : ""}
              data-shake={shakeFields.programs ? "true" : "false"}
              required
            >
              <option value="">Select your program</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Master">Master's</option>
              <option value="PhD">PhD</option>
              <option value="Diploma">Diploma</option>
              <option value="Chinese Language">Chinese Language programs</option>
            </select>
            {errors.programs && <small>{errors.programs}</small>}
          </div>

          {/* Row 4: Academic Level */}
          <div className="form-group">
            <label>Highest Academic Level:</label>
            <select
              name="education_level"
              value={form.education_level}
              onChange={handleChange}
              className={errors.education_level ? "error" : ""}
              data-shake={shakeFields.education_level ? "true" : "false"}
              required
            >
              <option value="">Select your Academic level</option>
              <option value="Advanced Level">Advanced Level</option>
              <option value="Ordinary Level">Ordinary Level</option>
              <option value="Diploma">Diploma</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Masters">Masters</option>
              <option value="PhD">PhD</option>
            </select>
            {errors.education_level && <small>{errors.education_level}</small>}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Application Status</h3>
            <p>{modalMessage}</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      <style>{`
        .form-container {
          max-width: 600px;
          margin: 40px auto;
          padding: 25px;
          border-radius: 12px;
          background: #f9f9f9;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          font-family: Arial, sans-serif;
        }

        h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }

        form {
          display: flex;
          flex-direction: column;
        }

        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
        }

        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        label {
          margin: 10px 0 5px;
          font-weight: 600;
          color: #444;
        }

        input, select {
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 8px;
          transition: border 0.3s ease;
          width: 100%;
        }

        input:focus, select:focus {
          border-color: #4CAF50;
          outline: none;
        }

        .error {
          border-color: red !important;
        }

        small {
          color: red;
          font-size: 12px;
          margin-bottom: 10px;
        }

        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }

        [data-shake="true"] {
          animation: shake 0.4s;
        }

        button {
          padding: 14px;
          background: #4CAF50;
          color: white;
          font-size: 16px;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease;
          width: 100%;
          margin-top: 15px;
        }

        button:hover {
          background: #45a049;
        }

        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }

        .modal {
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          max-width: 450px;
          width: 90%;
          box-shadow: 0 6px 20px rgba(0,0,0,0.25);
          font-family: Arial, sans-serif;
        }

        .modal h3 {
          margin-bottom: 15px;
          color: #333;
          font-size: 22px;
        }

        .modal p {
          margin-bottom: 25px;
          color: #555;
          font-size: 16px;
          line-height: 1.5;
        }

        .modal button {
          background-color: #25D366;
          color: #fff;
          padding: 12px 25px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .modal button:hover {
          background-color: #1ebe5b;
        }

        /* Responsive */
        @media (max-width: 600px) {
          .form-row {
            flex-direction: column;
            gap: 0;
          }

          .form-container {
            margin: 20px;
            padding: 20px;
          }

          h2 {
            font-size: 18px;
          }

          input, select, button {
            font-size: 14px;
            padding: 10px;
          }
        }
      `}</style>
    </>
  );
}
