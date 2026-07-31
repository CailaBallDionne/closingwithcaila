/* ============================================================
   FOOTHILLS READS — foothillsreads.js
 
   This file currently handles:
   - Showing the map view instead of the form for returning visitors
   - The "Already added yours?" skip link
   - The real-estate opt-in reveal (email/phone field appears when checked)
   - Basic form validation + honeypot spam check
   - Rendering the map and feed once library/submission data is available
 
   NOT wired up yet (comes in the next piece):
   - The actual Google Apps Script URL that reads/writes the Google Sheet
   - Real library pin data and real submissions
 
   EDIT: Once the Apps Script Web App is deployed, replace this placeholder
   with the real URL (looks like https://script.google.com/macros/s/XXXX/exec)
   ============================================================ */
 
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzdf2gKXMc4OBhU4Ny6ZpcDn2k5GkfvIEIMh1ke7PBbZok5eujAK3EoAelNdwtFTt9SAg/exec";
 
/* ============================================================
   LIBRARY LOCATIONS
 
   Add one entry per Little Free Library. To get lat/lng:
   1. Open Google Maps, find the library's exact spot
   2. Right-click that point
   3. Click the coordinates at the top of the menu (copies them)
   4. Paste the first number as lat, the second as lng
 
   id: just needs to be unique, lowercase, no spaces (use dashes)
   name: whatever you want to call it publicly
   area: a short neighborhood tag, shown next to the name
   ============================================================ */
const LIBRARY_LOCATIONS = [
  { id: "glorietta-park", name: "Glorietta Park", location: "Glorietta Park", area: "Montrose / La Crescenta", lat: 34.1883981, lng: -118.2267469 },
  { id: "boucher-memorial", name: "Barbara \"Bobbi\" Boucher Memorial Mini Library", location: "Boston Ave", area: "La Crescenta", lat: 34.2461634, lng: -118.2620645 },
  { id: "gibney-library", name: "Mrs. Gibney's Library", location: "Santa Carlotta St (north)", area: "La Crescenta", lat: 34.2416402, lng: -118.2569661 },
  { id: "natalies-library", name: "Natalie's Little Free Library", location: "Vista Ct", area: "La Crescenta", lat: 34.2404828, lng: -118.2646430 },
  { id: "abella-street", name: "Little Free Library", location: "Abella St", area: "La Crescenta", lat: 34.2375174, lng: -118.2654475 },
  { id: "library-for-my-mom", name: "Library for my Mom", location: "Lowell Ave", area: "La Crescenta", lat: 34.2343217, lng: -118.2664695 },
  { id: "lori-o", name: "Lori O", location: "Santa Carlotta St (south)", area: "La Crescenta", lat: 34.2360196, lng: -118.2469930 },
  { id: "glenwood-library", name: "Glenwood Free Little Library", location: "Glenwood Ave", area: "La Crescenta-Montrose", lat: 34.2368794, lng: -118.2422966 },
  { id: "farmhouse-library", name: "Farmhouse Library", location: "Laughlin Ave", area: "La Crescenta-Montrose", lat: 34.2289549, lng: -118.2333896 },
  { id: "kassidys-library", name: "Kassidy's Library", location: "Ocean View Blvd", area: "La Cañada Flintridge", lat: 34.2236365, lng: -118.2254546 },
  { id: "winters-family-library", name: "Winters Family Library", location: "Foothill Blvd (west)", area: "La Cañada Flintridge", lat: 34.2127369, lng: -118.2171938 },
  { id: "kirra-serna", name: "Kirra Serna", location: "Community Ave", area: "La Crescenta-Montrose", lat: 34.2227912, lng: -118.2411296 },
  { id: "dianne-reilly", name: "Dianne Reilly", location: "Manhattan Ave", area: "La Crescenta", lat: 34.2169047, lng: -118.2448370 },
  { id: "randall-ehrbar", name: "Randall Ehrbar", location: "Ramsdell Ave & Oakendale Pl", area: "La Crescenta", lat: 34.2120070, lng: -118.2443491 },
  { id: "murray-library", name: "Murray Library", location: "Angelus Ave", area: "Glendale", lat: 34.2051143, lng: -118.2345835 },
  { id: "rosemary-ave-library", name: "Rosemary Ave Little Free Library", location: "Rosemary Ave", area: "Glendale", lat: 34.2048125, lng: -118.2309550 },
  { id: "marlene-maginot", name: "Marlene Maginot", location: "Arlington Ave", area: "Glendale", lat: 34.2002841, lng: -118.2301805 },
  { id: "lady-lulus-library", name: "Lady Lulu's Little Free Library", location: "Castera Ave", area: "Glendale", lat: 34.1984686, lng: -118.2274755 },
  { id: "grandpa-ls-library", name: "Grandpa L's Library", location: "Vickers Dr", area: "Glendale", lat: 34.1978095, lng: -118.2254041 },
  { id: "susan-foster", name: "Susan Foster", location: "Foothill Blvd (east)", area: "La Cañada Flintridge", lat: 34.1942384, lng: -118.1799200 },
  { id: "harpers-library", name: "Harper's Little Free Library", location: "Baptiste Way", area: "La Cañada Flintridge", lat: 34.2001001, lng: -118.1807006 },
  { id: "marcia-hanford", name: "Marcia Hanford", location: "Rustic Ln", area: "Glendale", lat: 34.1868943, lng: -118.2274134 }
];
 
const STORAGE_KEY = "foothillsreads_submitted";
 
let frMap = null;
 
document.addEventListener("DOMContentLoaded", () => {
  const formSection = document.getElementById("formSection");
  const mapSection = document.getElementById("mapSection");
  const skipLink = document.getElementById("skipToMap");
  const realEstateCheckbox = document.getElementById("fr-realestate");
  const emailWrap = document.getElementById("fr-emailWrap");
  const form = document.getElementById("fr-form");
  const librarySelect = document.getElementById("fr-library");
  const suggestWrap = document.getElementById("fr-suggestWrap");
  const suggestLibraryLink = document.getElementById("suggestLibraryLink");
 
  librarySelect.addEventListener("change", () => {
    suggestWrap.classList.toggle("open", librarySelect.value === "suggest-new");
  });
 
  if (suggestLibraryLink) {
    suggestLibraryLink.addEventListener("click", () => {
      formSection.style.display = "block";
      mapSection.style.display = "none";
      librarySelect.value = "suggest-new";
      suggestWrap.classList.add("open");
      formSection.scrollIntoView({ behavior: "smooth" });
      document.getElementById("fr-libraryName").focus();
    });
  }
 
  // Fill in the library dropdown right away, don't wait for the map to load
  populateLibraryDropdown();
 
  // Returning visitor who already submitted goes straight to the map
  if (localStorage.getItem(STORAGE_KEY) === "true") {
    showMapView();
  }
 
  skipLink.addEventListener("click", () => {
    showMapView();
  });
 
  const bookClubCheckbox = document.getElementById("fr-bookclub");
 
  function updateEmailVisibility() {
    emailWrap.classList.toggle("open", realEstateCheckbox.checked || bookClubCheckbox.checked);
  }
 
  bookClubCheckbox.addEventListener("change", updateEmailVisibility);
  realEstateCheckbox.addEventListener("change", updateEmailVisibility);
 
  form.addEventListener("submit", handleSubmit);
 
  function showMapView() {
    formSection.style.display = "none";
    mapSection.style.display = "block";
    initMapIfNeeded();
 
    // Leaflet sometimes measures the wrong size if it initializes (or was
    // initialized) while its container was hidden. This forces it to
    // recheck once the section is actually visible on screen.
    setTimeout(() => {
      if (frMap) frMap.invalidateSize();
    }, 100);
  }
 
  async function handleSubmit(e) {
    e.preventDefault();
 
    // Honeypot check — if this hidden field has anything in it, silently drop the submission
    const honeypot = document.getElementById("fr-website").value;
    if (honeypot) {
      return;
    }
 
    const submitBtn = document.getElementById("fr-submitBtn");
    const successMsg = document.getElementById("fr-success");
 
    const payload = {
      libraryId: librarySelect.value,
      suggestedLibraryName: document.getElementById("fr-libraryName").value.trim(),
      suggestedLibraryLocation: document.getElementById("fr-libraryLocation").value.trim(),
      book: document.getElementById("fr-book").value.trim(),
      note: document.getElementById("fr-note").value.trim(),
      displayName: document.getElementById("fr-name").value.trim(),
      bookClubInterest: document.getElementById("fr-bookclub").checked,
      realEstateOptIn: realEstateCheckbox.checked,
      contact: document.getElementById("fr-email").value.trim(),
      timestamp: new Date().toISOString()
    };
 
    if (!payload.book) {
      return;
    }
 
    if (payload.libraryId === "suggest-new" && !payload.suggestedLibraryLocation) {
      document.getElementById("fr-libraryLocation").focus();
      return;
    }
 
    submitBtn.disabled = true;
    submitBtn.textContent = "Adding…";
 
    try {
      if (APPS_SCRIPT_URL && !APPS_SCRIPT_URL.startsWith("PASTE_")) {
        await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(payload)
        });
      }
    } catch (err) {
      // Fails quietly — the visitor still sees success below.
      // Once the backend piece is wired, we'll revisit error handling here.
      console.error("Foothills Reads submission error:", err);
    }
 
    localStorage.setItem(STORAGE_KEY, "true");
    successMsg.style.display = "block";
    form.reset();
    emailWrap.classList.remove("open");
    suggestWrap.classList.remove("open");
    submitBtn.disabled = false;
    submitBtn.textContent = "Add To The Map";
 
    setTimeout(() => {
      showMapView();
    }, 1400);
  }
});
 
function initMapIfNeeded() {
  if (frMap) return;
 
  frMap = L.map("fr-leaflet-map", {
    scrollWheelZoom: false
  }).setView([34.2331, -118.2445], 13); // La Crescenta / La Cañada area
 
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 19
  }).addTo(frMap);
 
  loadMapData();
}
 
function bookPinIcon() {
  return L.divIcon({
    className: "",
    html: `<svg width="30" height="38" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 23 15 23s15-12.5 15-23C30 6.7 23.3 0 15 0z" fill="#B5532A"/>
      <g transform="translate(7.5,7.2) scale(0.65)" fill="none" stroke="#FDFCFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </g>
    </svg>`,
    iconSize: [30, 38],
    iconAnchor: [15, 38],
    popupAnchor: [0, -34]
  });
}
 
// Builds the dropdown label. Leads with the street since that's how
// most people actually identify these, the nickname (if there is one that
// isn't just "Little Free Library") comes after as a bonus identifier.
function libraryLabel(lib) {
  const generic = !lib.name || lib.name === lib.location || lib.name === "Little Free Library";
  return generic
    ? `${lib.location} (${lib.area})`
    : `${lib.location} — ${lib.name} (${lib.area})`;
}
 
// Fills in the library dropdown. Runs on page load, independent of the map,
// so the form has real options even before anyone opens the map view.
function populateLibraryDropdown() {
  const librarySelect = document.getElementById("fr-library");
 
  LIBRARY_LOCATIONS.forEach((lib) => {
    const option = document.createElement("option");
    option.value = lib.id;
    option.textContent = libraryLabel(lib);
    librarySelect.insertBefore(option, librarySelect.lastElementChild.nextSibling);
  });
}
 
// Fetches libraries once. Falls back to LIBRARY_LOCATIONS if the Sheet
// doesn't have its own "Libraries" tab (which is the normal setup for now).
async function fetchLibraries() {
  try {
    if (APPS_SCRIPT_URL && !APPS_SCRIPT_URL.startsWith("PASTE_")) {
      const res = await fetch(`${APPS_SCRIPT_URL}?type=libraries`);
      const libraries = await res.json();
      if (libraries.length) return libraries;
    }
  } catch (err) {
    console.error("Could not load libraries:", err);
  }
  return LIBRARY_LOCATIONS;
}
 
// Fetches every book submission from the Sheet.
async function fetchSubmissions() {
  try {
    if (APPS_SCRIPT_URL && !APPS_SCRIPT_URL.startsWith("PASTE_")) {
      const res = await fetch(`${APPS_SCRIPT_URL}?type=submissions`);
      return await res.json();
    }
  } catch (err) {
    console.error("Could not load submissions:", err);
  }
  return [];
}
 
// Loads submissions once, then uses them for both the map pin popups
// (what's actually been found at each library) and the feed below it.
async function loadMapData() {
  const [libraries, submissions] = await Promise.all([fetchLibraries(), fetchSubmissions()]);
 
  libraries.forEach((lib) => {
    L.marker([lib.lat, lib.lng], { icon: bookPinIcon() })
      .addTo(frMap)
      .bindPopup(buildPopupContent(lib, submissions));
  });
 
  renderFeed(submissions);
}
 
// Builds what shows up when someone clicks a pin: the library's name/street,
// plus the actual books people have logged there so far.
function buildPopupContent(lib, submissions) {
  const entries = submissions.filter((s) => s.libraryId === lib.id);
 
  const subtitle = lib.name !== lib.location && lib.name !== "Little Free Library"
    ? `${escapeHtml(lib.name)} — ${escapeHtml(lib.area)}`
    : escapeHtml(lib.area);
 
  let html = `<strong>${escapeHtml(lib.location)}</strong>${subtitle}`;
 
  if (!entries.length) {
    html += `<div class="fr-popup-empty">Nothing logged here yet, be the first!</div>`;
    return html;
  }
 
  const recent = entries.slice().reverse().slice(0, 4);
  html += `<div class="fr-popup-books">`;
  recent.forEach((e) => {
    html += `<div class="fr-popup-book">📖 ${escapeHtml(e.book)}${e.displayName ? " — " + escapeHtml(e.displayName) : ""}</div>`;
  });
  if (entries.length > recent.length) {
    html += `<div class="fr-popup-more">+ ${entries.length - recent.length} more</div>`;
  }
  html += `</div>`;
 
  return html;
}
 
// Renders the "recent finds" feed below the map, using the same submissions
// data that was already fetched for the pins.
function renderFeed(submissions) {
  const feedEl = document.getElementById("fr-feed");
 
  if (!submissions.length) {
    feedEl.innerHTML = `<p class="hub-empty">Be the first to add a find. The feed fills in as neighbors submit.</p>`;
    return;
  }
 
  feedEl.innerHTML = submissions
    .slice()
    .reverse()
    .map((s) => {
      const lib = LIBRARY_LOCATIONS.find((l) => l.id === s.libraryId);
      const tag = lib ? lib.location : (s.libraryId === "suggest-new" ? "A new spot" : "Foothills");
      return `
      <div class="fr-feed-card">
        <span class="fr-feed-tag">${tag}</span>
        <h3>${escapeHtml(s.book)}</h3>
        ${s.note ? `<p>${escapeHtml(s.note)}</p>` : ""}
        <div class="fr-feed-meta">${s.displayName ? escapeHtml(s.displayName) : "A neighbor"}</div>
      </div>
    `;
    })
    .join("");
}
 
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}
