# MechaCrew Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# OpenAI API Key (Required for AI Orchestrator)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Neon Database Connection (Required for data persistence)
NEON_DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require

# Clerk Authentication (Optional - stubbed for later)
CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key
CLERK_SECRET_KEY=sk_test_your-clerk-secret-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key

# Optional: Custom configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Vercel Deployment Environment Variables

When deploying to Vercel, add these environment variables in your Vercel dashboard:

### Required Variables:
- `OPENAI_API_KEY` - Your OpenAI API key for AI functionality
- `NEON_DATABASE_URL` - Your Neon database connection string

### Optional Variables:
- `CLERK_PUBLISHABLE_KEY` - Clerk authentication (for future use)
- `CLERK_SECRET_KEY` - Clerk authentication secret (for future use)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key (for future use)

## Setup Instructions

### 1. OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key and add it to your environment variables

### 2. Neon Database
1. Go to https://neon.tech/
2. Create a new project
3. Copy the connection string from the dashboard
4. Run the database schema: `database/schema.sql`

### 3. Clerk Authentication (Optional)
1. Go to https://clerk.com/
2. Create a new application
3. Copy the publishable and secret keys
4. Add them to your environment variables

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Production Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Database Setup

Run the following SQL commands in your Neon database:

```sql
-- Run the contents of database/schema.sql
-- This will create all necessary tables and indexes
```

## Troubleshooting

### Common Issues:

1. **OpenAI API Key Error**: Make sure your API key is valid and has sufficient credits
2. **Database Connection Error**: Verify your Neon connection string is correct
3. **Build Errors**: Check that all environment variables are set correctly

### Support:

- Check the console for detailed error messages
- Verify all environment variables are set
- Ensure database schema is properly initialized
