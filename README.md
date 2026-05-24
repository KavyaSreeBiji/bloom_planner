<div align="center">
  
  <h1 align="center">Bloom Planner</h1>

  <p align="center">
    <strong>Focus on progress, not perfection.</strong>
    <br />
    A beautifully designed, aesthetic productivity web application to help you stay organized and build better habits at your own pace.
    <br />
    <br />
    <a href="#-features">Features</a>
    ·
    <a href="#%EF%B8%8F-tech-stack">Tech Stack</a>
    ·
    <a href="#-getting-started">Getting Started</a>
    ·
    <a href="#-design-philosophy">Design Philosophy</a>
  </p>
</div>

---

## ✨ Features

- **🔐 Authentication**: Secure sign-up, login, and user profile management powered by Firebase.
- **📅 Weekly Planner**: Plan your week with daily task lists, top priorities (with add/remove functionality), weekly goals, and a dedicated notes section.
- **✨ Habit Tracker**: Build and maintain daily habits. 
  - **Intelligent Icon Prediction**: Typing "coding" automatically assigns a 💻 icon, "learning" gets a 🎓, "music" gets a 🎵, etc.
  - **Analytics**: Track your best streak, weekly check-in percentage, and total habits completed.
  - **Reflection**: Dedicated text areas to reflect on what went well and what you want to focus on next week.
- **✅ To-Do List**: A simple, intuitive daily to-do list to keep track of your most important tasks.
- **🕰️ History**: Look back at your previous weeks and reflect on your growth over time.
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile displays.

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) (Lightning-fast HMR)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Styling**: Vanilla CSS with a highly customized aesthetic color palette (`--cream`, `--blush`, `--terracotta`).
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend / DB**: [Firebase](https://firebase.google.com/) (Authentication & Cloud Firestore for real-time data synchronization).

## 🚀 Getting Started

Follow these steps to run Bloom Planner locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- A [Firebase](https://firebase.google.com/) project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/bloom-planner.git
   cd bloom-planner
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase Environment Variables:**
   Create a `.env` file in the root directory and add your Firebase configuration details:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser** and visit `http://localhost:5173`.

## 📁 Project Structure

```text
bloom-planner/
├── src/
│   ├── components/
│   │   ├── Auth/           # Login & Signup screens
│   │   ├── HabitTracker/   # Habit check-ins, stats, icon mappings
│   │   ├── History/        # Past weeks review
│   │   ├── Layout/         # Navbar and global layout wrappers
│   │   ├── TodoList/       # Daily task management
│   │   └── WeeklyPlanner/  # Day-by-day planner & goals
│   ├── context/            # Global state (AuthContext)
│   ├── hooks/              # Custom Firebase hooks (useFirestore.js)
│   ├── App.jsx             # Main app shell & routing
│   ├── firebase.js         # Firebase initialization
│   └── index.css           # Design system tokens and core styles
├── index.html
└── package.json
```

## 🎨 Design Philosophy

Bloom Planner was designed with calmness and mindfulness in mind. Unlike rigid, overwhelming productivity tools that stress you out, Bloom Planner uses a soft, warm palette (creams, blushes, and terracottas) and encouraging micro-copy to help you "grow at your own pace." Every element is carefully crafted to feel like a premium, aesthetic digital journal.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/yourusername/bloom-planner/issues).

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---
<div align="center">
  <i>Made with love 🌸</i>
</div>
