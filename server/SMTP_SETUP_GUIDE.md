# 📧 SMTP Email Configuration Guide - BRX.MA

This guide explains how to configure SMTP email sending for BRX.MA authentication features (email verification, password reset, etc.).

## 🎯 Quick Start

### Option 1: Gmail (Recommended for Development)

**Step 1: Enable 2-Factor Authentication**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification

**Step 2: Generate App Password**
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select app: "Mail" and device: "Other (Custom name)"
3. Enter name: "BRX.MA Server"
4. Click "Generate"
5. Copy the 16-character password (example: `abcd efgh ijkl mnop`)

**Step 3: Update `.env` file**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
EMAIL_FROM=noreply@brx.ma
```

**Step 4: Test the configuration**
```bash
cd server
npm run test-email your-test-email@gmail.com
```

---

### Option 2: SendGrid (Recommended for Production)

**Free Tier**: 100 emails/day

**Step 1: Create SendGrid Account**
1. Go to [SendGrid.com](https://sendgrid.com)
2. Sign up for free account
3. Verify your email address

**Step 2: Generate API Key**
1. Go to Settings > [API Keys](https://app.sendgrid.com/settings/api_keys)
2. Click "Create API Key"
3. Name: "BRX.MA Production"
4. Permissions: "Full Access" or "Mail Send" only
5. Copy the API key (starts with `SG.`)

**Step 3: Verify Sender Identity**
1. Go to Settings > [Sender Authentication](https://app.sendgrid.com/settings/sender_auth)
2. Choose "Single Sender Verification" (for free tier)
3. Fill in your details:
   - From Email: `noreply@brx.ma` (or your verified domain)
   - From Name: `BRX.MA`
4. Check your email and verify

**Step 4: Update `.env` file**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your-sendgrid-api-key-here
EMAIL_FROM=noreply@brx.ma
```

**Step 5: Test the configuration**
```bash
cd server
npm run test-email your-test-email@gmail.com
```

---

### Option 3: Mailgun

**Free Tier**: 5,000 emails/month for first 3 months

**Step 1: Create Mailgun Account**
1. Go to [Mailgun.com](https://mailgun.com)
2. Sign up for free trial
3. Verify your email

**Step 2: Get SMTP Credentials**
1. Go to [Sending > Domain Settings](https://app.mailgun.com/app/sending/domains)
2. Select your sandbox domain or add custom domain
3. Click "SMTP credentials"
4. Create new SMTP user or use existing

**Step 3: Update `.env` file**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@sandboxxxxxx.mailgun.org
SMTP_PASSWORD=your-mailgun-smtp-password
EMAIL_FROM=noreply@brx.ma
```

---

### Option 4: Amazon SES

**Free Tier**: 62,000 emails/month (if sending from EC2)

**Step 1: Create AWS Account**
1. Go to [AWS SES Console](https://console.aws.amazon.com/ses)
2. Create IAM user with SES permissions

**Step 2: Verify Email/Domain**
1. Go to "Verified identities"
2. Add email or domain

**Step 3: Create SMTP Credentials**
1. Go to "SMTP Settings"
2. Click "Create SMTP credentials"
3. Copy username and password

**Step 4: Update `.env` file**
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-aws-ses-smtp-username
SMTP_PASSWORD=your-aws-ses-smtp-password
EMAIL_FROM=noreply@brx.ma
```

---

## 🧪 Testing Email Configuration

### Test Script Usage

```bash
# Navigate to server directory
cd server

# Run test (replace with your email)
npm run test-email john.doe@gmail.com
```

**What it does:**
1. Verifies SMTP connection
2. Sends 3 test emails:
   - Email verification link
   - Password reset link
   - Welcome email

**Expected output:**
```
=== BRX.MA Email Testing Tool ===

📧 Test email will be sent to: john.doe@gmail.com

Step 1: Verifying SMTP connection...
🔄 Verifying SMTP connection...
✅ SMTP connection verified successfully
✅ SMTP connection verified!

Step 2: Sending test emails...

📧 Test 1/3: Sending verification email...
[2025-01-15T10:30:00.000Z] 📧 Sending email...
   To: john.doe@gmail.com
   Subject: Vérifiez votre adresse email - BRX.MA
[2025-01-15T10:30:01.000Z] ✅ Email sent successfully
   Message ID: <abc123@brx.ma>
✅ Verification email sent

📧 Test 2/3: Sending password reset email...
✅ Password reset email sent

📧 Test 3/3: Sending welcome email...
✅ Welcome email sent

🎉 All test emails sent successfully!

📬 Check inbox for: john.doe@gmail.com
   (Check spam folder if emails not found)
```

---

## 🔧 Troubleshooting

### Issue: "SMTP not configured"

**Solution:** Make sure `SMTP_USER` and `SMTP_PASSWORD` are set in `.env` file.

```bash
# Check if variables are loaded
cd server
node -e "require('dotenv').config(); console.log('SMTP_USER:', process.env.SMTP_USER)"
```

---

### Issue: "Authentication failed"

**Gmail:**
- Make sure 2FA is enabled
- Use App Password (not regular password)
- Remove spaces from App Password

**SendGrid:**
- SMTP_USER must be exactly `apikey`
- SMTP_PASSWORD is your API key starting with `SG.`

---

### Issue: "Connection timeout"

**Solutions:**
1. Check firewall settings (allow outbound port 587)
2. Try alternative ports:
   - Port 587 (TLS) - recommended
   - Port 465 (SSL)
   - Port 2525 (alternative)

```env
SMTP_PORT=465  # Try this if 587 fails
```

---

### Issue: "Emails go to spam"

**Solutions:**
1. **Verify sender domain** (use SPF, DKIM, DMARC records)
2. **Use professional SMTP service** (SendGrid, Mailgun, SES)
3. **Avoid spam triggers**:
   - Don't use ALL CAPS
   - Avoid excessive links
   - Include unsubscribe option

---

## 📊 Email Templates

BRX.MA includes professionally styled HTML email templates:

### Features:
- ✅ Responsive design (mobile-friendly)
- ✅ BRX.MA branding with gradient headers
- ✅ Clear call-to-action buttons
- ✅ Security warnings for sensitive actions
- ✅ Professional footer with links

### Available templates:
1. **Verification Email** - Sent after registration
2. **Password Reset Email** - Sent when user forgets password
3. **Welcome Email** - Sent after email verification

### Preview Templates:

Run the test script to see how emails look:
```bash
npm run test-email your-email@example.com
```

---

## 🌐 Production Configuration

### Environment Variables Checklist

```env
# ✅ Required for email functionality
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your-production-api-key
EMAIL_FROM=noreply@brx.ma

# ✅ Required for email links
APP_URL=https://brx.ma

# ✅ Security
NODE_ENV=production
JWT_SECRET=your-production-secret-min-32-chars
COOKIE_SECRET=your-cookie-secret-min-32-chars
```

### Best Practices:

1. **Use dedicated SMTP service** (SendGrid, Mailgun, SES)
2. **Never commit `.env` files** to Git
3. **Use environment-specific configs**:
   - Development: Gmail with App Password
   - Staging: SendGrid free tier
   - Production: SendGrid paid / AWS SES
4. **Monitor email deliverability**:
   - Check bounce rates
   - Monitor spam reports
   - Track open rates
5. **Set up SPF/DKIM/DMARC** records for custom domain
6. **Implement rate limiting** (already configured in auth routes)

---

## 📝 Email Service Comparison

| Service | Free Tier | Pros | Cons |
|---------|-----------|------|------|
| **Gmail** | 500/day | Easy setup, reliable | Not for production, 2FA required |
| **SendGrid** | 100/day | Professional, good docs | Daily limit low |
| **Mailgun** | 5,000/month (3mo) | Generous free tier | Complex setup |
| **AWS SES** | 62,000/month* | Cheapest at scale | Requires AWS account |
| **Postmark** | 100/month | Best deliverability | Expensive |

*Free tier only if sending from AWS EC2/Lambda

---

## 🚀 Next Steps

After configuring SMTP:

1. ✅ Test email sending: `npm run test-email your-email@example.com`
2. ✅ Test registration flow with real email
3. ✅ Test password reset flow
4. ✅ Monitor email logs in production
5. ✅ Set up email analytics (open rates, bounces)
6. ✅ Configure SPF/DKIM for custom domain

---

## 📞 Support

If you encounter issues:

1. Check the logs: `tail -f server/logs/error.log`
2. Test SMTP connection: `npm run test-email your-email@example.com`
3. Review `.env` configuration
4. Check SMTP provider dashboard for errors
5. Contact SMTP provider support

---

**Last updated:** 2025-01-15
**BRX.MA Version:** 1.0.0
