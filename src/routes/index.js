import React from "react"
import { Redirect } from "react-router-dom"

// Profile
import UserProfile from "../pages/Authentication/user-profile"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

// Dashboard
import Dashboard from "../pages/Dashboard/index"
import Appointment from "../pages/Appointment/index"
import Accounts from "../pages/Accounts/index"
import Patient from "../pages/Patient/index"
import PatientDetails from "../pages/Patient/patientDeatails"
import Settings from "pages/Settings"
import Reports from "pages/Reports"
import WelcomeClinicScreen from "pages/clinics"
import WelcomeChairScreen from "pages/chairs"
import verifyEmail from "pages/verifyEmail"
import PatientSummary from "pages/Patient/components/summary"

// Accounts
import ManagePettyCash from "../pages/Accounts/ManageAccounts/ManagePettyCash"

const authProtectedRoutes = [
  { path: "/clinics", component: WelcomeClinicScreen },
  { path: "/chairs", component: WelcomeChairScreen },
  { path: "/dashboard", component: Dashboard },
  { path: "/appointment", component: Appointment },
  { path: "/accounts", component: Accounts },
  { path: "/patients", component: Patient },
  { path: "/patient", component: PatientDetails },
  { path: "/reports", component: Reports },
  { path: "/settings", component: Settings },
  { path: "/accounts/petty-cash", component: ManagePettyCash },
  { path: "/accounts/billing", component: Settings },
  { path: "/accounts/paymets", component: Settings },
  { path: "/accounts/passbook", component: Settings },
  { path: "/accounts/diposit", component: Settings },
  { path: "/patinet/summary/:id", component: PatientSummary },

  // //profile
  { path: "/profile", component: UserProfile },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/chairs" /> },
]

const publicRoutes = [
  { path: "/verify", component: verifyEmail },
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },
]

export { publicRoutes, authProtectedRoutes }
