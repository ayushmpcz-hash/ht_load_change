import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { ApplicantBasicDetails, InputTag, Button } from '../../importComponents'
const LoadDemandNotePayment = () => {
  const officerData = useSelector(state => state.user.officerData);
  const location = useLocation()
  const { items } = location.state || {}
  console.log(items, "items")
  const { register, setValue, formState: { errors }, } = useForm({
    defaultValues: items || {}
  })

  const [mobileNo] = useState(officerData?.employee_detail.cug_mobile);
  const [isDisabled, setIsDisabled] = useState(false);
  setValue('total_demand_note_amt', items?.demand_note_generation?.total_demand_note_amt)

    console.log(officerData,'officerData')
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
              <div className="card-body px-4 pb-4">
                <div className="">
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <InputTag
                      LName="Demand Note Amount"
                      {...register("total_demand_note_amt",)}
                      errorMsg={errors.total_demand_note_amt?.message}
                      disabled={isDisabled}
                      readOnly
                    />
                    <Link to={`https://htsanyojan.mpcz.in:8089/ht_load_change/call_demand_note_payment/${items?.id}`}><Button label=' Pay Demand Note'></Button></Link>
                  </div>

                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>

  );
};
export default LoadDemandNotePayment;
