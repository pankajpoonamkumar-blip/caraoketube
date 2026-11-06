# CaraokeTube v2: setup (Day 1), no coding needed

Do these in order. Steps 1-3 get the site live; 4-5 add login; 6-7 are slow approvals, so start them today.

## 1. Put the files on GitHub
1. Make a new, empty GitHub repository called `caraoketube`.
2. Upload everything in this folder (drag and drop in the browser works): `index.html`, `functions/`, icons, etc.

## 2. Get a YouTube API key (free)
1. Go to console.cloud.google.com, create a project, then APIs & Services > Library > enable **YouTube Data API v3**.
2. Credentials > Create credentials > API key. Under "API restrictions", pick **YouTube Data API v3**. Copy the key.

## 3. Host it free on Cloudflare Pages (commercial use allowed)
1. Sign up at cloudflare.com > Workers & Pages > Create > Pages > Connect to Git > pick `caraoketube`.
2. Framework preset: **None**. Build command: leave empty. Output directory: `/`. Deploy.
3. Settings > Variables and Secrets > add secret `YOUTUBE_API_KEY` = your key. Redeploy.
4. Visit `your-project.pages.dev`, search a song. Results should appear.
5. Domain: buy caraoketube.com (Cloudflare Registrar sells at cost), then Pages > Custom domains > add it.
6. Once it works, delete the old Vercel project. Vercel's free plan is not allowed for commercial use.

## 4. Supabase (login + saved songs)
1. supabase.com > New project (pick the region closest to your users).
2. SQL Editor > New query > paste `supabase.sql` > Run.
3. Project Settings > API: copy **Project URL** and the **anon public** key.
4. Open `index.html` on GitHub, edit the `CFG` line near the top of the script, paste both values, commit. The anon key is designed to be public; the security rules in the SQL protect the data.

## 5. Google sign-in
1. Google Cloud Console > APIs & Services > OAuth consent screen: app name CaraokeTube, your email. Later set it to "In production" (needs a privacy policy link; I'll write it on Day 5).
2. Credentials > Create credentials > OAuth client ID > Web application. Under "Authorized redirect URIs" paste the callback URL shown in Supabase > Authentication > Providers > Google. Copy the Client ID and Secret.
3. In Supabase > Providers > Google: enable, paste Client ID and Secret.
4. Supabase > Authentication > URL Configuration: Site URL `https://caraoketube.com`; add `https://caraoketube.com` and your `.pages.dev` address to Redirect URLs.

## 6. Start Razorpay verification today
Razorpay dashboard > complete KYC (PAN, bank account, business details). Approval can take days, and we need it for VIP on Day 5. Stripe is invite-only in India, so skip it.

## 7. Apply for AdSense after the site is live on your domain
It needs a working public site and a privacy policy (Day 5). Approval can take days or weeks. Ads will go only on Library and search screens, never beside the video.

## Test on real devices
Open the live site on an Android phone and an iPhone (use HTTPS only; the mic needs it). Tap the mic, allow access, use headphones first, then Record, then check the Library.

