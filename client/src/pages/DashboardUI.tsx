type Win = Window & {
  goBackToStates?: () => void
  openModal?: (id: string) => void
  closeModal?: (id: string) => void
}

export const DashboardUI = () => {
  const w = () => window as Win

  return (
  <>
<div id="app">
  <header id="topbar">
    <a className="logo" href="/">
      <div className="logo-mark" aria-hidden>O</div>
      <span>Omni<span className="sub">Growth</span></span>
    </a>
    <div id="search-wrap">
      <input type="text" id="search-input" placeholder="Search state, district or crop..." autoComplete="off" spellCheck={false}/>
      <span className="search-icon" aria-hidden>⌕</span>
      <div id="search-results"></div>
    </div>
    <div className="topbar-actions">
      <button type="button" id="back-btn" className="btn-ghost" onClick={() => w().goBackToStates?.()}>← States</button>
      <button type="button" className="btn-ghost" onClick={() => w().openModal?.('delivery-overlay')} title="Delivery Partners"><span className="mo-ic">Dlv</span><span className="mo-tx"> Delivery</span></button>
      <button type="button" className="btn-ghost" onClick={() => w().openModal?.('connected-overlay')} title="Partners"><span className="mo-ic">Net</span><span className="mo-tx"> Partners</span></button>
      <button type="button" className="btn-primary" id="about-btn" title="About OmniGrowth"><span className="mo-ic">Info</span><span className="mo-tx"> About</span></button>
    </div>
  </header>
  <div id="main">
    <div id="map"></div>
    <div id="mode-pill">Click any state to explore</div>
    <div id="legend">
      <h4>Legend</h4>
      <div className="legend-row"><div className="legend-box" style={{ background: '#1c3527', borderColor: '#4abc64' }}></div><span>State</span></div>
      <div className="legend-row"><div className="legend-box" style={{ background: '#2a5535', borderColor: '#7dd98a' }}></div><span>Selected</span></div>
      <div className="legend-row"><div className="legend-box" style={{ background: '#0e2138', borderColor: '#4d9de0' }}></div><span>District</span></div>
    </div>
    <div id="panel">
      <div id="panel-content">
        <div id="welcome">
          <div className="welcome-mark" aria-hidden>O</div>
          <div className="welcome-title">Explore India by state</div>
          <div className="welcome-sub">
            Click a state on the map, then a district, for crops, soil, MSP, and market context.
          </div>
          <p className="welcome-hint">Search above works for states, districts, and crops</p>
        </div>
      </div>
    </div>
  </div>
</div>

<div id="about-overlay" className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) w().closeModal?.('about-overlay'); }}>
  <div className="modal-box">
    <button type="button" className="modal-close" onClick={() => w().closeModal?.('about-overlay')}>×</button>
    <div className="about-hero">
      <div className="about-brand">
        <div className="about-brand-icon">O</div>
        <div>
          <div className="about-brand-name">Omni<span>Growth</span></div>
          <div style={{ fontSize: '.68rem', color: 'var(--text3)', marginTop: '2px' }}>B2B Agricultural Connectivity Platform</div>
        </div>
      </div>
      <div className="about-tagline">
        We bridge farmers, dealers, and buyers across India — right produce to the right market at the right time.
      </div>
    </div>
    <div className="about-body">
      <div className="about-section-title">Contact</div>
      <div className="about-card">
        <div className="about-row">
          <div className="about-icon-box green">V</div>
          <div>
            <span className="about-label">Co-Founder &amp; Director</span>
            <span className="about-val">Varshith</span>
          </div>
        </div>
        <div className="about-row">
          <div className="about-icon-box blue">K</div>
          <div>
            <span className="about-label">Co-Founder &amp; Director</span>
            <span className="about-val">Krishna</span>
          </div>
        </div>
        <div className="about-row">
          <div className="about-icon-box gold">@</div>
          <div>
            <span className="about-label">Business Email</span>
            <span className="about-val"><a href="mailto:Omnigrowth@gmail.com">Omnigrowth@gmail.com</a></span>
          </div>
        </div>
        <div className="about-row">
          <div className="about-icon-box blue">#</div>
          <div>
            <span className="about-label">Contact</span>
            <span className="about-val"><a href="tel:+919192138473">+91 91921 38473</a></span>
          </div>
        </div>
      </div>
      <div className="about-section-title" style={{ marginTop: '16px' }}>Data Sources</div>
      <div className="about-card">
        <div className="sources-grid">
          <span className="source-tag"><a href="https://data.gov.in" target="_blank" rel="noreferrer">data.gov.in</a></span>
          <span className="source-tag"><a href="https://agmarknet.gov.in" target="_blank" rel="noreferrer">Agmarknet</a></span>
          <span className="source-tag"><a href="https://icar.org.in" target="_blank" rel="noreferrer">ICAR</a></span>
          <span className="source-tag"><a href="https://imd.gov.in" target="_blank" rel="noreferrer">IMD</a></span>
          <span className="source-tag"><a href="https://mospi.gov.in" target="_blank" rel="noreferrer">MoSPI</a></span>
          <span className="source-tag"><a href="https://desagri.gov.in" target="_blank" rel="noreferrer">DESA</a></span>
          <span className="source-tag"><a href="https://cacp.dacnet.nic.in" target="_blank" rel="noreferrer">CACP (MSP)</a></span>
        </div>
      </div>
      <div style={{ fontSize: '.68rem', color: 'var(--text3)', marginTop: '10px', lineHeight: '1.6' }}>MSP data from CACP (Government of India). APMC ranges from Agmarknet bulletins.</div>
    </div>
  </div>
</div>

<div id="delivery-overlay" className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) w().closeModal?.('delivery-overlay'); }}>
  <div className="modal-box">
    <button type="button" className="modal-close" onClick={() => w().closeModal?.('delivery-overlay')}>×</button>
    <div className="modal-header">
      <div className="modal-title">Agricultural delivery partners</div>
      <div className="modal-subtitle">Logistics and distribution companies serving Indian agriculture</div>
    </div>
    <div className="modal-body">
      {[
        { mark: 'NC', name: 'Ninjacart', type: 'Fresh Produce Supply Chain', desc: "India's largest agri B2B supply chain. Connects 70,000+ farmers with 1.6 lakh+ retailers across 9 cities.", meta: ['Active', 'ninjacart.in'] },
        { mark: 'WC', name: 'WayCool Foods', type: 'Integrated Agri Supply Chain', desc: 'South India agri-food company managing sourcing and last-mile across 13 states.', meta: ['Active', 'waycoolfoods.com'] },
        { mark: 'DV', name: 'Delhivery (Agri-Express)', type: 'Last-Mile Agri Logistics', desc: '19,000+ pin codes with temperature-controlled and bulk agri freight options.', meta: ['Active', 'delhivery.com'] },
        { mark: 'AR', name: 'Arya.ag', type: 'Post-Harvest Logistics', desc: 'Commodity management with 900+ partner warehouses and 6 million MT+ storage.', meta: ['Active', 'arya.ag'] },
        { mark: 'BH', name: 'BigHaat Agri Express', type: 'Agri Inputs & Output', desc: 'Digital agri marketplace delivering inputs to 17,000+ pin codes with market linkage.', meta: ['Active', 'bighaat.com'] },
        { mark: 'CR', name: 'CONCOR', type: 'Bulk Agri Rail & Road', desc: 'Multi-modal logistics under Ministry of Railways with specialized agri freight corridors.', meta: ['Govt. Enterprise', 'concorindia.com'] },
      ].map((p) => (
        <div className="partner-card" key={p.name}>
          <div className="partner-top">
            <div className="partner-mark">{p.mark}</div>
            <div>
              <div className="partner-name">{p.name}</div>
              <div className="partner-type">{p.type}</div>
            </div>
          </div>
          <div className="partner-desc">{p.desc}</div>
          <div className="partner-meta">
            <span className="partner-badge green">{p.meta[0]}</span>
            <span className="partner-badge blue">{p.meta[1]}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

<div id="connected-overlay" className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) w().closeModal?.('connected-overlay'); }}>
  <div className="modal-box">
    <button type="button" className="modal-close" onClick={() => w().closeModal?.('connected-overlay')}>×</button>
    <div className="modal-header">
      <div className="modal-title">Connected network</div>
      <div className="modal-subtitle">Verified dealers and procurement agencies across India</div>
    </div>
    <div className="modal-body">
      {[
        { name: 'NAFED — National Cooperative Exports', segment: 'Oilseeds, Pulses, Spices & Grains · Pan-India', desc: "India's largest agricultural cooperative. Key PSS procurement for soybean, groundnut, mustard, and pulses.", tags: ['PSS Procurement', 'nafed.com'] },
        { name: 'ITC Agribusiness Division', segment: 'Wheat, Soybean, Coffee, Spices · 17 States', desc: 'e-Choupal network reaches 35,000+ villages with direct digital mandi procurement.', tags: ['Export Focus', 'itcportal.com'] },
        { name: 'Mahindra Agri Solutions', segment: 'Fruits, Vegetables & Grains · 12 States', desc: 'Market linkage for 3 lakh+ farmers with focus on fresh produce and aggregation.', tags: ['B2B Focus', 'mahindraagri.com'] },
        { name: 'Cargill India Pvt. Ltd.', segment: 'Edible Oils, Cotton, Grains · Pan-India', desc: 'Major buyer of cottonseed, soybean, and sunflower with direct farmer networks.', tags: ['Global Exporter', 'cargill.com/india'] },
        { name: 'APEDA — Agri Export Promotion', segment: 'Export Facilitation · All Commodities', desc: 'Govt. body promoting agri exports, GI certification, and quality testing.', tags: ['Export Authority', 'apeda.gov.in'] },
        { name: 'Mother Dairy Fruit & Vegetable', segment: 'Horticulture & Dairy · North & West', desc: 'Procures 200,000+ MT of fresh produce annually under the Safal brand.', tags: ['Retail + B2B', 'motherdairy.com'] },
      ].map((d) => (
        <div className="dealer-card" key={d.name}>
          <div className="dealer-top">
            <div className="dealer-name">{d.name}</div>
            <span className="dealer-verified">Verified</span>
          </div>
          <div className="dealer-segment">{d.segment}</div>
          <div className="dealer-desc">{d.desc}</div>
          <div className="dealer-meta">
            <span className="partner-badge green">{d.tags[0]}</span>
            <span className="partner-badge blue">{d.tags[1]}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

<div id="toast"></div>
  </>
  )
}
