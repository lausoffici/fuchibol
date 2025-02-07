# Fuchibol

A web application for managing amateur soccer matches, designed to help groups of friends keep detailed records of their games and statistics.

## 🚀 Main Features

- **Group Management**

  - Create and manage multiple player groups
  - Assign skill levels to each player (1-10)
  - Manage player rosters within each group

- **Match Recording**

  - Log match results
  - Assign players to teams A and B
  - Mark winning team and goal difference
  - Designate match MVP
  - Edit or delete recorded matches

- **Detailed Statistics**
  - Player rankings by matches played
  - Win/Loss tracking
  - MVP count per player
  - Average skill level per team

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** with App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **Lucide** for icons
- **Embla Carousel** for carousels

### Backend

- **Next.js API Routes** with Server Actions
- **Prisma** as ORM
- **PostgreSQL** as database
- **NextAuth.js** for Google authentication

### Development Tools

- **ESLint** for linting
- **Prettier** for code formatting
- **TypeScript** for static typing

## 📦 Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── actions/         # Server Actions
│   ├── api/            # API Routes
│   └── [routes]/       # Application pages
├── components/          # React components
│   ├── ui/             # Base components (shadcn/ui)
│   ├── groups/         # Group-related components
│   ├── matches/        # Match-related components
│   └── players/        # Player-related components
├── lib/                # Utilities and configurations
├── types/              # TypeScript types
└── hooks/              # Custom React hooks
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Cloud account for authentication

### Local Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fuchibol.git
cd fuchibol
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Run database migrations:

```bash
npm run prisma:migrate
```

5. Start the development server:

```bash
npm run dev
```

## 📝 Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/fuchibol
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🤝 Contributing

Contributions are welcome. Please open an issue first to discuss what you would like to change.
