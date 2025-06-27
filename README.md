# EnigmaSite

> A modern Vue 3-based frontend for exploring and interacting with the Enigma and Cyclometer cryptographic simulators.  
> Built as part of a modular system featuring native simulation, RESTful APIs, and historical visual interfaces.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)

---

## Project Overview

EnigmaSite provides a user-friendly web interface to the [Enigma-API](https://github.com/UPEV1sion/Enigma-API), which wraps native simulation code via Java’s Foreign Function & Memory API.  
It allows users to simulate the historical workings of the Enigma machine, run Cyclometer-style analyses, and visually interact with plugboards, rotors, and stepping mechanisms.

---

## Project Structure

```
EnigmaSite/
├─ public/                # Static assets (favicon, index.html)
├─ src/
│  ├─ assets/             # UI images and icons
│  ├─ components/         # Modular Vue components
│  ├─ views/              # Core views: Cyclometer, Enigma interface, etc.
│  ├─ services/
│  │   └─ Enigma/         # API interaction logic
│  ├─ router/             # Vue Router config
│  └─ App.vue             # Root component
├─ package.json           # Project metadata and scripts
├─ vue.config.js          # Dev/Prod settings
└─ dist/                  # Production build output
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Bibble-code/EnigmaSite.git
cd EnigmaSite
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run serve
```

This will launch the app at `http://localhost:8080` with hot-reload.

### 4. Build for production

```bash
npm run build
```

This creates a minified production-ready bundle inside `/dist/`.

---

## Configuration

The frontend expects a running instance of [Enigma-API](https://github.com/UPEV1sion/Enigma-API) to respond at:

```http
http://localhost:8081/api/...
```

You can change the backend target by editing the service config in:
```
src/services/Enigma/BackendEnigma.js
```

Make sure CORS settings in the backend (`application.properties`) allow access from the frontend domain.

---

## Related Projects

- **[Enigma-API](https://github.com/UPEV1sion/Enigma-API)** – Spring Boot API layer bridging to native code
- **[EnigmaServer](https://github.com/UPEV1sion/Enigma/tree/server)** – Native C code for libenigma.so
- **[EnigmaSite](https://github.com/Bibble-code/EnigmaSite)** – You are here

---

## Licensing

Distributed under the [MIT License](../LICENSE).  
Part of a university research project reimagining cryptographic history through modern tools.
