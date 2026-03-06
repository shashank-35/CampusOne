const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: config.emailHost,
  port: config.emailPort,
  secure: config.emailPort === 465,
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

/**
 * Send inquiry confirmation email to the student
 */
const sendInquiryConfirmation = async ({ name, email }) => {
  if (!config.emailUser) return; // Skip if email not configured

  const mailOptions = {
    from: config.emailFrom,
    to: email,
    subject: 'Your Inquiry has been received – CampusOne',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="background: #1e293b; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">CampusOne</h1>
        </div>
        <div style="padding: 30px 20px;">
          <h2 style="color: #1e293b;">Hello ${name},</h2>
          <p style="color: #475569; line-height: 1.6;">
            Thank you for contacting <strong>CampusOne</strong>.
          </p>
          <p style="color: #475569; line-height: 1.6;">
            Your inquiry has been received successfully. Our counselor will review your details
            and contact you shortly to guide you through the admission process.
          </p>
          <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #1e293b; font-weight: 600;">What happens next?</p>
            <ul style="color: #475569; margin: 8px 0; padding-left: 20px;">
              <li>Our receptionist will review your inquiry</li>
              <li>A counselor will be assigned to you</li>
              <li>You will be contacted within 24–48 hours</li>
            </ul>
          </div>
          <p style="color: #475569;">If you have any urgent questions, feel free to reach out to us directly.</p>
        </div>
        <div style="background: #f1f5f9; padding: 16px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            &copy; ${new Date().getFullYear()} CampusOne. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Notify a counselor when an inquiry is assigned to them
 */
const sendInquiryAssignedEmail = async ({ counselorEmail, counselorName, studentName }) => {
  if (!config.emailUser) return;

  const mailOptions = {
    from: config.emailFrom,
    to: counselorEmail,
    subject: `New Inquiry Assigned: ${studentName} – CampusOne`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="background: #1e293b; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">CampusOne</h1>
        </div>
        <div style="padding: 30px 20px;">
          <h2 style="color: #1e293b;">Hello ${counselorName},</h2>
          <p style="color: #475569;">
            A new inquiry has been assigned to you. Please review and follow up with the student.
          </p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: 600; color: #166534;">Student: ${studentName}</p>
          </div>
          <p style="color: #475569;">Please log in to your CampusOne dashboard to view the full inquiry details.</p>
        </div>
        <div style="background: #f1f5f9; padding: 16px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} CampusOne</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Send welcome email to a newly admitted student
 */
const sendStudentWelcomeEmail = async ({ name, email, password }) => {
  if (!config.emailUser) return;

  const mailOptions = {
    from: config.emailFrom,
    to: email,
    subject: 'Welcome to CampusOne – Your Student Account is Ready',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="background: #1e293b; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">CampusOne</h1>
        </div>
        <div style="padding: 30px 20px;">
          <h2 style="color: #1e293b;">Welcome, ${name}!</h2>
          <p style="color: #475569; line-height: 1.6;">
            Congratulations! Your admission has been confirmed and your student account has been created.
          </p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 8px; font-weight: 700; color: #166534; font-size: 16px;">Your Login Credentials</p>
            <p style="margin: 4px 0; color: #1e293b;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 4px 0; color: #1e293b;"><strong>Temporary Password:</strong> <code style="background:#e2e8f0;padding:2px 6px;border-radius:4px;">${password}</code></p>
          </div>
          <p style="color: #475569;">Please log in to your student portal and change your password immediately.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${config.clientUrl}/student-login" style="background:#1e293b;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
              Go to Student Portal
            </a>
          </div>
        </div>
        <div style="background: #f1f5f9; padding: 16px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            &copy; ${new Date().getFullYear()} CampusOne. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendInquiryConfirmation, sendInquiryAssignedEmail, sendStudentWelcomeEmail };
