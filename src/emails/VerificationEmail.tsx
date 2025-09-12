export const getOtpHtml = ({ email, otp,username }:{email:string,otp:string,username:string}) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>{{APP_NAME}} Verification Code</title>
<style>
/* Base reset */
html, body {
margin: 0;
padding: 0;
}
body {
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: #1f2937;
-webkit-text-size-adjust: 100%;
-ms-text-size-adjust: 100%;
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
line-height: 1.6;
}
table {
border-collapse: collapse;
}
img {
border: 0;
line-height: 100%;
outline: none;
text-decoration: none;
display: block;
max-width: 100%;
height: auto;
}
/* Layout */
.wrapper {
width: 100%;
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
min-height: 100vh;
}
.outer {
width: 100%;
}
.container {
width: 600px;
max-width: 600px;
background: #ffffff;
border-radius: 16px;
overflow: hidden;
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
margin: 40px auto;
}
.p-24 {
padding: 24px;
}
.p-32 {
padding: 32px;
}
.p-40 {
padding: 40px;
}
.header {
background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
padding: 32px 40px;
text-align: center;
position: relative;
}
.header::before {
content: '';
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.05)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.05)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.03)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
opacity: 0.3;
}
.brand {
display: inline-block;
text-wrap:no-wrap;
white-space:no-wrap;
color: #ffffff;
font-weight: 700;
font-size: 20px;
letter-spacing: 0.5px;
text-decoration: none;
position: relative;
z-index: 1;
text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.title {
margin: 0 0 16px 0;
font-size: 28px;
line-height: 1.3;
color: #1f2937;
font-weight: 700;
text-align: center;
}
.subtitle {
margin: 0 0 24px 0;
font-size: 16px;
line-height: 1.6;
color: #6b7280;
text-align: center;
}
.text {
margin: 0 0 20px 0;
font-size: 16px;
line-height: 1.7;
color: #374151;
text-align: center;
}
.muted {
color: #6b7280;
font-size: 14px;
line-height: 1.6;
margin: 0 0 12px 0;
text-align: center;
}
/* OTP badge */
.otp-wrap {
margin: 32px 0;
width: 100%;
}
.otp-container {
background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
border: 2px solid #e2e8f0;
border-radius: 16px;
padding: 24px;
text-align: center;
position: relative;
}
.otp-container::before {
content: '';
position: absolute;
top: -1px;
left: -1px;
right: -1px;
bottom: -1px;
background: linear-gradient(135deg, #667eea, #764ba2);
border-radius: 16px;
z-index: -1;
}
.otp-label {
display: block;
font-size: 12px;
font-weight: 600;
color: #6b7280;
text-transform: uppercase;
letter-spacing: 1px;
margin-bottom: 8px;
}
.otp {
display: inline-block;
background: transparent;
font-size: 36px;
letter-spacing: 8px;
font-weight: 800;
color: #1f2937;
font-family: 'Courier New', Courier, monospace;
text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
/* Security notice */
.security-notice {
background: #fef3cd;
border: 1px solid #fbbf24;
border-radius: 12px;
padding: 16px 20px;
margin: 24px 0;
}
.security-text {
margin: 0;
font-size: 14px;
color: #92400e;
font-weight: 500;
text-align: center;
}
/* Footer */
.footer {
background: #f9fafb;
text-align: center;
color: #6b7280;
font-size: 13px;
line-height: 1.6;
padding: 24px 40px;
border-top: 1px solid #e5e7eb;
}
.footer-link {
color: #4f46e5;
text-decoration: none;
}
.footer-link:hover {
text-decoration: underline;
}
/* Responsive */
@media only screen and (max-width: 600px) {
.container {
width: 95% !important;
margin: 20px auto !important;
border-radius: 12px !important;
}
.p-40 {
padding: 24px !important;
}
.header {
padding: 24px !important;
}
.title {
font-size: 24px !important;
}
.otp {
font-size: 32px !important;
letter-spacing: 6px !important;
}
.footer {
padding: 20px 24px !important;
}
}
</style>
</head>
<body>
<table role="presentation" class="wrapper" width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
<td align="center" class="p-24">
<table role="presentation" class="container" border="0" cellspacing="0" cellpadding="0">
<!-- Header -->
<tr>
<td class="header">
<span class="brand">🔐 Session Message</span>
</td>
</tr>
<!-- Body -->
<tr>
<td class="p-40">
<h1 class="title">Verify Your Email</h1>
<p class="subtitle">Your Email: <strong>${email}</strong>, username: <strong>${username}</strong></p>
<p class="text">
Enter the code below to complete your authentication and secure your account.
</p>
<!-- OTP -->
<table role="presentation" class="otp-wrap" border="0" cellspacing="0" cellpadding="0">
<tr>
<td align="center">
<div class="otp-container">
<span class="otp-label">Verification Code</span>
<div class="otp">${otp}</div>
</div>
</td>
</tr>
</table>
<!-- Security Notice -->
<div class="security-notice">
<p class="security-text">
⚠️ This code expires in <strong>5 minutes</strong> for your security
</p>
</div>
<p class="muted">
If you didn't request this verification, please ignore this email or contact our support team.
</p>
<p class="muted">
Never share this code with anyone. Our team will never ask for your verification code.
</p>
</td>
</tr>
<!-- Footer -->
<tr>
<td class="footer">
<p style="margin: 0 0 8px 0;">
© ${new Date().getFullYear()} Session Message. All rights reserved.
</p>
<p style="margin: 0;">
<a href="#" class="footer-link">Privacy Policy</a> • 
<a href="#" class="footer-link">Terms of Service</a> • 
<a href="#" class="footer-link">Support</a>
</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>
`
  return html
}