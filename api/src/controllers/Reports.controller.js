/* eslint-disable max-len */
import httpStatus from 'http-status';
import * as response from '../middlewares/response-handler.js';
import { birthdayReportsService, appointmentReportService, appointmentWaitningReportsService, patientgReportsService, doctorsWorkReportsService, patientFilesReportsService, referenceReportsService, followsReportsService } from '../services/Reports.service.js';

const responseHandler = response.default;

const appointmentReports = async (req, res) => {
    try {
        const { query } = req;
        console.log(query);

        const data = await appointmentReportService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const appointmentWaitningReports = async (req, res) => {
    try {
        const { query } = req;
        console.log(query);

        const data = await appointmentWaitningReportsService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const patientgReports = async (req, res) => {
    try {
        const { query } = req;
        // const data = await patientgReportsService(req);
        const data = await patientgReportsService({ query });
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const doctorsWorkReports = async (req, res) => {
    try {
        const { query } = req;
        console.log(query);

        const data = await doctorsWorkReportsService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const patientFilesReports = async (req, res) => {
    try {
        const { query } = req;
        console.log(query);

        const data = await patientFilesReportsService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const referenceReports = async (req, res) => {
    try {
        const data = await referenceReportsService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const birthdayReports = async (req, res) => {
    try {
        const { query } = req;
        console.log(query);

        const data = await birthdayReportsService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const followsReports = async (req, res) => {
    try {
        const { query } = req;
        console.log(query);

        const data = await followsReportsService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

export { followsReports, appointmentReports, appointmentWaitningReports, patientgReports, doctorsWorkReports, patientFilesReports, referenceReports, birthdayReports };
