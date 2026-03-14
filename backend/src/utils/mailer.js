const nodemailer = require('nodemailer');

// Status-specific content
const statusContent = {
    Active: {
        subject: '✅ Your Account Has Been Approved — HCL Library',
        heading: 'Account Approved!',
        color: '#10b981',
        icon: '✅',
        message: 'Great news! Your student account has been <strong>approved</strong> by the administrator. You can now log in and access all library features including borrowing books and registering for courses.',
        cta: 'Log In Now',
    },
    Suspended: {
        subject: '⚠️ Your Account Has Been Suspended — HCL Library',
        heading: 'Account Suspended',
        color: '#ef4444',
        icon: '⚠️',
        message: 'Your student account has been <strong>suspended</strong> by the administrator. You will not be able to log in until your account is reactivated. Please contact the library administration if you have any questions.',
        cta: null,
    },
    Reactivated: {
        subject: '🔄 Your Account Has Been Reactivated — HCL Library',
        heading: 'Account Reactivated!',
        color: '#3b82f6',
        icon: '🔄',
        message: 'Your student account has been <strong>reactivated</strong> by the administrator. You can now log in and continue using all library features.',
        cta: 'Log In Now',
    },
    Deleted: {
        subject: '❌ Your Account Has Been Removed — HCL Library',
        heading: 'Account Removed',
        color: '#64748b',
        icon: '❌',
        message: 'Your student account has been <strong>permanently removed</strong> from the HCL Library system by the administrator. If you believe this is a mistake, please contact library administration directly.',
        cta: null,
    },
};

/**
 * Send a status change notification email to the student.
 * @param {Object} student - { name, email }
 * @param {'Active'|'Suspended'|'Reactivated'|'Deleted'} action
 */
const sendStatusEmail = async (student, action) => {
    const content = statusContent[action];
    if (!content) return;

    // Create transporter lazily so env vars are guaranteed to be loaded
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const mailOptions = {
        from: `"HCL Library System" <${process.env.MAIL_USER}>`,
        to: student.email,
        subject: content.subject,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
                <div style="background: #1e293b; padding: 28px; text-align: center;">
                    <h2 style="color: #ffffff; margin: 0; font-size: 20px;">HCL Library System</h2>
                    <p style="color: #94a3b8; margin: 4px 0 0; font-size: 13px;">Account Status Notification</p>
                </div>
                <div style="padding: 28px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <span style="font-size: 3rem;">${content.icon}</span>
                        <h2 style="color: ${content.color}; margin: 8px 0 0;">${content.heading}</h2>
                    </div>
                    <p style="font-size: 15px; color: #334155;">Hi <strong>${student.name}</strong>,</p>
                    <p style="font-size: 15px; color: #475569; line-height: 1.6;">${content.message}</p>
                    ${content.cta ? `
                    <div style="text-align: center; margin: 28px 0;">
                        <a href="http://localhost:5173/login" style="background: ${content.color}; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 15px;">${content.cta}</a>
                    </div>` : ''}
                    <p style="font-size: 12px; color: #94a3b8; margin-top: 24px;">Action taken on: ${timestamp}</p>
                </div>
                <div style="background: #f1f5f9; padding: 16px; text-align: center;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">This is an automated notification from the HCL Library Management System.</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[Mailer] "${action}" email sent to: ${student.email}`);
    } catch (err) {
        console.error(`[Mailer] Failed to send email to ${student.email}: ${err.message}`);
    }
};

module.exports = { sendStatusEmail };
