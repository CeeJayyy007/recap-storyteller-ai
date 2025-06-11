# Recap Storyteller AI

A modern task management and note-taking application with AI-powered recap generation.

## Features

- 📝 Task Management with Calendar Integration
- 📓 Rich Text Note Taking
- 🔄 Task-Note Linking
- 🤖 AI-Powered Recap Generation
- 🌓 Dark/Light Mode
- 📱 Responsive Design
- 🔒 Secure Admin Access

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: Shadcn UI + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Authentication**: NextAuth.js
- **Database**: Prisma + PostgreSQL
- **AI Integration**: OpenAI API

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/recap-storyteller-ai.git
cd recap-storyteller-ai
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
```

## Environment Variables

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: NextAuth.js secret
- `OPENAI_API_KEY`: OpenAI API key

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/             # Utility functions
├── stores/          # Zustand stores
├── types/           # TypeScript types
└── styles/          # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
