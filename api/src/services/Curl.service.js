import db from "../models/index.js"
import "dotenv/config"
const {
  ScheduledNotification,
  Appointment,
  Doctors,
  TretmentTypes,
  Patients,
  Clinics,
  Sequelize,
} = db
import logActivity from "../utils/activityLogger.js"
import moment from "moment"
import {
  sendMailNotification,
  sendWpNotification,
} from "../utils/notification.js"

/**
 * Cancel Appointments by system using curl calls
 * @param {*} req
 * @returns
 */
const makeAppointmentExprierService = async req => {
  try {
    // Today start (00:00)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    // yesterday 23:59:59
    const canceledAt = new Date(todayStart.getTime() - 1)
    canceledAt.setHours(23, 59, 59, 999)

    const rows = await Appointment.findAll({
      attributes: ["id"],
      where: {
        reporting_time: { [Sequelize.Op.is]: null },
        canceled_at: { [Sequelize.Op.is]: null },
        appointment_date: { [Sequelize.Op.lt]: todayStart },
      },
      raw: true,
    })

    const appointmentIds = rows.map(r => r.id)

    const [affectedRows] = await Appointment.update(
      {
        canceled_at: canceledAt,
        canceled_note: "Patient not reported",
        canceled_by: "system",
      },
      {
        where: { id: appointmentIds },
      }
    )

    await logActivity({
      entityType: "appointment",
      action: "BULK_AUTO_CANCEL",
      description: "Auto-cancelled missed appointments",
      newData: {
        affected_rows: appointmentIds,
        canceled_date: canceledAt,
        cutoff_date: todayStart,
      },
    })

    return { success: true, data: affectedRows }
  } catch (e) {
    console.error(e)
    return { success: false, error: e }
  }
}

const buildPatientsTable = appointments => {
  let rows = ""
  let count = 1

  appointments.forEach(app => {
    const date = new Date(app.appointment_date).toLocaleDateString("en-IN")

    app.patients.forEach(p => {
      rows += `
        <tr>
          <td>${count++}</td>
          <td>${date}</td>
          <td>${p.patient.title} ${p.patient.first_name} ${
        p.patient.last_name
      }</td>
          <td>${p.patient.mobile}</td>
          <td>${p.patient.treatment || "-"}</td>
          <td>${p.notes || "-"}</td>
        </tr>
      `
    })
  })

  return `
    <table width="100%" cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;font-family:Arial,sans-serif;">
      <thead style="background:#f3f3f3;">
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Patient Name</th>
          <th>Mobile</th>
          <th>Treatment</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `
}

const doctorEmailMessage = doctorData => {
  const totalAppointments = doctorData.appointments.reduce(
    (sum, a) => sum + a.patients.length,
    0
  )

  return `
          <p>Good Morning Dr. <strong>${doctorData.doctor.name}</strong>,</p>

          <p>
          Gentle reminder for today’s appointments.
          You have <strong>${totalAppointments}</strong> appointment(s) listed below:
          </p>

          ${buildPatientsTable(doctorData.appointments)}

          <br />

          <p style="font-size:12px;color:#666;">
          This is an automated system notification.
          </p>
      `
}

const buildWhatsAppMessage = doctorData => {
  const totalAppointments = doctorData.appointments.reduce(
    (sum, a) => sum + a.patients.length,
    0
  )

  let message = `Good Morning Dr. ${doctorData.doctor.name} 👋\n\n`
  message += `Gentle reminder for today’s appointments. You have ${totalAppointments} appointment(s):\n\n`

  let count = 1
  doctorData.appointments.forEach(app => {
    const date = new Date(app.appointment_date).toLocaleDateString("en-IN")

    app.patients.forEach(p => {
      const patient = p.patient
      message += `${count++}. ${patient.title} ${patient.first_name} ${
        patient.last_name
      }\n`
      message += `   Date: ${date}\n`
      message += `   Mobile: ${patient.mobile}\n`
      message += `   Treatment: ${patient.treatment || "-"}\n`
      message += `   Notes: ${p.notes || "-"}\n\n`
    })
  })

  message += `This is an automated system notification. ✅`

  return message
}

const createDoctorNotifications = (doctorData, doctorTime) => {
  const notifications = []
  const doctor = doctorData?.doctor

  // Email notification
  if (doctor.email) {
    notifications.push({
      notification_for: "daily reminder",
      sent_to: "doctor",
      scheduled_time: doctorTime,
      notification_type: "email",
      notification_address: doctor.email,
      message: JSON.stringify({
        subject: "Today's Appointments",
        body: doctorEmailMessage(doctorData),
      }),
      notification_status: "PENDING",
    })
  }

  // WhatsApp / SMS notification
  if (doctor.mobile) {
    notifications.push({
      notification_for: "daily reminder",
      sent_to: "doctor",
      scheduled_time: doctorTime,
      notification_type: "whatsapp",
      notification_address: doctor.mobile,
      message: JSON.stringify({
        subject: "Today's Appointments",
        body: buildWhatsAppMessage(doctorData),
      }),
      notification_status: "PENDING",
    })
  }

  return notifications
}

const buildPatientEmailCard = (patient, appointmentDate, doctorName, notes) => {
  const dateStr = new Date(appointmentDate).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  })

  return `
  <div style="border:1px solid #e0e0e0; border-radius:8px; padding:16px; margin-bottom:12px; font-family:Arial,sans-serif; background:#fafafa;">
    <h3 style="margin:0 0 8px 0; color:#333;">Dear ${patient.title} ${
    patient.first_name
  } ${patient.last_name}</h3>
    <p style="margin:4px 0;"><strong>Appointment Date:</strong> ${dateStr}</p>
    <p style="margin:4px 0;"><strong>Doctor:</strong> Dr. ${doctorName}</p>
    <p style="margin:4px 0;"><strong>Treatment:</strong> ${
      patient.treatment || "-"
    }</p>
    <p style="margin:4px 0;"><strong>Notes:</strong> ${notes || "-"}</p>
  </div>
  `
}

const createPatientNotifications = doctorData => {
  const notifications = []

  // morning 6AM for all appointments of the day
  const morningTime = new Date(doctorData.appointments[0].appointment_date)
  // morningTime.setUTCDate(morningTime.getUTCDate())
  morningTime.setHours(6, 0, 0, 0) // 6:00 AM today

  doctorData.appointments.forEach(app => {
    app.patients.forEach(p => {
      const patient = p.patient

      // === Morning 6AM Notification ===
      if (patient.email) {
        notifications.push({
          notification_for: "daily appointment reminder",
          sent_to: "patient",
          scheduled_time: morningTime,
          notification_type: "email",
          notification_address: patient.email,
          message: JSON.stringify({
            subject: "Your Appointment Reminder",
            body: `
              <p>Dear ${patient.title} ${patient.first_name} ${
              patient.last_name
            },</p>
              <p>Here’s a reminder for your upcoming appointment today:</p>
              ${buildPatientEmailCard(
                patient,
                app.appointment_date,
                doctorData.doctor.name,
                p.notes
              )}
              <p style="font-size:12px; color:#666;">This is an automated notification.</p>
            `,
          }),
          notification_status: "PENDING",
        })
      }

      if (patient.mobile) {
        notifications.push({
          notification_for: "daily appointment reminder",
          sent_to: "patient",
          scheduled_time: morningTime,
          notification_type: "whatsapp",
          notification_address: patient.mobile,
          message: JSON.stringify({
            subject: "Your Appointment Reminder",
            body: `Dear ${patient.title} ${patient.first_name} ${
              patient.last_name
            },\nThis is a reminder for your appointment today with Dr. ${
              doctorData.doctor.name
            }.\nTreatment: ${patient.treatment || "-"}\nNotes: ${
              p.notes || "-"
            }`,
          }),
          notification_status: "PENDING",
        })
      }

      // === 1 hour before appointment ===
      const oneHourBefore = new Date(app.appointment_date)
      oneHourBefore.setHours(oneHourBefore.getHours() - 1)

      if (patient.email) {
        notifications.push({
          notification_for: "appointment reminder 1 hour before",
          sent_to: "patient",
          scheduled_time: oneHourBefore,
          notification_type: "email",
          notification_address: patient.email,
          message: JSON.stringify({
            subject: "Your Appointment in 1 Hour",
            body: `
              <p>Dear ${patient.title} ${patient.first_name} ${
              patient.last_name
            },</p>
              <p>Your appointment with Dr. ${
                doctorData.doctor.name
              } is in 1 hour (${new Date(
              app.appointment_date
            ).toLocaleTimeString()}).</p>
              ${buildPatientEmailCard(
                patient,
                app.appointment_date,
                doctorData.doctor.name,
                p.notes
              )}
              <p style="font-size:12px; color:#666;">This is an automated notification.</p>
            `,
          }),
          notification_status: "PENDING",
        })
      }

      if (patient.mobile) {
        notifications.push({
          notification_for: "appointment reminder 1 hour before",
          sent_to: "patient",
          scheduled_time: oneHourBefore,
          notification_type: "whatsapp",
          notification_address: patient.mobile,
          message: JSON.stringify({
            subject: "Your Appointment in 1 Hour",
            body: `Dear ${patient.title} ${patient.first_name} ${
              patient.last_name
            },\nYour appointment with Dr. ${
              doctorData.doctor.name
            } is in 1 hour (${new Date(
              app.appointment_date
            ).toLocaleTimeString()}).\nTreatment: ${
              patient.treatment || "-"
            }\nNotes: ${p.notes || "-"}`,
          }),
          notification_status: "PENDING",
        })
      }
    })
  })

  return notifications
}

/**
 * Send Appointments to doctors on dat start
 * @param {*} req
 * @returns
 */

const dayAppointmentReminderForDoctorandPatientService = async req => {
  try {
    // ---------- 1️⃣ Today UTC start & end ----------
    const todayStart = new Date()
    todayStart.setUTCDate(todayStart.getUTCDate())
    todayStart.setUTCHours(0, 0, 0, 0)

    const todayEnd = new Date()
    todayEnd.setUTCDate(todayEnd.getUTCDate())
    todayEnd.setUTCHours(23, 59, 59, 999)

    // ---------- 2️⃣ Fetch today’s appointments ----------
    const data = await Appointment.findAll({
      attributes: ["id", "appointment_date", "notes"],
      where: {
        reporting_time: { [Sequelize.Op.is]: null },
        canceled_at: { [Sequelize.Op.is]: null },
        appointment_date: { [Sequelize.Op.between]: [todayStart, todayEnd] },
      },
      include: [
        {
          model: Doctors,
          as: "doctor",
          attributes: ["name", "mobile", "email"],
        },
        {
          model: Patients,
          as: "patient",
          attributes: ["title", "first_name", "last_name", "mobile", "email"],
        },
        { model: TretmentTypes, as: "tretmenttypes", attributes: ["title"] },
      ],
      raw: true,
      nest: true,
    })

    // ---------- 3️⃣ Group by doctor ----------
    const groupedByDoctor = data.reduce((acc, appt) => {
      const doctorKey = appt.doctor.mobile
      if (!acc[doctorKey]) acc[doctorKey] = { doctor: appt.doctor, dates: {} }

      const dateKey = appt.appointment_date
      if (!acc[doctorKey].dates[dateKey])
        acc[doctorKey].dates[dateKey] = {
          appointment_date: dateKey,
          patients: [],
        }

      acc[doctorKey].dates[dateKey].patients.push({
        appointmentId: appt.id,
        notes: appt.notes,
        patient: { ...appt.patient, treatment: appt.tretmenttypes?.title },
      })

      return acc
    }, {})

    const doctorsGroupedData = Object.values(groupedByDoctor).map(d => ({
      doctor: d.doctor,
      appointments: Object.values(d.dates),
    }))

    // ---------- 4️⃣ Doctor notifications (6 AM) ----------
    const doctorsNotifications = []
    doctorsGroupedData.forEach(doctorData => {
      const doctorTime = new Date()
      doctorTime.setUTCDate(doctorTime.getUTCDate())
      doctorTime.setHours(6, 0, 0, 0) // 6 AM local

      const notifs = createDoctorNotifications(doctorData, doctorTime)
      doctorsNotifications.push(...notifs)
    })

    // ---------- 5️⃣ Patient notifications (6 AM + 1 hour before) ----------
    const allPatientNotifications = []
    doctorsGroupedData.forEach(doctorData => {
      const patientNotifs = createPatientNotifications(doctorData)
      allPatientNotifications.push(...patientNotifs)
    })

    // ---------- 7️⃣ Merge all notifications ----------
    const finalNotificationArray = [
      ...doctorsNotifications, // today 6 AM doctor reminders
      ...allPatientNotifications, // today 6 AM + 1-hour patient reminders
    ]

    // ---------- 8️⃣ Bulk insert ----------
    // const res = await ScheduledNotification.bulkCreate(finalNotificationArray)

    return { success: true, data: data }
  } catch (e) {
    console.error(e)
    return { success: false, error: e }
  }
}

const tommarowAppointmentReminderForPatientService = async req => {
  try {
    // ---------- 6️⃣ Tomorrow’s appointments digest (7 PM today) ----------
    const digestTime = new Date()
    digestTime.setHours(19, 0, 0, 0) // 7 PM today

    const tomorrowStart = new Date()
    tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1)
    tomorrowStart.setUTCHours(0, 0, 0, 0)

    const tomorrowEnd = new Date(tomorrowStart)
    tomorrowEnd.setUTCHours(23, 59, 59, 999)

    const tomorrowData = await Appointment.findAll({
      attributes: ["id", "appointment_date", "notes"],
      where: {
        reporting_time: { [Sequelize.Op.is]: null },
        canceled_at: { [Sequelize.Op.is]: null },
        appointment_date: {
          [Sequelize.Op.between]: [tomorrowStart, tomorrowEnd],
        },
      },
      include: [
        {
          model: Doctors,
          as: "doctor",
          attributes: ["name", "mobile", "email"],
        },
        {
          model: Patients,
          as: "patient",
          attributes: ["title", "first_name", "last_name", "mobile", "email"],
        },
        { model: TretmentTypes, as: "tretmenttypes", attributes: ["title"] },
      ],
      raw: true,
      nest: true,
    })

    // Generate notifications for tomorrow’s appointments
    const tomorrowNotifications = []
    tomorrowData.forEach(appt => {
      const doctor = appt.doctor
      const patient = { ...appt.patient, treatment: appt.tretmenttypes?.title }

      // Email
      if (patient.email) {
        tomorrowNotifications.push({
          notification_for: "tomorrow digest",
          sent_to: "patient",
          scheduled_time: digestTime,
          notification_type: "email",
          notification_address: patient.email,
          message: JSON.stringify({
            subject: "Tomorrow's Appointments",
            body: `
            <p>Dear ${patient.title} ${patient.first_name} ${
              patient.last_name
            },</p>
            <p>Here’s a reminder of your appointments scheduled for tomorrow with Dr. ${
              doctor.name
            }:</p>
            ${buildPatientEmailCard(
              patient,
              appt.appointment_date,
              doctor.name,
              appt.notes
            )}
            <p style="font-size:12px;color:#666;">This is an automated notification.</p>
            `,
          }),
          notification_status: "PENDING",
        })
      }

      // WhatsApp
      if (patient.mobile) {
        tomorrowNotifications.push({
          notification_for: "tomorrow digest",
          sent_to: "patient",
          scheduled_time: digestTime,
          notification_type: "whatsapp",
          notification_address: patient.mobile,
          message: JSON.stringify({
            subject: "Tomorrow's Appointments",
            body: `Dear ${patient.title} ${patient.first_name} ${patient.last_name},\nReminder: You have appointments scheduled for tomorrow with Dr. ${doctor.name}.`,
          }),
          notification_status: "PENDING",
        })
      }
    })

    // ---------- 8️⃣ Bulk insert ----------
    const res = await ScheduledNotification.bulkCreate(tomorrowNotifications)

    return { success: true, data: res }
  } catch (e) {
    console.error(e)
    return { success: false, error: e }
  }
}

/**
 * Send Appointments to doctors on dat start
 * @param {*} req
 * @returns
 */
const reminderCurlCallService = async today => {
  try {
    const notifications = await ScheduledNotification.findAll({
      where: {
        sent_at: null,
        scheduled_time: {
          [Sequelize.Op.between]: [today.start, today.end],
        },
      },
    })

    return { success: true, data: notifications }
  } catch (e) {
    console.error(e)
    return { success: false, error: e }
  }
}

/**
 * Send Greetings to Patients
 * @param {*} req
 * @returns
 */
const greetingNotificationService = async req => {
  try {
    // Get all patients with DOB and other info needed for notification
    const patients = await Patients.findAll({
      attributes: [
        "id",
        "title",
        "first_name",
        "last_name",
        "clinic_id",
        "email",
        "mobile",
        "dob",
      ],
    })

    const today = moment() // current date

    for (const patient of patients) {
      const dob = moment(patient.dob)
      const clinicData = await Clinics.findOne({
        attributes: ["id", "clinic_name", "clinic_url"],
        where: { id: patient.clinic_id },
      })

      // Check if birthday is today (ignore year)
      if (dob.date() === today.date() && dob.month() === today.month()) {
        const patientName = `${patient.title} ${patient.first_name} ${patient.last_name}`

        // Prepare message data
        const msgData = {
          patientType: "birthday",
          patientEmail: patient.email,
          patientMobile: patient.mobile,
          patientName,
          clinicName: clinicData?.clinic_name,
          websiteLink: clinicData?.clinic_url,
          clinic_id: clinicData?.id,
        }

        // Send wishes via Email and WhatsApp
        if (patient.email) sendMailNotification(msgData)
        if (patient.mobile) sendWpNotification(msgData)

        console.log(`Birthday wishes sent to ${patientName}`)
        return "notification sent"
      }
    }
  } catch (err) {
    console.error("Error sending birthday wishes:", err)
  }
}

export {
  makeAppointmentExprierService,
  dayAppointmentReminderForDoctorandPatientService,
  tommarowAppointmentReminderForPatientService,
  greetingNotificationService,
  reminderCurlCallService,
}
