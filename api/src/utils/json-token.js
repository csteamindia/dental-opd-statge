import fs from 'fs/promises';
import jwt from 'jsonwebtoken';

const privateKeyPath = 'crets/private.pem'
const privateKey = await fs.readFile(privateKeyPath, 'utf8');
import { validateUserService } from '../services/Auth.service.js';

export const generateAccessToken = (data) => {
  try {
    data = JSON.parse(JSON.stringify(data));
    return jwt.sign(data, privateKey, { expiresIn: '1d', algorithm: 'RS256' }); // Adjust the expiration time as needed
  } catch (error) {
    console.error('Error during token generation:', error);
  }
}

export const generateRefreshToken = (data) => {
  data = JSON.parse(JSON.stringify(data));
  return jwt.sign(data, privateKey, { expiresIn: '7d', algorithm: 'RS256' }); // Adjust the expiration time as needed
}

export const validateAccessToken = (token, res) => {
  // const newToken = token?.replace(/^Bearer\s/, '');
  const newToken = token;
  return jwt.verify(newToken, privateKey, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(403).json({ message: 'Invalid token' });
    }
    return user
  });
};

// /old code
export const validateRefreshToken = (req, res, next) => {
  let token = req.body.refreshtoken;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  jwt.verify(token, privateKey, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired' });
      }
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    if (user.hasOwnProperty('iat')) {
      delete user.iat;
    }

    if (user.hasOwnProperty('exp')) {
      delete user.exp;
    }

    req.tokendata = user;
    next();
  });
};


export const verifyToken = async (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    if (!accessToken) {
      return res.status(httpStatus.UNAUTHORIZED).send(responseHandler('Access token not found', false));
    }

    try {
      // Verify access token
      const decoded = jwt.verify(accessToken, privateKey);
      req.user = decoded;
      return next();
    } catch (error) {
      // Access token expired, try refresh token
      if (!refreshToken) {
        return res.status(httpStatus.UNAUTHORIZED).send(responseHandler('Refresh token not found', false));
      }

      try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, privateKey);

        // Generate new access token
        const newAccessToken = await generateAccessToken(decoded);

        const userData = await validateUserService(req, newAccessToken?.user_id);

        // Set new access token in cookie
        res.cookie('access_token', userData, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
         maxAge: 0.5 * 60 * 1000, // 15 minutes
          sameSite: 'strict'
        });

        req.user = decoded;
        return next();
      } catch (refreshError) {
        return res.status(httpStatus.UNAUTHORIZED).send(responseHandler('Invalid refresh token', false));
      }
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler('Authentication failed', false));
  }
};
