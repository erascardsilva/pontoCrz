# PontoCrz

<div align="center">

![PontoCrz](https://img.shields.io/badge/PontoCrz-Cross--Stitch%20Generator-38bdf8?style=for-the-badge)

**Convert photos into Cross-Stitch charts using the official DMC palette**

[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat&logo=go)](https://go.dev)
[![Wails](https://img.shields.io/badge/Wails-v2-red?style=flat)](https://wails.io)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)](https://typescriptlang.org)
[![Linux](https://img.shields.io/badge/Linux-ready-FCC624?style=flat&logo=linux)](https://kernel.org)
[![Windows](https://img.shields.io/badge/Windows-ready-0078D4?style=flat&logo=windows)](https://microsoft.com)
[![Available on Snap Store](https://snapcraft.io/pt/dark/install.svg)](https://snapcraft.io/ponto-crz)

</div>

---

## About

**PontoCrz** is a desktop application that converts images (JPG, PNG) into **Cross-Stitch charts**, featuring:

- **Official DMC palette** with 454 colors (RGB Euclidean distance mapping).
- **Nearest Neighbor** algorithm for resizing.
- **Technical grid** with 10×10 reference markers for counting stitches.
- **A4 / A3 export** at 300 DPI.

---

## Architecture

```mermaid
graph TB
    subgraph Frontend ["Frontend (React + TypeScript)"]
        UI["App.tsx\n(UI + Controls)"]
        Bindings["WailsJS Bindings\n(Auto-generated)"]
    end

    subgraph Bridge ["Wails Bridge"]
        App_go["app.go\n(PickFile / ProcessImage / SaveImage)"]
    end

    subgraph Backend ["Backend (Go)"]
        Processor["processor.go\n(Resize + DMC Map + Export)"]
        Colors["colors.go\n(454 DMC Colors)"]
    end

    subgraph Output ["Output"]
        JPG["Cross-Stitch Chart JPG\n(With 10x10 grid)"]
    end

    UI -- "Wails RPC" --> Bindings
    Bindings --> App_go
    App_go --> Processor
    Processor -- "FindNearestDMC()" --> Colors
    Colors -- "DMCColor{ID, Hex, RGB}" --> Processor
    Processor -- "[][]string Pixel Hex" --> App_go
    App_go -- "SaveToJPG()" --> Processor
    Processor --> JPG
```

---

## Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| **Go** | 1.21+ | Backend and image processing |
| **Wails** | v2.11 | Desktop bridge |
| **React** | 18 | User interface |
| **TypeScript** | 5 | Frontend logic |
| **Vite** | 3 | Build tool |
| **golang.org/x/image** | latest | Image resizing |
| **image/jpeg** | — | JPG export |
| **sync.WaitGroup** | — | Parallel processing |

---

## Core Logic

### 1. Image → DMC Pixels (`processor.go`)

```go
// Resize using Nearest Neighbor
resized := image.NewRGBA(image.Rect(0, 0, targetWidth, targetHeight))
draw.NearestNeighbor.Scale(resized, resized.Bounds(), img, bounds, draw.Over, nil)

// Map each pixel to the nearest DMC color
for y := startRow; y < endRow; y++ {
    for x := 0; x < targetWidth; x++ {
        c := resized.At(x, y)
        r32, g32, b32, _ := c.RGBA()
        r, g, b := uint8(r32>>8), uint8(g32>>8), uint8(b32>>8)

        nearest := FindNearestDMC(r, g, b)
        pixels[y][x] = nearest.Hex
    }
}
```

### 2. Export with Technical Grid (`processor.go`)

```go
func SaveToJPG(outputPath string, data *ProcessedImage, cellSize int) error {
    const gridSize = 1
    const majorSize = 3 

    // Grid lines every 10 squares
    for x := 0; x <= data.Width; x++ {
        thickness := gridSize
        if x > 0 && x%10 == 0 { thickness = majorSize }
        ...
    }
}
```

---

## Installation

### Prerequisites

- **Go** 1.21+: [go.dev/dl](https://go.dev/dl)
- **Node.js** 18+: [nodejs.org](https://nodejs.org)
- **Wails CLI**: `go install github.com/wailsapp/wails/v2/cmd/wails@latest`

---

### Linux — Direct Run

```bash
git clone https://github.com/erascardilva/pontoCrz.git
cd pontoCrz

chmod +x build/bin/pontoCrz
./build/bin/pontoCrz
```

---

### Windows — Direct Run

```
1. Download the repository
2. Run: build\bin\pontoCrz.exe
```

---

## Build from Source

### Linux
```bash
wails build
```

### Windows (Cross-compile)
```bash
wails build --platform windows/amd64 -nsis
```

---

## Project Structure

```
pontoCrz/
├── build/bin/                   ← Executables
├── backend/
│   ├── processor.go             ← Image processing
│   └── colors.go                ← DMC palette
├── frontend/src/
│   ├── App.tsx                  ← UI component
│   └── style.css                ← Styles
├── app.go                       ← Wails bridge
├── main.go                      ← Entry point
└── wails.json                   ← Configuration
```

---

## License

MIT License.

---

<div align="center">

**Erasmo Cardoso**<br>
**Software Engineer | Electronics Specialist**


</div>
