EBRABO TRA RECEIPT SYSTEM  
PRODUCTION SERVER + DOMAIN + SSL DEPLOYMENT GUIDE
================================================

This guide explains how to deploy the EBRABO Receipt System on a real
internet server so QR codes can be scanned by any phone and the TRA
verification portal works publicly.


------------------------------------------------
1. WHAT YOU NEED
------------------------------------------------

You must have:

• A VPS server (Ubuntu 20.04 or 22.04)
• A domain name (example: ebrabo.co.tz)
• Root or sudo access
• Node.js installed
• PostgreSQL installed


------------------------------------------------
2. POINT DOMAIN TO SERVER
------------------------------------------------

Log in to your domain registrar.

Create two DNS records:

Type: A  
Name: @  
Value: YOUR_SERVER_IP  

Type: A  
Name: www  
Value: YOUR_SERVER_IP  

Example:
@      →  159.89.123.45  
www    →  159.89.123.45  

Wait 5–30 minutes for DNS to update.


------------------------------------------------
3. INSTALL REQUIRED SOFTWARE
------------------------------------------------

SSH into your VPS:

ssh root@YOUR_SERVER_IP

Install packages:

sudo apt update
sudo apt install nodejs npm nginx postgresql git -y


------------------------------------------------
4. CLONE YOUR PROJECT
------------------------------------------------

cd /var/www
git clone https://github.com/YOURNAME/ebrabo-receipt-system.git
cd ebrabo-receipt-system/backend


------------------------------------------------
5. SET UP DATABASE
------------------------------------------------

Log into PostgreSQL:

sudo -u postgres psql

Create database:

CREATE DATABASE ebrabo;

Create user:

CREATE USER ebrabo_user WITH PASSWORD 'StrongPassword123';

Give access:

GRANT ALL PRIVILEGES ON DATABASE ebrabo TO ebrabo_user;

Exit:

\q


------------------------------------------------
6. CONFIGURE BACKEND
------------------------------------------------

Edit backend .env file:

nano .env

Add:

DB_HOST=localhost
DB_USER=ebrabo_user
DB_PASSWORD=StrongPassword123
DB_NAME=ebrabo
PORT=5000


------------------------------------------------
7. RUN BACKEND
------------------------------------------------

cd backend
npm install
node src/app.js

Test:
Open browser:

http://YOUR_SERVER_IP:5000/api/receipts

If it loads JSON, backend works.


------------------------------------------------
8. SET UP FRONTEND
------------------------------------------------

cd ../frontend
npm install
npm run build

This creates a "dist" folder.


------------------------------------------------
9. CONFIGURE NGINX
------------------------------------------------

Create config:

sudo nano /etc/nginx/sites-available/ebrabo

Paste:

server {
    listen 80;
    server_name ebrabo.co.tz www.ebrabo.co.tz;

    location / {
        root /var/www/ebrabo-receipt-system/frontend/dist;
        index index.html;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
    }

    location /verify {
        proxy_pass http://localhost:5000;
    }
}


Enable it:

sudo ln -s /etc/nginx/sites-available/ebrabo /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx


------------------------------------------------
10. INSTALL SSL (HTTPS)
------------------------------------------------

Install certbot:

sudo apt install certbot python3-certbot-nginx -y

Run:

sudo certbot --nginx -d ebrabo.co.tz -d www.ebrabo.co.tz

Choose:
Redirect HTTP → HTTPS


------------------------------------------------
11. UPDATE QR CODE URL
------------------------------------------------

In Receipts.jsx, change:

http://localhost:5000/verify/

to

https://ebrabo.co.tz/verify/


------------------------------------------------
12. FINAL RESULT
------------------------------------------------

Your system will now be available at:

https://ebrabo.co.tz

Your QR codes will open:

https://ebrabo.co.tz/verify/RECEIPT_CODE

from any phone, anywhere in the world.


------------------------------------------------
13. WHY THIS FIXES YOUR HTTPS ERROR
------------------------------------------------

Safari blocks HTTP QR codes.

Because now everything runs under HTTPS
using a real SSL certificate,
QR scanning will work properly.


------------------------------------------------
14. DONE
------------------------------------------------

Your EBRABO TRA Receipt System is now
running like a real government portal.

QR verified.
Encrypted.
Public.
Professional.
