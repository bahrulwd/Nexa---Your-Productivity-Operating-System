# <p align="center"><img src="frontend/public/images/LogoPanjang.png" alt="Nexa Logo" width="320" /></p>

<p align="center">
  <strong>⚡ Nexa - Premium Full-Stack Task Management SaaS</strong>
</p>

<p align="center">
  Nexa is a premium <strong>Decision Support System</strong> and task management platform designed to help professionals optimize their daily workflow, manage cognitive load, and prevent burnout.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Laravel-v11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
</p>

---

## ✨ Key Features

* **🎯 Smart Priority Score Engine:** A custom backend algorithm built with Laravel that dynamically calculates task priority based on deadlines, urgency, impact, and duration.
* **⚖️ Workload Monitoring:** Real-time tracking of daily focus hours against user capacity limits to detect and alert before overloading.
* **⏱️ Nexa Focus Hub:** A dedicated, distraction-free execution workspace equipped with a focus countdown timer and post-session progress reflections.
* **🚀 Interactive Split-Screen Onboarding:** A modern, beautiful progressive wizard designed to capture user goals and work capacities during registration.

---

## 📸 Screenshots

<details>
  <summary><b>Lihat Antarmuka Nexa (Klik untuk membuka)</b></summary>
  
  <br>
  
  **1. Smart Dashboard & Workload Monitoring**
  <img src="frontend/public/images/antarmukaNexa/dashboard.png" alt="Nexa Dashboard" width="100%">

  **2. Interactive Split-Screen Onboarding**
  <img src="frontend/public/images/antarmukaNexa/onboarding1.png" alt="Nexa Onboarding Step 1" width="100%">
  <img src="frontend/public/images/antarmukaNexa/onboarding2.png" alt="Nexa Onboarding Step 2" width="100%">
  <img src="frontend/public/images/antarmukaNexa/onboarding3.png" alt="Nexa Onboarding Step" width="100%">

  **3. Nexa Focus Hub & Pomodoro Timer**
  <img src="frontend/public/images/antarmukaNexa/focus.png" alt="Nexa Focus Mode" width="100%">
  
  **4. My Tasks & Priority Score Sorting**
  <img src="frontend/public/images/antarmukaNexa/mytasks.png" alt="Nexa Tasks" width="100%">
  
</details>

---

## 🏗️ Tech Stack

### Client (Frontend)
* **Build Tool:** Vite
* **Library:** React 19 (SPA)
* **Language:** TypeScript
* **Routing:** React Router v6 (Folder-based route structure)
* **Styling:** Tailwind CSS v4
* **Icons:** Lucide React & FontAwesome 6

### API Server (Backend)
* **Framework:** Laravel 11
* **Database:** MySQL
* **Authentication:** Laravel Sanctum (Token-based)

---

## 📂 Project Structure

```text
Nexa - Your Productivity Operating System/
├── frontend/               # React + Vite Client Application
│   ├── public/             # Static public assets (logos, icons)
│   ├── src/
│   │   ├── app/            # App routes and layout (React Router)
│   │   │   ├── (auth)/     # Auth pages (login, register, onboarding)
│   │   │   └── (dashboard)/# Dashboard, Tasks, Chat, Focus, Workload pages
│   │   ├── assets/         # Imported asset files
│   │   ├── components/     # UI and Feature Components (tasks, dashboard, focus, layout, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Shared utilities and API services
│   │   └── main.tsx        # Application entry point
│   ├── package.json
│   └── vite.config.ts
│
└── backend/                # Laravel 11 REST API Application
    ├── app/
    │   ├── Http/
    │   │   └── Controllers/# Auth and Task API Controllers
    │   ├── Models/         # Eloquent Models (User, Task, Subtask)
    │   └── Providers/      # Service Providers
    ├── config/             # Laravel Config files
    ├── database/           # Migrations, seeders, and factories
    ├── routes/             # Routes (api.php, web.php)
    └── .env.example
```

---

## 🚀 Quick Start Guide

### 1. Clone & Setup Workspace

```bash
git clone https://github.com/bahrulwd/Nexa---Your-Productivity-Operating-System.git
cd "Nexa - Your Productivity Operating System"
```

### 2. Configure Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```
> Configure your MySQL database settings in `.env`, then run migrations and seeders:
```bash
php artisan migrate --seed
php artisan serve
```

### 3. Configure Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The application will be accessible locally via Vite's dev server (typically `http://localhost:5173`).