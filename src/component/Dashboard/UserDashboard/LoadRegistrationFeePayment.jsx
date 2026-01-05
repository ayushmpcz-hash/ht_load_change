import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ApplicantBasicDetails, InputTag, Button } from '../../importComponents'
const LoadRegistrationFeePayment = () => {
  const officerData = useSelector(state => state.user.officerData);
  console.log(officerData, "officerData")
  const location = useLocation()
  const { items } = location.state || {}
  const { register, setValue, formState: { errors }, } = useForm({
    defaultValues: items || {}
  })

  const [mobileNo] = useState(officerData?.employee_detail.cug_mobile);
  const [isDisabled, setIsDisabled] = useState(false);
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
                  HT Load Change {items.application_status_text}
                </h2>
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
              {items?.tariff_charges?.total_pay_amount && (
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
                        <Link
                          to={`/ht-load-change/payment/${items?.id}`}
                          state={{
                            result: items,
                          }}
                        >
                          <Button label=' Pay Total Amount'></Button>
                        </Link>

                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>
          </>
        )}
      </div>
    </>

  );
};
export default LoadRegistrationFeePayment;
