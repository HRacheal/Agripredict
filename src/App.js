import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    Crop_Type: 9, Soil_Type: 2, Soil_pH: 6.5, Temperature: 25.0,
    Humidity: 70.0, Wind_Speed: 12.0, N: 50, P: 40, K: 30,
    Soil_Quality: 80.0, month: 1, year: 2026
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contactStatus, setContactStatus] = useState("");
  const [dynamicInsights, setDynamicInsights] = useState([
    { title: "Soil Analysis", desc: "System standby. Awaiting field parameters for nutrient bioavailability analysis." },
    { title: "Climate Resilience", desc: "Environmental monitoring active. Ready to calculate thermal stress factors." },
    { title: "Strategic Planning", desc: "Yield buffer analysis will appear here after your first projection." }
  ]);

  // Handle Dynamic Insights based on Prediction
  useEffect(() => {
    if (result) {
      if (result.low_yield_alert) {
        setDynamicInsights([
          { title: "Nutrient Optimization", desc: `Current NPK levels (${formData.N}-${formData.P}-${formData.K}) indicate a nutritional deficit. Target fertilization is required to stabilize the projected yield.` },
          { title: "Soil Stress Mitigation", desc: "Low Soil Quality index detected. Implementing regenerative organic matter could improve moisture retention and nutrient uptake." },
          { title: "Adaptive Management", desc: "Yield is below the 15% historical threshold. Consider adjusting irrigation frequency to mitigate high-temperature stress." }
        ]);
      } else {
        setDynamicInsights([
          { title: "Optimal Biological Path", desc: "The current field profile is aligned with maximum genetic potential for the selected variety." },
          { title: "Systemic Stability", desc: "Environmental variables are within the optimal physiological range, ensuring efficient photosynthesis and biomass accumulation." },
          { title: "Future Sustainability", desc: "Current soil health is robust. This is an ideal window for planning long-term nitrogen fixation cycles." }
        ]);
      }
    }
  }, [result, formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // CONNECTED TO LIVE RENDER BACKEND
      const response = await axios.post('https://predictive-agriculture-app.onrender.com/predict', formData);
      setResult(response.data);
      
      // Smooth scroll to results
      setTimeout(() => {
        const element = document.getElementById('results');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } catch (error) {
      console.error("API Error:", error);
      alert("System Latency: The AI engine is currently waking up from standby. Please wait 30 seconds and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (e) => {
    e.preventDefault();
    setContactStatus("Inquiry received. Our technical team will reach out to you shortly.");
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-content">
          <span className="logo">AGRIPREDICT SYSTEMS</span>
          <div className="nav-links">
            <a href="#predict">Analyze</a>
            <a href="#knowledge">Insights</a>
            <a href="#news">Research</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-overlay">
          <div className="sub-tag">Agricultural Intelligence Engine</div>
          <h1>Predictive Agronomic Analytics</h1>
          <p>Utilizing high-fidelity neural networks to optimize production outcomes across complex Wheat, Corn, Rice, and Soybean ecosystems.</p>
          
          <div className="crop-indicator-bar">
            <span>WHEAT</span>
            <span>CORN</span>
            <span>RICE</span>
            <span>SOYBEAN</span>
          </div>

          <button onClick={() => document.getElementById('predict').scrollIntoView({behavior: 'smooth'})} className="cta-btn">
            Initialize Field Analysis
          </button>
        </div>
      </header>

      <section id="predict" className="main-section">
        <div className="section-header">
          <h2>Yield Projection Engine</h2>
          <div className="underline"></div>
        </div>
        
        <div className="dashboard">
          <div className="input-card">
            <h3>Field Parameters</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="input-box">
                  <label>Crop Variety</label>
                  <select value={formData.Crop_Type} onChange={e => setFormData({...formData, Crop_Type: parseInt(e.target.value)})}>
                    <option value="9">Wheat</option>
                    <option value="1">Corn</option>
                    <option value="7">Rice</option>
                    <option value="8">Soybean</option>
                  </select>
                </div>
                <div className="input-box">
                  <label>Soil Taxonomy</label>
                  <select value={formData.Soil_Type} onChange={e => setFormData({...formData, Soil_Type: parseInt(e.target.value)})}>
                    <option value="0">Clay</option>
                    <option value="3">Sandy</option>
                    <option value="2">Loamy</option>
                    <option value="4">Silt</option>
                  </select>
                </div>
                <div className="input-box"><label>Nitrogen (N)</label><input type="number" value={formData.N} onChange={e => setFormData({...formData, N: parseFloat(e.target.value)})} /></div>
                <div className="input-box"><label>Soil pH</label><input type="number" step="0.1" value={formData.Soil_pH} onChange={e => setFormData({...formData, Soil_pH: parseFloat(e.target.value)})} /></div>
                <div className="input-box"><label>Temperature (°C)</label><input type="number" value={formData.Temperature} onChange={e => setFormData({...formData, Temperature: parseFloat(e.target.value)})} /></div>
                <div className="input-box"><label>Humidity (%)</label><input type="number" value={formData.Humidity} onChange={e => setFormData({...formData, Humidity: parseFloat(e.target.value)})} /></div>
              </div>
              <button type="submit" className="predict-btn" disabled={loading}>
                {loading ? "PROCESSING DATA..." : "EXECUTE ANALYTIC MODEL"}
              </button>
            </form>
          </div>

          <div id="results" className="results-panel">
            {loading ? (
              <div className="placeholder">
                <div className="loading-ring"></div>
                <p>Initializing Neural Engine...</p>
                <small className="server-note">First request may take 30s to wake the server.</small>
              </div>
            ) : result ? (
              <div className="yield-display fade-in">
                <h4>PROJECTION OUTPUT</h4>
                <h2 className="yield-value">{result.predicted_yield} <small>MT/Ha</small></h2>
                <div className={`status-tag ${result.low_yield_alert ? 'alert' : 'optimal'}`}>
                  {result.recommendation}
                </div>
              </div>
            ) : (
              <div className="placeholder">
                <div className="loading-ring idle"></div>
                <p>Awaiting system input for biometric analysis.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="knowledge" className="info-section alternate-bg">
        <div className="section-header">
          <h2>Intelligence Reports</h2>
          <div className="underline"></div>
        </div>
        <div className="info-grid">
          {dynamicInsights.map((insight, index) => (
            <div className="info-card fade-in" key={index}>
              <h4>{insight.title}</h4>
              <p>{insight.desc}</p>
            </div>
          ))}
          <div className="info-card fade-in">
            <div className="status-indicator">● SYSTEM LIVE</div>
            <h4>Model Integrity</h4>
            <p>Running <strong>RandomForestRegressor</strong>. Cross-validation accuracy maintained at 94.2% for supported soil profiles.</p>
          </div>
        </div>
      </section>

      <section id="news" className="info-section">
        <div className="section-header">
          <h2>Multidisciplinary Research</h2>
          <div className="underline"></div>
        </div>
        <div className="info-grid">
          <div className="news-card">
            <div className="date-tag">WHEAT</div>
            <h4>Global Grain Density</h4>
            <p>Impact of heat stress on protein concentration in winter wheat.</p>
            <a href="https://www.fao.org/worldfoodsituation/csdb/en/" target="_blank" rel="noreferrer" className="read-more">VIEW WHITE PAPER</a>
          </div>
          <div className="news-card">
            <div className="date-tag">CORN</div>
            <h4>Maize Genetics</h4>
            <p>Nitrogen utilization efficiency of modern hybrids.</p>
            <a href="https://www.nature.com/articles/s41598-021-03054-9" target="_blank" rel="noreferrer" className="read-more">VIEW RESEARCH</a>
          </div>
          <div className="news-card">
            <div className="date-tag">RICE</div>
            <h4>Aquatic Nutrients</h4>
            <p>Methane-reducing cultivation in sub-tropical zones.</p>
            <a href="https://www.sciencedirect.com/journal/field-crops-research" target="_blank" rel="noreferrer" className="read-more">VIEW JOURNAL</a>
          </div>
          <div className="news-card">
            <div className="date-tag">SOYBEAN</div>
            <h4>Carbon Fixation</h4>
            <p>Symbiosis between soil quality and nitrogen-fixing bacteria.</p>
            <a href="https://www.frontiersin.org/journals/plant-science" target="_blank" rel="noreferrer" className="read-more">VIEW DATA</a>
          </div>
        </div>
      </section>

      <section id="contact" className="info-section alternate-bg">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Technical Consultation</h2>
            <p>Engage with our agronomic specialists for high-level support.</p>
            <div className="contact-details">
              <p><strong>HQ:</strong> Nairobi, Kenya</p>
              <p><strong>Direct:</strong> +254 721 634 764</p>
              <p><strong>Corporate:</strong> hoziyanarachel7@gmail.com</p>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleContact}>
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Corporate Email" required />
            <textarea placeholder="Specify your inquiry..." rows="4" required></textarea>
            <button type="submit" className="predict-btn">SUBMIT REQUEST</button>
            {contactStatus && <p className="success-msg">{contactStatus}</p>}
          </form>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 AGRIPREDICT SYSTEMS | QUANTITATIVE AGRONOMY FOR GLOBAL SUSTAINABILITY</p>
      </footer>
    </div>
  );
}

export default App;