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

const APPS_SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

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

  // Returning visitor who already submitted goes straight to the map
  if (localStorage.getItem(STORAGE_KEY) === "true") {
    showMapView();
  }

  skipLink.addEventListener("click", () => {
    showMapView();
  });

  realEstateCheckbox.addEventListener("change", () => {
    emailWrap.classList.toggle("open", realEstateCheckbox.checked);
  });

  form.addEventListener("submit", handleSubmit);

  function showMapView() {
    formSection.style.display = "none";
    mapSection.style.display = "block";
    initMapIfNeeded();
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

  loadLibraryPins();
  loadFeed();
}

function bookPinIcon() {
  return L.divIcon({
    className: "",
    html: `<svg width="30" height="38" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 23 15 23s15-12.5 15-23C30 6.7 23.3 0 15 0z" fill="#B5532A"/>
      <path d="M9 11h5.5v14L11.5 23 9 25V11z" fill="#FDFCFA"/>
      <path d="M15.5 11H21v14l-2.5-2-3-2V11z" fill="#FDFCFA" opacity="0.85"/>
    </svg>`,
    iconSize: [30, 38],
    iconAnchor: [15, 38],
    popupAnchor: [0, -34]
  });
}

// EDIT: Replace this with a real fetch to the Apps Script "Libraries" endpoint
// once it's deployed. Left as a small placeholder set for now so the map
// isn't empty while we build out the rest.
async function loadLibraryPins() {
  let libraries = [];

  try {
    if (APPS_SCRIPT_URL && !APPS_SCRIPT_URL.startsWith("PASTE_")) {
      const res = await fetch(`${APPS_SCRIPT_URL}?type=libraries`);
      libraries = await res.json();
    }
  } catch (err) {
    console.error("Could not load library pins:", err);
  }

  if (!libraries.length) {
    libraries = [
      { id: "placeholder-1", name: "Add your library locations here", area: "Edit in foothillsreads.js or the Google Sheet", lat: 34.2331, lng: -118.2445 }
    ];
  }

  const librarySelect = document.getElementById("fr-library");

  libraries.forEach((lib) => {
    if (lib.id !== "placeholder-1") {
      const option = document.createElement("option");
      option.value = lib.id;
      option.textContent = `${lib.name} (${lib.area})`;
      librarySelect.insertBefore(option, librarySelect.lastElementChild.nextSibling);
    }

    L.marker([lib.lat, lib.lng], { icon: bookPinIcon() })
      .addTo(frMap)
      .bindPopup(`<strong>${lib.name}</strong>${lib.area}`);
  });
}

// EDIT: Replace this with a real fetch to the Apps Script "Submissions" endpoint
async function loadFeed() {
  const feedEl = document.getElementById("fr-feed");
  let submissions = [];

  try {
    if (APPS_SCRIPT_URL && !APPS_SCRIPT_URL.startsWith("PASTE_")) {
      const res = await fetch(`${APPS_SCRIPT_URL}?type=submissions`);
      submissions = await res.json();
    }
  } catch (err) {
    console.error("Could not load feed:", err);
  }

  if (!submissions.length) {
    feedEl.innerHTML = `<p class="hub-empty">Be the first to add a find. The feed fills in as neighbors submit.</p>`;
    return;
  }

  feedEl.innerHTML = submissions
    .slice()
    .reverse()
    .map((s) => `
      <div class="fr-feed-card">
        <span class="fr-feed-tag">${s.libraryName || "Foothills"}</span>
        <h3>${escapeHtml(s.book)}</h3>
        ${s.note ? `<p>${escapeHtml(s.note)}</p>` : ""}
        <div class="fr-feed-meta">${s.displayName ? escapeHtml(s.displayName) : "A neighbor"}</div>
      </div>
    `)
    .join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}
