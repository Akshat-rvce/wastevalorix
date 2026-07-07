# <p align="center"><img src="./PHOTOS/UPDATED%20BANNER.png" alt="WasteValorix Banner" width="100%"></p>

<p align="center">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Threejs">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="Tensorflow">
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
</p>

<p align="center">
  <a href="https://wastevalorix.onrender.com/" target="_blank">
    <img src="https://img.shields.io/badge/⚡%20Live%20Demo-Deploy%20on%20Render-00E676?style=for-the-badge&logo=render&logoColor=white" alt="Live Demo">
  </a>
</p>

<p align="center">
  <b>WasteValorix</b> is a state-of-the-art waste-to-energy hybrid intelligence suite. By combining real-time <b>Computer Vision (TensorFlow.js)</b>, advanced <b>Generative AI (Gemini Flash APIs)</b>, and responsive <b>3D Scroll Physics (React Three Fiber & GSAP)</b>, WasteValorix enables communities and scrap dealers to capture, analyze, and value recyclable waste according to current market rates.
</p>

---

## 📸 App Interface Gallery

Here is a visual walkthrough of the WasteValorix hybrid platform, showcasing screenshots located in the `PHOTOS/` directory:

| 🏠 Interactive 3D Home | 🔬 Methodology & Architecture |
|:---:|:---:|
| <img src="./PHOTOS/HOME%20PAGE.png" width="100%" alt="3D Home Screen"> | <img src="./PHOTOS/FLOW%20OF%20WEBSITE.png" width="100%" alt="Methodology"> |

| 📸 Live AI Camera Scanner | 💰 Market Price Intelligence |
|:---:|:---:|
| <img src="./PHOTOS/AI%20SCANNING%20PLASTIC%20BOTTLE.png" width="100%" alt="Live Scanner"> | <img src="./PHOTOS/PRICING%20GOT%20WITH%20QUALITY.png" width="100%" alt="Pricing Dashboard"> |

| ♻️ Environmental CO₂ Impact | 🏪 Waste Marketplace |
|:---:|:---:|
| <img src="./PHOTOS/RESULTS%20AFTER%20SCANNING%20PRODUCT.png" width="100%" alt="Carbon Offsets"> | <img src="./PHOTOS/FULL%20WAY%20TO%20USE%20WEBSITE.png" width="100%" alt="Marketplace"> |

---

## ⚡ Core Engine Features

### 1. Cinematic 3D Particle Hero Canvas (R3F + GSAP)
- **Chaotic Morphing System:** The app features an immersive dark background space initialized with Three.js and `@react-three/drei`'s `Stars`.
- **W-Logo Formation:** Over 2,000 individual vertex particles animate and align to form the "W" logo as the user scrolls, controlled dynamically via custom scroll progress indicators.
- **Scroll-Controlled Burst Engine:** Interactive 3D waste objects (plastic bottles, soda cans) float and explode into glowing green energy bursts once the scroll position reaches the energy-extraction phase.

### 2. Neural Object Detection (TensorFlow.js)
- **Local COCO-SSD Neural Network:** Performs real-time multi-object tracking and bounding box drawings natively on the client browser.
- **Dynamic Camera Switching:** Supports dual-camera systems, integrated laptop webcams, and mobile video proxies (such as DroidCam/OBS Virtual Cam) with custom switching capabilities.
- **Auto-Capture Thresholds:** Freezes frames automatically to snapshot detected waste for AI classification.

### 3. Market Pricing Intelligence (Gemini AI API)
- **Multi-Model Fallbacks:** Utilizes models (`gemini-flash-latest`, `gemini-2.5-flash`, and `gemini-2.0-flash`) in series to bypass quota limits or region unavailability.
- **Indian Recycler Market Rates:** Returns accurate market value estimates (INR per Kg) derived from current market trends (2024-2025).
- **Price Position Gauge:** Graphs the scrap dealer rates vs. premium industrial recycling factory pricing to show quality-grade offsets.

### 4. Interactive Marketplace (SQLite + Express Backend)
- **Integrated DB Transactions:** Local sqlite database (`better-sqlite3`) tracks waste analysis logs, saving exact categories, co2 offsets, and weights.
- **Listing Hub:** Users can easily list scrap directly from scan results, opening listings to scrap dealers and recycling hubs.

---

## 🛠️ Project Structure

```
├── PHOTOS/                      # Screenshot assets and README graphics
├── README.md                    # Project documentation
└── wastevalorix/                # React Vite Frontend + Express Backend
    ├── .env                     # Local API keys (Git ignored)
    ├── .env.example             # Template for environment configuration
    ├── package.json             # App dependencies and run scripts
    ├── vite.config.js           # Vite server and R3F config
    ├── server/                  # Node Express server
    │   ├── db/                  # SQLite database configurations
    │   └── routes/              # Express API endpoints (analyses, marketplace)
    └── src/                     # React Single Page App
        ├── components/          # UI components, scanners, and layouts
        ├── pages/               # Page templates (Home, Analyze, Marketplace)
        ├── three/               # Three.js fiber canvas, waste objects, and shaders
        └── services/            # APIs (Gemini call orchestration)
```

---

## 🛠️ Quick Start

Ensure you have [Node.js](https://nodejs.org/) installed, then configure and launch the hybrid engine:

```bash
# Navigate to the workspace and install dependencies
cd wastevalorix
npm install

# Set up your environment variables
# Copy .env.example to .env and input your Gemini API Key
cp .env.example .env

# Run both the React frontend (Vite) and SQLite/Express backend
npm run dev:all
```

- React Frontend: [http://localhost:5173](http://localhost:5173)
- Express Backend: [http://localhost:5000](http://localhost:5000)

---

<p align="center">Made with 💚 for a sustainable future.</p>
