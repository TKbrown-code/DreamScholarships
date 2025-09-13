import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faList, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../lib/Supabase";
import AOS from "aos";
import "aos/dist/aos.css";

function Scholarships() {
  const [open, setOpen] = useState("first");
  const [categories, setCategories] = useState(false);

  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");

  const [bachelorData, setBachelorData] = useState([]);
  const [mastersData, setMastersData] = useState([]);
  const [phdData, setPhdData] = useState([]);

  const [bachelorPage, setBachelorPage] = useState(0);
  const [mastersPage, setMastersPage] = useState(0);
  const [phdPage, setPhdPage] = useState(0);

  const [objectUrls, setObjectUrls] = useState([]);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Currency toggle
  const currencyRates = {
    XAF: 1,
    USD: 0.0018,
    EUR: 0.0017,
    GBP: 0.0015,
  };
  const [currency, setCurrency] = useState("XAF");

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    const converted = amount * (currencyRates[currency] || 1);
    return `${currency} ${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

    useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    setBachelorData([]);
    setMastersData([]);
    setPhdData([]);
    setBachelorPage(0);
    setMastersPage(0);
    setPhdPage(0);

    loadMore("bachelor", "bachelor", setBachelorData, 0);
    loadMore("masters", "masters", setMastersData, 0);
    loadMore("phd", "phd", setPhdData, 0);

    return () => objectUrls.forEach(URL.revokeObjectURL);
  }, [sortBy, filterBy]);

  const fetchImageBlob = async (bucket, path) => {
    if (!path) return null;
    const { data, error } = await supabase.storage.from(bucket).download(path);
    if (error) {
      console.error(`Error downloading image from ${bucket}:`, error.message);
      return null;
    }
    const url = URL.createObjectURL(data);
    setObjectUrls((prev) => [...prev, url]);
    return url;
  };

  const loadMore = async (table, bucketName, setData, page) => {
    try {
      const orderColumn =
        sortBy === "Deadline"
          ? "deadline"
          : sortBy === "Price"
          ? "amount"
          : sortBy === "School"
          ? "type"
          : "posted_at"
       sortBy === "description"
           "description";

      const ascending = sortBy === "Deadline";

      let query = supabase
        .from(table)
        .select("*")
        .order(orderColumn, { ascending })
        .range(page * 8, page * 8 + 7);

      if (filterBy) {
        query = query.ilike("type", `%${filterBy}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      const withImages = await Promise.all(
        data.map(async (item) => {
          if (item.photo_path) {
            const url = await fetchImageBlob(bucketName, item.photo_path);
            item.photo_path = url || "/default-scholarship.jpg";
          } else {
            item.photo_path = "/default-scholarship.jpg";
          }
          return item;
        })
      );

      setData((prev) => [...prev, ...withImages]);
    } catch (err) {
      console.error("Error fetching scholarships:", err.message);
    }
  };

  const setDataFor = (type) => {
    if (type === "Bachelor") return setBachelorData;
    if (type === "Masters") return setMastersData;
    return setPhdData;
  };

  const renderCards = (data, type, page, setPage, table, bucket) => (
    <>
      {data.length > 0 ? (
        <>
          {data.map((item) => (
            <div className="card" key={`${type}-${item.id}`}>
              <div className="card-image">
                <img src={item.photo_path} alt={item.type} />
              </div>
              <div className="card-header">
                <h1>{item.type}</h1>
              </div>
              <div className="card-body">
                <p className="description">{item.description_sumary}</p>
                <p className="age-limit">
                  <strong>Age Limit:</strong> {item.age_limit || "N/A"}
                </p>
                <div className="pay-deadline">
                  <span>{formatCurrency(item.amount)}</span>
                  <span>
                    Deadline:{" "}
                    {item.deadline
                      ? new Date(item.deadline).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="card-footer">
                  <a href="#">
                    Contact <FontAwesomeIcon icon={faMessage} />
                  </a>
                  <button
                    onClick={() => {
                      setModalData(item);
                      setModalOpen(true);
                    }}
                  >
                    Learn More!
                  </button>
                </div>
              </div>
            </div>
          ))}
          {data.length >= (page + 1) * 8 && (
            <button
              className="view-more"
              onClick={() => {
                const nextPage = page + 1;
                setPage(nextPage);
                loadMore(table, bucket, setDataFor(type), nextPage);
              }}
            >
              View More
            </button>
          )}
        </>
      ) : (
        <p style={{ fontSize: "1.5em" }}>
          NO {type.toUpperCase()} SCHOLARSHIPS AVAILABLE AT THE MOMENT!, Contact
          us for more details <a href="#">WhatsApp</a>
        </p>
      )}
    </>
  );

  return (
    <section id="Scholarships" style={{overflowX:'hidden'}}>
      <div className="scholarship-header" data-aos="fade-down">
        <h1>Featured Scholarships</h1>
        <p>
          Explore our featured scholarships and find the perfect opportunity to
          fund your education.
        </p>
      </div>

      {/* Currency toggle */}
      <div className="currency-toggle" data-aos="fade-right">
        <label htmlFor="currency">Currency:</label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          {Object.keys(currencyRates).map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>

      <div className="scholarships">
        {/* Desktop nav */}
        <div className="scholarship-nav" data-aos="fade-right">
          <button>
            <FontAwesomeIcon icon={faList} /> Categories:
          </button>
          <div className="scholarship-content">
            <button
              onClick={() => setOpen("first")}
              style={{ color: open === "first" ? "brown" : "rgba(20,22,44,0.932)" }}
            >
              Bachelor Scholarships
            </button>
            <button
              onClick={() => setOpen("second")}
              style={{ color: open === "second" ? "brown" : "rgba(20,22,44,0.932)" }}
            >
              Masters Scholarships
            </button>
            <button
              onClick={() => setOpen("third")}
              style={{ color: open === "third" ? "brown" : "rgba(20,22,44,0.932)" }}
            >
              Phd Scholarships
            </button>
          </div>
          <div className="otherbtn">
            <select onChange={(e) => setSortBy(e.target.value)}>
              <option value="">Sort</option>
              <option value="Price">Price</option>
              <option value="Type">Type</option>
              <option value="Deadline">Deadline</option>
              <option value="School">School</option>
            </select>
            <input
              type="text"
              placeholder="Filter by school/type..."
              onChange={(e) => setFilterBy(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile nav */}
        <div className="scholarship-nav-mobile">
          <button
            className="category"
            onClick={() => setCategories(!categories)}
            aria-label="Open menu"
          >
            <FontAwesomeIcon icon={faList} /> Categories:
          </button>
          {categories && (
            <div className="scholarship-content">
              <button
                onClick={() => setOpen("first")}
                style={{ color: open === "first" ? "brown" : "rgba(20,22,44,0.932)" }}
              >
                Bachelor Scholarships
              </button>
              <button
                onClick={() => setOpen("second")}
                style={{ color: open === "second" ? "brown" : "rgba(20,22,44,0.932)" }}
              >
                Masters Scholarships
              </button>
              <button
                onClick={() => setOpen("third")}
                style={{ color: open === "third" ? "brown" : "rgba(20,22,44,0.932)" }}
              >
                Phd Scholarships
              </button>

              <div className="otherbtn">
                <select onChange={(e) => setSortBy(e.target.value)}>
                  <option value="">Sort</option>
                  <option value="Price">Price</option>
                  <option value="Type">Type</option>
                  <option value="Deadline">Deadline</option>
                  <option value="School">School</option>
                </select>
                <input
                  type="text"
                  placeholder="Filter by school/type..."
                  onChange={(e) => setFilterBy(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Scholarship Sections */}
        {open === "first" && (
          <div className="view-scholarships" data-aos="fade-up">
            <div className="card-container">
              {renderCards(
                bachelorData,
                "Bachelor",
                bachelorPage,
                setBachelorPage,
                "bachelor",
                "bachelor"
              )}
            </div>
          </div>
        )}
        {open === "second" && (
          <div className="view-scholarships" data-aos="fade-up">
            <div className="card-container">
              {renderCards(
                mastersData,
                "Masters",
                mastersPage,
                setMastersPage,
                "masters",
                "masters"
              )}
            </div>
          </div>
        )}
        {open === "third" && (
          <div className="view-scholarships" data-aos="fade-up">
            <div className="card-container">
              {renderCards(phdData, "Phd", phdPage, setPhdPage, "phd", "phd")}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && modalData && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-image">
              <img src={modalData.photo_path} alt={modalData.type} />
            </div>
            <h2>{modalData.type}</h2>
            <p className="description2">{modalData.description}</p>
            <p>
              <strong>Age Limit:</strong> {modalData.age_limit || "N/A"}
            </p>
            <p>
              <strong>Price:</strong> {formatCurrency(modalData.amount)}
            </p>
            <p>
              <strong>Deadline:</strong>{" "}-
              {modalData.deadline
                ? new Date(modalData.deadline).toLocaleDateString()
                : "N/A"}
            </p>
            <div className="scholarship-btn">
              <button className="close" onClick={() => setModalOpen(false)}>
              Exit
            </button>
            <button className="close"> <a href="https://wa.me/673918431" target="_blank" rel="noopener noreferrer">
                  Apply  <FontAwesomeIcon icon={faPaperPlane}/></a>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Scholarships;



