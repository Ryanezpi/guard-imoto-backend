# Guard Imoto Backend

## Project Setup

### Prerequisites

- Node.js (v24 or higher)
- npm
- SQL

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file (see `.env.example`)
4. Run development server: `npm run dev`

## Folder Structure

```text
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middlewares/    # Express middlewares
├── models/        # Database models
├── routes/        # API routes
├── services/      # Business logic
├── utils/         # Helper functions
└── app.js         # Application entry point
```

## Naming Conventions

- Files: `kebab-case.js`
- Classes: `PascalCase`
- Functions/Variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Database Collections: `PascalCase`

## License

MIT
