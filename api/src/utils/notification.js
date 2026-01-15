import db from "../models/index.js"
import fetch from "node-fetch"
const { Clinics, Sequelize } = db
import { testMail } from "../utils/maller.js"

const getConfigData = async clinic_id => {
  return await Clinics.findOne({
    where: { id: clinic_id },
  })
}

// Function to send email notification
export const sendMailNotification = async data => {
  const { patientEmail, patientName, patientType, clinicName, websiteLink } =
    data

  // Switch-case for patient type
  let subject, html
  switch (patientType) {
    case "newPatient":
      subject = `Welcome to ${clinicName}, ${patientName}!`
      html = `
      <div style="max-width: 420px; margin: 20px auto; border-radius: 20px; font-family: Arial, sans-serif; background: linear-gradient(135deg, #3498db, #2ecc71); color: #fff; text-align: center; padding: 30px; box-shadow: 0 8px 25px rgba(0,0,0,0.2); line-height: 1.6;">
        <h2 style="margin-top:0; font-size:24px;">Welcome to ${clinicName}, ${patientName}!</h2>
        <div style="font-size:60px; margin:15px 0; animation:bounce 2s infinite;">🦷</div>
        <p>Thank you for choosing our clinic, ${patientName}. We are committed to providing the highest quality dental care in a safe, comfortable, and hygienic environment. Your health, confidence, and comfort are our top priorities.</p>
        <p style="font-size: 15px; margin: 15px 0; text-align: left; display: inline-block;">
          ✅ Experienced dental professionals<br>
          ✅ State-of-the-art equipment and modern techniques<br>
          ✅ Personalized care tailored to your needs<br>
          ✅ Hygienic & safe environment<br>
          ✅ Friendly and professional staff
        </p>
        <a href="${websiteLink}" style="display:inline-block; margin-top:20px; padding:12px 28px; background-color: #e67e22; color:#fff; text-decoration:none; border-radius:10px; font-weight:bold; font-size:15px; box-shadow:0 4px 10px rgba(0,0,0,0.2); transition:background-color 0.3s;">Schedule Your Next Visit</a>
        <p style="font-size:13px; margin-top:20px; color:#ecf0f1;">We value your trust and are here for any questions or support you may need. Thank you for choosing <strong>${clinicName}</strong>.</p>
      </div>
      <style>
      @keyframes bounce {
        0%,20%,50%,80%,100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
      </style>
      `
      break

    case "newAppointment":
      subject = `Your Appointment is Scheduled, ${patientName}`
      html = `
      <div style="max-width: 420px; margin: 20px auto; border-radius: 20px; font-family: Arial, sans-serif; background: linear-gradient(135deg, #3498db, #2ecc71); color: #fff; text-align: center; padding: 30px; box-shadow: 0 8px 25px rgba(0,0,0,0.2); line-height: 1.6;">
        <h2 style="margin-top:0; font-size:24px;">Appointment Scheduled</h2>
        <div style="font-size:50px; margin:15px 0; animation:bounce 2s infinite;">📅</div>
        <p>Dear ${patientName}, your appointment at <strong>${clinicName}</strong> has been successfully scheduled.</p>
        <p style="font-size:16px; margin:10px 0;">
          <strong>Date:</strong> ${appointmentDate}<br>
          <strong>Time:</strong> ${appointmentTime}<br>
          <strong>Doctor:</strong> ${doctorName}
        </p>
        <p style="font-size: 15px; margin: 15px 0; text-align: left; display: inline-block;">
          ✅ Timely reminders before your visit<br>
          ✅ Safe and hygienic environment<br>
          ✅ Expert dental care tailored to you
        </p>
        <a href="${websiteLink}" style="display:inline-block; margin-top:20px; padding:12px 28px; background-color: #e67e22; color:#fff; text-decoration:none; border-radius:10px; font-weight:bold; font-size:15px; box-shadow:0 4px 10px rgba(0,0,0,0.2); transition:background-color 0.3s;">View Appointment</a>
        <p style="font-size:13px; margin-top:20px; color:#ecf0f1;">We look forward to your visit. Thank you for trusting ${clinicName}!</p>
      </div>
      <style>
      @keyframes bounce {
        0%,20%,50%,80%,100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
      </style>
    `
      break

    case "reschedule":
      subject = `Your Appointment has been Rescheduled, ${patientName}`
      html = `
      <div style="max-width: 420px; margin: 20px auto; border-radius: 20px; font-family: Arial, sans-serif; background: linear-gradient(135deg, #f39c12, #e67e22); color: #fff; text-align: center; padding: 30px; box-shadow: 0 8px 25px rgba(0,0,0,0.2); line-height: 1.6;">
        <h2 style="margin-top:0; font-size:24px;">Appointment Rescheduled</h2>
        <div style="font-size:50px; margin:15px 0; animation:bounce 2s infinite;">🔄</div>
        <p>Dear ${patientName}, your appointment at <strong>${clinicName}</strong> has been rescheduled.</p>
        <p style="font-size:16px; margin:10px 0;">
          <strong>New Date:</strong> ${appointmentDate}<br>
          <strong>New Time:</strong> ${appointmentTime}<br>
          <strong>Doctor:</strong> ${doctorName}
        </p>
        <p style="font-size: 15px; margin: 15px 0; text-align: left; display: inline-block;">
          ✅ We ensure timely reminders<br>
          ✅ Safe and hygienic environment<br>
          ✅ Expert dental care tailored to you
        </p>
        <a href="${websiteLink}" style="display:inline-block; margin-top:20px; padding:12px 28px; background-color: #2980b9; color:#fff; text-decoration:none; border-radius:10px; font-weight:bold; font-size:15px; box-shadow:0 4px 10px rgba(0,0,0,0.2); transition:background-color 0.3s;">View Appointment</a>
        <p style="font-size:13px; margin-top:20px; color:#ecf0f1;">We look forward to seeing you. Thank you for trusting ${clinicName}!</p>
      </div>
      <style>
      @keyframes bounce {
        0%,20%,50%,80%,100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
      </style>
    `
      break

    case "birthday":
      subject = `🎉 Happy Birthday, ${patientName}!`
      html = `
        <div style="max-width: 420px; margin: 20px auto; border-radius: 20px; font-family: Arial, sans-serif; background: linear-gradient(135deg, #f39c12, #e67e22); color: #fff; text-align: center; padding: 30px; box-shadow: 0 8px 25px rgba(0,0,0,0.2); line-height: 1.6;">
            <h2 style="margin-top:0; font-size:24px;">Happy Birthday, ${patientName}!</h2>
            <div style="font-size:60px; margin:15px 0; animation:bounce 2s infinite;">🎂</div>
            <p>We at <strong>${clinicName}</strong> wish you a day filled with happiness, smiles, and health. Thank you for being a valued patient.</p>
            <p style="font-size: 15px; margin: 15px 0; text-align: left; display: inline-block;">
            ✅ Wishing you joy and wellness<br>
            ✅ May your year ahead be bright<br>
            ✅ Remember to smile today!<br>
            </p>
            <p style="font-size:13px; margin-top:20px; color:#ecf0f1;">We look forward to your next visit and hope you have a fantastic birthday!</p>
        </div>
        <style>
        @keyframes bounce {
            0%,20%,50%,80%,100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
        </style>
        `
      break
  }

  try {
    const mailOptions = {
      from: "support@oralstop.com",
      to: patientEmail,
      subject,
      html,
    }
    await testMail(mailOptions)
    console.log("Email sent")
  } catch (err) {
    console.error("Error sending email:", err)
  }
}

// Function to send WhatsApp notification
export const sendWpNotification = async data => {
  const {
    patientMobile,
    patientType,
    patientName,
    clinicName,
    websiteLink,
    clinic_id,
  } = data

  let message
  switch (patientType) {
    case "newAppointment":
      message = `Welcome to ${clinicName}! Thank you for your first visit. Schedule your next visit here: ${websiteLink}`
      break
    case "reschedule":
      message = `Welcome back to ${clinicName}! We appreciate your trust. Visit us again soon: ${websiteLink}`
      break
    case "vip":
      message = `As a valued patient at ${clinicName}, we are committed to premium care. Schedule your next visit: ${websiteLink}`
      break
    case "birthday":
      message = `🎉 Happy Birthday, ${patientName}! 🎂\n\nWishing you a day filled with smiles and joy from all of us at Your ${clinicName}.`
      break

    default:
      message = `Thank you for choosing ${clinicName}!`
  }

  const postdata = {
    contact: [
      {
        number: `91${patientMobile}`,
        message,
      },
    ],
  }

  try {
    const { wp_key, clinic_name, phone } = await getConfigData(clinic_id)
    const response = await fetch(
      "https://thedigitalizeclick.com/api/whatsapp/send",
      {
        method: "POST",
        headers: {
          "Api-key": "89beab1e-6079-436d-991a-e0dd54437127",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postdata),
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    console.log("WhatsApp sent:", data)
  } catch (err) {
    console.error("Error sending WhatsApp message:", err)
  }
}
