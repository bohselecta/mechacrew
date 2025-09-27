# MechaCrew - Collaborative AI Mecha Builder

![MechaCrew Logo](MC-Logo.png)

## 🚀 **REVOLUTIONARY COLLABORATIVE AI MECHA BUILDER**

MechaCrew is a cutting-edge web application that combines AI-powered component generation with real-time multiplayer collaboration to create the ultimate mecha building experience. Built with Next.js, Three.js, and OpenAI integration.

## ✨ **Key Features**

### 🤖 **AI Orchestrator**
- Natural language mecha component generation
- "Add rocket boosters to legs" → AI creates and places components
- Intelligent component positioning and scaling
- Real-time AI-powered modifications

### 👥 **Real-time Collaboration**
- Live multiplayer editing with user cursors
- Instant component synchronization
- Collaborative chat and action feed
- Guest mode - no login required for demo

### 🎮 **3D Mecha Builder**
- Interactive 3D environment with Three.js
- Physics-based component simulation
- Real-time mecha status monitoring
- Component DNA system for mixing parts

### 🎨 **Cyberpunk Anime Aesthetic**
- 1970s/80s Japanese mecha anime styling
- Chrome edges and neon accents
- Cel-shaded blocks of color
- Retro-futuristic UI design

## 🛠️ **Tech Stack**

- **Frontend**: Next.js 14, React 18, TypeScript
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Styling**: Tailwind CSS with custom anime theme
- **AI**: OpenAI GPT-4 integration
- **Database**: Neon PostgreSQL
- **Authentication**: Clerk (stubbed for later)
- **Deployment**: Vercel
- **Animation**: Framer Motion

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ 
- OpenAI API key
- Neon database account
- Vercel account (for deployment)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd mechacrew
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open http://localhost:3000**

## 🔧 **Environment Setup**

### Required Variables:
```bash
OPENAI_API_KEY=sk-your-openai-api-key
NEON_DATABASE_URL=postgresql://username:password@hostname/database
```

### Optional Variables:
```bash
CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-key
CLERK_SECRET_KEY=sk_test_your-clerk-secret
```

## 🗄️ **Database Setup**

1. Create a Neon project at https://neon.tech/
2. Run the schema from `database/schema.sql`
3. Add your connection string to environment variables

## 🚀 **Production Deployment**

### Option 1: Automated Script
```bash
./deploy.sh
```

### Option 2: Manual Vercel Deployment
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Post-Deployment:
1. Add environment variables in Vercel dashboard
2. Run database schema in Neon
3. Test your live deployment!

## 🎮 **Usage**

### Demo Flow:
1. **Join Session**: Share URL with team members
2. **AI Commands**: "Add laser cannon to right arm"
3. **Real-time Updates**: See changes instantly
4. **Collaboration**: Multiple users editing simultaneously
5. **Physics**: Mecha attempts to move with current parts

### AI Commands Examples:
- "Add rocket boosters to the legs"
- "Create a laser cannon for the right arm"
- "Add armor plating to the torso"
- "Install a targeting system in the head"
- "Add energy shields around the mecha"

## 🏗️ **Architecture**

```
src/
├── app/
│   ├── api/
│   │   ├── ai/generate/     # AI component generation
│   │   ├── sessions/        # Session management
│   │   └── collaboration/   # Real-time features
│   ├── globals.css          # Anime-themed styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main application
├── components/
│   ├── AIPanel.tsx          # AI orchestrator interface
│   ├── CollaborationPanel.tsx # Multiplayer features
│   ├── LogoAnimation.tsx    # Loading animation
│   └── AuthButton.tsx       # Authentication (stubbed)
└── lib/
    └── database.ts          # Database utilities
```

## 🎨 **Styling System**

### Color Palette:
- **Mecha Red**: `#E6322B` (energy, urgency)
- **Neon Blue**: `#08B0D5` (tech, circuitry)
- **Steel Gray**: `#2E2E2E` (frames, panels)
- **Gunmetal**: `#3F4A4F` (structural base)
- **Accent Yellow**: `#F9D648` (highlights)

### Typography:
- **Headlines**: Orbitron (wide, heavy sans-serif)
- **Body**: Inter (modern, readable)
- **UI Labels**: Uppercase bold with tracking

## 🔮 **Future Features**

- **Component Battles**: AI-mediated conflicts between parts
- **Mecha DNA**: Genetic mixing of component properties
- **Advanced Physics**: Realistic movement simulation
- **Export System**: 3D model export capabilities
- **Component Marketplace**: Share and trade components

## 🤝 **Contributing**

This is a demo project showcasing cutting-edge web technologies. Feel free to fork and experiment!

## 📄 **License**

MIT License - See LICENSE file for details

## 🎯 **Demo Ready**

This application is production-ready and designed to impress. Perfect for:
- **Tech demos** and presentations
- **Portfolio showcases** 
- **Team collaboration** tools
- **AI integration** examples

**Deploy now and watch jaws drop! 🚀**
