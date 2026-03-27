<div align="center">
  <img src="https://github.com/Abdenasser/neohtop/raw/main/app-icon.png" alt="PyNeoHtop Logo" width="120" />
  <h1>PyNeoHtop</h1>
  <p>A modern cross-platform system monitor built with Python, pywebview, and psutil</p>

  [![License](https://img.shields.io/github/license/Abdenasser/neohtop)](https://github.com/BasterHapy/PyNeoHtop/blob/main/LICENSE)
  [![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/downloads/)
  [![Platform](https://img.shields.io/badge/Platform-Linux%20%7C%20macOS%20%7C%20Windows-lightgrey.svg)](#supported-platforms)
</div>

<div align="center">
  <p><i>Inspired by <a href="https://github.com/Abdenasser/neohtop">NeoHtop</a></i></p>
</div>

## Table of Contents

- [Why Choose PyNeoHtop?](#why-choose-pyneohtop)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Supported Platforms](#supported-platforms)
- [Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Run the Application](#run-the-application)
- [Build & Release](#build--release)
- [Project Structure](#project-structure)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## Why Choose PyNeoHtop?

PyNeoHtop is a Python implementation of [NeoHtop](https://github.com/Abdenasser/neohtop).
It provides developers with a lightweight and easily extendable system monitoring utility.
Built purely with Python, it lowers the learning curve and facilitates secondary development.

## Features

- 🚀 **Real-time System Monitoring** — Comprehensive tracking for CPU, memory, disk and network
- 💻 **CPU Monitoring** — Processor model, overall usage and per-core load display
- 🧠 **Memory Monitoring** — RAM usage, total/used capacity, available memory and cache statistics
- 💾 **Disk Monitoring** — Disk utilization, used space and free storage overview
- 🌐 **Network Monitoring** — Real-time upload and download speed for each network adapter
- ℹ️ **System Information** — System uptime and average load display
- 🎨 **Modern UI Design** — Clean and elegant dashboard layout

## Tech Stack

- **Language**: Python >= 3.12
- **GUI Framework**: [pywebview](https://pywebview.flowrl.com/) — Lightweight cross-platform native desktop window
- **System Metrics**: [psutil](https://psutil.readthedocs.io/) — Cross-platform system monitoring library
- **Frontend**: HTML5 / CSS3 / JavaScript
- **Packaging Tool**: [Nuitka](https://nuitka.net/) — Python compiler for standalone builds

## Supported Platforms

| Platform | Status |
|:----:|:--------:|
| Linux | Supported✅ |
| macOS | To be tested✅ |
| Windows | Supported✅ |

## Quick Start

### Prerequisites

- Python 3.12 or higher
- pip or [uv](https://docs.astral.sh/uv/) package manager

### Installation

Clone the repository:

```bash
git clone https://gitcode.com/BasterHapy/PyNeoHtop.git
cd PyNeoHtop
```

Install dependencies:

**Using pip:**

```bash
pip install -r requirement.txt
```

**Using uv:**

```bash
uv sync
```

### Run the Application

```bash
python main.py
```
With uv:
```bash
uv run main.py
```

## Build & Release

You can use Nuitka to compile the project into a standalone executable file:

```bash
# Install packaging dependencies
pip install nuitka ordered-set zstandard
```
With uv:
```bash
uv pip install nuitka ordered-set zstandard
```

### Build as a Single Executable File
```bash
nuitka --standalone --onefile \
     --enable-plugin=pywebview \
     --enable-plugin=pyside6 \
     --include-data-dir=static=static \
     --include-package=monitoring \
     --include-package=psutil \
     --include-package=cpuinfo \
     main.py
```

With uv:
```bash
uv run nuitka --standalone --onefile \
     --enable-plugin=pywebview \
     --enable-plugin=pyside6 \
     --include-data-dir=static=static \
     --include-package=monitoring \
     --include-package=psutil \
     --include-package=cpuinfo \
     main.py
```

## Project Structure
```
PyNeoHtop/
├── main.py                  # Application entry point
├── pyproject.toml           # Project configuration
├── requirement.txt          # Dependency list
├── LICENSE                  # Apache 2.0 License
├── monitoring/
│   ├── system_monitor.py    # Core system monitoring logic
│   ├── process_monitor.py   # Process monitoring module
│   ├── function_tools.py    # Common utility functions
│   └── type.py              # Type definitions
└── static/
    ├── index.html           # Frontend page
    ├── style.css            # Global stylesheet
    ├── script.js            # Frontend interaction logic
    └── images/              # Icon and image resources
```

## Dependency Description

| Package | Purpose |
|---------|---------|
| psutil | Collect cross-platform system performance data |
| pywebview | Create lightweight native desktop application windows |
| zstandard | Provide compression support for Nuitka packaging |

## Acknowledgements

This project is inspired by [NeoHtop](https://github.com/Abdenasser/neohtop).
Thanks to the original author for the outstanding design and inspiration.

## License

This open-source project is licensed under the [Apache License 2.0](LICENSE).
