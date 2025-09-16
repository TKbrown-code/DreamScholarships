import { useEffect, useState } from "react";
import { supabase } from "../lib/Supabase";
import emailjs from "emailjs-com";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

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
  const [scholarships, setScholarships] = useState({
    bachelor: [],
    master: [],
    phd: [],
    diploma: [],
    chinese: [],
  });
  const [selectedProgram, setSelectedProgram] = useState("");
  const navigate = useNavigate();

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

    if (!form.programs && !selectedProgram) {
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
        .insert([
          {
            ...form,
            programs: form.programs || selectedProgram,
          },
        ])
        .select("id, created_at");

      if (error) throw error;

      const id = data[0].id;

      // Send confirmation email via EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ONE,
        {
          to_email: form.email,
          applicant_name: form.full_name,
          program: form.programs || selectedProgram,
          country: form.country,
          education_level: form.education_level,
          registration_id: id,
          created_at: data[0].created_at,
          whatsapp_link: "https://wa.me/+8615241647328",
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setModalMessage(
        `Thank you ${form.full_name}, your application was submitted successfully! 
        A confirmation email has been sent to ${form.email}. 
        Please contact us via WhatsApp to complete your registration.`
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
      setSelectedProgram("");
    } catch (err) {
      console.error(err);
      setModalMessage("⚠️ Something went wrong. Please try again.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const fetchBachelorSch = async () => {
        const { data, error } = await supabase
          .from("bachelor")
          .select("type, id");
        if (error) throw error;
        setScholarships((prev) => ({ ...prev, bachelor: data }));
      };
      const fetchMasterSch = async () => {
        const { data, error } = await supabase
          .from("masters")
          .select("type, id");
        if (error) throw error;
        setScholarships((prev) => ({ ...prev, master: data }));
      };
      const fetchPhDSch = async () => {
        const { data, error } = await supabase.from("phd").select("type, id");
        if (error) throw error;
        setScholarships((prev) => ({ ...prev, phd: data }));
      };
      fetchBachelorSch();
      fetchMasterSch();
      fetchPhDSch();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const programOptions = Object.entries(scholarships).flatMap(([level, programs]) =>
    programs.map((program) => ({
      value: `${program.type}(${level})`,
      label: `${program.type} (${level})`,
    }))
  );

  return (
    <>
      <div className="form-container">
        <h2>Scholarship Application Form</h2>

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
            >
              <option value="">Select your program</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Master">Master's</option>
              <option value="PhD">PhD</option>
              <option value="Diploma">Diploma</option>
              <option value="Chinese Language">
                Chinese Language programs
              </option>
            </select>
            <span>
                <em>-- OR --</em>
            </span>
            <label>Select From existing programs</label>
            <Select
              options={programOptions}
              placeholder="Select or search program"
              onChange={(selectedOption) => {
                setSelectedProgram(selectedOption ? selectedOption.value : "");
                setForm((prev) => ({ ...prev, programs: selectedOption ? selectedOption.value : "" }));
              }}
              isClearable
              className="custom-select"
            />
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

            <div className="scholarship-policy">
               <div><input type="checkbox" required /></div> <div>I agree to the{" "}<a href="/scholarship-policy" target="_blank" rel="noopener noreferrer">scholarship policy</a></div>.
            </div>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        <div style={{marginTop:"10px", textAlign:"start"}}>
          <span onClick={() => navigate("/")} style={{color:"red", cursor:"pointer"}}> <FontAwesomeIcon icon={faArrowCircleLeft} /> Return Home</span>
          </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Application Status</h3>
            <p>{modalMessage}</p>
            <div className="modal-actions">
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <a
                href="https://wa.me/+8615241647328"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
              >
                Contact on WhatsApp
              </a>
            </div>
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
          border: none !important;
          text-align: left !important;
        }

        input, select, custom-select {
          padding: 12px;
          border: 1px solid #ccc !important;
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

        .modal-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .close-btn {
          background-color: #999;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s ease;
            width: 30%;
        }

        .close-btn:hover {
          background-color: #777;
        }

        .whatsapp-btn {
          background-color: #25D366;
          padding: 12px 20px;
          border-radius: 8px;
          color: #fff;
          font-weight: bold;
          text-decoration: none;
          transition: background 0.3s ease;
        }

        .whatsapp-btn:hover {
          background-color: #1ebe5b;
        }

        /* Responsive */
        @media (max-width: 600px) {
          .form-row {
            flex-direction: column;
            gap: 0;
          }

          .form-container {
            padding: 20px;
            box-shadow:none;
          }
           Select option {          
            padding: 8px;
            border-bottom: 1px solid #eee;
          }
          h2 {
            font-size: 18px;
          }

          input, select, Select, button {
            font-size: 14px;
            padding: 10px;
          }
        }
          .scholarship-policy {
            margin: 15px 0;
            font-size: 14px;
            color: #555;
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
          }
          .scholarship-policy span {
            width: 55%;
          }
          .scholarship-policy a {
            color: #4CAF50;
            text-decoration: none;
          }
          .scholarship-policy a:hover {
            text-decoration: underline;
          }
      `}</style>
    </>
  );
}
