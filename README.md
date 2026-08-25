# Pixel Crush — local setup

```
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

## Turning on real emails (free, no hosting needed)

By default, "Forgot Password" shows the reset link on screen (demo mode),
and new-order alerts only show up in the admin dashboard's notification
bell — since no email service is configured yet. To send real emails
instead, using EmailJS's free tier (200 emails/month):

1. Sign up free at https://www.emailjs.com (email only, no phone/card needed)
2. **Email Services** → Add New Service → connect your Gmail
   (pixelcrushgraphics@gmail.com) — this uses Google's own sign-in, EmailJS
   never sees your password
3. Create **two** templates under **Email Templates**:

   **Template 1 — Password reset.** Set "To email" to `{{to_email}}`, and
   use `{{name}}` and `{{reset_link}}` in the body, e.g.:
   ```
   Hi {{name}},
   Click here to reset your password: {{reset_link}}
   ```

   **Template 2 — New order alert.** Set "To email" to `{{to_email}}`, and
   use these variables in the body: `{{order_id}}`, `{{customer_name}}`,
   `{{customer_email}}`, `{{customer_phone}}`, `{{customer_whatsapp}}`,
   `{{product}}`, `{{quantity}}`, `{{total}}`. e.g.:
   ```
   New order: {{product}} × {{quantity}}
   Customer: {{customer_name}} ({{customer_email}})
   Phone: {{customer_phone}} · WhatsApp: {{customer_whatsapp}}
   Total: {{total}}
   Order ID: {{order_id}}
   ```

4. Copy your **Service ID** and **Public Key** (Account → General) — these
   are shared by both templates. Also copy each template's own **Template ID**.
5. Open `src/App.jsx`, find this block near the top of the file, and fill
   in all five values between the quotes:
   ```js
   const EMAILJS_SERVICE_ID = "";
   const EMAILJS_PUBLIC_KEY = "";
   const EMAILJS_TEMPLATE_ID = "";       // password-reset template
   const EMAILJS_ORDER_TEMPLATE_ID = ""; // new-order alert template
   const ADMIN_NOTIFY_EMAIL = "pixelcrushgraphics@gmail.com";
   ```
6. Save, then `npm run dev` again. Test Forgot Password, and place a test
   order to confirm both emails arrive.


## Deploy for free with GitHub Pages

This site is 100% static files (no server needed), so GitHub Pages hosts
it for free — including your custom domain and HTTPS.

### 1. Create a GitHub account and install GitHub Desktop
- Sign up free at https://github.com (just an email)
- Install GitHub Desktop from https://desktop.github.com — this gives you
  a visual app so you never need to type git commands

### 2. Publish this folder as a repository
- Open GitHub Desktop → File → Add Local Repository → choose this
  `pixelcrush-app` folder
- If it says the folder isn't a repository yet, click "create a repository"
- Click **Publish repository** (top right) — make sure "Keep this code
  private" is UNCHECKED, since free GitHub Pages requires a public repo
- Click Publish

### 3. Turn on GitHub Pages
- On github.com, open your new repository → **Settings** → **Pages**
  (left sidebar)
- Under "Build and deployment" → **Source**, choose **GitHub Actions**
  (not "Deploy from a branch")
- That's it — this repo already includes a workflow file
  (`.github/workflows/deploy.yml`) that builds and deploys automatically
  every time you push changes from GitHub Desktop

### 4. Connect your domain
- Still in Settings → Pages, scroll to **Custom domain**, type
  `pixelcrush.online` (or whatever domain you bought), and save
- This repo already includes a `public/CNAME` file with that domain so
  the setting doesn't get reset — if you end up with a different domain,
  edit that file to match before publishing
- At wherever you bought the domain, go to DNS settings and add the
  records GitHub shows you (usually 4 "A" records pointing to GitHub's
  servers, or a CNAME record if using a `www` subdomain — GitHub's Pages
  settings page shows the exact values to use)
- DNS changes can take anywhere from a few minutes to a few hours

### 5. Every future update
Just make your changes locally, then in GitHub Desktop: type a short
summary → **Commit to main** → **Push origin**. The site rebuilds and
redeploys automatically within a minute or two — no manual build/upload
ever again.

## Notes
- Product/order/review/account data lives in the browser's localStorage —
  it is NOT a shared database. Two different visitors won't see each
  other's data yet. That needs a real backend/database eventually.
- Admin login: default is `admin@pixelcrush.lk` / `PixelCrush2026!` — change
  this from the **Admin Account** tab in the dashboard after your first login.
