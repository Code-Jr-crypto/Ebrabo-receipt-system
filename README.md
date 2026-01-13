==================== START README ====================

EBRABO ELECTRONIC RECEIPT SYSTEM
TRA-STYLE VAT RECEIPT & QR VERIFICATION PLATFORM

=====================================================

1. WHAT THIS SYSTEM IS

This system is a full electronic receipt and verification platform designed to behave like the Tanzania Revenue Authority (TRA) Electronic Fiscal Device (EFD).

It allows:
• Creating customers  
• Creating receipts  
• Automatic VAT (18%) calculation  
• QR Code generation  
• Receipt verification via web  
• Printing legal TRA-style receipts  
• Storing everything in PostgreSQL  

Each receipt has a unique receipt number and verification QR code.

-----------------------------------------------------

2. SYSTEM ARCHITECTURE

Frontend (React + Vite)
       ↓
Backend (Node.js + Express)
       ↓
Database (PostgreSQL)
       ↓
Verification Portal (/verify)

QR Codes point to:
http://YOUR_SERVER_IP:5000/verify/RECEIPT_CODE

-----------------------------------------------------

3. SOFTWARE REQUIREMENTS

You must install:

Node.js 18 or later  
PostgreSQL  
Git  
Web Browser  

Check versions:
node -v
npm -v
psql --version

-----------------------------------------------------

4. PROJECT STRUCTURE

ebrabo-receipt-system/
│
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── db.js
│   │   └── routes/
│   │       ├── auth.js
│   │       └── receipts.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── utils/

-----------------------------------------------------

5. POSTGRESQL DATABASE SETUP

Open PostgreSQL:
sudo -u postgres psql

Create database:
CREATE DATABASE ebrabo;

Create user:
CREATE USER ebrabo_user WITH PASSWORD 'StrongPassword123';

Give permissions:
GRANT ALL PRIVILEGES ON DATABASE ebrabo TO ebrabo_user;

Exit:
\q

-----------------------------------------------------

6. BACKEND SETUP

Go to backend:
cd backend

Install packages:
npm install

Create a file named .env inside backend:

DB_HOST=localhost
DB_USER=ebrabo_user
DB_PASSWORD=StrongPassword123
DB_NAME=ebrabo
DB_PORT=5432
JWT_SECRET=ebrabo_secret
BASE_URL=http://localhost:5000

-----------------------------------------------------

7. RUN BACKEND

Start backend:
node src/app.js

You should see:
Server running on http://localhost:5000

Test:
Open browser and go to:
http://localhost:5000

-----------------------------------------------------

8. FRONTEND SETUP

Open another terminal:
cd frontend

Install packages:
npm install

Start frontend:
npm run dev

Vite will show:
Local: http://localhost:5173

Open in browser:
http://localhost:5173

-----------------------------------------------------

9. LOGIN

Default login (from your backend):
Username: admin
Password: StrongPassword123

After login you will reach the Dashboard.

-----------------------------------------------------

10. RECEIPT FLOW

1. Add customer details  
2. Add items  
3. Click “Create Receipt”  
4. Receipt is stored in database  
5. QR Code is generated  
6. Receipt appears in Receipts table  
7. Click “Open” to view receipt  
8. Click “Print” to generate printable receipt  

-----------------------------------------------------

11. QR VERIFICATION

Each receipt QR contains:
http://localhost:5000/verify/RECEIPT_CODE

When scanned:
• Customer details are shown  
• VAT and totals are displayed  
• Receipt is verified  

This simulates a real TRA online receipt check.

-----------------------------------------------------

12. RUNNING ON A REAL SERVER (LATER)

When you buy a server + domain:

1. Install Ubuntu on server
2. Install Node.js, PostgreSQL, Git, Nginx
3. Clone project
4. Create PostgreSQL database same as above
5. Set BASE_URL=https://yourdomain.com
6. Run backend using PM2
7. Configure Nginx reverse proxy
8. Install SSL (Let’s Encrypt)
9. QR Codes will point to your real domain

Then QR scans will work on any phone anywhere.

-----------------------------------------------------

13. SECURITY

• JWT authentication  
• Database isolation  
• QR verification is read-only  
• SSL encryption (when deployed)

-----------------------------------------------------

14. LEGAL NOTE

This software is a technical implementation of receipt handling and QR verification.
For official TRA compliance, certification from TRA is required.

-----------------------------------------------------

END OF README

===================== END README =====================
