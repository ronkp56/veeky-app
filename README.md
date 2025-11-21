# Veeky App (Frontend)

## ⚙️ Prerequisites

Before getting started, make sure you have the following installed on your machine:

### ✅ Required

- **[Git](https://git-scm.com/downloads)**
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**

You can verify installations with:

```bash
git --version
docker --version
```

## ▶️ Running the App

### Veeky Web Image (Docker)

This is a Docker-based setup for running the Veeky Expo app in web mode.

#### 📦 Included

- `Dockerfile`: Builds the Expo app and starts it in web mode (`--web --lan`).
- `docker-compose.yml`: Simplifies development with port forwarding for Expo Web (8081).

#### 🚀 Usage

1. Clone the repository from Git

```bash
git clone https://github.com/TalHadad94/veeky-app.git
```

2. Move to the project folder

```bash
cd veeky-app
```

3. Build

```bash
docker-compose build --no-cache
```

4. Run

```bash
docker-compose up
```

5. Open your browser and paste:

```
http://localhost:8081
```

> Make sure port 8081 is not blocked by firewalls.

# Veeky App (Frontend)

Welcome to the frontend codebase for **Veeky**, a mobile-first app that helps users discover and book vacations through short-form videos. This project is built with **React Native**, powered by **Expo**, and written in **TypeScript**.

We’ve set this project up from scratch — no boilerplate tabs, no unnecessary files — just a clean foundation to build from.

---

## 📁 Project Structure & File Overview

Here’s a breakdown of what each folder and file does in this repo.

---

### 📂 `assets/`

Contains all static assets used by the app — icons, splash images, etc.

| File                | Purpose                                  |
| ------------------- | ---------------------------------------- |
| `icon.png`          | The app icon used across platforms       |
| `splash-icon.png`   | The image shown while the app is loading |
| `adaptive-icon.png` | Required by Android (for rounded icons)  |
| `favicon.png`       | Used on web builds                       |

---

### 📂 `components/`

Reusable UI components will live here — anything that appears in multiple places.

Examples (you might create):

- `VideoCard.tsx` – shows a single vacation video
- `ReserveButton.tsx` – call-to-action used on feed & trip screens
- `Tag.tsx` – for things like “Greece”, “Luxury”, “Adventure”

Right now this folder is empty, and we’ll build it out as the app grows.

---

### 📂 `navigation/`

Handles app routing and screen transitions using React Navigation.

| File                | Purpose                                             |
| ------------------- | --------------------------------------------------- |
| `RootNavigator.tsx` | Defines all screens and how users move between them |

This is where you’ll add or reorder screens (e.g., Login → Feed → Profile).

---

### 📂 `screens/`

Each file here is a full **page** or **screen** in the app.

| File                 | Purpose                                                   |
| -------------------- | --------------------------------------------------------- |
| `LoginScreen.tsx`    | Starting screen — handles login and routes to Feed        |
| `HomeFeedScreen.tsx` | Main screen — users scroll vacation videos                |
| `ProfileScreen.tsx`  | User info, saved videos, uploaded content, settings, etc. |

Every screen is built as a functional React component.

---

### 📄 `App.tsx`

This is the main entry point of the app.

All it does is set up the navigation system.

---

### 📄 `app.json`

This is the **Expo configuration file**. It defines global app settings:

| Key           | Purpose                                 |
| ------------- | --------------------------------------- |
| `name`        | Display name of the app                 |
| `slug`        | Project folder name (used in Expo URLs) |
| `version`     | App version                             |
| `orientation` | Portrait or landscape (we use portrait) |
| `icon`        | Path to the app icon                    |
| `splash`      | Splash screen shown on startup          |
| `platforms`   | Supported platforms (ios, android, web) |

You can customize this if you need a different splash screen or app icon.

---

### 📄 `package.json`

This is where **all dependencies and scripts** are tracked.

- Use it when you install packages (e.g. `npm install react-native-video`)
- It also defines your project name and version
- Scripts like `npm start` or `npm run web` are defined here

If you ever need to check what libraries are being used — start here.

---

### 📄 `tsconfig.json`

This file controls how **TypeScript** checks and builds your code.

You don’t usually need to touch it, but it ensures:

- Type safety (like autocomplete and prop checking)
- Stronger error messages during development

---

### 📄 `.gitignore`

Tells Git which files to **ignore** in version control, like:

- `node_modules/`
- `.expo/`
- `*.log` files

---

### Start the development server:

```bash
npx expo start
```

| Key Press | What It Does                            |
| --------- | --------------------------------------- |
| `w`       | Open the app in your web browser        |
| `a`       | Launch the Android emulator (if set up) |
| QR Code   | Scan with **Expo Go** on your phone     |

🧠 Developer Notes
| Location | What Belongs There |
| ------------- | ---------------------------------------- |
| `screens/` | Full screen views (Login, Feed, Profile) |
| `components/` | Reusable UI (VideoCard, Button, etc.) |
| `navigation/` | Stack & screen navigation setup |

✅ Use TypeScript for all files — it improves autocomplete, prevents bugs, and helps with scaling.

👥 Team & Contribution
If you're contributing to this repo, here are some guidelines:

- Keep your code clean, modular, and mobile-friendly

- Create components for any UI repeated more than once

- Ask before adding new libraries or dependencies

- Follow existing patterns in App.tsx and RootNavigator.tsx

We're building Veeky to be a smart, delightful experience — ask questions, share feedback, and build with quality in mind 💡
