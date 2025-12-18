# i2u.ai Global Leaderboard - Deployment Guide for Namecheap

This guide provides step-by-step instructions for deploying the i2u.ai Global Leaderboard application to a server with a Namecheap domain.

## Prerequisites

- A Namecheap domain (e.g., `i2u.ai`)
- A VPS or cloud server (DigitalOcean, AWS EC2, Linode, Vultr, etc.)
- Node.js 20+ installed on your server
- PostgreSQL database (can be on the same server or a managed service)
- Basic command line knowledge

## Option 1: VPS Deployment (Recommended)

Namecheap's shared hosting doesn't support Node.js applications. You'll need a VPS.

### Step 1: Prepare Your Server

Connect to your VPS via SSH:

```bash
ssh root@your-server-ip
```

Install required software:

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install PM2 for process management
npm install -g pm2

# Install Nginx for reverse proxy
apt install -y nginx
```

### Step 2: Set Up PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE i2u_leaderboard;
CREATE USER i2u_user WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE i2u_leaderboard TO i2u_user;
\q
```

### Step 3: Deploy the Application

```bash
# Create application directory
mkdir -p /var/www/i2u-leaderboard
cd /var/www/i2u-leaderboard

# Clone or upload your code
# Option A: Git clone
git clone your-repo-url .

# Option B: Upload via SCP from your local machine
# scp -r ./dist ./package.json root@your-server-ip:/var/www/i2u-leaderboard/
```

### Step 4: Build the Application

On your local machine (or on the server if you have the source):

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `dist/` folder with:
- `dist/index.cjs` - The compiled server
- `dist/public/` - Static frontend assets

### Step 5: Configure Environment Variables

Create a `.env` file on your server:

```bash
nano /var/www/i2u-leaderboard/.env
```

Add:

```env
DATABASE_URL=postgresql://i2u_user:your-secure-password@localhost:5432/i2u_leaderboard
NODE_ENV=production
PORT=3000
```

### Step 6: Push Database Schema

```bash
cd /var/www/i2u-leaderboard
npm run db:push
```

### Step 7: Start with PM2

```bash
cd /var/www/i2u-leaderboard

# Start the application
pm2 start dist/index.cjs --name i2u-leaderboard

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup
```

### Step 8: Configure Nginx

Create Nginx configuration:

```bash
nano /etc/nginx/sites-available/i2u-leaderboard
```

Add:

```nginx
server {
    listen 80;
    server_name i2u.ai www.i2u.ai;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/i2u-leaderboard /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 9: Configure SSL with Let's Encrypt

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d i2u.ai -d www.i2u.ai
```

### Step 10: Configure Namecheap DNS

1. Log in to Namecheap dashboard
2. Go to Domain List → Manage → Advanced DNS
3. Add/Update these records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | your-server-ip | Automatic |
| A | www | your-server-ip | Automatic |

Wait 10-30 minutes for DNS propagation.

## Option 2: Railway/Render with Namecheap Domain

If you prefer managed hosting:

### Railway Deployment

1. Push your code to GitHub
2. Create a Railway account at [railway.app](https://railway.app)
3. Create new project → Deploy from GitHub
4. Add PostgreSQL database from Railway's add-ons
5. Set environment variables:
   - `DATABASE_URL` (auto-set by Railway)
   - `NODE_ENV=production`

6. Railway will provide a URL like `your-app.up.railway.app`

### Point Namecheap to Railway

1. In Railway: Settings → Domains → Add custom domain
2. Enter `i2u.ai` and `www.i2u.ai`
3. Railway will provide DNS records

**Important**: Namecheap does not support CNAME records for apex domains (@). You have two options:

**Option A: Use www subdomain as primary (Recommended)**
| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | www | your-app.up.railway.app | Automatic |
| URL Redirect | @ | https://www.i2u.ai | Automatic |

**Option B: Use Cloudflare (for apex CNAME flattening)**
1. Transfer DNS management to Cloudflare (free tier available)
2. Cloudflare supports CNAME flattening for apex domains
3. Add CNAME record for @ pointing to your-app.up.railway.app

## Production Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Set `NODE_ENV=production`
- [ ] Enable SSL/HTTPS
- [ ] Configure firewall (allow only ports 22, 80, 443)
- [ ] Set up database backups
- [ ] Configure log rotation
- [ ] Test all features in production

## Useful Commands

```bash
# View application logs
pm2 logs i2u-leaderboard

# Restart application
pm2 restart i2u-leaderboard

# Check application status
pm2 status

# Update application
cd /var/www/i2u-leaderboard
git pull
npm install
npm run build
pm2 restart i2u-leaderboard
```

## Troubleshooting

### Application not starting
```bash
# Check PM2 logs
pm2 logs i2u-leaderboard --lines 50

# Check if port is in use
lsof -i :3000
```

### Database connection issues
```bash
# Test PostgreSQL connection
psql -h localhost -U i2u_user -d i2u_leaderboard

# Check PostgreSQL is running
systemctl status postgresql
```

### Nginx 502 Bad Gateway
```bash
# Check if Node app is running
pm2 status

# Check Nginx error logs
tail -f /var/log/nginx/error.log
```

### DNS not resolving
- Wait up to 48 hours for full propagation
- Check DNS with: `nslookup i2u.ai`
- Verify records in Namecheap dashboard

## Security Recommendations

1. **Firewall**: Configure UFW
   ```bash
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw enable
   ```

2. **Fail2ban**: Protect against brute force
   ```bash
   apt install fail2ban
   ```

3. **Regular Updates**:
   ```bash
   apt update && apt upgrade -y
   ```

4. **Database Security**: Only allow local connections in `pg_hba.conf`

## Support

For issues specific to:
- **Namecheap DNS**: Contact Namecheap support
- **VPS/Server**: Contact your hosting provider
- **Application**: Check the application logs with `pm2 logs`
