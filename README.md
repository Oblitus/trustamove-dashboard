# TrustAMove Dashboard

A modern React-based dashboard for managing your TrustAMove KYC service. Built with React, TypeScript, Tailwind CSS, and Supabase authentication.

## Features

- 🔐 **Supabase Authentication** - Secure login and signup
- 🔑 **API Key Management** - Create, view, and revoke API keys
- 💳 **Billing Dashboard** - Monitor usage and costs
- ✅ **KYC Verifications** - Track verification statuses
- 📊 **Overview Dashboard** - Quick stats and actions
- 🎨 **Modern UI** - Built with Tailwind CSS
- 📱 **Responsive Design** - Works on all devices

## Prerequisites

- Node.js 18+ 
- npm or yarn
- A Supabase project ([create one here](https://supabase.com))
- TrustAMove KYC API running (deployed to Fly.io)

## Setup

### 1. Clone and Install

```bash
cd trustamove-dashboard
npm install
```

### 2. Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Create a new project (or use existing)
3. Go to Settings → API
4. Copy your Project URL and anon public key

### 3. Create Environment File

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_BASE_URL=https://trustamove-kyc.fly.dev
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

### First Time Setup

1. **Sign Up**: Create a new account at `/signup`
2. **Login**: Sign in at `/login`
3. **Create API Key**: Navigate to API Keys and create your first key
4. **View Billing**: Check your usage in the Billing section

### Managing API Keys

- **Create**: Click "Create API Key" and give it a descriptive name
- **Test vs Live**: Choose "Test key" for development (prefix: `tm_test_`)
- **Copy Secret**: The full API key is shown only once - copy it immediately!
- **Revoke**: Revoke compromised keys instantly

### Monitoring Billing

- View total verifications and costs
- Filter by date range (week, month, all time)
- Select specific API keys to view their usage
- See detailed verification history

## Project Structure

```
src/
├── components/
│   ├── DashboardLayout.tsx   # Main layout with sidebar
│   └── ProtectedRoute.tsx    # Auth guard component
├── hooks/
│   └── useAuth.ts            # Authentication hook
├── lib/
│   ├── api.ts                # API client for backend
│   └── supabase.ts           # Supabase client config
├── pages/
│   ├── LoginPage.tsx         # Login page
│   ├── SignUpPage.tsx        # Sign up page
│   ├── OverviewPage.tsx      # Dashboard overview
│   ├── ApiKeysPage.tsx       # API key management
│   ├── BillingPage.tsx       # Billing & usage
│   └── VerificationsPage.tsx # KYC verifications
├── App.tsx                   # Main app with routing
└── index.css                 # Tailwind styles
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` |
| `VITE_API_BASE_URL` | TrustAMove API endpoint | `https://trustamove-kyc.fly.dev` |

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## API Integration

The dashboard connects to your TrustAMove KYC API for:

- Creating and managing API keys
- Fetching billing usage
- Viewing verification statuses

Make sure your API is running and accessible at the URL specified in `VITE_API_BASE_URL`.

## Supabase Setup Details

### Enable Email Authentication

1. Go to Authentication → Providers in Supabase
2. Enable Email provider
3. Configure email templates (optional)

### JWT Configuration (Optional)

If you want the backend to verify Supabase JWTs:

1. Get your JWT Secret from Supabase Settings → API
2. Add to your backend's environment variables
3. Update `application.properties` with Supabase JWKS URL

## Development Tips

### Hot Module Replacement

Vite provides instant HMR - changes appear immediately during development.

### Debugging

- Check browser console for errors
- Use React DevTools for component inspection
- Monitor network tab for API calls

### Common Issues

**"Missing Supabase environment variables"**
- Make sure `.env.local` exists with correct values
- Restart dev server after changing env vars

**"Failed to load API keys"**
- Verify API_BASE_URL is correct
- Check if backend is running
- Ensure CORS is enabled on backend

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Supabase** - Authentication
- **React Router** - Routing
- **Lucide React** - Icons
- **date-fns** - Date formatting

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

Proprietary - TrustAMove

## Support

For questions or issues:
- Email: support@trustamove.com
- API Docs: https://trustamove-kyc.fly.dev/q/swagger-ui
