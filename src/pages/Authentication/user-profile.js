import MetaTags from "react-meta-tags"
import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Media,
  Button,
} from "reactstrap"
import { AvForm, AvField } from "availity-reactstrap-validation"
import { useSelector, useDispatch } from "react-redux"
import { withRouter } from "react-router-dom"
import Breadcrumb from "../../components/Common/Breadcrumb"
import avatar from "../../assets/images/logos/2.png"
import { editProfile, resetProfileFlag } from "../../store/actions"
import cookieHelper from "helpers/getCookieData"
import { post } from "helpers/api_helper"

const UserProfile = () => {
  const dispatch = useDispatch()

  const { error, success } = useSelector(state => ({
    error: state.Profile.error,
    success: state.Profile.success,
  }))

  const [profile, setProfile] = useState(null)
  const [password, setPassword] = useState(null)

  useEffect(() => {
    const authUser = cookieHelper.getCookie("authUser")

    if (authUser) {
      const user = JSON.parse(authUser)
      setProfile(user.user)
    }

    if (success) {
      setTimeout(() => dispatch(resetProfileFlag()), 3000)
    }
  }, [dispatch, success])

  const handleValidSubmit = (_, values) => {
    dispatch(editProfile(values))
  }

  const handleUpdatePassword = async () => {
    const newObj = {
      id: profile?.user_id,
      password: password?.password,
    }

    console.log(password)

    if (password?.password === password?.conf_password) {
      console.log("Password Update Obj:", newObj)
      const { success, data } = await post("/v1/auth/update-password", newObj)
      if (success) {
        console.log(success)
      }
    } else {
      alert("Password and Confirm Password must be same")
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Profile</title>
        </MetaTags>

        <Container fluid>
          <Breadcrumb title="Oralstop" breadcrumbItem="Profile" />

          <Row>
            <Col lg="12">
              {error && <Alert color="danger">{error}</Alert>}
              {success && <Alert color="success">{success}</Alert>}

              <Card>
                <CardBody>
                  <Media>
                    <div className="me-3">
                      <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>

                    <Media body className="align-self-center">
                      <div className="text-muted">
                        <h5>{profile?.user_name}</h5>
                        <p className="mb-1">{profile?.email}</p>
                        <p className="mb-0">ID: #{profile?.doc_code}</p>
                      </div>
                    </Media>
                  </Media>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Update Password</h4>

          <Card>
            <CardBody>
              <AvForm onValidSubmit={handleValidSubmit}>
                <Row>
                  <Col md="6">
                    <AvField
                      name="password"
                      label="Password"
                      value={password?.password || ""}
                      type="password"
                      onChange={e =>
                        setPassword(p => ({ ...p, password: e.target.value }))
                      }
                      placeholder="Enter New Password"
                    />
                  </Col>

                  <Col md="6">
                    <AvField
                      name="con_password"
                      label="Confirm Password"
                      value={password?.conf_password || ""}
                      type="password"
                      onChange={e =>
                        setPassword(p => ({
                          ...p,
                          conf_password: e.target.value,
                        }))
                      }
                      placeholder="Enter Confirm Password"
                    />
                  </Col>
                </Row>

                {/* <AvField name="uid" type="hidden" value={profile.uid || null} /> */}

                <div className="text-center mt-4">
                  <Button
                    color="danger"
                    type="button"
                    onClick={handleUpdatePassword}
                  >
                    Save Changes
                  </Button>
                </div>
              </AvForm>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(UserProfile)
