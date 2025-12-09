/* eslint-disable max-len */
import db from "../models/index.js";
import "dotenv/config";
const { Patient_Follow_Up, Appointment, CommunicationGroup, Files, User, Clinics, Patients, ReferenceTypes, Doctors, Billing, Tretment, Vouchers, Voucher_Transactions, sequelize, Sequelize } = db;
import moment from "moment";

// appointmentReportsService
const appointmentReportService = async (data) => {
    const { clinic_id, dates, status, byDoctor, patient_id, limit, page, search } = data.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null

    const where = { status: 0 };

    if (clinic_id) where.clinic_id = clinic_id;
    if (status != 'All') {
        // where.status = status
        switch (status) {
            case "Waiting":
                where.is_visited = 1
                where.arravel_time = { [Sequelize.Op.not]: null }
                where.attened_time = null
                break;
            case "Scheduled":
                // where.is_visited = 0,
                where.appointment_valid = {
                    [Sequelize.Op.gt]: new Date()
                };
                break;
            case "Completed":
                where.completed_time = { [Sequelize.Op.not]: null }
                break;
            case "Cancelled":
                where.canceled_at = { [Sequelize.Op.not]: null }
                break;
            case "Engaged":
                where.attened_time = { [Sequelize.Op.not]: null }
                break;
            case "Missed":
                where.is_visited = 0;
                where.appointment_valid = {
                    [Sequelize.Op.and]: [
                        { [Sequelize.Op.lt]: new Date() } // current time
                    ]
                };
                break;
        }
    }
    if (byDoctor) where.doctor_code = byDoctor;
    if (patient_id) where.patient_id = patient_id;

    const conditions = {
        where,
        attributes: ["appointment_date", "chair_code", "tretment_code", "notes", "is_visited", "status", "id", "arravel_time", "attened_time", "canceled_at", "canceled_note", "token"],
        include: [
            {
                model: Clinics,
                as: "clinic",
                required: true,
                attributes: ["clinic_name", "doctor_code", "id"],
            }, {
                model: Patients,
                as: "patient",
                attributes: [[Sequelize.fn('CONCAT', Sequelize.col('title'), ' ', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'full_name']],
            }, {
                model: Doctors,
                as: "doctor",
                attributes: ["name"],
            }
        ],
        order: [["appointment_date", "DESC"]],
        limit: parsedLimit,
        offset
    };
    try {
        const res = await Appointment.findAndCountAll(conditions);


        return {
            limit: parsedLimit,
            page: parsedPage,
            ...res,
        };
    } catch (error) {
        console.error("Error fetching appointment reports:", error);
        return { errors: [{ message: "Failed to fetch appointment reports" }] };
    }
}

// appointmentWaitningReportsService
const appointmentWaitningReportsService = async (data) => {
    const { clinic_id, dates, doctor_code, daterange, limit, page, search } = data.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null

    const where = { status: 0, is_visited: 1 };

    if (clinic_id) where.clinic_id = clinic_id;
    if (doctor_code) where.doctor_code = doctor_code;
    if (daterange) where.appointment_date = {
        [Sequelize.Op.between]: daterange.split(',')
    };

    const conditions = {
        where,
        attributes: ["appointment_date", "chair_code", "tretment_code", "notes", "id", "arravel_time", "attened_time", "canceled_at", "canceled_note", "token"],
        include: [
            {
                model: Clinics,
                as: "clinic",
                required: true,
                attributes: ["clinic_name", "doctor_code", "id"],
            }, {
                model: Patients,
                as: "patient",
                attributes: [[Sequelize.fn('CONCAT', Sequelize.col('title'), ' ', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'full_name']],
            }, {
                model: Doctors,
                as: "doctor",
                attributes: ["name"],
            }
        ],
        order: [["appointment_date", "DESC"]],
        limit: parsedLimit,
        offset
    };
    try {
        let res = await Appointment.findAndCountAll(conditions);

        if (res.count !== 0) {
            res.rows = JSON.parse(JSON.stringify(res.rows)).map((row) => {
                const arrTime = row.arravel_time;
                const attTime = row.attened_time;

                // Convert to moment objects
                const start = moment(arrTime);
                const end = attTime ? moment(attTime) : moment(); // Use current time if null

                const duration = moment.duration(end.diff(start));

                // Get hours and minutes
                const hours = Math.floor(duration.asHours());
                const minutes = duration.minutes();

                row.wating_time = `${hours}h ${minutes}m`;
                return row;
            });


            console.log("No waiting appointments found.", res.rows);
        }


        return {
            limit: parsedLimit,
            page: parsedPage,
            ...res,
        };
    } catch (error) {
        console.error("Error fetching appointment reports:", error);
        return { errors: [{ message: "Failed to fetch appointment reports" }] };
    }
}

// patientgReportsService
const patientgReportsService = async (data) => {
    const { clinic_id, patient_id, date, gender, dob, doctor_code, allergies, daterange, dobdaterange, communication, referrerTypeValue, referrerBy, reference, limit, page, search } = data.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null

    const where = { status: 0 };

    if (patient_id) where.id = patient_id;
    if (clinic_id) where.clinic_id = clinic_id;
    if (gender) where.gender = gender;
    if (doctor_code) where.doctor = doctor_code;
    if (date) where.date = date;
    if(referrerTypeValue) where.reference_type = referrerTypeValue;
    if(referrerBy) where.reference = referrerBy;

    if (daterange) where.date = {
        [Sequelize.Op.between]: daterange.split(',')
    };

    if (dobdaterange) where.dob = {
        [Sequelize.Op.between]: dobdaterange.split(',')
    };

    if (communication) {
        const communicationList = communication.split(',').map(val => val.trim());
        where[Sequelize.Op.and] = where[Sequelize.Op.and] || [];

        const orConditions = communicationList.map(val =>
            Sequelize.literal(`JSON_CONTAINS(communication_group, '["${val}"]')`)
        );
        where[Sequelize.Op.and].push({ [Sequelize.Op.or]: orConditions });
    }

    if (reference) {
        const referrerTypesList = reference.split(',').map(val => val.trim());
        where[Sequelize.Op.and] = where[Sequelize.Op.and] || [];

        const orConditions = referrerTypesList.map(val =>
            Sequelize.literal(`JSON_CONTAINS(reference_type, '["${val}"]')`)
        );
        where[Sequelize.Op.and].push({ [Sequelize.Op.or]: orConditions });
    }


    const conditions = {
        where,
        attributes: [
            [Sequelize.fn('CONCAT', Sequelize.col('title'), ' ', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'full_name'],
            'case_no', 'dob', 'mobile', "email", 'city', "zip_code", "date", "gender", "dob", "communication_group", "reference_type"],
        include: [
            {
                model: Clinics,
                as: "clinic",
                required: true,
                attributes: ["clinic_name", "doctor_code", "id"],
            }, {
                model: Doctors,
                as: "doctors",
                attributes: ["name"],
            }
        ],
        order: [["id", "DESC"]],
        limit: parsedLimit,
        offset
    };
    try {
        const res = await Patients.findAndCountAll(conditions);

        if (res.count !== 0) {
            // Convert rows and map asynchronously
            const parsedRows = JSON.parse(JSON.stringify(res.rows));

            res.rows = await Promise.all(
                parsedRows.map(async (row) => {
                    // Parse JSON field
                    const CG = row.communication_group ? JSON.parse(row.communication_group) : [];

                    // Fetch matching communication groups, if needed
                    const CGRes = await CommunicationGroup.findAll({
                        attributes: ["title"],
                        where: {
                            id: {
                                [Sequelize.Op.in]: CG.map(c => c),
                            }
                        }
                    });

                    row.communication_group = CGRes.map(cg => cg.title).join(", ");
                    return row;
                })
            );
            // console.log("Waiting appointments found.", res.rows);
        }

        return {
            limit: parsedLimit,
            page: parsedPage,
            ...res,
        };
    } catch (error) {
        console.error("Error fetching appointment reports:", error);
        return { errors: [{ message: "Failed to fetch appointment reports" }] };
    }
}

// doctorsWorkReportsService
const doctorsWorkReportsService = async (data) => {
    const { clinic_id, date, doctor_code, daterange, limit, page, search } = data.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null

    const where = { status: 0 };

    if (clinic_id) where.clinic_id = clinic_id;
    if (doctor_code) where.doctor_code = doctor_code;
    if (date) where.date = date;

    if (daterange) where.created_at = { [Sequelize.Op.between]: daterange.split(',') };

    const conditions = {
        where,
        attributes: [
            'treatment_date', 'treatment_type', 'tooths', 'treatment_cost', "treatment_discount", 'treatment_total_cost', "treatment_status", "is_billed", "billed_date", "treatment_note"],
        include: [
            {
                model: Patients,
                as: "patients",
                required: true,
                attributes: [
                    [Sequelize.fn('CONCAT', Sequelize.col('title'), ' ', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'full_name'],
                    'mobile', "email",
                ],
            }, {
                model: Doctors,
                as: "doctor",
                attributes: ["name"],
            }
        ],
        order: [["id", "DESC"]],
        limit: parsedLimit,
        offset
    };
    try {
        const res = await Tretment.findAndCountAll(conditions);

        if (res.count !== 0) {
            // Convert rows and map asynchronously
            const parsedRows = JSON.parse(JSON.stringify(res.rows));

            res.rows = await Promise.all(
                parsedRows.map(async row => {
                    row.doctor = row.doctor ? row.doctor.name : "N/A";
                    row.patients = row.patients[0];
                    return row;
                })
            );
        }

        return {
            limit: parsedLimit,
            page: parsedPage,
            ...res,
        };
    } catch (error) {
        console.error("Error fetching appointment reports:", error);
        return { errors: [{ message: "Failed to fetch appointment reports" }] };
    }
}

// referenceReportsService
const referenceReportsService = async (data) => {
    const { clinic_id, patient_id, daterange, referrerTypeValue, doctor_code, limit, page, search } = data.query;

    const parsedPage = parseInt(page) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null

    const where = { status: 0 };

    if (clinic_id) where.clinic_id = clinic_id;
    if (referrerTypeValue) where.reference_type = referrerTypeValue;
    if (doctor_code) where.reference = doctor_code;
    if (patient_id) where.reference = patient_id;

    if (daterange) where.date = { [Sequelize.Op.between]: daterange.split(',') };

    const modals = {
        "Doc": {
            model: Doctors,
            as: "ref_doctors",
            attributes: ['name']
        },
        "P": {
            model: Patients,
            as: "ref_patient",
            attributes: [[Sequelize.fn('CONCAT', Sequelize.col('ref_patient.title'), ' ', Sequelize.col('ref_patient.first_name'), ' ', Sequelize.col('ref_patient.last_name')), 'name']]
        },
        "O": {
            model: User,
            as: "ref_client",
            attributes: ['name']
        }
    };

    const conditions = {
        where,
        attributes: [[Sequelize.fn('CONCAT', Sequelize.col('Patients.title'), ' ', Sequelize.col('Patients.first_name'), ' ', Sequelize.col('Patients.last_name')), 'full_name'], 'mobile', "email", 'reference_type', 'reference', 'date', 'id'],
        include: [modals[referrerTypeValue]],
        order: [["id", "DESC"]],
        limit: parsedLimit,
        offset
    };

    const RefType = {
        "Doc": "Doctor",
        "P": "Patient",
        "O": "Other"
    }

    try {
        const res = await Patients.findAndCountAll(conditions);
        if (res.count !== 0) {
            const parsedRows = JSON.parse(JSON.stringify(res.rows));

            res.rows = await Promise.all(
                parsedRows.map(async (row) => {
                    row.reference_type = row.reference_type ? RefType[row.reference_type] : "Self";

                    console.log(row)

                    if (row[modals[referrerTypeValue].as] !== null) {
                        row.reference = row[modals[referrerTypeValue].as].name
                    }
                    delete row[modals[referrerTypeValue].as];

                    return row;
                })
            );
            console.log("References found.", res.rows);
        }

        return {
            limit: parsedLimit,
            page: parsedPage,
            ...res,
        };
    } catch (error) {
        console.error("Error fetching appointment reports:", error);
        return { errors: [{ message: "Failed to fetch appointment reports" }] };
    }
}

// doctorsWorkReportsService
const patientFilesReportsService = async (data) => {
    const { clinic_id, dates, limit, page, search } = data.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null

    const where = { status: 0 };

    if (clinic_id) where.clinic_id = clinic_id;

    const conditions = {
        where,
        attributes: ['file_type', 'file_path', 'description', 'created_at'],
        include: [
            {
                model: Patients,
                as: "patients",
                required: true,
                attributes: [
                    [Sequelize.fn('CONCAT', Sequelize.col('title'), ' ', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'full_name'],
                    'mobile', "email",
                ],
            }
        ],
        order: [["id", "DESC"]],
        limit: parsedLimit,
        offset
    };

    const fileTypeObject = {
        "1": "Testimonials",
        "2": "Scanned Image",
        "3": "Patient Reports",
        "4": "Other"
    };


    try {
        const res = await Files.findAndCountAll(conditions);

        if (res.count !== 0) {
            // Convert rows and map asynchronously
            const parsedRows = JSON.parse(JSON.stringify(res.rows));

            res.rows = await Promise.all(
                parsedRows.map(async (row) => {
                    row.file_path = JSON.parse(row.file_path);
                    row.file_type = fileTypeObject[row.file_type] || "Other";
                    row.patients = row.patients
                    row.created_datetime = row.created_at
                    delete row.created_at; // Remove created_at if not needed

                    return row;
                })
            );
            console.log("Waiting appointments found.", res.rows);
        }

        return {
            limit: parsedLimit,
            page: parsedPage,
            ...res,
        };
    } catch (error) {
        console.error("Error fetching appointment reports:", error);
        return { errors: [{ message: "Failed to fetch appointment reports" }] };
    }
}

// patientReportsService
const birthdayReportsService = async (data) => {
    const { clinic_id, dobdaterange, doctor, patient_id, limit, page, search } = data.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null

    const where = { status: 0 };

    if (clinic_id) where.clinic_id = clinic_id;
    if (doctor) where.doctor = doctor;
    if (patient_id) where.patient_id = patient_id;

    if (dobdaterange) where.dob = {
        [Sequelize.Op.between]: dobdaterange.split(',')
    };



    try {
        const res = await Patients.findAndCountAll({
            where,
            attributes: [
                [Sequelize.fn('CONCAT', Sequelize.col('title'), ' ', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'full_name'],
                'case_no', 'dob', 'mobile', "email"],
            order: [["id", "DESC"]],
            limit: parsedLimit,
            offset
        });

        return {
            limit: parsedLimit,
            page: parsedPage,
            ...res,
        };
    } catch (error) {
        console.error("Error fetching appointment reports:", error);
        return { errors: [{ message: "Failed to fetch appointment reports" }] };
    }
}

const followsReportsService = async (data) => {
    const { clinic_id, date, followup_date, patient_id, daterange, limit, page, search } = data.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null

    const where = { status: 0 };

    if (clinic_id) where.clinic_id = clinic_id;
    if (patient_id) where.patient_id = patient_id;
    if (followup_date) where.followup_date = followup_date;

    if (daterange) where.followup_date = {
        [Sequelize.Op.between]: daterange.split(',')
    };

    try {
        const res = await Patient_Follow_Up.findAndCountAll({
            where,
            attributes: ["id", "followup_date", "remark"],
            include: [
                {
                    model: Patients,
                    as: "patient",
                    attributes: [[Sequelize.fn('CONCAT', Sequelize.col('title'), ' ', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'full_name']],
                },
                {
                    attributes: ["name"],
                    model: User,
                    as: "client",
                }
            ],
            order: [["id", "DESC"]],
            limit: parsedLimit,
            offset
        });


        if (res.count !== 0) {
            // Convert rows and map asynchronously
            const parsedRows = JSON.parse(JSON.stringify(res.rows));

            res.rows = await Promise.all(
                parsedRows.map(async (row) => {
                    row.patient = row.patient?.full_name || 'N/A';
                    row.added_by = row.client?.name || 'N/A';
                    delete row.client;

                    return row;
                })
            );
        }

        return {
            limit: parsedLimit,
            page: parsedPage,
            ...res,
        };
    } catch (error) {
        console.error("Error fetching Follow Up reports:", error);
        return { errors: [{ message: "Failed to fetch Follow Up reports" }] };
    }
}

export { followsReportsService, birthdayReportsService, appointmentReportService, appointmentWaitningReportsService, patientgReportsService, doctorsWorkReportsService, patientFilesReportsService, referenceReportsService };




// const birthdayReportsService = async (data) => {
//     const { clinic_id, dates, doctor, limit, page, search } = data.query;

//     const parsedPage = parseInt(page) || 1;
//     const parsedLimit = limit === "all" ? null : parseInt(limit) || 10;
//     const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

//     const where = { status: 0 };

//     if (clinic_id) where.clinic_id = clinic_id;
//     if (doctor) where.doctor = doctor;

//     // Filter by DOB range
//     if (dates?.length === 2) {
//         where.dob = {
//             [Sequelize.Op.between]: [dates[0], dates[1]]
//         };
//     }

//     // Apply search filter on full name or case number
//     if (search) {
//         where[Sequelize.Op.or] = [
//             Sequelize.where(
//                 Sequelize.fn('CONCAT', Sequelize.col('title'), ' ', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')),
//                 { [Sequelize.Op.like]: `%${search}%` }
//             ),
//             { case_no: { [Sequelize.Op.like]: `%${search}%` } },
//             { mobile: { [Sequelize.Op.like]: `%${search}%` } },
//             { email: { [Sequelize.Op.like]: `%${search}%` } },
//         ];
//     }

//     try {
//         const res = await Patients.findAndCountAll({
//             where,
//             attributes: [
//                 [Sequelize.fn('CONCAT', Sequelize.col('title'), ' ', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'full_name'],
//                 'case_no', 'dob', 'mobile', 'email'
//             ],
//             order: [["id", "DESC"]],
//             limit: parsedLimit,
//             offset
//         });

//         return {
//             limit: parsedLimit,
//             page: parsedPage,
//             ...res,
//         };
//     } catch (error) {
//         console.error("Error fetching birthday reports:", error);
//         return { errors: [{ message: "Failed to fetch birthday reports" }] };
//     }
// };

// followsReportsService