import React, { useMemo, useState, useEffect } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";
import { useModal } from "../hooks/useModal";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../style/form.css"
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function SecondForm() {
  const [country, setCountry] = useState(null);
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState(null);
  const { modal, showModal, closeModal } = useModal();
  // Countriess
  
  const {user} = useAuth();
  const countryOptions = useMemo(() => countryList().getData(), []);
  const navigate = useNavigate();

  const userid = user?.id;

  // Custom display for country options
  const customCountryOption = (option) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <img
        src={`https://flagcdn.com/24x18/${option.value.toLowerCase()}.png`}
        alt=""
        style={{ width: "20px", height: "15px" }}
      />
      {option.label}
    </div>
  );

  // Fetch cities when country changes
  useEffect(() => {
    if (!country) {
      setCities([]);
      setCity(null);
      return;
    }

    const fetchCities = async () => {
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: country.label }),
        });

        const data = await res.json();
        if (data && data.data) {
          setCities(data.data.map((c) => ({ value: c, label: c })));
        } else {
          setCities([]);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
        setCities([]);
      }
    };

    fetchCities();
  }, [country]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!country || !city) {
    showModal("Please Select your Country And City!🥹", "", [
      { label: "Close", onClick: closeModal },
    ]);
    return;
  }

  const { data, error } = await supabase
  .from("profiles")
  .update({
    country: country.label,
    city: city.label,
  })
  .eq("user_id", user.id)   // match the row
  .select()
  .maybeSingle();

  if (error) {
    console.error("Unable to insert into profile:", error.message);
  } else {
    showModal("Success!✅", "Your profile is almost complete!", [
      { label: "continue", onClick: () => navigate("/Profilepic") },
    ]);
  }
};


  return (
    <div className="second-form">
      <div className="second-form-container">
        <div className="second-form-header"> 
            <span>Choose Your Country And Region</span>
            <span style={{fontSize: '1rem', color:'grey'}}>Your information is safe with us</span>
            </div>
      <form>
        {/* Country Select */}
        <Select
          options={countryOptions}
          value={country}
          onChange={setCountry}
          formatOptionLabel={customCountryOption}
          placeholder="🌍 Select Country"
        />

        {/* City Select */}

          <Select
            options={cities}
            value={city}
            onChange={setCity}
            isDisabled={!country}
            placeholder={country ? "🏙️ Select City" : "Select Country First"}
          />
      </form>

      <div className="form-button">
         <button onClick={handleSubmit}>
          Submit
        </button>
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
              <h2>{modal.title}</h2>
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
    </div>
  );
}
