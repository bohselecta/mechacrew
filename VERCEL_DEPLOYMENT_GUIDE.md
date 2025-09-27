# 🚀 **MECHACREW VERCEL DEPLOYMENT GUIDE**

## **✅ STEP 1: PRE-DEPLOYMENT SETUP**

### **1.1 Environment Variables Required**

Before deploying to Vercel, you need to set up these environment variables:

#### **🔑 OpenAI API Key (Required for AI Features)**
- **Variable Name**: `OPENAI_API_KEY`
- **Value**: Your OpenAI API key (starts with `sk-`)
- **Get it from**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **Cost**: ~$0.01-0.10 per AI generation (very affordable)

#### **🗄️ Neon Database URL (Required for Sessions)**
- **Variable Name**: `NEON_DATABASE_URL`
- **Value**: Your Neon PostgreSQL connection string
- **Get it from**: [Neon Console](https://console.neon.tech/)
- **Free tier**: 500MB storage, perfect for MVP

#### **🔐 Clerk Authentication (Optional - Stubbed for Later)**
- **Variable Name**: `CLERK_PUBLISHABLE_KEY`
- **Variable Name**: `CLERK_SECRET_KEY`
- **Variable Name**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- **Note**: These are stubbed for later implementation

---

## **✅ STEP 2: VERCEL DEPLOYMENT**

### **2.1 Deploy via Vercel Dashboard (Recommended)**

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import from GitHub**: Select `bohselecta/mechacrew`
4. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### **2.2 Set Environment Variables in Vercel**

In the Vercel project settings:

1. **Go to Settings → Environment Variables**
2. **Add each variable**:
   ```
   OPENAI_API_KEY = sk-your-openai-key-here
   NEON_DATABASE_URL = postgresql://username:password@host/database
   CLERK_PUBLISHABLE_KEY = pk_test_your-clerk-key
   CLERK_SECRET_KEY = sk_test_your-clerk-secret
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_your-clerk-key
   ```

3. **Deploy**: Click "Deploy" button

### **2.3 Deploy via Vercel CLI (Alternative)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add OPENAI_API_KEY
vercel env add NEON_DATABASE_URL
vercel env add CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```

---

## **✅ STEP 3: DATABASE SETUP**

### **3.1 Create Neon Database**

1. **Go to [Neon Console](https://console.neon.tech/)**
2. **Create new project**: "MechaCrew"
3. **Copy connection string**: Use as `NEON_DATABASE_URL`

### **3.2 Run Database Schema**

1. **Go to Neon SQL Editor**
2. **Run the schema** from `database/schema.sql`:

```sql
-- Create mecha_sessions table
CREATE TABLE IF NOT EXISTS mecha_sessions (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create mecha_components table
CREATE TABLE IF NOT EXISTS mecha_components (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) REFERENCES mecha_sessions(session_id),
  component_id VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  position JSONB NOT NULL,
  rotation JSONB NOT NULL,
  scale JSONB NOT NULL,
  color VARCHAR(7) NOT NULL,
  material VARCHAR(50) NOT NULL,
  power INTEGER DEFAULT 0,
  durability INTEGER DEFAULT 0,
  weight INTEGER DEFAULT 0,
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mecha_sessions_session_id ON mecha_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_mecha_components_session_id ON mecha_components(session_id);
CREATE INDEX IF NOT EXISTS idx_mecha_components_component_id ON mecha_components(component_id);
```

---

## **✅ STEP 4: TESTING YOUR DEPLOYMENT**

### **4.1 Test AI Features**

1. **Open your deployed URL**
2. **Go to "AI ORCHESTRATOR" panel**
3. **Try these commands**:
   - `"Add laser cannon to right arm"`
   - `"Create rocket boosters for legs"`
   - `"Make the mecha more powerful"`

### **4.2 Test Collaboration Features**

1. **Open multiple browser tabs**
2. **Go to "COLLABORATE" panel**
3. **Verify real-time updates work**

### **4.3 Test Database Features**

1. **Create a new session**
2. **Add components via AI**
3. **Check Neon console for data**

---

## **✅ STEP 5: PRODUCTION OPTIMIZATION**

### **5.1 Performance Monitoring**

- **Vercel Analytics**: Enable in project settings
- **Core Web Vitals**: Monitor loading performance
- **API Response Times**: Check `/api/ai/generate` performance

### **5.2 Security Considerations**

- **Environment Variables**: Never commit API keys
- **Rate Limiting**: Consider adding to AI endpoints
- **CORS**: Configure if needed for custom domains

### **5.3 Scaling Considerations**

- **Database**: Neon scales automatically
- **AI API**: OpenAI has generous rate limits
- **Vercel**: Handles traffic spikes automatically

---

## **🎯 EXPECTED RESULTS**

### **✅ What You'll Get:**

1. **Live URL**: `https://your-project.vercel.app`
2. **AI-Powered Mecha Builder**: Natural language component generation
3. **Real-time Collaboration**: Multiplayer editing capabilities
4. **Professional UI**: Cyberpunk anime aesthetic
5. **Guest Mode**: No login required for demos
6. **Mobile Responsive**: Works on all devices

### **🚀 Demo Flow:**

1. **Share URL in Discord**
2. **Everyone joins simultaneously**
3. **"Add laser cannon to right arm"** → AI generates instantly
4. **Others see updates in real-time**
5. **Mecha attempts movement with new parts**

---

## **🔧 TROUBLESHOOTING**

### **Common Issues:**

1. **Build Fails**: Check environment variables are set
2. **AI Not Working**: Verify `OPENAI_API_KEY` is correct
3. **Database Errors**: Check `NEON_DATABASE_URL` format
4. **Styling Issues**: Ensure Tailwind CSS is building correctly

### **Support:**

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Neon Docs**: [neon.tech/docs](https://neon.tech/docs)
- **OpenAI Docs**: [platform.openai.com/docs](https://platform.openai.com/docs)

---

## **🎉 SUCCESS!**

**Your MechaCrew MVP is now live and ready to blow minds!**

**Total deployment time: 10-15 minutes from zero to live URL!**

**Your Discord team is about to lose their minds! 🚀**
