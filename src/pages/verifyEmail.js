import React, { useEffect, useState } from "react";
import MetaTags from 'react-meta-tags';
import { Container } from "reactstrap";
import { get } from "../helpers/api_helper";
import { showSuccessAlert } from "pages/utils/alertMessages";
import logo from "assets/images/logos/1.png"

const VerifyEmail = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true); // Loader state
  const [userEmail, setUserEmail] = useState(""); // Optional: used for resend
  const [error, setError] = useState(""); // Optional: used for resend

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      verifyEmailToken(token);
    }
  }, []);

  const verifyEmailToken = async (token) => {
    try {
      const { body :{message, success} } = await get(`auth/verify-email?token=${token}`);
      if (success) {
            setIsVerified(true);
        }else{
          setError(message);
      }
    } catch (error) {
      console.error('Error verifying email:', error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Email Verification | {process.env.REACT_APP_TITLE}</title>
        </MetaTags>
        <Container fluid>
          <div className="row justify-content-center mt-5">
            <div className="col-md-6 text-center">
              <div className="card">
                <div className="card-body">
                  
                  {isVerified == 1 ? (
                    <>
                      <i className="bx bx-check-circle text-success" style={{ fontSize: '64px' }}></i>
                      <h4 className="mt-3">Email Verified Successfully!</h4>
                      <p className="text-muted">Your email has been verified. You can now access all clinic management features.</p>
                      <a href="/login" className="btn btn-success mt-3">
                        <i className="fas fa-arrow-right me-1"></i> Please Login to Access panel
                      </a>
                    </>
                  ) : (
                    error ? (
                      <>
                        <img src={logo} alt="" height="192" /><br />
                        <div style={{marginTop: '-36px'}}>
                            <i className="bx bx-error text-danger" style={{ fontSize: '64px' }}></i>
                            <h4 className="mt-3">Account Verification Failed</h4>
                        </div>
                    </>
                    ): 
                        <>
                            <img src={logo} alt="" height="192" /><br />
                            <div  style={{marginTop: '-36px'}} className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Verifying...</span>
                            </div>
                            <p className="mt-3">Verifying your account...</p>
                        </>
                  )}

                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default VerifyEmail;
