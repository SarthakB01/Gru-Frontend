# Deployment Guide

## Frontend (Vercel) Deployment

### Environment Variables Setup

1. In your Vercel dashboard, go to your project settings
2. Navigate to the "Environment Variables" section
3. Add the following environment variables:

```
NEXT_PUBLIC_API_URL=https://gru-backend.onrender.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Clerk Authentication Setup

1. **Get your Clerk keys** from your Clerk dashboard
2. **Configure OAuth providers** in Clerk dashboard:
   - Go to "User & Authentication" → "Social Connections"
   - Enable Google OAuth
   - Add your production URLs to the allowed redirect URLs

3. **Set up redirect URLs** in Clerk dashboard:
   - Go to "User & Authentication" → "Redirect URLs"
   - Add these URLs:
     ```
     https://gru-frontend.vercel.app/sign-up/[[...sign-up]]
     https://gru-frontend.vercel.app/log-in/[[...log-in]]
     https://gru-frontend.vercel.app/sign-up
     https://gru-frontend.vercel.app/log-in
     https://gru-frontend.vercel.app/
     ```

4. **Configure Google OAuth** in Google Cloud Console:
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Add your production domain to authorized redirect URIs:
     ```
     https://clerk.gru-frontend.vercel.app/v1/oauth_callback
     ```

### Local Development

For local development, create a `.env.local` file in the `Gru-Frontend` directory:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Local Development

For local development, create a `.env.local` file in the `Gru-Frontend` directory:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Backend (Render) Deployment

### Environment Variables Setup

In your Render dashboard, add the following environment variables:

```
HUGGING_FACE_API_KEY=your_hugging_face_api_key
GROQ_API_KEY=your_groq_api_key
```

### CORS Configuration

Make sure your backend allows requests from your Vercel frontend domain. Update your CORS configuration in the backend to include:

```javascript
app.use(cors({
  origin: ['https://your-vercel-frontend-url.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

## API Endpoints

The frontend now uses centralized API configuration through `src/lib/config.ts`. All API calls will automatically use the correct URL based on the `NEXT_PUBLIC_API_URL` environment variable.

### Available Endpoints

- `UPLOAD`: File upload endpoint
- `SUMMARIZE_DOCUMENT`: Document summarization
- `SUMMARIZE`: Text summarization
- `GENERATE_QUIZ`: Quiz generation
- `VERIFY_ANSWERS`: Quiz answer verification
- `CHAT`: AI chat functionality
- `TEXT_TO_SPEECH`: Text-to-speech conversion
- `MESSAGE`: Message endpoint
- `LEGACY_UPLOAD`: Legacy upload endpoint

## Testing

After deployment:

1. Test file upload functionality
2. Test text summarization
3. Test quiz generation
4. Test chat functionality
5. Verify all API calls are working with the deployed backend

## Troubleshooting

### API Issues
- If you see CORS errors, check that your backend CORS configuration includes your Vercel domain
- If API calls fail, verify the `NEXT_PUBLIC_API_URL` environment variable is set correctly
- Check Render logs for any backend errors
- Ensure all required API keys are set in your Render environment variables

### Authentication Issues
- **Google OAuth not working**: Check that your Google Cloud Console redirect URIs include the Clerk callback URL
- **Clerk redirect errors**: Verify all redirect URLs are correctly configured in Clerk dashboard
- **Environment variables**: Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set in Vercel
- **Domain mismatch**: Make sure your Clerk application domain matches your Vercel domain

### Common Clerk Errors
- `"Invalid redirect URL"`: Add the missing URL to Clerk's redirect URLs list
- `"OAuth provider not configured"`: Enable Google OAuth in Clerk dashboard
- `"Invalid client ID"`: Check that your Google OAuth client ID is correct in Clerk 