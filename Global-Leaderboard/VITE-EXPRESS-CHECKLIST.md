# Pre-Deployment Checklist for i2u.ai

Use this checklist before you start deploying to Namecheap.

---

## Required Information

### Namecheap Account
- [ ] cPanel login URL (usually yourdomain.com/cpanel)
- [ ] cPanel username
- [ ] cPanel password

### PostgreSQL Database (create this in cPanel first)
- [ ] Database host (e.g., localhost or IP address)
- [ ] Database name
- [ ] Database username
- [ ] Database password
- [ ] Database port (usually 5432)

### Your Domain
- [ ] Domain name pointed to Namecheap nameservers
- [ ] SSL certificate (usually free with Namecheap hosting)

---

## Optional API Keys (only if using payments)

### Cashfree (for INR payments)
- [ ] Cashfree App ID
- [ ] Cashfree Secret Key

### PayPal (for USD payments)
- [ ] PayPal Client ID
- [ ] PayPal Client Secret

---

## Files You Need

- [ ] `i2u-vite-express-deploy.tar.gz` (download from Replit - 827 KB)

---

## Time Estimate

| Step | Time |
|------|------|
| Download ZIP | 1 minute |
| Upload to cPanel | 2-3 minutes |
| Extract files | 1 minute |
| Create .env file | 5 minutes |
| Install npm packages | 3-5 minutes |
| Setup database | 2 minutes |
| Configure Node.js app | 5 minutes |
| Testing | 5 minutes |
| **Total** | **20-30 minutes** |

---

## Difficulty Level

**Very Easy** - Just uploading files and clicking buttons in cPanel

No coding required. If you can:
- Upload a file
- Copy and paste text
- Follow step-by-step instructions

...you can do this!

---

## After Deployment

Your app will be live at your domain with:
- User registration and login
- Global leaderboard
- Blog with 28 articles
- Payment integration (Cashfree + PayPal)
- Admin dashboard

---

## Need the Archive File?

The deployment archive is created in your Replit project.
Look for: `i2u-vite-express-deploy.tar.gz`

It contains:
- `dist/` - Your compiled app (frontend + backend)
- `shared/` - Database schema
- `package.json` - Dependencies
- `.env.production.example` - Environment template
- Documentation files
