# ADHD Study Planner

A study planner built for students with ADHD. It puts tasks, habits, a calendar, a Pomodoro study room and a distraction blocker in one place, plus a short self-screening quiz with AI help for confusing questions.

**Live API:** https://adhd-fudz.onrender.com

## Features

- **Tasks** – create, edit, pin, tag, search and complete tasks with due dates
- **Habits** – daily, weekday, weekend, weekly or biweekly habits with progress goals, colors and reminder times
- **Calendar** – drag-and-drop day and week views of your tasks (Schedule-X)
- **Email reminders** – an hourly job emails you about tasks due within the next hour
- **ADHD self-screener** – 18 questions based on the adult ADHD self-report scale (ASRS), with a score band at the end. Stuck on a question? Ask for a one-sentence example from Google Gemini.
- **Study mode** – Pomodoro timer (25 min focus, short and long breaks), task list, background music (lofi, rain, piano, fire, nature) and animated backgrounds
- **Focus mode** – a companion Chrome extension blocks Facebook, X/Twitter, Instagram, TikTok and LinkedIn while you study

> The screener is for self-reflection only. It is not a diagnosis.

## Tech stack

| Part | Tools |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS v4, React Router, Axios, Framer Motion, Schedule-X |
| Backend | Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt, node-cron, Nodemailer |
| AI | Google Gemini (`gemini-2.0-flash`), called from the backend |
| Extension | Chrome Manifest V3, `declarativeNetRequest` |

## Project structure

```
backend/                 Express API
  index.js               routes for auth, tasks and habits
  ai.js                  /ai/explain – Gemini example for screener questions
  notification.js        /notification – send a task email on demand
  scheduler/reminderCron.js  hourly due-soon reminders
  models/                User, Task, Habit
frontend/study-planner/  React app
social-media-blocker/    Chrome extension for focus mode
```

## Running it locally

You need Node.js 18+ and a MongoDB database (a free MongoDB Atlas cluster works).

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values
npm start              # or: npx nodemon index.js
```

| Variable | What it's for |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | any long random string, used to sign login tokens |
| `EMAIL_USER`, `EMAIL_PASS` | Gmail address and [app password](https://support.google.com/accounts/answer/185833) for reminders |
| `GEMINI_API_KEY` | Google Gemini API key for screener help |
| `CLIENT_ORIGIN` | frontend URL(s) allowed to call the API, comma-separated |
| `TIMEZONE` | time zone used in reminder emails (default `America/Chicago`) |

The API runs on http://localhost:8000.

### 2. Frontend

```bash
cd frontend/study-planner
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:8000
npm run dev
```

Open http://localhost:5173.

### 3. Chrome extension (optional)

1. Go to `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and choose the `social-media-blocker` folder.
3. Copy the extension's ID into `VITE_EXTENSION_ID` in the frontend `.env` and restart the dev server.
4. Open **Focus Mode** in the app and toggle it on.

To use focus mode with a deployed frontend, add that site to `externally_connectable.matches` in `social-media-blocker/manifest.json`, for example `"https://your-site.example/*"`.

## Security notes

- Passwords are hashed with bcrypt. Accounts created before hashing was added are upgraded to a hash the next time they log in.
- All secrets live in `.env` files, which git ignores. Never commit them.
- The Gemini key stays on the server, and the frontend reaches Gemini through `/ai/explain`.
