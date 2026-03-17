# 🏥 MediCare+

> **AI-powered healthcare automation platform** — streamlining patient-doctor interaction, appointment scheduling, and hospital workflow management through intelligent preprocessing, serverless cloud infrastructure, and real-time communication pipelines.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Workflow](#workflow)
- [Roles & Access](#roles--access)
- [What Makes MediCare+ Stand Out](#what-makes-medicare-stand-out)
- [Future Scope](#future-scope)

---

## Overview

MediCare+ is a full-stack healthcare platform built to go beyond basic appointment scheduling. It introduces intelligent patient input preprocessing via a Groq-powered LLM backend, automated communication pipelines, secure payment handling, and a multi-role ecosystem — making it a close simulation of a real-world hospital management system.

---

## Features

### 👤 Patient Experience
- Secure signup & login
- Conversational assistant-based UI for guided input
- Collects name, symptoms (free text + dropdown), and preferred appointment time

### 🤖 AI-Powered Symptom Processing
- Patient symptoms are forwarded to a **Cloudflare Worker** backend
- The worker calls the **Groq API** to:
  - Extract structured symptoms from raw free-text input
  - Generate a generalized disease assessment
- Output is used to intelligently assign the most relevant doctor

### 🩺 Doctor Dashboard
- Role-based authenticated access
- View assigned patients with:
  - AI-extracted symptoms
  - AI-generated disease assessment
  - Appointment schedule

### 🛠️ Admin Panel
- Centralized control over the entire system
- Monitor all users (patients, doctors), appointments, and system activity
- Designed for scalability to hospital-level deployment

### 🧪 Medical Equipment / Test Portals
- Dedicated logins for: `MRI` · `X-Ray` · `ECG` · `Ventilator` · `Blood Test`
- Simulates real hospital equipment infrastructure
- Extensible for test booking and report management

### 📩 Automated Email Notifications
- Powered by **EmailJS** (no backend server required)
- Emails automatically sent on appointment booking and confirmation
- Improves patient engagement and communication reliability

### 💳 Payment Integration
- **Razorpay** gateway for secure appointment payments
- Supports UPI, Cards, and Net Banking
- Enables real-world monetization of the platform

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Auth & Database** | Firebase Authentication, Firestore / Realtime Database |
| **Serverless Backend** | Cloudflare Workers |
| **AI / LLM** | Groq API (NLP inference) |
| **Email** | EmailJS |
| **Payments** | Razorpay |
| **Hosting** | Vercel |

---

## Architecture

```
Patient Input (Assistant UI)
        │
        ▼
Cloudflare Worker  ──────────────────────────────────┐
        │                                             │
        ▼                                             │
   Groq API (LLM)                              Secure API Layer
   ├─ Symptom Extraction                    (No key exposure on frontend)
   └─ Disease Assessment                             │
        │                                             │
        ▼                                             │
Doctor Mapping Logic  ◄──────────────────────────────┘
        │
        ▼
Firebase Database
        │
        ▼
Dashboards (Admin / Doctor)
        │
        ▼
EmailJS Notification + Razorpay Payment
```

---

## Getting Started

### Prerequisites
- Node.js (for local tooling / Cloudflare Wrangler CLI)
- A Firebase project with Authentication and Firestore enabled
- A Cloudflare account with Workers enabled
- API keys for: Groq, EmailJS, Razorpay

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/medicare-plus.git
cd medicare-plus
```

### 2. Configure Firebase

Create a `firebaseConfig.js` file with your Firebase project credentials:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  ...
};
```

### 3. Deploy the Cloudflare Worker

```bash
cd worker
npx wrangler deploy
```

Set your Groq API key as a Cloudflare secret:

```bash
npx wrangler secret put GROQ_API_KEY
```

### 4. Configure EmailJS & Razorpay

Update the relevant config files with your EmailJS service/template IDs and your Razorpay key.

### 5. Deploy Frontend

```bash
# Via Vercel CLI
vercel deploy
```

---

## Workflow

1. **Patient** signs up, uses the conversational UI to enter symptoms and preferred appointment time.
2. Input is sent to a **Cloudflare Worker**, which calls the **Groq API** for NLP processing.
3. Groq extracts structured symptoms and generates a disease assessment.
4. The system maps the patient to a relevant **doctor** and stores the record in **Firebase**.
5. An automated **email confirmation** is sent via EmailJS.
6. The patient completes appointment payment via **Razorpay**.
7. The assigned **doctor** logs in to their dashboard and reviews the AI-generated assessment.
8. The **admin** monitors all activity from the central panel.

---

## Roles & Access

| Role | Capabilities |
|---|---|
| **Patient** | Register, submit symptoms, book & pay for appointments, receive email confirmation |
| **Doctor** | View assigned patients, AI symptom report, and appointment schedule |
| **Admin** | Full system visibility — users, appointments, activity monitoring |
| **Equipment Portals** | MRI, X-Ray, ECG, Ventilator, Blood Test — dedicated logins for each |

---

## What Makes MediCare+ Stand Out

- 🤖 **AI preprocessing** — symptoms are understood, not just stored
- ⚡ **Serverless edge backend** via Cloudflare Workers for low latency and scalability
- 🔐 **Secure API handling** — LLM keys never exposed on the frontend
- 📩 **Automated communication pipeline** — EmailJS handles confirmations seamlessly
- 💳 **Fully integrated payment system** via Razorpay
- 🏥 **Multi-role ecosystem** — Patient, Doctor, Admin, and Equipment portals in one platform

---

## Future Scope

- 📱 Mobile app (React Native / Flutter)
- 🗂️ Medical report upload and management per test portal
- 🔔 SMS / WhatsApp notification support
- 📊 Analytics dashboard for hospital administrators
- 🌐 Multi-language support for broader accessibility
- 🔗 HL7 / FHIR compliance for real-world EHR integration

---

<div align="center">

Built with ❤️ using Firebase · Cloudflare Workers · Groq · Razorpay · EmailJS · Vercel

</div>
