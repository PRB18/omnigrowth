// @ts-nocheck
import { useEffect, useState } from 'react';
// @ts-nocheck
declare const L: any;
// @ts-nocheck
import { STATE_DATA, DISTRICT_DATA, CROP_PRICES } from '../lib/data';
import { supabase } from '../lib/supabase';
import {
  aggregateMandiForCrop,
  findMspBaseline,
  formatMandiRange,
  formatMspDisplay,
} from '../lib/priceResolve';

export function useMapLogic() {
  const [districtListings, setDistrictListings] = useState<any[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(false);

  const fetchListingsForDistrict = async (districtName: string) => {
    setIsLoadingListings(true);
    const { data, error } = await supabase
      .from('listings')
      .select(`*, profiles ( full_name, phone_number )`)
      .eq('district_name', districtName)
      .eq('is_active', true);

    if (error) console.error("Supabase Error:", error);
    else setDistrictListings(data || []);
    setIsLoadingListings(false);
  };
  useEffect(() => {
    const mapEl = document.getElementById('map');
    if (!mapEl) return;

    // Tear down any leftover Leaflet instance (Strict Mode / remount)
    if ((mapEl as any)._leaflet_id) {
      try {
        (mapEl as any)._leaflet_id = null;
        mapEl.innerHTML = '';
      } catch {
        /* ignore */
      }
    }

    // Add globals that the UI expects
    (window as any).showToast = function (m: string, dur?: number) {
      const t = document.getElementById('toast');
      if (!t) return;
      t.textContent = m;
      t.classList.add('show');
      if (dur !== 0) setTimeout(() => t.classList.remove('show'), dur || 2500);
    };
    (window as any).hideToast = function () {
      const t = document.getElementById('toast');
      if (t) t.classList.remove('show');
    };
    (window as any).openModal = function (id: string) {
      const m = document.getElementById(id);
      if (m) m.classList.add('open');
    };
    (window as any).closeModal = function (id: string) {
      const m = document.getElementById(id);
      if (m) m.classList.remove('open');
    };

    // ===== MAP SETUP =====
    var map = L.map('map', { center: [22, 82], zoom: 5, zoomControl: true, attributionControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', { maxZoom: 19, subdomains: 'abcd' }).addTo(map);

    var stateLayer = null, districtLayer = null, currentState = null, selectedDistLayer = null;

    // State name → local geojson filename
    var STATE_FILE = {
      "Andhra Pradesh": "andhra_pradesh", "Arunachal Pradesh": "arunachal_pradesh",
      "Assam": "assam", "Bihar": "bihar", "Chhattisgarh": "chhattisgarh", "Goa": "goa",
      "Gujarat": "gujarat", "Haryana": "haryana", "Himachal Pradesh": "himachal_pradesh",
      "Jharkhand": "jharkhand", "Karnataka": "karnataka", "Kerala": "kerala",
      "Madhya Pradesh": "madhya_pradesh", "Maharashtra": "maharashtra", "Manipur": "manipur",
      "Meghalaya": "meghalaya", "Mizoram": "mizoram", "Nagaland": "nagaland", "Odisha": "odisha",
      "Punjab": "punjab", "Rajasthan": "rajasthan", "Sikkim": "sikkim", "Tamil Nadu": "tamil_nadu",
      "Telangana": "telangana", "Tripura": "tripura", "Uttar Pradesh": "uttar_pradesh",
      "Uttarakhand": "uttarakhand", "West Bengal": "west_bengal",
      "Delhi": "delhi", "Jammu and Kashmir": "jammu_and_kashmir", "Ladakh": "ladakh",
      "Andaman and Nicobar": "andaman_and_nicobar", "Chandigarh": "chandigarh",
      "Lakshadweep": "lakshadweep", "Puducherry": "puducherry",
      "Dadra and Nagar Haveli and Daman and Diu": "dadra___nagar_haveli___daman___diu"
    };

    // GeoJSON STNAME → our data key
    var GEO_TO_DATA = {
      "ANDHRA PRADESH": "Andhra Pradesh", "ARUNACHAL PRADESH": "Arunachal Pradesh",
      "ASSAM": "Assam", "BIHAR": "Bihar", "CHHATTISGARH": "Chhattisgarh", "GOA": "Goa",
      "GUJARAT": "Gujarat", "HARYANA": "Haryana", "HIMACHAL PRADESH": "Himachal Pradesh",
      "JHARKHAND": "Jharkhand", "KARNATAKA": "Karnataka", "KERALA": "Kerala",
      "MADHYA PRADESH": "Madhya Pradesh", "MAHARASHTRA": "Maharashtra", "MANIPUR": "Manipur",
      "MEGHALAYA": "Meghalaya", "MIZORAM": "Mizoram", "NAGALAND": "Nagaland", "ODISHA": "Odisha",
      "PUNJAB": "Punjab", "RAJASTHAN": "Rajasthan", "SIKKIM": "Sikkim", "TAMIL NADU": "Tamil Nadu",
      "TELANGANA": "Telangana", "TRIPURA": "Tripura", "UTTAR PRADESH": "Uttar Pradesh",
      "UTTARAKHAND": "Uttarakhand", "WEST BENGAL": "West Bengal",
      "ANDAMAN & NICOBAR": "Andaman and Nicobar", "CHANDIGARH": "Chandigarh", "DELHI": "Delhi",
      "JAMMU & KASHMIR": "Jammu and Kashmir", "LADAKH": "Ladakh", "LAKSHADWEEP": "Lakshadweep",
      "PUDUCHERRY": "Puducherry", "DAMAN & DIU": "Dadra and Nagar Haveli and Daman and Diu",
      "DADRA & NAGAR HAVELI": "Dadra and Nagar Haveli and Daman and Diu"
    };

    // Styles
    function stS() { return { fillColor: '#1c3527', fillOpacity: .78, color: '#4abc64', weight: 1.4, opacity: .85 }; }
    function hovS() { return { fillColor: '#243f2e', fillOpacity: .88, color: '#90e0a0', weight: 2, opacity: 1 }; }
    function selS() { return { fillColor: '#2a5535', fillOpacity: .92, color: '#7dd98a', weight: 2.5, opacity: 1 }; }
    function dstS() { return { fillColor: '#0e2138', fillOpacity: .7, color: '#4d9de0', weight: 0.85, opacity: .85 }; }
    function dstHovS() { return { fillColor: '#163047', fillOpacity: .85, color: '#7ecaec', weight: 1.8, opacity: 1 }; }
    function dstSelS() { return { fillColor: '#1a3d5e', fillOpacity: .92, color: '#7ecaec', weight: 2.5, opacity: 1 }; }

    // ===== STATE MAP =====
    function loadStateMap() {
      showToast('Loading India map\u2026', 0);
      fetch('https://raw.githubusercontent.com/datta07/INDIAN-SHAPEFILES/master/INDIA/INDIA_STATES.geojson')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          stateLayer = L.geoJSON(data, {
            style: stS,
            onEachFeature: function (f, layer) {
              var raw = (f.properties.STNAME || '').toUpperCase().trim();
              var name = GEO_TO_DATA[raw] || raw;
              layer._kriName = name;
              layer.bindTooltip(name, { sticky: true, direction: 'top', offset: [0, -4] });
              layer.on('mouseover', function (e) { if (name !== currentState) e.target.setStyle(hovS()); });
              layer.on('mouseout', function (e) { if (name !== currentState && stateLayer) stateLayer.resetStyle(e.target); });
              layer.on('click', function (e) {
                L.DomEvent.stopPropagation(e);
                map.fitBounds(layer.getBounds(), { padding: [30, 30], maxZoom: 8 });
                onStateClick(name, layer);
              });
            }
          }).addTo(map);
          hideToast();
        })
        .catch(function (e) { hideToast(); showToast('Map load failed. Check internet.'); console.error(e); });
    }

    // ===== STATE CLICK =====
    function onStateClick(name, layer) {
      currentState = name;
      if (stateLayer) stateLayer.eachLayer(function (l) { stateLayer.resetStyle(l); });
      layer.setStyle(selS());
      var backBtn = document.getElementById('back-btn');
      if (backBtn) backBtn.classList.add('visible');
      var pill = document.getElementById('mode-pill');
      if (pill) {
        pill.textContent = name + ' — click a district';
        pill.classList.add('is-drilling');
        pill.classList.remove('is-loading');
      }
      showStatePanel(name);
      loadDistrictMap(name);
    }

    // ===== DISTRICT MAP (loads local per-state file) =====
    function loadDistrictMap(stateName) {
      if (districtLayer) { map.removeLayer(districtLayer); districtLayer = null; selectedDistLayer = null; }
      var fname = STATE_FILE[stateName];
      if (!fname) { console.warn('No district file for', stateName); return; }
      // Absolute path so /app and /app/prices still resolve geodata correctly
      var url = '/geodata/' + fname + '.geojson';
      var pill = document.getElementById('mode-pill');
      if (pill) { pill.classList.add('is-loading'); pill.textContent = 'Loading districts…'; }
      showToast('Loading districts\u2026', 0);
      fetch(url)
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          return r.json();
        })
        .then(function (data) {
          hideToast();
          if (pill) {
            pill.classList.remove('is-loading');
            pill.textContent = stateName + ' — click a district';
            pill.classList.add('is-drilling');
          }
          districtLayer = L.geoJSON(data, {
            style: dstS,
            onEachFeature: function (f, layer) {
              var dn = (f.properties.name || f.properties.NAME || '').trim();
              layer._dstName = dn;
              if (dn) layer.bindTooltip(dn, { sticky: true, direction: 'top', offset: [0, -4] });
              layer.on('mouseover', function (e) { if (dn !== currentDistrict) e.target.setStyle(dstHovS()); });
              layer.on('mouseout', function (e) { if (dn !== currentDistrict && districtLayer) districtLayer.resetStyle(e.target); });
              layer.on('click', function (e) {
                L.DomEvent.stopPropagation(e);
                if (selectedDistLayer) districtLayer.resetStyle(selectedDistLayer);
                selectedDistLayer = e.target;
                e.target.setStyle(dstSelS());
                map.fitBounds(layer.getBounds(), { padding: [20, 20], maxZoom: 11 });
                if (dn) {
                  fetchListingsForDistrict(dn);
                  showDistrictPanel(dn, stateName);
                }
              });
            }
          }).addTo(map);
          showToast(data.features.length + ' districts loaded', 2000);
        })
        .catch(function (e) {
          hideToast();
          if (pill) {
            pill.classList.remove('is-loading');
            pill.textContent = stateName + ' — district data unavailable';
          }
          console.warn('District load error:', e);
        });
    }
    var currentDistrict = '';

    // ===== HELPER =====
    function esc(s) { return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

    function srcBox() {
      return '<div class="source-box"><strong>Sources:</strong> ' +
        '<a href="https://data.gov.in" target="_blank">data.gov.in</a> &middot; ' +
        '<a href="https://agmarknet.gov.in" target="_blank">Agmarknet (MSP)</a> &middot; ' +
        '<a href="https://icar.org.in" target="_blank">ICAR</a> &middot; ' +
        '<a href="https://imd.gov.in" target="_blank">IMD</a></div>';
    }

    function priceCard(cropName, regionName) {
      var key = cropName.split(/[\s(]/)[0];
      var p = CROP_PRICES[key] || CROP_PRICES[cropName];
      if (!p) return '';
      var isStatePanel = Boolean(STATE_DATA[regionName]);
      var localNote = !isStatePanel
        ? ('Local arrivals in <strong>' + regionName + '</strong> mandis — live Agmarknet when available, else MSP from DB.')
        : ('Statewide APMC aggregates for <strong>' + regionName + '</strong>. Live mandi when synced; MSP from non-realtime DB otherwise.');

      // IDs use panel crop names so async overlay can fuzzy-match DB crops back to the card
      var safeCrop = cropName.replace(/[^a-zA-Z0-9]/g, '');
      var safeRegion = regionName.replace(/[^a-zA-Z0-9]/g, '');
      var priceId = 'live-price-' + safeRegion + '-' + safeCrop;
      var mspId = 'msp-price-' + safeRegion + '-' + safeCrop;

      return '<div class="price-card">' +
        '<div class="price-header">' +
        '<div class="price-icon">&#8377;</div>' +
        '<strong>' + cropName + '</strong>' +
        '<span class="price-live" id="live-badge-' + priceId + '" style="display:none; background: #eab308; color: #000; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-left: 8px;">LIVE</span>' +
        '<span class="price-live" id="msp-badge-' + priceId + '" style="display:none; background: #4abc64; color: #000; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-left: 8px;">MSP DB</span>' +
        '</div>' +
        '<div class="price-grid">' +
        '<div><div class="price-label">Govt. MSP / FRP</div><div class="price-val accent" id="' + mspId + '">' + p.msp + '</div></div>' +
        '<div><div class="price-label">APMC Mandi Range</div><div class="price-val gold" id="' + priceId + '">' + p.market + '</div></div>' +
        '</div>' +
        '<div class="price-info-row" style="margin-top:6px;background:rgba(77,157,224,.08);padding:6px;border-radius:4px;border:1px solid rgba(77,157,224,.15);"><span class="price-key">&#128204; ' + regionName + '</span><span class="price-detail" style="font-size:0.7rem;color:var(--blue);">' + localNote + '</span></div>' +
        '<div class="price-info-row" style="margin-top:8px"><span class="price-key">&#127968; Key Mandis</span><span class="price-detail">' + p.key_mandis + '</span></div>' +
        '<div class="price-info-row"><span class="price-key">&#128722; Buyers</span><span class="price-detail">' + p.buyers + '</span></div>' +
        '<div class="price-info-row"><span class="price-key">&#128197; Season</span><span class="price-detail">' + p.season + '</span></div>' +
        '<div class="price-info-row"><span class="price-key">&#128200; Volume</span><span class="price-detail">' + p.traded + '</span></div>' +
        '<div class="price-note">' + p.note + '</div>' +
        '</div>';
    }

    function buildPriceSection(cropList, regionName) {
      var seen = {}, cards = '', count = 0;
      var validCrops = [];
      cropList.forEach(function (c) {
        if (count >= 4) return;
        var k = c.split(/[\s(]/)[0];
        if (!seen[k] && (CROP_PRICES[k] || CROP_PRICES[c])) {
          seen[k] = 1; cards += priceCard(c, regionName); count++;
          validCrops.push(c);
        }
      });

      // Kick off async Supabase fetch (live mandi + MSP DB fallback)
      if (validCrops.length > 0) {
        fetchLivePricesForPanel(validCrops, regionName);
      }

      return count > 0 ? '<div class="sec-head">&#8377; ' + regionName + ' Market Rates &amp; Crop Intelligence</div>' + cards : '';
    }

    async function fetchLivePricesForPanel(cropList, regionName) {
      // Live Agmarknet (market set) by district or state; MSP baseline (district null) as fallback
      try {
        const isState = Boolean(STATE_DATA[regionName]);
        let mandiQuery = supabase
          .from('msp_prices')
          .select('crop, min_price, max_price, modal_price, msp, arrival_date, state, district, market')
          .not('market', 'is', null)
          .order('arrival_date', { ascending: false })
          .limit(2000);

        if (isState) {
          mandiQuery = mandiQuery.eq('state', regionName);
        } else {
          mandiQuery = mandiQuery.eq('district', regionName);
        }

        const [mandiRes, mspRes] = await Promise.all([
          mandiQuery,
          supabase.from('msp_prices').select('crop, msp').is('district', null),
        ]);

        if (mandiRes.error) throw mandiRes.error;
        if (mspRes.error) console.warn('MSP baseline fetch:', mspRes.error.message);

        const mandiRows = mandiRes.data || [];
        const mspRows = mspRes.data || [];
        const safeRegion = regionName.replace(/[^a-zA-Z0-9]/g, '');

        cropList.forEach(function (panelCrop) {
          const safeCrop = panelCrop.replace(/[^a-zA-Z0-9]/g, '');
          const priceId = 'live-price-' + safeRegion + '-' + safeCrop;
          const mspId = 'msp-price-' + safeRegion + '-' + safeCrop;
          const el = document.getElementById(priceId);
          const mspEl = document.getElementById(mspId);
          const liveBadge = document.getElementById('live-badge-' + priceId);
          const mspBadge = document.getElementById('msp-badge-' + priceId);

          const agg = aggregateMandiForCrop(mandiRows, panelCrop);
          const baselineMsp = findMspBaseline(mspRows, panelCrop);
          const mspValue = (agg && agg.msp > 0) ? agg.msp : baselineMsp;

          if (mspEl && mspValue != null && mspValue > 0) {
            mspEl.textContent = formatMspDisplay(mspValue);
            if (!agg && mspBadge) {
              mspBadge.style.display = 'inline-block';
            }
          }

          if (agg && el) {
            el.classList.add('price-val-live');
            el.innerHTML = formatMandiRange(agg);
            el.style.color = '#fff';
            if (liveBadge) {
              liveBadge.style.display = 'inline-block';
              liveBadge.classList.add('price-live-pulse');
              liveBadge.title = agg.arrivalDate
                ? ('Agmarknet ' + agg.arrivalDate + (isState ? ' · state aggregate' : ''))
                : 'Agmarknet mandi';
            }
            if (mspBadge) mspBadge.style.display = 'none';
          }
        });
      } catch (err) {
        console.error('Error fetching live prices:', err);
      }
    }



    // ===== CASH CROP DETECTION =====
    var CASH_KEYS = ['cotton', 'sugarcane', 'tobacco', 'jute', 'rubber', 'coffee', 'tea', 'cashew', 'silk', 'opium', 'cardamom', 'vanilla', 'cinnamon', 'pepper', 'spice', 'saffron', 'turmeric', 'chilli', 'ginger', 'coconut'];
    function getCashCrops(crops) {
      var seen = {};
      (crops || []).forEach(function (c) {
        var cl = c.toLowerCase();
        CASH_KEYS.forEach(function (kw) { if (cl.indexOf(kw) !== -1) seen[c] = 1; });
      });
      return Object.keys(seen);
    }

    // ===== STATE PANEL =====
    function showStatePanel(name) {
      var d = STATE_DATA[name];
      var panel = document.getElementById('panel');
      if (panel) { panel.style.display = 'block'; panel.classList.add('is-open'); }

      var stDists = Object.keys(DISTRICT_DATA).filter(function (k) { return DISTRICT_DATA[k].state === name; });
      var distChips = '';
      stDists.forEach(function (dist) {
        distChips += '<div class="crop-chip clickable" onclick="showDistrictPanel(\'' + esc(dist) + '\',\'' + esc(name) + '\')"><div class="dot dot-blue"></div>' + dist + '</div>';
      });
      var distNote = distChips ?
        '<div class="sec-head">&#128269; Districts with detailed data (' + (stDists.length) + ')<span style="color:var(--text3);font-weight:400;font-size:.65rem;margin-left:6px">Click on map or chips below</span></div><div class="crop-wrap">' + distChips + '</div>' :
        '<div class="info-row" style="margin-top:8px"><div class="info-key">Districts</div><div class="info-val" style="color:var(--text3)">Click on map boundaries</div></div>';

      var pc = document.getElementById('panel-content');
      var bc = '<span onclick="goBackToStates()">India</span> &#8250; ' + name;

      if (!d) {
        pc.innerHTML = '<button class="close-panel" onclick="closePanel()">&#10005;</button>' +
          '<div class="panel-header"><div class="panel-breadcrumb">' + bc + '</div>' +
          '<div class="panel-title">' + name + '</div><div class="panel-subtitle">State / Union Territory</div></div>' +
          '<div class="panel-body"><div class="panel-divider"></div>' +
          '<p style="font-size:.8rem;color:var(--text2)">State-level data is being compiled. District boundaries are visible on the map.</p>' +
          distNote + srcBox() + '</div>';
        return;
      }

      var allC = [].concat(d.kharif || []).concat(d.rabi || []).concat(d.zaid || []).concat(d.topCrops || []);
      var cashCrops = getCashCrops(allC);
      var cashHtml = '';
      if (cashCrops.length) {
        cashHtml = '<div class="cash-section"><div class="cash-title">&#128176; Major Cash Crops</div><div class="crop-wrap">';
        cashCrops.forEach(function (c) { cashHtml += '<div class="crop-chip cash"><div class="dot dot-gold"></div>' + c + '</div>'; });
        cashHtml += '</div></div>';
      }

      var zaidHtml = (d.zaid && d.zaid.length) ?
        '<div class="sec-head">&#127807; Zaid Crops</div><div class="crop-wrap">' +
        d.zaid.map(function (c) { return '<div class="crop-chip"><div class="dot dot-blue"></div>' + c + '</div>'; }).join('') + '</div>' : '';

      var priceSrc = [].concat(d.topCrops || []).concat(cashCrops);
      var priceSection = buildPriceSection(priceSrc, name);

      pc.innerHTML = '<button class="close-panel" onclick="closePanel()">&#10005;</button>' +
        '<div class="panel-header"><div class="panel-breadcrumb">' + bc + '</div>' +
        '<div class="panel-title">' + name + '</div>' +
        '<div class="panel-subtitle">' + (d.capital ? 'Capital: ' + d.capital : '') + '</div></div>' +
        '<div class="panel-body">' +
        '<div class="panel-divider"></div>' +
        '<div class="season-row">' +
        '<div class="season-badge kharif">&#9728; Kharif</div>' +
        '<div class="season-badge rabi">&#10052; Rabi</div>' +
        (d.zaid && d.zaid.length ? '<div class="season-badge zaid">&#127807; Zaid</div>' : '') +
        '</div>' +
        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-label">Area</div><div class="stat-val">' + (d.area || '&mdash;') + '</div></div>' +
        '<div class="stat-card"><div class="stat-label">Population</div><div class="stat-val">' + (d.population || '&mdash;') + '</div></div>' +
        '<div class="stat-card"><div class="stat-label">Net Sown Area</div><div class="stat-val accent">' + (d.netSownArea || '&mdash;') + '</div></div>' +
        '<div class="stat-card"><div class="stat-label">Irrigated</div><div class="stat-val gold">' + (d.irrigated || '&mdash;') + '</div></div>' +
        '<div class="stat-card"><div class="stat-label">Avg Rainfall</div><div class="stat-val">' + (d.rainfall || '&mdash;') + '</div></div>' +
        '<div class="stat-card"><div class="stat-label">Dominant Soil</div><div class="stat-val" style="font-size:.76rem">' + (d.dominantSoil || '&mdash;') + '</div></div>' +
        '</div>' +
        cashHtml +
        '<div class="sec-head">&#9728; Kharif Crops</div>' +
        '<div class="crop-wrap">' + (d.kharif || []).map(function (c) { return '<div class="crop-chip"><div class="dot dot-green"></div>' + c + '</div>'; }).join('') + '</div>' +
        '<div class="sec-head">&#10052; Rabi Crops</div>' +
        '<div class="crop-wrap">' + (d.rabi || []).map(function (c) { return '<div class="crop-chip"><div class="dot dot-gold"></div>' + c + '</div>'; }).join('') + '</div>' +
        zaidHtml +
        '<div class="sec-head">&#127942; National Rankings</div>' +
        '<div class="crop-wrap">' + (d.topCrops || []).map(function (c) { return '<div class="crop-chip"><div class="dot dot-purple"></div>' + c + '</div>'; }).join('') + '</div>' +
        '<div class="sec-head">&#9888; Challenges</div>' +
        '<div>' + (d.challenges || []).map(function (c) { return '<span class="challenge-chip">&#9889; ' + c + '</span>'; }).join('') + '</div>' +
        '<div class="panel-divider"></div>' +
        '<div class="info-row"><div class="info-key">Agri GSDP Share</div><div class="info-val">' + (d.gdpShare || '&mdash;') + '</div></div>' +
        '<div class="info-row"><div class="info-key">Key Crop Rankings</div><div class="info-val">' + (d.rank || '&mdash;') + '</div></div>' +
        priceSection + distNote + srcBox() + '</div>';
    }

    // ===== DISTRICT PANEL =====
    function showDistrictPanel(name, stateName) {
      currentDistrict = name;
      var d = DISTRICT_DATA[name];
      var panel = document.getElementById('panel');
      if (panel) { panel.style.display = 'block'; panel.classList.add('is-open'); }
      var backBtn = document.getElementById('back-btn');
      if (backBtn) backBtn.classList.add('visible');
      var pill = document.getElementById('mode-pill');
      if (pill) { pill.textContent = name; pill.classList.add('is-drilling'); }
      var pc = document.getElementById('panel-content');
      var ds = d ? (d.state || stateName) : stateName;
      var bc = '<span onclick="goBackToStates()">India</span> &#8250; <span onclick="showStatePanel(\'' + esc(ds) + '\')">' + ds + '</span> &#8250; ' + name;

      // Also highlight on map if district layer exists
      if (districtLayer) {
        districtLayer.eachLayer(function (l) {
          if (l._dstName && l._dstName.toLowerCase() === name.toLowerCase()) {
            if (selectedDistLayer) districtLayer.resetStyle(selectedDistLayer);
            selectedDistLayer = l;
            l.setStyle(dstSelS());
            try { map.fitBounds(l.getBounds(), { padding: [20, 20], maxZoom: 11 }); } catch (e) { }
          }
        });
      }

      if (!d) {
        pc.innerHTML = '<button class="close-panel" onclick="closePanel()">&#10005;</button>' +
          '<div class="panel-header"><div class="panel-breadcrumb">' + bc + '</div>' +
          '<div class="panel-title">' + name + '</div><div class="panel-subtitle">District &mdash; ' + stateName + '</div></div>' +
          '<div class="panel-body"><div class="panel-divider"></div>' +
          '<p style="font-size:.8rem;color:var(--text2)">Detailed district agricultural data for <strong>' + name + '</strong> is being compiled. The district boundary is visible on the map.</p>' +
          '<button class="btn-ghost" style="width:100%;margin-top:12px" onclick="showStatePanel(\'' + esc(stateName) + '\')">&#128202; View ' + stateName + ' State Data</button>' +
          srcBox() + '</div>';
        return;
      }

      var allCrops = [].concat(d.crops || []);
      var cashCrops = getCashCrops(allCrops);
      var cashHtml = '';
      if (cashCrops.length) {
        cashHtml = '<div class="cash-section"><div class="cash-title">&#128176; Major Cash Crops</div><div class="crop-wrap">';
        cashCrops.forEach(function (c) { cashHtml += '<div class="crop-chip cash"><div class="dot dot-gold"></div>' + c + '</div>'; });
        cashHtml += '</div></div>';
      }
      var dots = ['dot-green', 'dot-gold', 'dot-blue', 'dot-red', 'dot-purple'];
      var priceSection = buildPriceSection([].concat(d.crops || []).concat(cashCrops), name);

      pc.innerHTML = '<button class="close-panel" onclick="closePanel()">&#10005;</button>' +
        '<div class="panel-header"><div class="panel-breadcrumb">' + bc + '</div>' +
        '<div class="panel-title">' + name + '</div>' +
        '<div class="panel-subtitle">District &mdash; ' + ds + '</div></div>' +
        '<div class="panel-body">' +
        '<div class="panel-divider"></div>' +
        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-label">Avg Rainfall</div><div class="stat-val accent">' + (d.rainfall || '&mdash;') + '</div></div>' +
        '<div class="stat-card"><div class="stat-label">Irrigation</div><div class="stat-val gold">' + (d.irrigation || '&mdash;') + '</div></div>' +
        '<div class="stat-card" style="grid-column:1/-1"><div class="stat-label">Dominant Soil</div><div class="stat-val" style="font-size:.82rem">' + (d.soil || '&mdash;') + '</div></div>' +
        '</div>' +
        cashHtml +
        '<div class="sec-head">&#127807; Primary Crops</div>' +
        '<div class="crop-wrap">' + (d.crops || []).map(function (c, i) { return '<div class="crop-chip"><div class="dot ' + dots[i % 5] + '"></div>' + c + '</div>'; }).join('') + '</div>' +
        '<div class="sec-head">&#128221; Agricultural Notes</div>' +
        '<div style="font-size:.8rem;color:var(--text2);line-height:1.65;margin-top:4px">' + (d.notes || '&mdash;') + '</div>' +
        priceSection + srcBox() +
        '<button class="btn-ghost" style="width:100%;margin-top:12px" onclick="showStatePanel(\'' + esc(ds) + '\')">&#128202; View ' + ds + ' State Data</button>' +
        '</div>';
    }

    // ===== NAVIGATION =====
    function goBackToStates() {
      currentState = null; currentDistrict = ''; selectedDistLayer = null;
      if (districtLayer) { map.removeLayer(districtLayer); districtLayer = null; }
      var backBtn = document.getElementById('back-btn');
      if (backBtn) backBtn.classList.remove('visible');
      var pill = document.getElementById('mode-pill');
      if (pill) {
        pill.textContent = 'Click any state to explore';
        pill.classList.remove('is-drilling');
        pill.classList.remove('is-loading');
      }
      if (stateLayer) stateLayer.eachLayer(function (l) { stateLayer.resetStyle(l); });
      map.flyTo([22, 82], 5, { duration: 1.2, easeLinearity: .5 });
      closePanel();
    }

    function closePanel() {
      var panel = document.getElementById('panel');
      if (panel) {
        panel.classList.remove('is-open');
        panel.style.display = 'none';
      }
    }

    function closeAbout() { closeModal('about-overlay'); }

    /** Expose handlers used by React onClick and innerHTML onclick= attributes */
    function bindMapGlobals() {
      var w = window;
      w.goBackToStates = goBackToStates;
      w.closePanel = closePanel;
      w.closeAbout = closeAbout;
      w.handleSearch = handleSearch;
      w.showStatePanel = showStatePanel;
      w.showDistrictPanel = showDistrictPanel;
      w.showCropModal = showCropModal;
      var aboutBtn = document.getElementById('about-btn');
      if (aboutBtn && !aboutBtn.dataset.bound) {
        aboutBtn.dataset.bound = '1';
        aboutBtn.addEventListener('click', function () { openModal('about-overlay'); });
      }
    }


    // ===== SEARCH — rebuilt =====
    var searchIndex = [];
    (function () {
      try {
        Object.keys(STATE_DATA).forEach(function (s) {
          var d = STATE_DATA[s];
          var parts = [s];
          ['kharif', 'rabi', 'zaid', 'topCrops', 'challenges'].forEach(function (k) { if (d[k]) parts = parts.concat(d[k]); });
          ['dominantSoil', 'capital', 'rank', 'gdpShare'].forEach(function (k) { if (d[k]) parts.push(d[k]); });
          searchIndex.push({ name: s, type: 'state', text: parts.join(' ').toLowerCase() });
        });
      } catch (e) { console.error('State index:', e); }
      try {
        Object.keys(DISTRICT_DATA).forEach(function (dk) {
          var d = DISTRICT_DATA[dk];
          var parts = [dk];
          if (d.state) parts.push(d.state);
          if (d.crops) parts = parts.concat(d.crops);
          ['soil', 'notes', 'rainfall', 'irrigation'].forEach(function (k) { if (d[k]) parts.push(d[k]); });
          searchIndex.push({ name: dk, type: 'district', state: d.state, text: parts.join(' ').toLowerCase() });
        });
      } catch (e) { console.error('District index:', e); }
      // Also add crop prices to index
      try {
        Object.keys(CROP_PRICES).forEach(function (crop) {
          var p = CROP_PRICES[crop];
          searchIndex.push({ name: crop, type: 'crop', text: (crop + ' ' + p.key_mandis + ' ' + p.buyers + ' ' + p.note + ' ' + p.season).toLowerCase() });
        });
      } catch (e) { }
      console.log('Search index:', searchIndex.length, 'items');
    })();

    var siEl = document.getElementById('search-input');
    var srEl = document.getElementById('search-results');

    function onSearchInput() {
      if (!siEl || !srEl) return;
      var q = siEl.value.trim().toLowerCase();
      if (!q) { srEl.classList.remove('open'); return; }
      var terms = q.split(/\s+/).filter(Boolean);
      var matches = [], partial = [];
      for (var i = 0; i < searchIndex.length && matches.length < 15; i++) {
        var it = searchIndex[i];
        var allMatch = true, anyMatch = false;
        for (var j = 0; j < terms.length; j++) {
          if (it.text.indexOf(terms[j]) !== -1) { anyMatch = true; } else { allMatch = false; }
        }
        if (allMatch) matches.push(it);
        else if (anyMatch && partial.length < 5) partial.push(it);
      }
      // Add partial matches if not enough full matches
      var results = matches.concat(partial.filter(function (p) { return matches.indexOf(p) === -1; })).slice(0, 15);

      if (!results.length) {
        srEl.innerHTML = '<div style="padding:12px 14px;font-size:.82rem;color:var(--text3)">No results for &ldquo;' + q + '&rdquo;. Try: cotton, wheat, hyderabad, turmeric\u2026</div>';
        srEl.classList.add('open');
        return;
      }
      var html = '';
      results.forEach(function (x) {
        var label = x.type === 'state' ? 'State' : x.type === 'district' ? 'District' : 'Crop';
        var tagCls = x.type === 'state' ? 'state' : x.type === 'crop' ? 'crop' : 'district';
        html += '<div class="sr-item" onclick="handleSearch(\'' + esc(x.name) + '\',\'' + x.type + '\',\'' + esc(x.state || '') + '\')">' +
          '<span class="sr-tag ' + tagCls + '">' + label + '</span>' +
          '<span>' + x.name + '</span>' +
          (x.state ? '<span style="color:var(--text3);font-size:.7rem;margin-left:auto">' + x.state + '</span>' : '') +
          '</div>';
      });
      srEl.innerHTML = html;
      srEl.classList.add('open');
    }

    function onSearchKeydown(e) {
      if (!siEl || !srEl) return;
      if (e.key === 'Enter') {
        var firstResult = srEl.querySelector('.sr-item');
        if (firstResult && srEl.classList.contains('open')) {
          firstResult.click();
        }
      }
    }

    function onDocClick(e) {
      if (!srEl) return;
      if (!e.target.closest('#search-wrap')) srEl.classList.remove('open');
    }

    if (siEl) {
      siEl.addEventListener('input', onSearchInput);
      siEl.addEventListener('keydown', onSearchKeydown);
    }
    document.addEventListener('click', onDocClick);

    function handleSearch(name, type, stateName) {
      siEl.value = name;
      srEl.classList.remove('open');
      if (type === 'crop') {
        showCropModal(name);
        return;
      }
      var targetState = type === 'state' ? name : stateName;
      if (stateLayer) {
        stateLayer.eachLayer(function (l) {
          if (l._kriName === targetState) {
            map.fitBounds(l.getBounds(), { padding: [40, 40], maxZoom: 8 });
            onStateClick(targetState, l);
          }
        });
      }
      if (type === 'district') {
        setTimeout(function () { showDistrictPanel(name, targetState); }, 200);
      }
    }

    // ===== CROP MODAL =====
    function showCropModal(cropName) {
      var key = cropName.split(/[\s(]/)[0];
      var p = CROP_PRICES[key] || CROP_PRICES[cropName];
      if (!p) { showToast('Detailed pricing for ' + cropName + ' is unavailable.', 3000); return; }

      var modalId = 'crop-modal-overlay';
      var m = document.getElementById(modalId);
      if (!m) {
        m = document.createElement('div');
        m.id = modalId;
        m.className = 'modal-overlay';
        m.onclick = function (e) { if (e.target === this) closeModal(modalId); };
        document.body.appendChild(m);
      }

      var cardHtml = priceCard(cropName, 'National');
      // Strip the 'National' pseudo-insight block just for the global view to keep it clean
      cardHtml = cardHtml.replace(/<div class="price-info-row" style="margin-top:6px;background:rgba\(77,157,224,\.08\).*?<\/div>/, '');

      m.innerHTML = '<div class="modal-box">' +
        '<button class="modal-close" onclick="closeModal(\'' + modalId + '\')">&#10005;</button>' +
        '<div class="modal-header">' +
        '<div class="modal-title">&#127793; ' + cropName + ' Intelligence</div>' +
        '<div class="modal-subtitle">Global market &amp; pricing data</div>' +
        '</div>' +
        '<div class="modal-body">' + cardHtml + '</div>' +
        '</div>';

      openModal(modalId);
    }

    // ===== INIT =====
    bindMapGlobals();
    loadStateMap();

    // Leave map page → tear down so coming back re-creates Leaflet cleanly
    return function cleanupMap() {
      try {
        map.remove();
      } catch {
        /* already gone */
      }
      if (siEl) {
        siEl.removeEventListener('input', onSearchInput);
        siEl.removeEventListener('keydown', onSearchKeydown);
      }
      document.removeEventListener('click', onDocClick);
      var cropModal = document.getElementById('crop-modal-overlay');
      if (cropModal) cropModal.remove();
      var w = window as any;
      delete w.goBackToStates;
      delete w.closePanel;
      delete w.closeAbout;
      delete w.handleSearch;
      delete w.showStatePanel;
      delete w.showDistrictPanel;
      delete w.showCropModal;
      delete w.showToast;
      delete w.hideToast;
      delete w.openModal;
      delete w.closeModal;
    };
  }, []);
  return {
    districtListings,
    isLoadingListings
  };
}
