import cookieHelper from "helpers/getCookieData";
import React, { useEffect } from "react"
import MetaTags from 'react-meta-tags';
import {
  Container,
} from "reactstrap"

const Dashboard = (props) => {
  const clinic = cookieHelper.getCookie('_c') ? JSON.parse(atob(cookieHelper.getCookie('_c'))) : null;
  useEffect(() => {
    if (!clinic) {
      props.history.push("/clinics")
    }
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Dashboard | {process.env.REACT_APP_TITLE}</title>
        </MetaTags>
        <Container fluid>
          <h4>Dashboard</h4>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Dashboard;
