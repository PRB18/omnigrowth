// --- Imports ---
// useState lets us remember one value that can change (here: which listing the buyer clicked)
import { useState } from 'react';
// The pop-up form that appears when a buyer clicks "Contact" on a seller card
import { ContactSellerModal } from '../components/ContactSellerModal';


// --- Type: Win ---
// The Leaflet map (index.html) puts some helper functions on the global `window` object.
// We tell TypeScript about them here so we can call them safely without errors.
type Win = Window & {
  goBackToStates?: () => void          // go back to the all-states view on the map
  openModal?: (id: string) => void     // open a pop-up by its HTML id
  closeModal?: (id: string) => void    // close a pop-up by its HTML id
}

// --- Component: DashboardUI ---
// This is the entire visible UI of the dashboard page.
// It receives two things from the parent (Dashboard.tsx):
//   - districtListings: array of seller listings for the selected district
//   - isLoadingListings: true while we're fetching listings from Supabase
export const DashboardUI = ({ districtListings = [], isLoadingListings = false }: any) => {

  // Helper to safely access the window functions defined by the Leaflet map
  const w = () => window as Win

  // selectedListing = whichever seller card the buyer just clicked "Contact" on.
  // null = no modal shown. Set it to a listing = modal opens for that listing.
  const [selectedListing, setSelectedListing] = useState<any>(null);

  return (
    <>
      {/* ===== MAIN APP SHELL ===== */}
      <div id="app">

        {/* --- TOP BAR (logo + search + nav buttons) --- */}
        <header id="topbar">
          <a className="logo" href="/">
            <div className="logo-mark" aria-hidden>O</div>
            <span>Omni<span className="sub">Growth</span></span>
          </a>

          {/* Search box — handled by the Leaflet map JS in index.html */}
          <div id="search-wrap">
            <input type="text" id="search-input" placeholder="Search state, district or crop..." autoComplete="off" spellCheck={false} />
            <span className="search-icon" aria-hidden>⌕</span>
            <div id="search-results"></div>
          </div>

          {/* Nav buttons — they call map functions (goBackToStates, openModal) */}
          <div className="topbar-actions">
            <button type="button" id="back-btn" className="btn-ghost" onClick={() => w().goBackToStates?.()}>← States</button>
            <button type="button" className="btn-ghost" onClick={() => w().openModal?.('delivery-overlay')} title="Delivery Partners"><span className="mo-ic">Dlv</span><span className="mo-tx"> Delivery</span></button>
            <button type="button" className="btn-ghost" onClick={() => w().openModal?.('connected-overlay')} title="Partners"><span className="mo-ic">Net</span><span className="mo-tx"> Partners</span></button>
            <button type="button" className="btn-primary" id="about-btn" title="About OmniGrowth"><span className="mo-ic">Info</span><span className="mo-tx"> About</span></button>
          </div>
        </header>

        {/* --- MAIN AREA (map + side panel) --- */}
        <div id="main">

          {/* The Leaflet map renders here — controlled by index.html JS */}
          <div id="map"></div>

          {/* Small pill that shows "Click any state to explore" before a state is selected */}
          <div id="mode-pill">Click any state to explore</div>

          {/* Map legend — explains what each colour means */}
          <div id="legend">
            <h4>Legend</h4>
            <div className="legend-row"><div className="legend-box" style={{ background: '#1c3527', borderColor: '#4abc64' }}></div><span>State</span></div>
            <div className="legend-row"><div className="legend-box" style={{ background: '#2a5535', borderColor: '#7dd98a' }}></div><span>Selected</span></div>
            <div className="legend-row"><div className="legend-box" style={{ background: '#0e2138', borderColor: '#4d9de0' }}></div><span>District</span></div>
          </div>

          {/* --- SIDE PANEL (welcome message + live sellers list) --- */}
          <div id="panel">

            {/* Welcome screen shown before the user clicks a district */}
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

            {/* ===== LIVE LOCAL SELLERS SECTION ===== */}
            {/* This section is driven by React. It shows sellers from the `listings` DB table
                for whichever district the user clicked on the map. */}
            <div style={{ padding: '0 20px 24px 20px' }}>
              <h4 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '12px', marginTop: '16px', color: '#166534', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                🛒 Live Local Sellers
              </h4>

              {/* Three states: loading → empty → list of cards */}
              {isLoadingListings ? (
                // State 1: still fetching from the database
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Loading verified sellers...</div>
              ) : districtListings.length === 0 ? (
                // State 2: fetch done but no sellers in this district
                <div style={{ color: '#6b7280', fontSize: '0.875rem', backgroundColor: '#f9fafb', padding: '12px', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                  No active sellers in this district right now.
                </div>
              ) : (
                // State 3: we have sellers — show one card per listing
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                  {districtListings.map((listing: any) => (
                    <div key={listing.id} style={{ backgroundColor: '#ffffff', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                      {/* LEFT SIDE: Seller name, crop, and available stock */}
                      <div>
                        <p style={{ fontWeight: 'bold', color: '#14532d', fontSize: '0.875rem', margin: 0 }}>
                          🧑‍🌾 {listing.profiles?.name || 'Verified Farmer'}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#4b5563', fontWeight: '500', textTransform: 'capitalize', marginTop: '4px', marginBottom: 0 }}>
                          {listing.crop_id}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
                          Stock: {listing.quantity_available} {listing.unit}
                        </p>
                      </div>

                      {/* RIGHT SIDE: Price and the "Contact" button */}
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#111827', margin: 0 }}>
                          ₹{listing.price_per_unit}<span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: '#4b5563' }}>/{listing.unit}</span>
                        </p>
                        {/* Clicking this saves this listing into selectedListing state,
                            which triggers the ContactSellerModal to open below */}
                        <button
                          onClick={() => setSelectedListing(listing)}
                          style={{ marginTop: '8px', backgroundColor: '#16a34a', color: '#ffffff', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
                        >
                          Contact
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* ===== END LIVE LOCAL SELLERS ===== */}

          </div>
        </div>
      </div>

      {/* ===== ABOUT MODAL =====
          Opens when user clicks the "About" button in the top bar.
          Clicking outside the white box (on the dark overlay) also closes it. */}
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
            {/* Founder contact info */}
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
            {/* Where the app's data comes from */}
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

      {/* ===== DELIVERY PARTNERS MODAL =====
          Opens when user clicks the "Delivery" button in the top bar.
          Lists logistics companies that can move produce across India. */}
      <div id="delivery-overlay" className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) w().closeModal?.('delivery-overlay'); }}>
        <div className="modal-box">
          <button type="button" className="modal-close" onClick={() => w().closeModal?.('delivery-overlay')}>×</button>
          <div className="modal-header">
            <div className="modal-title">Agricultural delivery partners</div>
            <div className="modal-subtitle">Logistics and distribution companies serving Indian agriculture</div>
          </div>
          <div className="modal-body">
            {/* Each object in this array = one delivery partner card */}
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

      {/* ===== CONNECTED NETWORK MODAL =====
          Opens when user clicks the "Partners" button in the top bar.
          Lists verified dealers and procurement agencies across India. */}
      <div id="connected-overlay" className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) w().closeModal?.('connected-overlay'); }}>
        <div className="modal-box">
          <button type="button" className="modal-close" onClick={() => w().closeModal?.('connected-overlay')}>×</button>
          <div className="modal-header">
            <div className="modal-title">Connected network</div>
            <div className="modal-subtitle">Verified dealers and procurement agencies across India</div>
          </div>
          <div className="modal-body">
            {/* Each object in this array = one dealer/agency card */}
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

      {/* Toast notification area — used by the Leaflet map JS to show brief messages */}
      <div id="toast"></div>

      {/* ===== CONTACT SELLER MODAL =====
          Only renders when a buyer clicked "Contact" on a seller card.
          selectedListing holds that seller's data.
          When the buyer submits or closes, onClose() sets selectedListing back to null,
          which makes this modal disappear. */}
      {selectedListing && (
        <ContactSellerModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </>
  )
}
