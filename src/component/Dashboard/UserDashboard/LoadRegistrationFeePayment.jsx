// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useLocation, Link } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { ApplicantBasicDetails, InputTag, Button } from '../../importComponents'
// const LoadRegistrationFeePayment = () => {
//   const officerData = useSelector(state => state.user.officerData);
//   console.log(officerData, "officerData")
//   const location = useLocation()
//   const { items } = location.state || {}
//   const { register, setValue, formState: { errors }, } = useForm({
//     defaultValues: items || {}
//   })

//   const [mobileNo] = useState(officerData?.employee_detail.cug_mobile);
//   const [isDisabled, setIsDisabled] = useState(false);
//   setValue('registration_amount', items?.tariff_charges?.total_pay_amount)
//   console.log(items, 'items in Applicant details')
//   return (
//     <>
//       <div>
//         <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//           <div className="card-body px-4 pb-4">
//             <div className="mt-6 overflow-x-auto">
//               <div className="">
//                 {/* <AlertModalBox
//                         open={modalOpen}
//                         onClose={() => setModalOpen(false)}
//                         message={modalMessage}
//                         onConfirm={modalAction}
//                       /> */}
//                 <ApplicantBasicDetails htConsumers={items} register={register} errors={errors} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {officerData?.employee_detail.role !== 3 && (
//           <>

//             <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//               <div className="card-header px-4 py-2 border-b border-gray-300">
//                 <h2 className="text-lg font-bold capitalize ">
//                   HT Load Change {items.application_status_text}
//                 </h2>
//               </div>
//               {/* {items?.tariff_charges?.total_pay_amount && (
//                 <>
//                   <div className="card-body px-4 pb-4">
//                     <div className="">
//                       <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

//                         <InputTag
//                           LName="Registration Amount"
//                           {...register("registration_amount",)}
//                           errorMsg={errors.registration_amount?.message}
//                           disabled={isDisabled}
//                         />
//                         <Link to={`https://htsanyojanuat.mpcz.in:8088/ht-load-change-api/call_lc_regfee/${items?.id}`}><Button label=' Pay Registration Fee'></Button></Link>

//                       </div>
//                     </div>
//                   </div>
//                 </>
//               )} */}
//               {items?.tariff_charges?.total_pay_amount && (
//                 <>
//                   <div className="card-body px-4 pb-4">
//                     <div className="">
//                       <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

//                         <InputTag
//                           LName="Registration Amount"
//                           {...register("registration_amount",)}
//                           errorMsg={errors.registration_amount?.message}
//                           disabled={isDisabled}
//                         />
//                         <Link
//                           to={`/ht-load-change/payment/${items?.id}`}
//                           state={{
//                             result: items,
//                           }}
//                         >
//                           <Button label=' Pay Total Amount'></Button>
//                         </Link>

//                       </div>
//                     </div>
//                   </div>
//                 </>
//               )}

//             </div>
//           </>
//         )}
//       </div>
//     </>

//   );
// };
// export default LoadRegistrationFeePayment;

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ApplicantBasicDetails, InputTag, Button } from '../../importComponents'
import { useDispatch } from "react-redux";
import { setUserData } from "../../../redux/slices/userSlice";

const LoadRegistrationFeePayment = () => {
  const officerData = useSelector(state => state.user.officerData);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const location = useLocation()
  const { items } = location.state || {}
  const { register, setValue, formState: { errors }, } = useForm({
    defaultValues: items || {}
  })

  const [mobileNo] = useState(officerData?.employee_detail.cug_mobile);
  const [isDisabled, setIsDisabled] = useState(false);

  const hasTariffCharges = Boolean(items?.tariff_charges?.total_pay_amount);

  setValue('registration_amount', items?.tariff_charges?.total_pay_amount)
  console.log(items, 'items in Applicant details')
  return (
    <>
      <div>
        <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
          <div className="card-body px-4 pb-4">
            <div className="mt-6 overflow-x-auto">
              <div className="">
                {/* <AlertModalBox
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        message={modalMessage}
                        onConfirm={modalAction}
                      /> */}
                <ApplicantBasicDetails htConsumers={items} register={register} errors={errors} />
              </div>
            </div>
          </div>
        </div>

        {officerData?.employee_detail.role !== 3 && (
          <>

            <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
              <div className="card-header px-4 py-2 border-b border-gray-300">
                <h2 className="text-lg font-bold capitalize ">
                { hasTariffCharges && `HT Load Change ${items.application_status_text}`}
                </h2>

                <div>
                    {/* 🔴 IMPORTANT NOTE (ENGLISH + HINDI) */}
      <div className="mt-4 p-4 border-l-4 border-red-500 bg-red-50 rounded">
        <p className="text-sm text-red-700 font-semibold">
          Important Note:
        </p>
        <p className="text-sm text-red-600 mt-1">
          If the payment has been deducted against the online application, DO
          NOT make same payment further until the deducted amount is refunded.
        </p>

        <p className="text-sm text-red-700 font-semibold mt-3">
          महत्वपूर्ण टीप:
        </p>
        <p className="text-sm text-red-600 mt-1">
          यदि ऑनलाइन आवेदन के विरुद्ध भुगतान काट लिया गया है, तो कटे हुए
          राशि के वापस मिलने तक उसी भुगतान को फिर से न करें।
        </p>
      </div>
                </div>
              </div>
              {/* {items?.tariff_charges?.total_pay_amount && (
                <>
                  <div className="card-body px-4 pb-4">
                    <div className="">
                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                        <InputTag
                          LName="Registration Amount"
                          {...register("registration_amount",)}
                          errorMsg={errors.registration_amount?.message}
                          disabled={isDisabled}
                        />
                        <Link to={`https://htsanyojanuat.mpcz.in:8088/ht-load-change-api/call_lc_regfee/${items?.id}`}><Button label=' Pay Registration Fee'></Button></Link>

                      </div>
                    </div>
                  </div>
                </>
              )} */}
              {hasTariffCharges ? (
                /* ✅ CASE 1: Tariff charges exist */
                <div className="card-body px-4 pb-4">
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <InputTag
                      LName="Registration Amount"
                      {...register("registration_amount")}
                      errorMsg={errors.registration_amount?.message}
                      disabled={isDisabled}
                    />

                    <Link
                      to={`/ht-load-change/payment/${items?.id}`}
                      state={{ result: items }}
                    >
                      <Button label="Pay Total Amount" />
                    </Link>
                  </div>
                </div>
              ) : (
                /* ❌ CASE 2: Tariff charges NOT exist */
                <div className="card-body px-4 pb-4">
                  <div className="mt-6 flex flex-col items-center text-center">

                    <p className="text-red-600 font-semibold mb-4">
                     Application is pending. Generate charges to proceed.
                    </p>


                    <button
                      onClick={() => {
                        dispatch(setUserData(items)); // 🔥 STORE IN REDUX
                        navigate("/ht-load-change/Details", {
                          state: {
                            data: items,      // 👈 same key jo submit flow me use hoti hai
                            fromDashboard: true
                          }
                        });
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-purple-800 cursor-pointer"
                    >
                      Generate Tariff Charges
                    </button>


                  </div>
                </div>
              )}


            </div>
          </>
        )}
      </div>
    </>

  );
};
export default LoadRegistrationFeePayment;

