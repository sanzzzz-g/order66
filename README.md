# 🛡️ Order 66 - Sith Productivity App
A dark-themed, full-stack productivity timer app inspired by the Sith Lords.
> "Execute Order 66... and focus like a true apprentice of the Dark Side."
---


🌍 Problem Statement

Procrastination, task switching, and screen fatigue are among the biggest threats to productivity.
Order 66 combats this by forcing immersive concentration for a fixed 66-minute session — an execution of your distractions in true Sith fashion.

----
📌 Overview

Order 66 integrates immersive design, ambient sound, and screen-locking utilities to create an environment optimized for single-task productivity. It’s perfect for:

- Deep work sprints
- Study sessions
- Creative focus blocks
- Code marathons
----
⚙️ Core Features
----
⏱️ Focus Timer (66 Minutes)
- Start/Pause/Reset controls
- Auto-alert on completion
- Time remaining in real-time
- --
🚫 Distraction Lock Mode
- Fullscreen enforcement using the Fullscreen API
- Dimming overlay to eliminate peripheral distractions
- Locked interaction until session ends or force-unlocked
- --
🔊 Sith Audio + Quote Engine
- Ambient Sith background sounds
- Random motivational quotes from Sith Lords (Darth Vader, Palpatine, Kylo Ren)
- Audio mute/unmute toggle
- ---
🧠 Streak Tracking (Local Storage)
- Stores daily completed session data
- Visual streak counters (🔥 1-day, 2-day, etc.)
- Persistent across browser sessions
- ---
🎨 Sith-Themed UI & Mascot
- Dark theme with red-accented highlights
- Animated Sith mascot or embedded GIF (e.g., Vader breathing, lightsaber ignition)
- Custom fonts and glows for a cinematic interface
- ---
🖥️ Tech Stack

- Layer	Technology
- Frontend	HTML, CSS (Tailwind or custom), JS / React
- Timer Logic	JavaScript, setInterval(), Date API
- Audio	HTML5 <audio> API
- Storage	Browser localStorage
- Fullscreen	Fullscreen API
- Deployment	Vercel
- ----
📁 Project Structure (Sample)
-------
- ├── /assets
- │   ├── audio/            # Sith background audio
- │   ├── images/           # Mascot, logos, icons
- ├── /components           # React components (if applicable)
- ├── index.html            # Main page (Vanilla)
- ├── style.css             # Theme + visual styles
- ├── script.js             # Timer logic (Vanilla)
- ├── App.jsx               # Main React app (if using React)
- └── vercel.json           # Vercel deployment config
----
🚀 Getting Started
----
Clone and run locally:

git clone https://github.com/your-username/order66-timer.git
cd order66-timer
----
# If using plain HTML/CSS/JS
- open index.html
---
# If using React (Vite or CRA)
- npm install
- npm run dev
----
🔮 Future Enhancements
----
- 📱 Mobile optimization & PWA support
- 📊 In-app analytics dashboard (session time, focus rate)
- 🧠 AI-generated quote engine (custom moods)
- 🌐 Multilingual Sith quote packs
- 🎯 Custom session durations + break reminders
- 🔔 Push notifications for recurring sessions
- ---
 🎯 Purpose
-------
Order 66 was created to help makers, coders, and students eliminate modern distractions and enter a flow state on command — with a little help from the dark side. This is not a timer.
This is an execution order for procrastination.




