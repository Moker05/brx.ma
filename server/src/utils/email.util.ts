import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASSWORD || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@brx.ma';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: SMTP_USER ? {
    user: SMTP_USER,
    pass: SMTP_PASS
  } : undefined,
});

/**
 * Base email template with BRX.MA branding
 */
function getEmailTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
    .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .footer { background-color: #f8f8f8; padding: 20px 30px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee; }
    .footer a { color: #667eea; text-decoration: none; }
    .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; color: #856404; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🇲🇦 BRX.MA</h1>
      <p style="color: #ffffff; margin: 5px 0 0 0;">Bourse de Casablanca</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>BRX.MA - Plateforme de trading de la Bourse de Casablanca</p>
      <p><a href="${APP_URL}">Visiter BRX.MA</a> | <a href="${APP_URL}/support">Support</a></p>
      <p style="margin-top: 15px; font-size: 11px;">Ce message a été envoyé automatiquement, merci de ne pas y répondre.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send email with logging
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const timestamp = new Date().toISOString();

  if (!SMTP_USER) {
    console.warn(`[${timestamp}] 📧 SMTP not configured - Email skipped`);
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    return;
  }

  try {
    console.log(`[${timestamp}] 📧 Sending email...`);
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);

    const info = await transporter.sendMail({
      from: `"BRX.MA" <${EMAIL_FROM}>`,
      to,
      subject,
      html,
    });

    console.log(`[${timestamp}] ✅ Email sent successfully`);
    console.log(`   Message ID: ${info.messageId}`);

  } catch (error: any) {
    console.error(`[${timestamp}] ❌ Email sending failed`);
    console.error(`   To: ${to}`);
    console.error(`   Error: ${error.message}`);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

/**
 * Send email verification link
 */
export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  const verifyUrl = `${APP_URL}/verify-email?token=${encodeURIComponent(token)}`;

  const content = `
    <h2>Vérifiez votre adresse email</h2>
    <p>Bonjour,</p>
    <p>Merci d'avoir créé un compte sur BRX.MA ! Pour commencer à utiliser votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
    <p style="text-align: center;">
      <a href="${verifyUrl}" class="button">Vérifier mon email</a>
    </p>
    <p style="color: #666; font-size: 14px;">Ou copiez ce lien dans votre navigateur :</p>
    <p style="word-break: break-all; color: #667eea; font-size: 13px;">${verifyUrl}</p>
    <div class="warning">
      ⚠️ Ce lien est valable pendant <strong>24 heures</strong>.
    </div>
    <p>Si vous n'avez pas créé de compte sur BRX.MA, vous pouvez ignorer cet email en toute sécurité.</p>
  `;

  await sendEmail(to, 'Vérifiez votre adresse email - BRX.MA', getEmailTemplate(content));
}

/**
 * Send password reset link
 */
export async function sendResetPasswordEmail(to: string, token: string): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${encodeURIComponent(token)}`;

  const content = `
    <h2>Réinitialisation de votre mot de passe</h2>
    <p>Bonjour,</p>
    <p>Vous avez demandé la réinitialisation de votre mot de passe BRX.MA. Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
    <p style="text-align: center;">
      <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
    </p>
    <p style="color: #666; font-size: 14px;">Ou copiez ce lien dans votre navigateur :</p>
    <p style="word-break: break-all; color: #667eea; font-size: 13px;">${resetUrl}</p>
    <div class="warning">
      ⚠️ Ce lien est valable pendant <strong>1 heure</strong>.
    </div>
    <p><strong>Vous n'avez pas demandé cette réinitialisation ?</strong></p>
    <p>Si vous n'êtes pas à l'origine de cette demande, votre compte est peut-être compromis. Nous vous recommandons de :</p>
    <ul>
      <li>Ignorer cet email</li>
      <li>Changer votre mot de passe immédiatement</li>
      <li>Contacter notre support si nécessaire</li>
    </ul>
  `;

  await sendEmail(to, 'Réinitialisation du mot de passe - BRX.MA', getEmailTemplate(content));
}

/**
 * Send welcome email after successful registration
 */
export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const content = `
    <h2>Bienvenue sur BRX.MA ! 🎉</h2>
    <p>Bonjour ${name},</p>
    <p>Votre compte a été créé avec succès. Vous pouvez maintenant profiter de toutes les fonctionnalités de notre plateforme :</p>
    <ul>
      <li>📊 Suivre les actions de la Bourse de Casablanca en temps réel</li>
      <li>💼 Gérer votre portefeuille virtuel</li>
      <li>📈 Analyser les tendances du marché avec TradingView</li>
      <li>💬 Échanger avec la communauté d'investisseurs</li>
      <li>🏆 Participer au classement et gagner des badges</li>
    </ul>
    <p style="text-align: center;">
      <a href="${APP_URL}/dashboard" class="button">Accéder à mon tableau de bord</a>
    </p>
    <p>Besoin d'aide ? Notre équipe de support est à votre disposition.</p>
    <p>Bon trading ! 🚀</p>
  `;

  await sendEmail(to, 'Bienvenue sur BRX.MA ! 🎉', getEmailTemplate(content));
}

/**
 * Verify SMTP connection (for testing)
 */
export async function verifyEmailConnection(): Promise<boolean> {
  if (!SMTP_USER) {
    console.warn('⚠️  SMTP credentials not configured');
    return false;
  }

  try {
    console.log('🔄 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');
    return true;
  } catch (error: any) {
    console.error('❌ SMTP connection failed:', error.message);
    return false;
  }
}
