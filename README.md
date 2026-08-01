# 3D E. coli Explorer

An interactive, educational 3D visualization of an *Escherichia coli* bacterium, built with React and React Three Fiber. This application allows users to explore various cellular components, from the flagella to the nucleoid, in a highly aesthetic, schematic format.

**[Live Demo](https://AnsiKwansi.github.io/ecoli-3d/)**

## Architecture & Technology Stack

This project is built using a modern web stack tailored for high-performance 3D graphics:
- **React (v19)**: Core UI framework managing application state, UI components, and the information overlay.
- **Vite**: Ultra-fast build tool and development server.
- **Three.js & React Three Fiber (@react-three/fiber)**: The 3D rendering engine. React Three Fiber provides a React-declarative wrapper around Three.js, allowing us to build the 3D scene using reusable components.
- **Drei (@react-three/drei)**: A growing collection of useful helpers and abstractions for React Three Fiber (used for OrbitControls, Environment, ContactShadows, Html overlays).
- **Postprocessing (@react-three/postprocessing)**: Adds advanced visual effects like bloom/glow for a premium medical-tech aesthetic.

## System Architecture

The application follows a decoupled architecture separating the 3D canvas from the HTML UI overlay:

### 1. `App.jsx` (The Shell)
The entry point that orchestrates the layout. It holds the global state (`selectedPart`) and renders two distinct layers:
- The **UI Overlay Layer** containing the header and the `PartInfoPanel`.
- The **3D Canvas Layer** rendering the `Scene`.

### 2. `Scene.jsx` (The 3D Environment)
Manages the global 3D environment setup.
- **Lighting & Environment**: Defines ambient lights, spotlights, and the `Environment` map to provide realistic reflections and soft shading.
- **Post-processing**: Applies `Bloom` effects to emissive materials.
- **Camera Controls**: Uses `OrbitControls` for user interaction and a custom `CameraController` to smoothly animate and focus on specific parts when clicked.

### 3. `EcoliModel.jsx` (The Core Model)
This is the heart of the 3D visualization. Instead of relying entirely on heavy external 3D models (like GLTF/GLB), the E. coli structure is generated **procedurally** using mathematical curves and geometries:
- **Capsule & Membranes**: Built using `capsuleGeometry` with varying scale and opacity to represent the cell wall and plasma membrane.
- **Nucleoid & Plasmids**: Generated dynamically using 3D random walks and Lissajous curves (`CatmullRomCurve3`) mapped to `tubeGeometry`.
- **Ribosomes**: Rendered using an `instancedMesh` to display hundreds of ribosomes (macromolecular crowding) efficiently with a single draw call.
- **Hotspots**: Utilizes Drei's `<Html>` component to anchor DOM elements perfectly to 3D coordinates, updating their position during camera rotation.

### 4. `PartInfoPanel.jsx` & `data/parts.json` (Data Layer)
The UI side panel that dynamically displays biological context based on the user's selection. All descriptions, names, and color themes are decoupled into a JSON data file for easy content management.

## Getting Started

To run the project locally:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

The project is configured to automatically build and deploy to GitHub Pages via the `gh-pages` package. 
To deploy updates:
```bash
npm run deploy
```
