# Deploying i2u.ai to Namecheap (Vite + Express)

This guide will help you deploy your i2u.ai app to Namecheap shared hosting using cPanel.

---

## Before You Start

Make sure you have:
- [ ] Namecheap cPanel login credentials
- [ ] PostgreSQL database created on Namecheap (host, username, password, database name)
- [ ] Your domain pointed to Namecheap
- [ ] API keys ready (Cashfree, PayPal if using payments)

**Estimated time: 20-30 minutes**

---

## Step 1: Download the Archive File

1. In Replit, find the file `i2u-vite-express-deploy.tar.gz`
2. Right-click on it and select **Download**
3. Save it to your computer (it's about 827 KB)

---

## Step 2: Open cPanel File Manager

1. Login to your **Namecheap cPanel** (usually at yourdomain.com/cpanel)
2. Find and click **File Manager**
3. Navigate to `/home/yourusername/nodejs/` folder
4. If the `nodejs` folder doesn't exist, create it:
   - Click **+ Folder** button
   - Name it: `nodejs`
   - Click inside the new folder
5. Create another folder called `i2u` inside nodejs
6. You should now be at: `/home/yourusername/nodejs/i2u/`

---

## Step 3: Upload and Extract the Archive

1. Click the **Upload** button at the top
2. Select `i2u-vite-express-deploy.tar.gz` from your computer
3. Wait for upload to complete (you'll see a progress bar)
4. Go back to File Manager
5. **Right-click** on `i2u-vite-express-deploy.tar.gz`
6. Select **Extract**
7. Click **Extract Files** in the popup
8. Done! All your app files are now extracted

---

## Step 4: Create Your .env File

1. In File Manager, make sure you're in `/home/yourusername/nodejs/i2u/`
2. Click **+ File** button at the top
3. Name it: `.env`
4. Click **Create New File**
5. Right-click on `.env` and select **Edit**
6. Paste the following (replace with YOUR values):

```
DATABASE_URL=postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_DB_HOST:5432/YOUR_DB_NAME
NODE_ENV=production
PORT=3000

# Payment Keys (optional - only if using payments)
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

7. Click **Save Changes**
8. Click **Close**

---

## Step 5: Install Dependencies

1. In cPanel, find and click **Terminal**
2. Type these commands one by one:

```bash
cd /home/yourusername/nodejs/i2u/
```
(Press Enter)

```bash
npm install --production
```
(Press Enter and wait 2-3 minutes)

You should see packages being installed. When it finishes, you'll see your username again.

---

## Step 6: Set Up Database Tables

1. Still in Terminal, type:

```bash
npm run db:push
```
(Press Enter and wait 1 minute)

This creates all the database tables your app needs.

---

## Step 7: Start Your App in cPanel

1. Go back to cPanel home
2. Find and click **Setup Node.js App**
3. Click **Create Application**
4. Fill in:
   - **Node.js version**: Select latest available (18.x or 20.x)
   - **Application mode**: Production
   - **Application root**: `/home/yourusername/nodejs/i2u`
   - **Application URL**: Select your domain
   - **Startup file**: `dist/index.cjs`
5. Click **Create**
6. On the next page, click **Run NPM Install** (if prompted)
7. Click **Start Application** (green button)

---

## Step 8: Test Your Site

1. Open your browser
2. Go to your domain (e.g., https://yourdomain.com)
3. You should see your i2u.ai app running!

---

## How It Works

Your app has two parts that work together:

| Part | Folder | What It Does |
|------|--------|--------------|
| Frontend | `dist/public/` | Your React website (HTML, CSS, JavaScript) |
| Backend | `dist/index.cjs` | Your Express server (APIs, database) |

When someone visits your site:
1. Express serves the frontend files from `dist/public/`
2. When the frontend needs data, it calls your APIs
3. Express handles the API calls and talks to the database
4. Data comes back to the frontend

---

## Troubleshooting

### App won't start?
- Check that `.env` file has correct database URL
- Make sure you ran `npm install`
- Check cPanel error logs

### Database errors?
- Verify your PostgreSQL credentials are correct
- Make sure the database exists on Namecheap
- Try running `npm run db:push` again

### Blank page?
- Check browser console for errors (F12 key)
- Make sure `dist/public/index.html` exists

### Need help?
- Check cPanel → Error Logs
- Contact Namecheap support for hosting issues

---

## Quick Reference

| Item | Value |
|------|-------|
| App folder | `/home/yourusername/nodejs/i2u/` |
| Startup file | `dist/index.cjs` |
| Frontend files | `dist/public/` |
| Config file | `.env` |
| Node.js command | `npm start` |

Good luck with your deployment!
