export const DashboardUI = () => (
  <>
<div id="app">
  <header id="topbar">
    <a className="logo" href="#">
      <div className="logo-icon">&#127807;</div>
      <span>Omni<span className="sub">Growth</span></span>
    </a>
    <div id="search-wrap">
      <input type="text" id="search-input" placeholder="Search state, district or crop..." autoComplete="off" spellCheck={false}/>
      <span className="search-icon">&#128269;</span>
      <div id="search-results"></div>
    </div>
    <div className="topbar-actions">
      <button id="back-btn" className="btn-ghost" onClick={() => (window as any).goBackToStates()}>&#8592; States</button>
      <button className="btn-ghost" onClick={() => (window as any).openModal('delivery-overlay')} title="Delivery Partners"><span className="mo-ic">&#128666;</span><span className="mo-tx"> Delivery</span></button>
      <button className="btn-ghost" onClick={() => (window as any).openModal('connected-overlay')} title="Partners"><span className="mo-ic">&#127757;</span><span className="mo-tx"> Partners</span></button>
      <button className="btn-primary" id="about-btn" title="About OmniGrowth"><span className="mo-ic">&#9432;</span><span className="mo-tx"> OmniGrowth</span></button>
    </div>
  </header>
  <div id="main">
    <div id="map"></div>
    <div id="mode-pill">&#128507; Click any state to explore</div>
    <div id="legend">
      <h4>Legend</h4>
      <div className="legend-row"><div className="legend-box" style={{ background: '#1c3527', borderColor: '#4abc64' }}></div><span>State</span></div>
      <div className="legend-row"><div className="legend-box" style={{ background: '#2a5535', borderColor: '#7dd98a' }}></div><span>Selected State</span></div>
      <div className="legend-row"><div className="legend-box" style={{ background: '#0e2138', borderColor: '#4d9de0' }}></div><span>District</span></div>
    </div>
    <div id="panel">
      <div id="panel-content">
        <div id="welcome">
          <div className="welcome-icon">&#127807;</div>
          <div className="welcome-title">OmniGrowth Agricultural Intelligence</div>
          <div className="welcome-sub">Click any state on the map, then drill into any district for crops, soil, MSP prices &amp; market data.</div>
          
          <div className="ticker-wrap" style={{ marginTop: '20px', background: 'rgba(212,165,71,.08)', border: '1px solid rgba(212,165,71,.25)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', whiteSpace: 'nowrap', padding: '8px 0', fontSize: '0.75rem', color: 'var(--gold)', fontWeight: '600' }}>
            <div className="ticker-inner" style={{ display: 'inline-block', animation: 'ticker 25s linear infinite', paddingLeft: '100%' }}>
              &#9679; LIVE APMC AVERAGES: WHEAT &#8377;2,350/qtl &#8593; &nbsp;&nbsp;&nbsp; COTTON &#8377;7,200/qtl &#8595; &nbsp;&nbsp;&nbsp; SOYBEAN &#8377;4,800/qtl &#8593; &nbsp;&nbsp;&nbsp; MUSTARD &#8377;5,900/qtl &nbsp;&nbsp;&nbsp; GROUNDNUT &#8377;6,500/qtl &#8593;
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px', textAlign: 'left' }}>
             <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase' }}>Tracked Districts</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent)' }}>820+</div>
             </div>
             <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase' }}>Monitored Crops</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--blue)' }}>120+</div>
             </div>
          </div>

          <ul className="feature-list" style={{ marginTop: '16px' }}>
            <li><span className="fi">&#127793;</span>Kharif, Rabi &amp; Zaid season crops</li>
            <li><span className="fi">&#128176;</span>Cash Crops automatically highlighted</li>
            <li><span className="fi">&#8377;</span>Government MSP &amp; APMC market rates</li>
            <li><span className="fi">&#127756;</span>Click any district boundary on map</li>
            <li><span className="fi">&#128269;</span>Search crops, districts, states</li>
          </ul>
          
          
        </div>
      </div>
    </div>
  </div>
</div>

{/* ===== ABOUT MODAL ===== */}
<div id="about-overlay" className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) (window as any).closeModal('about-overlay'); }}>
  <div className="modal-box">
    <button className="modal-close" onClick={() => (window as any).closeModal('about-overlay')}>&#10005;</button>
    <div className="about-hero">
      <div className="about-brand">
        <div className="about-brand-icon">&#127807;</div>
        <div>
          <div className="about-brand-name">Omni<span>Growth</span></div>
          <div style={{ fontSize: '.68rem', color: 'var(--text3)', marginTop: '2px' }}>B2B Agricultural Connectivity Platform</div>
        </div>
      </div>
      <div className="about-tagline">
        We are a B2B connectivity service that bridges farmers, dealers, and buyers across every corner of India &mdash; delivering the right produce to the right market at the right time.
      </div>
    </div>
    <div className="about-body">
      <div className="about-section-title">Contact</div>
      <div className="about-card">
        <div className="about-row">
          <div className="about-icon-box green">&#128100;</div>
          <div>
            <span className="about-label">Co-Founder &amp; Director</span>
            <span className="about-val">Varshith</span>
          </div>
        </div>
        <div className="about-row">
          <div className="about-icon-box blue">&#128100;</div>
          <div>
            <span className="about-label">Co-Founder &amp; Director</span>
            <span className="about-val">Krishna</span>
          </div>
        </div>
        <div className="about-row">
          <div className="about-icon-box gold">&#9993;</div>
          <div>
            <span className="about-label">Business Email</span>
            <span className="about-val"><a href="mailto:Omnigrowth@gmail.com">Omnigrowth@gmail.com</a></span>
          </div>
        </div>
        <div className="about-row">
          <div className="about-icon-box blue">&#128222;</div>
          <div>
            <span className="about-label">Contact</span>
            <span className="about-val"><a href="tel:+919192138473">+91 91921 38473</a></span>
          </div>
        </div>
      </div>
      <div className="about-section-title" style={{ marginTop: '16px' }}>Data Sources</div>
      <div className="about-card">
        <div className="sources-grid">
          <span className="source-tag"><a href="https://data.gov.in" target="_blank">data.gov.in</a></span>
          <span className="source-tag"><a href="https://agmarknet.gov.in" target="_blank">Agmarknet</a></span>
          <span className="source-tag"><a href="https://icar.org.in" target="_blank">ICAR</a></span>
          <span className="source-tag"><a href="https://imd.gov.in" target="_blank">IMD</a></span>
          <span className="source-tag"><a href="https://mospi.gov.in" target="_blank">MoSPI</a></span>
          <span className="source-tag"><a href="https://desagri.gov.in" target="_blank">DESA</a></span>
          <span className="source-tag"><a href="https://cacp.dacnet.nic.in" target="_blank">CACP (MSP)</a></span>
        </div>
      </div>
      <div style={{ fontSize: '.68rem', color: 'var(--text3)', marginTop: '10px', lineHeight: '1.6' }}>MSP data is sourced from CACP reports (Government of India). APMC market rate ranges are sourced from Agmarknet price bulletins.</div>
    </div>
  </div>
</div>

{/* ===== DELIVERY MODAL ===== */}
<div id="delivery-overlay" className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) (window as any).closeModal('delivery-overlay'); }}>
  <div className="modal-box">
    <button className="modal-close" onClick={() => (window as any).closeModal('delivery-overlay')}>&#10005;</button>
    <div className="modal-header">
      <div className="modal-title">&#128666; Agricultural Delivery Partners</div>
      <div className="modal-subtitle">Top logistics and distribution companies serving Indian agriculture</div>
    </div>
    <div className="modal-body">

      <div className="partner-card">
        <div className="partner-top">
          <div className="partner-emoji">&#128998;</div>
          <div>
            <div className="partner-name">Ninjacart</div>
            <div className="partner-type">Fresh Produce Supply Chain &mdash; Farm to Business</div>
          </div>
        </div>
        <div className="partner-desc">India's largest agri B2B supply chain company. Connects 70,000+ farmers directly with 1.6 lakh+ retailers across 9 cities. Moves 1,400+ tonnes of fresh produce daily with zero middlemen.</div>
        <div className="partner-meta">
          <span className="partner-badge green">&#9679; Active</span>
          <span className="partner-badge blue">ninjacart.in</span>
          <span className="partner-badge gold">&#128222; 1800-123-0000</span>
        </div>
      </div>

      <div className="partner-card">
        <div className="partner-top">
          <div className="partner-emoji">&#127807;</div>
          <div>
            <div className="partner-name">WayCool Foods</div>
            <div className="partner-type">Integrated Agri Supply Chain</div>
          </div>
        </div>
        <div className="partner-desc">South India's largest agri-food company, managing sourcing, processing, and last-mile delivery across 13 states. Handles 1,200+ tonnes of produce daily with cold chain infrastructure.</div>
        <div className="partner-meta">
          <span className="partner-badge green">&#9679; Active</span>
          <span className="partner-badge blue">waycoolfoods.com</span>
          <span className="partner-badge gold">Chennai HQ</span>
        </div>
      </div>

      <div className="partner-card">
        <div className="partner-top">
          <div className="partner-emoji">&#128230;</div>
          <div>
            <div className="partner-name">Delhivery (Agri-Express)</div>
            <div className="partner-type">Last-Mile Agri Logistics</div>
          </div>
        </div>
        <div className="partner-desc">India's largest logistics company with 19,000+ pin codes covered. Offers temperature-controlled shipping and bulk agri freight. Partnerships with APMC mandis for inter-state grain transport.</div>
        <div className="partner-meta">
          <span className="partner-badge green">&#9679; Active</span>
          <span className="partner-badge blue">delhivery.com</span>
          <span className="partner-badge gold">&#128222; 011-40191030</span>
        </div>
      </div>

      <div className="partner-card">
        <div className="partner-top">
          <div className="partner-emoji">&#128717;</div>
          <div>
            <div className="partner-name">Arya.ag</div>
            <div className="partner-type">Post-Harvest Logistics &amp; Warehousing</div>
          </div>
        </div>
        <div className="partner-desc">India's largest agri commodity management platform. Manages 900+ partner warehouses across 22 states with 6 million MT+ storage capacity. Provides commodity financing, trade, and price discovery.</div>
        <div className="partner-meta">
          <span className="partner-badge green">&#9679; Active</span>
          <span className="partner-badge blue">arya.ag</span>
          <span className="partner-badge gold">&#128222; 1800-270-2792</span>
        </div>
      </div>

      <div className="partner-card">
        <div className="partner-top">
          <div className="partner-emoji">&#9992;</div>
          <div>
            <div className="partner-name">BigHaat Agri Express</div>
            <div className="partner-type">Agri Inputs &amp; Output Delivery</div>
          </div>
        </div>
        <div className="partner-desc">India's leading digital agri marketplace. Delivers seeds, fertilizers, pesticides, and farm equipment to 17,000+ pin codes. Also provides output market linkage for 1 million+ farmers.</div>
        <div className="partner-meta">
          <span className="partner-badge green">&#9679; Active</span>
          <span className="partner-badge blue">bighaat.com</span>
          <span className="partner-badge gold">&#128222; 1800-3000-2434</span>
        </div>
      </div>

      <div className="partner-card">
        <div className="partner-top">
          <div className="partner-emoji">&#128718;</div>
          <div>
            <div className="partner-name">CONCOR (Container Corporation)</div>
            <div className="partner-type">Bulk Agri Rail &amp; Road Freight</div>
          </div>
        </div>
        <div className="partner-desc">India's dominant multi-modal logistics operator under Ministry of Railways. Operates 65+ inland container depots. Specialized agri freight corridors for wheat, rice, and pulses to ports and mandis.</div>
        <div className="partner-meta">
          <span className="partner-badge green">&#9679; Govt. Enterprise</span>
          <span className="partner-badge blue">concorindia.com</span>
          <span className="partner-badge gold">&#128222; 011-26169001</span>
        </div>
      </div>

    </div>
  </div>
</div>

{/* ===== WE ARE CONNECTED MODAL ===== */}
<div id="connected-overlay" className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) (window as any).closeModal('connected-overlay'); }}>
  <div className="modal-box">
    <button className="modal-close" onClick={() => (window as any).closeModal('connected-overlay')}>&#10005;</button>
    <div className="modal-header">
      <div className="modal-title">&#127757; We Are Connected</div>
      <div className="modal-subtitle">OmniGrowth's network of verified top agricultural dealers &amp; procurement agencies across India</div>
    </div>
    <div className="modal-body">

      <div className="dealer-card">
        <div className="dealer-top">
          <div className="dealer-name">NAFED &mdash; National Cooperative Exports</div>
          <span className="dealer-verified">&#9989; Verified</span>
        </div>
        <div className="dealer-segment">&#128200; Oilseeds, Pulses, Spices &amp; Grains &bull; Pan-India</div>
        <div className="dealer-desc">India's largest agricultural cooperative. Procures directly from farmers for government buffer stock (Price Support Scheme). Key procurement agency for soybean, groundnut, mustard, and pulses.</div>
        <div className="dealer-meta">
          <span className="partner-badge green">PSS Procurement</span>
          <span className="partner-badge blue">nafed.com</span>
          <span className="partner-badge gold">&#128222; 011-26862367</span>
        </div>
      </div>

      <div className="dealer-card">
        <div className="dealer-top">
          <div className="dealer-name">ITC Agribusiness Division</div>
          <span className="dealer-verified">&#9989; Verified</span>
        </div>
        <div className="dealer-segment">&#127807; Wheat, Soybean, Coffee, Spices &bull; 17 States</div>
        <div className="dealer-desc">India's largest agri-commodity exporter. ITC's e-Choupal network reaches 35,000+ villages. Procures wheat, soybean, maize, and spices directly through its proprietary digital mandi network.</div>
        <div className="dealer-meta">
          <span className="partner-badge green">Export Focus</span>
          <span className="partner-badge blue">itcportal.com</span>
          <span className="partner-badge gold">Kolkata HQ</span>
        </div>
      </div>

      <div className="dealer-card">
        <div className="dealer-top">
          <div className="dealer-name">Mahindra Agri Solutions</div>
          <span className="dealer-verified">&#9989; Verified</span>
        </div>
        <div className="dealer-segment">&#128200; Fruits, Vegetables &amp; Grains &bull; 12 States</div>
        <div className="dealer-desc">Mahindra Group's agri business vertical providing market linkage for 3 lakh+ farmers. Key focus on fresh produce (grapes, banana, pomegranate) and commodity aggregation in Maharashtra and Karnataka.</div>
        <div className="dealer-meta">
          <span className="partner-badge green">B2B Focus</span>
          <span className="partner-badge blue">mahindraagri.com</span>
          <span className="partner-badge gold">Mumbai HQ</span>
        </div>
      </div>

      <div className="dealer-card">
        <div className="dealer-top">
          <div className="dealer-name">Cargill India Pvt. Ltd.</div>
          <span className="dealer-verified">&#9989; Verified</span>
        </div>
        <div className="dealer-segment">&#127807; Edible Oils, Cotton, Grains &bull; Pan-India</div>
        <div className="dealer-desc">Global agribusiness giant with deep India operations. Major buyer of cottonseed, soybean, and sunflower for oil processing. Operates grain elevators and works with 80,000+ farmers through direct procurement.</div>
        <div className="dealer-meta">
          <span className="partner-badge green">Global Exporter</span>
          <span className="partner-badge blue">cargill.com/india</span>
          <span className="partner-badge gold">Gurugram HQ</span>
        </div>
      </div>

      <div className="dealer-card">
        <div className="dealer-top">
          <div className="dealer-name">APEDA &mdash; Agri Export Promotion</div>
          <span className="dealer-verified">&#9989; Govt. Verified</span>
        </div>
        <div className="dealer-segment">&#9992; Export Facilitation &bull; All Commodities</div>
        <div className="dealer-desc">Govt. of India body under Ministry of Commerce promoting export of agricultural products. Key contact for rice, mango, grapes, onion, and processed food exports. Facilitates GI certification and quality testing.</div>
        <div className="dealer-meta">
          <span className="partner-badge green">Export Authority</span>
          <span className="partner-badge blue">apeda.gov.in</span>
          <span className="partner-badge gold">&#128222; 011-26513204</span>
        </div>
      </div>

      <div className="dealer-card">
        <div className="dealer-top">
          <div className="dealer-name">Mother Dairy Fruit &amp; Vegetable</div>
          <span className="dealer-verified">&#9989; Verified</span>
        </div>
        <div className="dealer-segment">&#127813; Horticulture &amp; Dairy &bull; North &amp; West India</div>
        <div className="dealer-desc">India's major integrated food company. Procures 200,000+ MT of fresh fruits and vegetables annually under the "Safal" brand. Direct farmer procurement in HP, Punjab, Maharashtra, and Karnataka.</div>
        <div className="dealer-meta">
          <span className="partner-badge green">Retail + B2B</span>
          <span className="partner-badge blue">motherdairy.com</span>
          <span className="partner-badge gold">&#128222; 1800-180-1018</span>
        </div>
      </div>

    </div>
  </div>
</div>

<div id="toast"></div>

  </>
);
