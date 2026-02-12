# Task Hive

A modern, full-stack task management application built with Next.js, Express, and Drizzle ORM. Features a premium dark-themed UI, secure authentication, and a comprehensive dashboard for managing tasks.

![Landing Page](./client/public/landing-hero.png) *Note: You'll need to add a screenshot here or use the one generated during testing.*

## 🚀 Features

- **Modern UI/UX**: Built with `shadcn/ui` and Tailwind CSS, featuring a sleek dark mode and smooth animations.
- **Authentication**: Secure email/password login and registration with JWT and `bcrypt` hashing.
- **Dashboard**: Real-time task statistics (Total, Completed, Active, Overdue).
- **Task Management**: Create, edit, delete, and toggle tasks.
- **Filtering & Search**: Filter by status (All, Active, Done, Overdue) and search by title/description.
- **Sorting**: Sort tasks by Date, Title, or Status.
- **Settings**: Update profile, change password, and delete account.
- **Responsive**: Fully responsive design working seamlessly on desktop and mobile.

## 🛠 Tech Stack

### Frontend (`/client`)
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theme**: `next-themes` (Dark/Light mode)
- **State**: React Context (Auth)

### Backend (`/server`)
- **Runtime**: Node.js
- **Framework**: [Express](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via Neon)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Auth**: `jsonwebtoken` (JWT), `bcryptjs`

## 📋 Prerequisites

- Node.js (v18+)
- pnpm (recommended) or npm
- PostgreSQL database (e.g., local or Neon)

## 📦 Installation

This project is a monorepo containing both `client` and `server`.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/iamdainwi/task-hive.git
    cd task-hive
    ```

2.  **Install dependencies for both client and server:**

    *Server:*
    ```bash
    cd server
    pnpm install
    ```

    *Client:*
    ```bash
    cd ../client
    pnpm install
    ```

## ⚙️ Environment Variables

### Server (`server/.env`)
Create a `.env` file in the `server` directory:

```env
PORT=3001
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"
JWT_SECRET="your-super-secret-key"
```

### Client (`client/.env.local`)
Create a `.env.local` file in the `client` directory (optional, defaults are set):

```env
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

## 🏃‍♂️ Running the App

You need to run both the backend and frontend servers.

1.  **Start the Backend:**
    ```bash
    cd server
    pnpm dev
    ```
    *Runs on `http://localhost:3001`*

2.  **Start the Frontend:**
    ```bash
    cd client
    pnpm dev
    ```
    *Runs on `http://localhost:3000`*

3.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
task-hive/
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/            # App Router pages & API routes
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth)
│   │   ├── lib/            # Utilities & Types
│   └── public/             # Static assets
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # Route logic
│   │   ├── middlewares/    # Auth middleware
│   │   ├── routes/         # API routes
│   │   ├── schema/         # Drizzle schema
│   └── drizzle/            # Migrations
```

## 🛡 API Endpoints

The Next.js client proxies requests to the Express backend.

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/user/me` - Get profile
- `PUT /api/user/me` - Update profile/password
- `DELETE /api/user/me` - Delete account
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task (status/content)
- `DELETE /api/tasks/:id` - Delete task

## 📄 License

MIT
