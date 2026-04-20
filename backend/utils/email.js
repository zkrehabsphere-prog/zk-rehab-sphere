const nodemailer = require('nodemailer');

// Create reusable transporter
let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });
  }
  return transporter;
};

/**
 * Send a generic email
 * @param {Object} options - { to, subject, html, text }
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️  Email credentials not configured. Skipping email send.');
      return false;
    }

    const info = await getTransporter().sendMail({
      from: `"ZK Rehab Sphere" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || html?.replace(/<[^>]*>/g, ''), // Fallback plain text
    });

    console.log(`📧 Email sent: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    return false; // Don't crash the app if email fails
  }
};

// ─── Email Templates ───────────────────────────────────────────────────────────

const emailBase = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0f766e, #3b82f6); padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 32px; }
    .info-row { display: flex; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
    .info-label { font-weight: 600; color: #64748b; width: 140px; flex-shrink: 0; font-size: 14px; }
    .info-value { color: #1e293b; font-size: 14px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-pending { background: #fef3c7; color: #92400e; }
    .badge-confirmed { background: #d1fae5; color: #065f46; }
    .badge-cancelled { background: #fee2e2; color: #991b1b; }
    .cta { margin: 24px 0; text-align: center; }
    .cta a { background: #0f766e; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏥 ZK Rehab Sphere</h1>
      <p>Evidence-Based Physiotherapy & Rehabilitation</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ZK Rehab Sphere · Chandigarh Tricity Region</p>
      <p>📞 +91 7340820883 · ✉️ zkrehabsphere@gmail.com</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Send appointment confirmation to patient
 */
const sendAppointmentConfirmation = async ({ to, patientName, doctorName, date, time, purpose }) => {
  const html = emailBase(`
    <h2 style="color:#0f766e; margin-top:0;">Appointment Confirmed ✅</h2>
    <p>Dear <strong>${patientName}</strong>, your appointment has been <strong>confirmed</strong>.</p>
    <div style="background:#f0fdf4; border-left: 4px solid #0f766e; padding: 16px; border-radius: 8px; margin: 20px 0;">
      <div class="info-row"><span class="info-label">👨‍⚕️ Doctor:</span><span class="info-value">${doctorName}</span></div>
      <div class="info-row"><span class="info-label">📅 Date:</span><span class="info-value">${date}</span></div>
      <div class="info-row"><span class="info-label">🕐 Time:</span><span class="info-value">${time}</span></div>
      ${purpose ? `<div class="info-row"><span class="info-label">📋 Purpose:</span><span class="info-value">${purpose}</span></div>` : ''}
    </div>
    <p style="color:#64748b; font-size:14px;">Our physiotherapist will visit you at the scheduled time. If you need to reschedule, please contact us on WhatsApp.</p>
    <div class="cta">
      <a href="https://wa.me/917340820883">Contact on WhatsApp</a>
    </div>
  `);
  return sendEmail({ to, subject: '✅ Appointment Confirmed — ZK Rehab Sphere', html });
};

/**
 * Send booking notification to the clinic/doctor
 */
const sendBookingNotification = async ({ doctorEmail, patientName, patientPhone, date, time, address, purpose }) => {
  const html = emailBase(`
    <h2 style="color:#0f766e; margin-top:0;">New Appointment Booking 📋</h2>
    <p>A new appointment has been booked. Here are the patient details:</p>
    <div style="background:#f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
      <div class="info-row"><span class="info-label">👤 Patient:</span><span class="info-value">${patientName}</span></div>
      <div class="info-row"><span class="info-label">📞 Phone:</span><span class="info-value">${patientPhone}</span></div>
      <div class="info-row"><span class="info-label">📍 Address:</span><span class="info-value">${address}</span></div>
      <div class="info-row"><span class="info-label">📅 Date:</span><span class="info-value">${date}</span></div>
      <div class="info-row"><span class="info-label">🕐 Time:</span><span class="info-value">${time}</span></div>
      ${purpose ? `<div class="info-row"><span class="info-label">📋 Purpose:</span><span class="info-value">${purpose}</span></div>` : ''}
    </div>
  `);
  return sendEmail({ to: doctorEmail, subject: `🔔 New Appointment — ${patientName} on ${date} at ${time}`, html });
};

/**
 * Send contact form notification to admin
 */
const sendContactNotification = async ({ name, email, phone, message }) => {
  const html = emailBase(`
    <h2 style="color:#0f766e; margin-top:0;">New Contact Form Message 💬</h2>
    <div style="background:#f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
      <div class="info-row"><span class="info-label">👤 Name:</span><span class="info-value">${name}</span></div>
      <div class="info-row"><span class="info-label">✉️ Email:</span><span class="info-value">${email}</span></div>
      ${phone ? `<div class="info-row"><span class="info-label">📞 Phone:</span><span class="info-value">${phone}</span></div>` : ''}
      <div style="margin-top: 16px; padding: 12px; background: white; border-radius: 6px; border: 1px solid #e2e8f0;">
        <p style="color:#64748b; font-size: 12px; margin: 0 0 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
        <p style="margin: 0; color: #1e293b;">${message}</p>
      </div>
    </div>
  `);
  return sendEmail({
    to: process.env.CLINIC_EMAIL || process.env.EMAIL_USER,
    subject: `📨 New Contact Message from ${name}`,
    html,
  });
};

/**
 * Send appointment status update to patient
 */
const sendStatusUpdate = async ({ to, patientName, status, date, time, doctorNotes }) => {
  const statusMap = {
    confirmed: { label: 'Confirmed ✅', color: '#065f46', bg: '#d1fae5' },
    cancelled: { label: 'Cancelled ❌', color: '#991b1b', bg: '#fee2e2' },
    completed: { label: 'Completed 🎉', color: '#1e40af', bg: '#dbeafe' },
  };
  const s = statusMap[status] || { label: status, color: '#374151', bg: '#f3f4f6' };

  const html = emailBase(`
    <h2 style="color:#0f766e; margin-top:0;">Appointment Update</h2>
    <p>Dear <strong>${patientName}</strong>, your appointment status has been updated.</p>
    <div style="text-align: center; margin: 24px 0;">
      <span style="background: ${s.bg}; color: ${s.color}; padding: 8px 24px; border-radius: 24px; font-weight: 700; font-size: 16px;">${s.label}</span>
    </div>
    <div style="background:#f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
      <div class="info-row"><span class="info-label">📅 Date:</span><span class="info-value">${date}</span></div>
      <div class="info-row"><span class="info-label">🕐 Time:</span><span class="info-value">${time}</span></div>
      ${doctorNotes ? `<div class="info-row"><span class="info-label">📝 Notes:</span><span class="info-value">${doctorNotes}</span></div>` : ''}
    </div>
    <div class="cta">
      <a href="https://wa.me/917340820883">Questions? Chat with Us</a>
    </div>
  `);
  return sendEmail({ to, subject: `Appointment ${s.label} — ZK Rehab Sphere`, html });
};

module.exports = {
  sendEmail,
  sendAppointmentConfirmation,
  sendBookingNotification,
  sendContactNotification,
  sendStatusUpdate,
};
