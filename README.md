# 3D E. coli Explorer

An interactive, educational 3D visualization of an *Escherichia coli* bacterium. This application allows users to explore the microscopic world and understand the anatomy and complex biological machinery of a living bacterial cell.

**[Live Demo](https://AnsiKwansi.github.io/ecoli-3d/)**

## What It Does

The **3D E. coli Explorer** serves as a digital microscope and interactive textbook. It visualizes the internal and external structures of an *E. coli* cell in a highly aesthetic, schematic format. 

Users can explore key cellular components, including:
- **The Cell Envelope**: Observe the layered defense of the capsule, cell wall, and plasma membrane.
- **Locomotion and Adhesion**: Inspect the helical **flagella** used for swimming and the hair-like **pili** used for attachment.
- **Genetic Material**: Dive into the center of the cell to see the highly folded, supercoiled **nucleoid** (chromosomal DNA) and separate circular **plasmids**.
- **Protein Synthesis**: Witness macromolecular crowding through hundreds of **ribosomes** dispersed throughout the cytoplasm.
- **Molecular Machinery**: Locate specific enzymes and sensors, such as the **RecBCD** enzyme, **I-SceI** endonuclease, and fluorescent reporters like **GamGFP** and **TetR-mCherry** used in genetic engineering and research.

## How It Works (User Experience)

- **Interactive Hotspots**: The 3D model is overlaid with clickable labels. Clicking on any structure (or its label) highlights the component and opens an information panel.
- **Dynamic Camera**: When a specific part is selected, the camera automatically glides and zooms in to focus on that molecular structure, allowing for up-close inspection.
- **Information Panel**: A dedicated UI panel provides biological context, explaining the function and significance of the selected component in real-time.

## How It Works (Under the Hood)

Rather than using a pre-built, static 3D model file, this application **procedurally generates** the biological structures using mathematics and code. This allows for dynamic, organic-looking shapes and high performance in the browser.

- **Procedural Geometry**: The highly complex, supercoiled DNA (nucleoid) and plasmids are generated using 3D random walks and mathematical Lissajous curves wrapped in 3D tube geometries. 
- **Macromolecular Crowding**: To simulate the dense, crowded environment of a real cell, the application uses **Instanced Meshes** to render hundreds of individual ribosomes simultaneously in a single, highly-optimized draw call.
- **Tech Stack**: 
  - **React & Vite**: Manages the application state, user interface, and lightning-fast local development.
  - **Three.js & React Three Fiber**: The core 3D rendering engine that translates React components into WebGL graphics.
  - **Postprocessing**: Adds advanced visual effects, like the bloom and glow of fluorescent proteins (GFP/mCherry), giving the cell a premium, medical-tech aesthetic.

## Getting Started

To run the project locally and experiment with the code:

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
