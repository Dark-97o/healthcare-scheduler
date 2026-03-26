# Welcome to the MediCare+ Redesign Plan

The goal is to rebuild the MediCare+ web application using modern UI/UX trends (3D models, scrollytelling, glassmorphism) researched in `context.md`. Given the complexity of implementing 3D graphics (Three.js) and advanced scroll animations, migrating the current single-file Vanilla HTML setup to a modular **React (Vite)** architecture is highly recommended. 

This will make managing state, integrating the Groq AI API, Firebase, and Razorpay significantly cleaner and more scalable.

## Proposed Changes

### 1. Project Initialization & Architecture
*   Move existing `.html` files to `legacy/` to preserve logic for reference.
*   Initialize a new React project using Vite in the root directory.
*   Install necessary dependencies:
    *   `react-router-dom` for navigating between Patient, Admin, and Doctor portals.
    *   `tailwindcss` for utility-first styling and glassmorphism.
    *   `three` and `@react-three/fiber` for the 3D Hero components.
    *   `framer-motion` for scrollytelling and page transitions.
    *   `firebase` for authentication and database interactions.

---

### 2. Frontend Restyling (The "Wow" Factor)
*   **Design System:** Replace the basic CSS with a comprehensive Tailwind configuration using premium colors (deep forest greens, cream, gold accents) and modern fonts (Playfair Display & DM Sans).
*   **3D Hero Section:** Implement a `<Hero3D />` React component that renders a lightweight, interactive 3D medical-themed model that users can subtly interact with using their mouse.
*   **Scrollytelling:** Use `framer-motion` to create scroll-linked animations where content reveals smoothly mapped to the user's scroll position.

---

### 3. Porting Core Logic
*   **Firebase Integration:** Port the existing Firebase initialization and Auth state listener into a React Context provider (`AuthContext`).
*   **AI Assessment (Groq API):** Port the Cloudflare worker fetch logic into a React custom hook or service file.
*   **Razorpay:** **[EXTRACTED OFFICIALLY]** - Located the `rzp_live_SRCE9sabTGkSGi` Token injected into `legacy/index.html`. Successfully wrapped the React frontend logic into `BookAppointment.tsx` by bootstrapping `window.Razorpay` with automated API callbacks capturing `razorpay_payment_id` prior to executing the EmailJS receipts!
*   **Portals:** 
    *   Rebuild `index.html` main flow as `Home.tsx`.
    *   Rebuild `admin.html` as `AdminDashboard.tsx`.
    *   Rebuild `doctor.html` as `DoctorDashboard.tsx`.
