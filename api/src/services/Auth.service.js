/* eslint-disable max-len */
import db from "../models/index.js"
import "dotenv/config"
import { testMail } from "../utils/maller.js"
import moment from "moment"
const {
  Userconfig,
  Doctors,
  Userverification,
  User,
  Role,
  Permission,
  Clinics,
  sequelize,
  Sequelize,
} = db

const validateUserService = async (req, refresh_id = false) => {
  const { body } = req
  const { email, password } = body

  let condition = {}

  if (email || password) {
    condition = {
      email: email,
      password: password,
    }
  }

  if (refresh_id) {
    condition = {
      user_id: refresh_id,
    }
  }

  try {
    const res = await User.findOne({
      attributes: { exclude: ["role", "created_at", "updated_at"] },
      where: condition,
      include: [
        {
          model: Role,
          as: "user_role",
          attributes: ["name"],
          include: [
            {
              model: Permission,
              as: "role_permissions",
              attributes: [
                "permission_id",
                "name",
                "module_name",
                "is_accessable",
                "is_creatable",
                "is_readable",
                "is_writable",
                "is_deletable",
              ],
            },
          ],
        },
        {
          model: Userconfig,
          as: "config",
        },
        {
          model: Clinics,
          attributes: [
            "id",
            "client_id",
            "clinic_name",
            "doctor_code",
            "address",
            "email",
            "phone",
            "time_zone",
            "zip_code",
            "created_at",
            "status",
          ],
        },
      ],
    })
    return res
  } catch (e) {
    // console.log(e)
    return e
  }
}

async function generateRandomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const newRegistrationService = async (req, isCallFromDocService = false) => {
  const transaction = await sequelize.transaction()
  try {
    const { body } = req
    const password = await generateRandomString(12)
    const token = await generateRandomString(72)
    const code = await generateRandomString(6)

    const obj = {
      name: body.name,
      clinic_id: body.clinic_id,
      client_id: body.client_id || null,
      doc_code: code,
      mobile: body.mobile,
      email: body.email,
      role: body.role || 1,
      password: password,
    }

    // Mail options
    const mailOptions = {
      from: "support@oralstop.com",
      to: body.email,
      subject: "Your Login Details – OPD",
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #2c3e50;">👋 Welcome to CatchySystem!</h2>
                <p>Dear User,</p>
                <p>We are excited to have you on board. Below are your login credentials:</p>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>Login URL:</strong> <a href="${process.env.APP_BASE_URL}/login" target="_blank">${process.env.APP_BASE_URL}/login</a></p>
                    <p><strong>Email:</strong> ${body.email}</p>
                    <p><strong>Password:</strong> ${password}</p>
                </div>
            
                <p><strong>🔐 For security reasons, please change your password after logging in.</strong></p>
            
                <h3 style="color: #2c3e50;">✅ Verify Your Email</h3>
                <p>To complete your registration, please verify your email address by clicking the button below:</p>
            
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.APP_BASE_URL}/verify?token=${token}"
                    style="background-color: #3498db; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold;">
                    Verify Email
                    </a>
                </div>
            
                <p>If you did not request this account, please ignore this email or contact our support.</p>
            
                <p>Best regards,<br/>Team CatchySystem</p>
                <hr style="margin: 30px 0;"/>
                <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply directly to this email.</p>
            </div>
            `,
    }

    const user = await User.create(obj, { transaction })

    if (user) {
      const UserverificationData = {
        _datetime: moment().tz(req.timezone).format("YYYY-MM-DD HH:mm:ss"),
        client_id: user?.user_id,
        token: token,
        ip_address: "",
      }

      await Userverification.create(UserverificationData, { transaction })
      if (!isCallFromDocService) {
        const docData = {
          code: code,
          name: body.name,
          mobile: body.mobile,
          email: body.email,
          client_id: user?.user_id,
        }
        const doc = await Doctors.create(docData, { transaction })

        if (obj.role == 1) {
          await Userconfig.create({ user_id: user?.user_id }, { transaction })
        }

        await User.update(
          { client_id: body.client_id },
          {
            where: { user_id: user?.user_id },
            transaction,
          }
        )
      }
      await transaction.commit()
      testMail(mailOptions)
      return true
    }
  } catch (e) {
    await transaction.rollback()
    console.log(e)
    return e
  }
}

/**
 *  Get Password by Email
 * @param {*} email
 * @returns
 */
async function getPasswordByEmail(email) {
  return await User.findOne({
    attributes: ["password", "user_id"],
    where: {
      email: email,
    },
  })
}

/**
 *  Resend Verification Mail
 * @param req
 * @returns
 */
const resendVerificationmailService = async req => {
  const transaction = await sequelize.transaction()
  try {
    const { email } = req.query
    if (!email) {
      throw new Error("Email is required")
    }

    const pwd = await getPasswordByEmail(email)
    if (!pwd) {
      throw new Error("User not found")
    }

    const token = await generateRandomString(72)

    // Update existing verification records
    await Userverification.update(
      { status: 1 },
      {
        where: { client_id: pwd.user_id },
        transaction,
      }
    )

    // Create new verification record
    const UserverificationData = {
      _datetime: moment().tz(req.timezone).format("YYYY-MM-DD HH:mm:ss"),
      client_id: pwd.user_id,
      token: token,
      ip_address: req.ip || "",
    }
    await Userverification.create(UserverificationData, { transaction })

    // Mail options
    const mailOptions = {
      from: "support@oralstop.com",
      to: email,
      subject: "Your Login Details – OPD",
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #2c3e50;">👋 Welcome to CatchySystem!</h2>
            <p>Dear User,</p>
            <p>We are excited to have you on board. Below are your login credentials:</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p><strong>Login URL:</strong> <a href="${process.env.APP_BASE_URL}/login" target="_blank">${process.env.APP_BASE_URL}/login</a></p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${pwd.password}</p>
            </div>
        
            <p><strong>🔐 For security reasons, please change your password after logging in.</strong></p>
        
            <h3 style="color: #2c3e50;">✅ Verify Your Email</h3>
            <p>To complete your registration, please verify your email address by clicking the button below:</p>
        
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.APP_BASE_URL}/verify?token=${token}"
                style="background-color: #3498db; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold;">
                Verify Email
                </a>
            </div>
        
            <p>If you did not request this account, please ignore this email or contact our support.</p>
        
            <p>Best regards,<br/>Team CatchySystem</p>
            <hr style="margin: 30px 0;"/>
            <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply directly to this email.</p>
            </div>
            `,
    }

    await testMail(mailOptions)
    await transaction.commit()
    return { success: true, message: "Verification email sent successfully" }
  } catch (error) {
    await transaction.rollback()
    console.error("Error in resendVerificationmailService:", error)
    return {
      success: false,
      message: error.message || "Failed to send verification email",
    }
  }
}

/**
 *  Verification Mail
 * @param req
 * @returns
 */
const isWithinLast24Hours = inputDate => {
  const now = moment().tz(req.timezone)
  const date = moment(inputDate).tz(req.timezone)
  const diffInHours = now.diff(date, "hours")

  return diffInHours < 24
}

const verificationMailService = async req => {
  const { token } = req.query
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress

  if (!token) {
    return { success: false, message: "Invalid or expired token" }
  }

  const userverification = await Userverification.findOne({
    where: {
      token: token,
      status: 0,
    },
  })

  if (!userverification || !isWithinLast24Hours(userverification?._datetime)) {
    return { success: false, message: "Invalid or expired token" }
  }

  await Userverification.update(
    { status: 1, ip_address: ip },
    { where: { token: token } }
  )
  await User.update(
    { is_verified: 1 },
    { where: { user_id: userverification?.client_id } }
  )

  return { success: true, message: "Email verified successfully" }
}

const checkVerifiedAccountService = async req => {
  const { tokendata } = req

  const res = await User.findOne({
    where: {
      user_id: tokendata?.user_id,
    },
  })

  if (res?.is_verified === 1) {
    return { success: 1, message: "Account verified successfully" }
  } else if (res?.is_verified === 2) {
    return { success: 2, message: "Account blocked.!" }
  } else {
    return { success: 0, message: "Account not verified" }
  }
}

export {
  checkVerifiedAccountService,
  validateUserService,
  newRegistrationService,
  resendVerificationmailService,
  verificationMailService,
}
