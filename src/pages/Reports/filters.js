import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { get } from "helpers/api_helper";
import Select from "react-select";
import Flatpickr from "react-flatpickr";

import "flatpickr/dist/themes/material_red.css";
import "./custom.css";

import Timezone from "../utils/timezone";
import { PATIENT_URL } from "helpers/url_helper";

const status = [
  { label: "All", value: "" },
  { label: "Waiting", value: "Waiting" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "Engaged", value: "Engaged" },
  { label: "Missed", value: "Missed" },
];

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const doctorWiseOptions = [
  { label: "Treatment Wise", value: "Treatment Wise" },
  { label: "Bill Wise", value: "Bill Wise" },
  { label: "Payment Wise", value: "Payment Wise" },
];

const referrerTypes = [
  { label: "Doctor", value: "Doc" },
  { label: "Patient", value: "P" },
  { label: "Other", value: "O" },
];

const patientDocumentTypes = [
  { label: "All", value: "All" },
  { label: "Testimonials", value: "Testimonials" },
  { label: "Scanned Images", value: "Scanned Images" },
  { label: "Patient Reports", value: "Patient Reports" },
];

const Filters = ({ hasFilter, callBack }) => {
  const [filterData, setFilterData] = useState({
    dates: [Timezone(new Date()), Timezone(new Date())],
    registrationRange: [Timezone(new Date()), Timezone(new Date())],
    birthdayRange: [Timezone(new Date()), Timezone(new Date())],

    patient_id: null,
    doctor_code: null,
    status: "",
    status_option: null,
    gender: "",
    gender_option: null,
    communication_group: [],
    communication: "",

    referenceSourceTypes: [],
    reference: "",
    referrerType: null,
    referrerTypeValue: "",
    referrerBy: null,

    docWiseOption: "",
    doctorWiseOptions: null,
    patientDocumentType: "",
    patientDocumentTypes: null,

    daterange: "",
    dobdaterange: "",
  });

  const [options, setOptions] = useState({
    doctors: [],
    patients: [],
    communication: [],
    reference: [],
    status,
  });

  // Fetch dropdown options
  const fetchOptions = async () => {
    const promises = [];

    if (hasFilter?.doctor || filterData?.referrerTypeValue === "Doc") {
      promises.push(
        get(`${PATIENT_URL}/options?_type=doctors&optionType=1`).then((res) => ({
          key: "doctors",
          res,
        }))
      );
    }

    if (hasFilter?.patient || filterData?.referrerTypeValue === "P") {
      promises.push(
        get(`${PATIENT_URL}/options?_type=patients`).then((res) => ({
          key: "patients",
          res,
        }))
      );
    }

    if (hasFilter?.communication) {
      promises.push(
        get(`${PATIENT_URL}/options?_type=communicationGroup`).then((res) => ({
          key: "communication",
          res,
        }))
      );
    }

    if (hasFilter?.referrerTypes) {
      promises.push(
        get(`${PATIENT_URL}/options?_type=referenceType`).then((res) => ({
          key: "reference",
          res,
        }))
      );
    }

    if (!promises.length) return;

    const results = await Promise.all(promises);

    results.forEach(({ key, res }) => {
      if (res?.success) {
        setOptions((prev) => ({ ...prev, [key]: res.body }));
      }
    });
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  // Sync multi-selects to comma-separated values
  useEffect(() => {
    setFilterData((prev) => ({
      ...prev,
      reference: prev?.referrerTypes?.map((v) => v.value).join(",") || "",
      communication: prev?.communication_group?.map((v) => v.value).join(",") || "",
    }));
  }, [filterData?.referrerTypes, filterData?.communication_group]);

  const isMore = Object.keys(hasFilter).length > 4;

  const onDateChange = (key) => (selectedDates) => {
    const mapped = selectedDates.map((d) => Timezone(d));
    setFilterData((prev) => ({
      ...prev,
      [key]: mapped,
      [`${key}String`]: mapped.join(","),
    }));
  };

  return (
    <Row style={{ marginBottom: "-16px" }}>
      <Col>
        <Card>
          <CardBody>
            <Row>
              {/* Main Filters */}
              {hasFilter?.date && (
                <Col md={3} className={isMore ? "mt-2" : ""}>
                  <label>Date</label>
                  <Flatpickr
                    className="form-control"
                    value={filterData.registrationRange}
                    options={{ altInput: true, mode: "range", dateFormat: "Y-m-d" }}
                    onChange={onDateChange("registrationRange")}
                  />
                </Col>
              )}

              {hasFilter?.patient && (
                <Col md={3} className={isMore ? "mt-2" : ""}>
                  <label>Patient</label>
                  <Select
                    isClearable
                    options={options.patients}
                    value={options.patients.find((x) => x.value === filterData.patient_id) || null}
                    onChange={(selected) =>
                      setFilterData((prev) => ({ ...prev, patient_id: selected?.value || null }))
                    }
                  />
                </Col>
              )}

              {hasFilter?.doctor && (
                <Col md={3} className={isMore ? "mt-2" : ""}>
                  <label>Doctor</label>
                  <Select
                    isClearable
                    options={options.doctors}
                    value={options.doctors.find((x) => x.value === filterData.doctor_code) || null}
                    onChange={(selected) =>
                      setFilterData((prev) => ({ ...prev, doctor_code: selected?.value || null }))
                    }
                  />
                </Col>
              )}

              {hasFilter?.status && (
                <Col md={3} className={isMore ? "mt-2" : ""}>
                  <label>Status</label>
                  <Select
                    isClearable
                    options={status}
                    value={filterData.status_option}
                    onChange={(selected) =>
                      setFilterData((prev) => ({
                        ...prev,
                        status_option: selected,
                        status: selected?.value || "",
                      }))
                    }
                  />
                </Col>
              )}

              {hasFilter?.genderOptions && (
                <Col md={3} className={isMore ? "mt-2" : ""}>
                  <label>Gender</label>
                  <Select
                    isClearable
                    options={genderOptions}
                    value={genderOptions.find((x) => x.value === filterData.gender) || null}
                    onChange={(selected) =>
                      setFilterData((prev) => ({
                        ...prev,
                        gender: selected?.value || "",
                        gender_option: selected,
                      }))
                    }
                  />
                </Col>
              )}

              {hasFilter?.birthdayRange && (
                <Col md={3} className={isMore ? "mt-2" : ""}>
                  <label>Birthday</label>
                  <Flatpickr
                    className="form-control"
                    value={filterData.birthdayRange}
                    options={{ altInput: true, mode: "range", dateFormat: "Y-m-d" }}
                    onChange={onDateChange("birthdayRange")}
                  />
                </Col>
              )}

              {hasFilter?.communication && (
                <Col md={3} className={isMore ? "mt-2" : ""}>
                  <label>Communication Group</label>
                  <Select
                    isMulti
                    isClearable
                    options={options.communication}
                    value={filterData.communication_group}
                    onChange={(selected) =>
                      setFilterData((prev) => ({ ...prev, communication_group: selected || [] }))
                    }
                  />
                </Col>
              )}

              {hasFilter?.doctorWiseOption && (
                <Col md={3} className={isMore ? "mt-2" : ""}>
                  <label>Doctor Wise</label>
                  <Select
                    isClearable
                    options={doctorWiseOptions}
                    value={doctorWiseOptions.find((x) => x.value === filterData.docWiseOption) || null}
                    onChange={(selected) =>
                      setFilterData((prev) => ({
                        ...prev,
                        doctorWiseOptions: selected,
                        docWiseOption: selected?.value || "",
                      }))
                    }
                  />
                </Col>
              )}

              {hasFilter?.patientDocumentTypes && (
                <Col md={3} className={isMore ? "mt-2" : ""}>
                  <label>Patient Document</label>
                  <Select
                    isClearable
                    options={patientDocumentTypes}
                    value={
                      patientDocumentTypes.find((x) => x.value === filterData.patientDocumentType) ||
                      null
                    }
                    onChange={(selected) =>
                      setFilterData((prev) => ({
                        ...prev,
                        patientDocumentTypes: selected,
                        patientDocumentType: selected?.value || "",
                      }))
                    }
                  />
                </Col>
              )}

              {hasFilter?.referrerTypes && (
                <Col md={3} className={isMore ? "mt-2" : ""}>
                  <label>Reference Source</label>
                  <Select
                    isClearable
                    options={referrerTypes}
                    value={referrerTypes.find((x) => x.value === filterData.referrerTypeValue) || null}
                    onChange={(selected) =>
                      setFilterData((prev) => ({
                        ...prev,
                        referrerType: selected,
                        referrerTypeValue: selected?.value || "",
                        referrerBy: null, // reset dependent field
                      }))
                    }
                  />
                </Col>
              )}

              {/* Dependent referrer selects */}
              {filterData?.referrerTypeValue === "P" && (
                <Col md={3} className={isMore ? "mt-2" : ""}>
                  <label>Reference By (Patient)</label>
                  <Select
                    isClearable
                    options={options.patients}
                    value={options.patients.find((x) => x.value === filterData.referrerBy) || null}
                    onChange={(selected) =>
                      setFilterData((prev) => ({
                        ...prev,
                        referrerBy: selected?.value || null,
                      }))
                    }
                  />
                </Col>
              )}

              {filterData?.referrerTypeValue === "Doc" && (
                <Col md={3} className={isMore ? "mt-2" : ""}>
                  <label>Reference By (Doctor)</label>
                  <Select
                    isClearable
                    options={options.doctors}
                    value={options.doctors.find((x) => x.value === filterData.referrerBy) || null}
                    onChange={(selected) =>
                      setFilterData((prev) => ({
                        ...prev,
                        referrerBy: selected?.value || null,
                      }))
                    }
                  />
                </Col>
              )}

              <Col style={{ marginTop: isMore ? "14px" : "8px" }}>
                <button
                  className="btn btn-primary mt-4"
                  style={{ width: "160px" }}
                  onClick={() => callBack(filterData)}
                >
                  Filter Data
                </button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Filters;