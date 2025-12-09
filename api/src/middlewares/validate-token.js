import { validateAccessToken } from '../utils/json-token.js'

export default async (req, res, next) => {
  const { cookies } = req;
  try {
    const token = cookies?.access_token;
    const isValid = await validateAccessToken(token, res)

    if (isValid.user_id) {
      req['tokendata'] = isValid

      if(cookies?._c && atob(cookies?._c) != "undefined"){
        req['clinic'] = JSON.parse(atob(cookies?._c))

        if(req['tokendata']['role'] == 'admin'){
          req.body.client_id = req.tokendata.user_id;
          req.query.client_id = req.tokendata.user_id;
        }

        req.body.client_id = req.tokendata.client_id;
        req.body.clinic_id = req.clinic.id;
        req.body.doctor = req.clinic.doctor_code;
        
        req.query.clinic_id = req?.clinic?.id || '';
        req.query.client_id = req.tokendata.client_id;
        req.query.doctor = req.clinic.doctor_code;
      }
      return next();
    } else {
      return ({ message: 'Unauthorized' });
    }
  } catch (e) {
    return ({ message: 'Unauthorized' });
  }
};
