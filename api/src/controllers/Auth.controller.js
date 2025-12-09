/* eslint-disable max-len */
/**
 * location controller
 *
 * @author Praveenumar Yennam
 */
import httpStatus from 'http-status';

import * as response from '../middlewares/response-handler.js';
import { validateUserService, newRegistrationService, resendVerificationmailService, verificationMailService, checkVerifiedAccountService } from '../services/Auth.service.js';
import { generateAccessToken, generateRefreshToken } from '../utils/json-token.js';
import moment from 'moment-timezone';
import { customEncrypt } from '../utils/encryption.js';

/**
 * @constant {function} responseHandler - function to form generic success response
 */
const responseHandler = response.default;

// Create
const newRegistration = async (req, res) => {
  try {
    const data = await newRegistrationService(req);

    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }

    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

const checkVerifiedAccount = async (req, res) => {
  try {
    const data = await checkVerifiedAccountService(req);
    res.status(httpStatus.OK).send(responseHandler(data.message, data.success));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

const resendVerificationmail = async (req, res) => {
  try {
    const data = await resendVerificationmailService(req);

    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }

    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

const verificationMail = async (req, res) => {
  try {
    const data = await verificationMailService(req);

    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }

    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get Clients
const login = async (req, res) => {
  try {
    const data = await validateUserService(req);
    if (data) {
      console.log(data)
      const clinic = JSON.parse(JSON.stringify(data.Clinics))
      const obj = {
        user_id: data.user_id,
        clinic_id: data.clinic_id,
        client_id: clinic.length ? clinic[0].client_id: data.user_id,
        user_name: data.name,
        email: data.email,
        is_verified: data.is_verified,
        role: data.user_role.name,
        config: data.config,
        timezone: 'Asia/Kolkata',
        login_time: moment().tz('Asia/Kolkata').format()
      }

      const permission = customEncrypt(JSON.stringify(data?.user_role?.role_permissions));
      const access_token = await generateAccessToken(obj);
      const refresh_token = await generateRefreshToken(obj);
      const indianTime = moment().tz('Asia/Kolkata');
      // Set cookies
      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000, // 60 minutes
        sameSite: 'strict',
        expires: indianTime.add(60, 'minutes').toDate()
      });

      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'strict',
        expires: indianTime.add(7, 'days').toDate()
      });
      
      return res.status(httpStatus.OK).send(responseHandler({
        user: {...obj, clinic: data.Clinics},
        modules: permission,
        access_token,
        refresh_token
      }));
    }
    res.status(httpStatus.UNAUTHORIZED).send(responseHandler([], false));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

export { newRegistration, login, resendVerificationmail, verificationMail, checkVerifiedAccount };
