import { useState } from 'react';
import '../src/css/style.css';
import './App.css';
import HomeLayout from './component/HomeLayout';
import Body from './component/Body';
import { BrowserRouter, Router, Routes, Route } from 'react-router-dom';
import LoadChangeReg from './component/loadChange/LoadChangeReg';
import ShowAndUpdateDetails from './component/loadChange/ShowAndUpdateDetails';
import NameTransferReg from './component/nameTransfer/NameTransferReg';
import GreenTariffReg from './component/greenTraiff/GreenTariffReg';
import LoadChangePay from './component/loadChange/LoadChangePay';
import BillDeskPayment from './component/BillDesk/BillDeskPayment';
import DashboardLayout from './component/Dashboard/DashboardLayout';
import ApplicationStatus from './component/Dashboard/ApplicationStatus';
import ApplicantStatus from './component/Dashboard/UserDashboard/ApplicantStatus';
// import TrackApplicationStatus from './component/loadChange/TrackApplicationStatus';
import Login from './component/Login/Login';
import PaddingApplication from './component/Dashboard/PaddingApplication';
import ApplicantPaddingApplication from './component/Dashboard/UserDashboard/ApplicantPaddingApplication';
import LoadSanction from './component/Dashboard/LoadSanction';
import LoadSurvey from './component/Dashboard/LoadSurvey';
import LoadDemandNote from './component/Dashboard/LoadDemandNote';
import LoadAgreement from './component/Dashboard/LoadAgreement';
import LoadChangeInstruction from './component/loadChange/LoadChangeInstruction';
import SuccessRespones from './component/newComponents/SuccessRespones';
import UserSuccessResponse from './component/newComponents/UserSuccessResponse';


import LoadCommissioningPermission from "./component/Dashboard/LoadCommissioningPermission"
import LoadCommissioning from "./component/Dashboard/LoadCommissioning"
import TranscoApproval from "./component/Dashboard/TranscoApproval"
import LoadDemandNotePayment from './component/Dashboard/UserDashboard/LoadDemandNotePayment';

import {
  TrackApplicationStatus, LoadRegistrationFeePayment, LoadResubmission, RegistrationPayment, LoadConnectionServed,
  LoadWorkCompletionAndMeterIssuing, SearchApplicantDetailsPDF, Download,
} from "./component/importComponents"
import PendingForForwardToEDCRA from './component/Dashboard/PendingForForwardToEDCRA';
import PendingForTranscoApproval from './component/Dashboard/PendingForTranscoApproval';
import Dummy from './component/Dummy';
import BayRequiredAccept from './component/Dashboard/BayRequiredAccept';


function App() {
//   console.log(import.meta.env.MODE,'App js MODE')
//   console.log(import.meta.env,'App js ENVVVVVVVVVVVVVVVVVVVVVV')
//  console.log( import.meta.env.VITE_LOAD_CHANGE_BASE_URL,'MMMMMMMMMMMMMMMMMMMMMMM')
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Body />} />
            <Route path="/NewServiceConnection" element={<LoadChangeReg />} />
            <Route path="/ht-load-change/" element={<LoadChangeInstruction />} />
            <Route path="/dummy/:empId" element={<Dummy />} />
            <Route
              path="/ht-load-change/consumer-registration/:consumerId"
              element={<LoadChangeReg />}
            />
            <Route path="/ht-load-change/update/:application_no" element={<LoadChangeReg />} />
            <Route path="/ht-load-change/Details" element={<LoadChangePay />} />
            <Route
              path="/ht-load-change/pay-by-online/:application_no"
              element={<BillDeskPayment />}
            />
            <Route path="/NameTransfer" element={<NameTransferReg />} />
            <Route path="/GreenTariff" element={<GreenTariffReg />} />
            <Route
              path="/department-login"
              element={<Login login_by="Department" label="Employee Id" />}
            />
            <Route
              path="/applicant-login"
              element={<Login login_by="Applicant" label="Application No" />}
            />
            <Route
              path="/track-application"
              element={<TrackApplicationStatus />}
            />
            <Route
              path="ht-load-change/track_application_status"
              element={<TrackApplicationStatus />}
            />
            <Route path="ht-load-change/payment/:id" element={<RegistrationPayment />} />
          </Route>
          {/* 🆕 Dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<ApplicationStatus />} />
            <Route path="/dashboard/padding_application" element={<PaddingApplication />} />
            <Route path="/dashboard/pending_for_registration_fee_payment/:id" element={<LoadRegistrationFeePayment />} />
            <Route path="/dashboard/pending_for_application_resubmission/:id" element={<LoadResubmission />} />
            <Route path="/dashboard/pending_for_load_sanction/:id" element={<LoadSanction />} />
            <Route path="/dashboard/pending_for_survey/:id" element={<LoadSurvey />} />
            <Route path="/dashboard/pending_for_agreement_finalization/:id" element={<LoadAgreement />} />
            <Route path="/dashboard/pending_for_second_demand_note_generation/:id" element={<LoadDemandNote />} />
            <Route path="/dashboard/pending_for_demand_note_payment/:id" element={<LoadDemandNotePayment />} />
            <Route path="/dashboard/pending_for_transco_approval/:id" element={<PendingForTranscoApproval />} />
            <Route path="/dashboard/pending_for_forwarding_to_EDCRA/:id" element={<PendingForForwardToEDCRA />} />
            <Route path="/dashboard/pending_for_work_completion_certifying_&_issuing_of_meter/:id" element={<LoadWorkCompletionAndMeterIssuing />} />
            <Route path="/dashboard/pending_for_bay_required/:id" element={<BayRequiredAccept />} />
            <Route path="/dashboard/pending_for_commissioning_permission/:id" element={<LoadCommissioningPermission />} />
            <Route path="/dashboard/pending_for_commissioning/:id" element={<LoadCommissioning />} />
            <Route path="/dashboard/connection_served/:id" element={<LoadConnectionServed />} />

            <Route path="/dashboard/success_respones" element={<SuccessRespones />} />
            <Route path="/dashboard/respones/:id" element={<SuccessRespones />} />
            <Route path="/dashboard/download_pdf" element={<SearchApplicantDetailsPDF />} />
            <Route path="/dashboard/download" element={< Download />} />
          </Route>
          <Route path="/user-dashboard" element={<DashboardLayout />}>
            <Route index element={<ApplicantStatus />} />
         <Route
    path="success-respones/:id"
    element={<UserSuccessResponse />}
  />

            <Route path="/user-dashboard/pending_for_registration_fee_payment/:id" element={<LoadRegistrationFeePayment />} />
            <Route path="/user-dashboard/pending_for_application_resubmission/:id" element={<LoadResubmission />} />
            <Route path="/user-dashboard/pending_for_demand_note_payment/:id" element={<LoadDemandNotePayment />} />
            {/* <Route path="/user-dashboard/pending_for_agreement_finalization/:id" element={<LoadAgreement/>}/> */}
            {/* <Route
              path="/user-dashboard/applicant-padding-application"
              element={<ApplicantPaddingApplication />}
            /> */}
          </Route>
        </Routes>
      </BrowserRouter>
      
    </>
  );
}
export default App;
