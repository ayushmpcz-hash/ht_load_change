import InputTag from './newComponents/InputTag';
import SelectTag from './newComponents/SelectTag';
import RadioTag from './newComponents/RadioTag.jsx';
import { fetchCtPtData } from '../utils/meRation.js';
import ApplicantBasicDetails from '../component/ApplicantBasicDetails.jsx';
import ApplicantFillDetails from '../component/ApplicantFillDetails.jsx';
import AlertModalBox from '../component/alertModelBox.jsx';
import { SendDataForToken,getNgbToken,getFinalUsingDataToken } from '../utils/newHandlePostApi.js';
import { extractFormValues } from '../utils/extractFormValues.js';
import { toFormData } from '../utils/FormateFormData.js';
import TrackApplicationStatus from './loadChange/TrackApplicationStatus.jsx';
import{sendOtp,sendOtpNew} from'../utils/otpSent.js'
import{verifyOtp,verifyOtpNew} from'../utils/otpVerify.js'
import Button from'./Button.jsx'

// user Dashboard
import LoadRegistrationFeePayment from './Dashboard/UserDashboard/LoadRegistrationFeePayment.jsx'
import LoadResubmission from './Dashboard/UserDashboard/LoadResubmission.jsx'
import RegistrationPayment from './loadChange/RegistrationPayment.jsx'


// officer Dashboard
import LoadConnectionServed from './Dashboard/loadConnectionServed.jsx';
import LoadWorkCompletionAndMeterIssuing from './Dashboard/LoadWorkCompletionAndMeterIssuing.jsx';
import SearchApplicantDetailsPDF from './Dashboard/SearchApplicantDetailsPDF.jsx';
import Download from './Dashboard/download.jsx';




export {
  InputTag,
  SelectTag,
  RadioTag,
  fetchCtPtData,
  ApplicantBasicDetails,
  ApplicantFillDetails,
  AlertModalBox,
  SendDataForToken,
  extractFormValues,
  toFormData,
  TrackApplicationStatus,
  sendOtp,
  verifyOtp,
  sendOtpNew,
  verifyOtpNew,
  Button,
  LoadRegistrationFeePayment,
  LoadResubmission,
  RegistrationPayment,
  LoadConnectionServed,
  getNgbToken,
  getFinalUsingDataToken,
  LoadWorkCompletionAndMeterIssuing,
  SearchApplicantDetailsPDF,
  Download,
};
