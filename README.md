# Little Heavy - 3D Pop-Up Cards E-commerce

A modern, full-stack e-commerce platform for selling 3D pop-up cards, inspired by Lovepop. Built with **Next.js 15**, **FastAPI**, **Supabase**, and **Stripe**.

![Little Heavy Homepage Placeholder](public/screenshot.png)
*(Add a screenshot of your homepage here named `screenshot.png` in the `public` folder)*

## 🚀 Features

- **Modern UI/UX**: Built with Shadcn UI, Tailwind CSS, and Framer Motion.
- **Full Authentication**: Secure Login/Register flow using JWT and BCrypt.
- **Shopping Cart**: Persistent cart functionality backed by a database.
- **Checkout**: Integrated Stripe payment gateway for secure transactions.
- **Backend API**: Production-ready FastAPI backend with SQLModel and Pydantic.
- **Database**: PostgreSQL (via Supabase) for robust data management.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI, Lucide React
- **State Management**: React Hooks

### Backend
- **Framework**: FastAPI
- **Database ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Authentication**: Python-Jose (JWT), Passlib (BCrypt)
- **Package Manager**: uv

### Infrastructure
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe

## 📦 Getting Started

### Prerequisites
- Node.js & npm
- Python 3.10+
- `uv` (Python package manager)

### 1. Clone the Repository
```bash
git clone https://github.com/Ivanxiedata/LittleHeavy.git
cd LittleHeavy
```

### 2. Backend Setup
```bash
cd backend

# Create .env file
cp .env.example .env
# Edit .env and add your Supabase & Stripe keys

# Install dependencies
uv sync

# Run the server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

Visit `http://localhost:3000` to see the app in action!

## 🔒 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://user:password@host:port/db
SECRET_KEY=your_secret_key
STRIPE_SECRET_KEY=sk_test_...
SUPABASE_API_KEY=your_supabase_key
```

## 📄 License

This project is open-source and available under the MIT License.
