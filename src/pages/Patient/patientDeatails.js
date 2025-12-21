import React, { useState, useEffect } from "react"
import MetaTags from "react-meta-tags"
import { Container } from "reactstrap"
import PatientProfile from "./components/profile"
import Tabs from "./components/tabs"
import { useLocation } from "react-router-dom"
import { get } from "helpers/api_helper"
import { PATIENT_VIEW_URL } from "helpers/url_helper"
import { getConfigData } from "pages/basic"

const PatientDetails = () => {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const id = params.get("_p")
  const appId = params.get("appointment")

  const userConfig = getConfigData()
  const role = localStorage.getItem("role").toLowerCase()
  const [patientData, setPatientData] = useState(null)
  const [isPatinetSummary, setIsPatinetSummary] = useState(false)

  const fatchData = async () => {
    const res = await get(`${PATIENT_VIEW_URL}/${id}`)
    if (res.success) {
      setPatientData(res.body)
    }
  }

  useEffect(() => {
    const stateData = location?.state?.patientData

    if (stateData) {
      setPatientData(stateData)
      localStorage.setItem("patientData", JSON.stringify(stateData))
      return
    }

    const saved = localStorage.getItem("patientData")
    let storedData = null

    try {
      storedData = saved ? JSON.parse(saved) : null
    } catch (e) {
      console.warn("Invalid patientData in localStorage", e)
    }

    // If localStorage matches the current ID → use it
    if (storedData?.id === id) {
      setPatientData(storedData)
    } else {
      // Otherwise hit the API
      fatchData()
    }
  }, [location?.state?.patientData, id])

  if (!patientData) {
    return <h1>Loading...</h1>
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Patient | {process.env.REACT_APP_TITLE}</title>
        </MetaTags>
        <Container fluid>
          <h4>Patients Details</h4>
          <PatientProfile
            data={patientData}
            configData={userConfig}
            callback={setIsPatinetSummary}
            appId={appId}
          />
          <Tabs patientData={patientData} configData={userConfig} role={role} />
        </Container>
      </div>
    </React.Fragment>
  )
}

export default PatientDetails
