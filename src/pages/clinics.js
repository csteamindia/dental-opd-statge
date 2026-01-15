import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
import { Container, Modal, Row, Col } from "reactstrap"
import { get, post } from "../helpers/api_helper"
import { CLINIC_URL, PATIENT_URL } from "helpers/url_helper"
import { showSuccessAlert } from "pages/utils/alertMessages"
import Select from "react-select"
import { timeZones } from "assets/timezones"
import { getConfigData } from "./basic"
import cookieHelper from "helpers/getCookieData"
import { getZoneDateTime } from "./utils/timezone"

const WelcomeClinicScreen = () => {
  const [modalLarge, setModalLarge] = useState(false)
  const [clinics, setClinics] = useState([])
  const [defaultClinic, setDefaultClinic] = useState(null)
  const [formData, setFormData] = useState({})
  const [userData, setUseData] = useState(null)
  const [isVerified, setIsVeriified] = useState(1)
  const [loader, setLoader] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState([])
  const [DDoptions, setDDOptions] = useState([])

  const consfigData = getConfigData()

  const fetchClinics = async () => {
    try {
      setLoader(true)

      const { success } = await get("/auth/check-account-status")
      if (success) {
        setIsVeriified(success)
        if (success == 1) {
          setUseData(consfigData?.user)
          const response = await get(`clinics?_q=${consfigData?.user?.user_id}`)
          if (response?.success) {
            setClinics(response?.body?.items)
            setDefaultClinic(
              response?.body?.items?.find(clinic => clinic.is_default == 1)?.id
            )
          }
        }
      } else {
        setIsVeriified(success)
      }
    } catch (error) {
      console.error("Error fetching clinics:", error)
    } finally {
      setLoader(false)
    }
  }
  useEffect(() => fetchClinics(), [])

  const handleDefaultChange = async (clinicData, e) => {
    const isChecked = e.target.checked
    const res = await get(
      `clinics/defaultclinic?_default=${e.target.checked ? 1 : 0}&clinic_id=${
        clinicData.id
      }&client_id=${clinicData.client_id}`
    )
    if (res.success) {
      setDefaultClinic(isChecked ? clinicData.id : null)
    }
  }

  const handleChnageClinic = async clinicData => {
    cookieHelper.setCookie("_c", btoa(JSON.stringify(clinicData)), 1, 7)
    window.location.href = `https://909dental.oralstop.com/panel/chairs`
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    const res = await post(CLINIC_URL, formData)

    if (res.success) {
      showSuccessAlert("Clinic created successfully!")
      setFormData({})
      toggleModal()
      fetchClinics()
    }
  }

  const loadDocOptions = async () => {
    const { success, body } = await get(`${PATIENT_URL}/options?_type=doctors`) // Fetch patients data
    if (success) {
      setDDOptions(body)
    }
  }

  const toggleModal = () => {
    setModalLarge(!modalLarge)
    loadDocOptions()
    setFormData({})
  }

  if (loader) {
    return (
      <div style={{ marginTop: "-36px" }}>
        <i className="bx bx-error text-danger" style={{ fontSize: "64px" }}></i>
        <h4 className="mt-3">Account Verification Failed</h4>
      </div>
    )
  }

  if (
    (isVerified != 0 && consfigData?.user?.config == 1) ||
    clinics.length == 1
  ) {
    setTimeout(() => {
      handleChnageClinic(clinics[0])
    }, 500)
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Dashboard | {process.env.REACT_APP_TITLE}</title>
        </MetaTags>
        <Container fluid>
          <div className="row">
            {!isVerified ? (
              <div className="row justify-content-center mt-5">
                <div className="col-md-6 text-center">
                  <div className="card">
                    <div className="card-body">
                      <i
                        className="bx bx-envelope-open text-warning"
                        style={{ fontSize: "64px" }}
                      ></i>
                      <h4 className="mt-3">Email Verification Required</h4>
                      <p className="text-muted">
                        Please verify your email address to access the clinic
                        management features. Check your inbox for the
                        verification link.
                      </p>
                      <button
                        className="btn btn-primary mt-3"
                        onClick={async () => {
                          try {
                            const { success } = await get(
                              `auth/resend-verification?email=${userData.email}`
                            )
                            if (success) {
                              showSuccessAlert(
                                "Verification email has been resent!"
                              )
                            }
                          } catch (error) {
                            console.error(
                              "Error resending verification:",
                              error
                            )
                          }
                        }}
                      >
                        <i className="bx bx-mail-send me-1"></i> Resend
                        Verification Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : isVerified == 2 ? (
              <div className="row justify-content-center mt-5">
                <div className="col-md-6 text-center">
                  <div className="card">
                    <div className="card-body">
                      <i
                        className="bx bx-block text-danger"
                        style={{ fontSize: "64px" }}
                      ></i>
                      <h4 className="mt-3">Account Blocked.!</h4>
                      <p className="text-muted">
                        Your account has been blocked. Please contact to
                        administrator.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {consfigData?.user?.config?.clinics < clinics.length && (
                  <div
                    role="button"
                    className="col-sm-6 col-xl-3"
                    key={"add_clinic"}
                  >
                    <div className="card" onClick={toggleModal}>
                      <div className="card-body">
                        <div className="d-flex">
                          <div className="flex-grow-1 overflow-hidden text-center">
                            <i
                              className="bx bx-plus-circle text-primary"
                              style={{ fontSize: "56px" }}
                            ></i>
                            <h5 className="text-truncate font-size-18 py-4">
                              Add <br /> New Clinic
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {clinics?.map((clinic, index) => {
                  return (
                    <div
                      role="button"
                      className="col-sm-6 col-xl-3"
                      key={`CLNIC_${clinic.id}`}
                      onClick={() => handleChnageClinic(clinic)}
                    >
                      <div className="card">
                        <div className="card-body">
                          {/* <input
                            type="checkbox"
                            className="form-check-input"
                            name="is_default"
                            checked={defaultClinic === clinic.id}
                            onChange={e => handleDefaultChange(clinic, e)}
                            style={{ float: "inline-end" }}
                          /> */}
                          <div className="d-flex">
                            <div className="flex-grow-1 overflow-hidden">
                              <h5 className="text-truncate font-size-22">
                                {clinic?.clinic_name}
                              </h5>
                              <p className="text-muted mb-1">
                                {clinic?.doctor?.name}
                              </p>
                              <p className="text-muted mb-1">
                                {clinic?.address}
                              </p>
                              <p className="text-muted mb-1">
                                {clinic?.email} | {clinic?.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-3 border-top">
                          {clinic?.status == 0 ? (
                            <ul className="list-inline mb-0">
                              <li className="list-inline-item me-3">
                                <span className="bg-success badge bg-secondary">
                                  Active
                                </span>
                              </li>
                              <li
                                className="list-inline-item me-3"
                                id="dueDate"
                              >
                                <i className="bx bx-calendar me-1"></i>{" "}
                                {getZoneDateTime(clinic?.created_at)
                                  .add(15, "days")
                                  .format("DD MMM, YYYY")}
                              </li>
                            </ul>
                          ) : (
                            <button className="btn btn-danger btn-sm w-100">
                              Renew
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </Container>
      </div>

      <Modal
        size="md"
        isOpen={modalLarge}
        toggle={toggleModal}
        className="custom-modal"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Clinic</h5>
            <button
              type="button"
              className="btn-close"
              onClick={toggleModal}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <Row className="mt-2">
              <Col>
                <div className="mb-1">
                  <label>Clinic Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Clinic Name"
                    name="clinic_name"
                    value={formData.clinic_name || ""}
                    onChange={handleChange}
                  />
                </div>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col>
                <div className="mb-1">
                  <label>Doctor Name</label>

                  <Select
                    id="doctor"
                    className="basic-single"
                    classNamePrefix="select"
                    options={DDoptions}
                    value={selectedDoc || DDoptions[0]}
                    onChange={selectedOption => {
                      setSelectedDoc(selectedOption)
                      setFormData(prev => ({
                        ...prev,
                        doctor_code: selectedOption?.value,
                      }))
                    }}
                    placeholder="Select Doctor"
                  />
                </div>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col>
                <div className="mb-1">
                  <label>Email</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                  />
                </div>
              </Col>
              <Col>
                <div className="mb-1">
                  <label>Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Phone"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                  />
                </div>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col>
                <div className="mb-1">
                  <label>Address</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Address"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                  />
                </div>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col>
                <div className="mb-1">
                  <label>City</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter City"
                    name="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                  />
                </div>
              </Col>
              <Col>
                <div className="mb-1">
                  <label>State</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter State"
                    name="state"
                    value={formData.state || ""}
                    onChange={handleChange}
                  />
                </div>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col>
                <div className="mb-1">
                  <label>Country</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Country"
                    name="country"
                    value={formData.country || ""}
                    onChange={handleChange}
                  />
                </div>
              </Col>
              <Col>
                <div className="mb-1">
                  <label>Zip Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Zip Code"
                    name="zip_code"
                    value={formData.zip_code || ""}
                    onChange={handleChange}
                  />
                </div>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col>
                <div className="mb-1">
                  <label>Time Zone</label>
                  <select className="form-control" onChange={handleChange}>
                    {timeZones?.map((v, i) => {
                      return (
                        <option key={v.timezone} value={v.offset}>
                          {v.timezone}
                        </option>
                      )
                    })}
                  </select>
                  {/* <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Time Zone"
                    name="time_zone"
                    value={formData.time_zone || ''}
                    
                  /> */}
                </div>
              </Col>
            </Row>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={toggleModal}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Save changes
            </button>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default WelcomeClinicScreen
