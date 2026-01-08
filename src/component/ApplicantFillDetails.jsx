import React from 'react';
import { InputTag } from '../component/importComponents';

export default function ApplicantBasicDetails({ htConsumers ,register ,errors}) {
 
  // console.log(htConsumers,"htConsumers")
  return (
    <>
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
          Connection Details..
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
          {htConsumers?.application_no &&(
            <InputTag
              LName="Application No"
              {...register('application_no')}
             readOnly={true}
              errorMsg={errors.application_no?.message}
            />

            
          )}

          <InputTag
            LName="Consumer Id"
            {...register('consumer_id')}
           readOnly={true}
            errorMsg={errors.consumer_id?.message}
          />
          <InputTag
            LName="Consumer Name"
            {...register('consumer_name')}
           readOnly={true}
            errorMsg={errors.consumer_name?.message}
          />
         <InputTag LName="mobile" {...register('mobile')}
           errorMsg={errors.mobile?.message}  readOnly={true} />
         <InputTag LName="Email" {...register('email')}
           errorMsg={errors.email?.message}  readOnly={true} />
         <InputTag LName="Address" {...register('address')}
           errorMsg={errors.address?.message}  readOnly={true} />
          <InputTag
            LName="pan_card_no"
            {...register('pan_card_no')}
           readOnly={true}
            errorMsg={errors.pan_card_no?.message}
            placeholder={htConsumers.pan_card_no || "NA"}
          />
          <InputTag
            LName="Connection Date"
            {...register('connection_date')}
            type="date"
           readOnly={true}
            errorMsg={errors.connection_date?.message}
          />
          <InputTag
            LName="Load Effective Date"
            //  type="date"
            {...register('load_effective_date')}
           readOnly={true}
            errorMsg={errors.load_effective_date?.message}
            placeholder={htConsumers.load_effective_date || "NA"}
          />
          <InputTag
            LName="Last Reduction Date"
            //  type="date"
            {...register('last_reduction_date')}
           readOnly={true}
            errorMsg={errors.last_reduction_date?.message}
            placeholder={htConsumers.last_reduction_date || "NA"}
          />
         <InputTag LName="Region" {...register('region')}
           errorMsg={errors.region?.message} readOnly={true} />
          <InputTag LName="Circle" {...register('circle')}
           errorMsg={errors.circle?.message} readOnly={true} />
          <InputTag
            LName="Division"
            {...register('division')}
           readOnly={true}
            errorMsg={errors.division?.message}
          />
          <InputTag
            LName="Substation Name"
            {...register('substation_name')}
           readOnly={true}
            errorMsg={errors.substation_name?.message}
          />
          <InputTag
            LName="Feeder Name"
            {...register('feeder_name')}
           readOnly={true}
            errorMsg={errors.feeder_name?.message}
          />
        </div>
      </div>
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
          Connection Details..
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
          <InputTag
            LName="Connection Type"
            {...register('connection_type')}
           readOnly={true}
            errorMsg={errors.connection_type?.message}
          />

          <InputTag
            LName="Connection Category"
            {...register('connection_category')}
           readOnly={true}
            errorMsg={errors.connection_category?.message}
          />

          <InputTag
            LName="Connection Sub Category"
            {...register('connection_sub_category')}
           readOnly={true}
            errorMsg={errors.connection_sub_category?.message}
          />

          <InputTag
            LName="Connection Purpose"
            {...register('connection_purpose')}
           readOnly={true}
            errorMsg={errors.connection_purpose?.message}
          />

          <InputTag
            LName="Existing Supply Voltage"
            {...register('existing_supply_voltage')}
           readOnly={true}
            errorMsg={errors.existing_supply_voltage?.message}
          />

          {htConsumers?.connection_type === 'Permanent' && (
            <InputTag
              LName="Existing Contract Demand"
              {...register('existing_contract_demand')}
             readOnly={true}
              errorMsg={errors.existing_contract_demand?.message}
            />
          )}

          {htConsumers?.connection_type === 'Temporary' && (
            <InputTag
              LName="Existing Temporary Contract Demand"
              {...register('temporaryLoad')}
             readOnly={true}
              errorMsg={errors.temporaryLoad?.message}
            />
          )}
        </div>
      </div>
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
          METER Details..
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
          <InputTag
            LName="Meter No"
            {...register('meter_no')}
           readOnly={true}
            errorMsg={errors.meter_no?.message}
          />

          <InputTag
            LName="Meter Make"
            {...register('meter_make')}
           readOnly={true}
            errorMsg={errors.meter_make?.message}
          />

          <InputTag
            LName="Meter Ct Ratio"
            {...register('meter_ct_ratio')}
           readOnly={true}
            errorMsg={errors.meter_ct_ratio?.message}
          />

          <InputTag
            LName="Meter Pt Ratio"
            {...register('meter_pt_ratio')}
           readOnly={true}
            errorMsg={errors.meter_pt_ratio?.message}
          />

          {/* <InputTag
            LName="Meter Accuracy Class"
            {...register('meter_accuracy')}
           readOnly={true}
            errorMsg={errors.meter_accuracy?.message}
            
          /> */}


          <InputTag
            LName="Meter Type"
            {...register('meter_type')}
           readOnly={true}
            errorMsg={errors.meter_type?.message}
          />

          <InputTag
            LName="Net Meter Install Date"
            {...register('net_meter_install_date')}
           readOnly={true}
            errorMsg={errors.net_meter_install_date?.message}
            placeholder={htConsumers.net_meter_install_date || "NA"}

          />
        </div>
      </div>
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
          ME Details..
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
          <InputTag
            LName="ME Serial"
            {...register('me_serial_no')}
           readOnly={true}
            errorMsg={errors.me_serial_no?.message}
          />

          <InputTag LName="ME Make" {...register('me_make')}
           errorMsg={errors.me_make?.message}  readOnly={true} />

          <InputTag
            LName="ME Ct Ratio"
            {...register('me_ct_ratio')}
           readOnly={true}
            errorMsg={errors.me_ct_ratio?.message}
          />

          <InputTag
            LName="ME Pt Ratio"
            {...register('me_pt_ratio')}
           readOnly={true}
            errorMsg={errors.me_pt_ratio?.message}
          />

          <InputTag
            LName="Solar Installation Capacity"
            type="number"
            {...register('solar_installation_capacity')}
           readOnly={true}
            errorMsg={errors.solar_installation_capacity?.message}
             placeholder={htConsumers.solar_installation_capacity || "NA"}
          />

          <InputTag
            LName="Dial Factor"
            {...register('dial_factor')}
           readOnly={true}
            errorMsg={errors.dial_factor?.message}
          />

          <InputTag LName="MF (Multiply)" {...register('mf')}
           errorMsg={errors.mf?.message}  readOnly={true} />
        </div>
      </div>
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
          Bill Details..
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {/* Previous Bill Fields (अगर चाहिए तो uncomment कर लेना) */}
          {/* 
<InputTag
  LName="Previous Bill Id"
  {...register("prev_bill_id")}
 readOnly={true}
  errorMsg={errors.prev_bill_id?.message}
/>

<InputTag
  LName="Previous Bill Month"
  {...register("prev_bill_month")}
 readOnly={true}
  errorMsg={errors.prev_bill_month?.message}
/>

<InputTag
  LName="Previous Bill Units"
  {...register("prev_bill_units")}
 readOnly={true}
  errorMsg={errors.prev_bill_units?.message}
/>

<InputTag
  LName="Previous Net Bill"
  {...register("prev_net_bill_amt")}
 readOnly={true}
  errorMsg={errors.prev_net_bill_amt?.message}
/>
*/}

          {/* Current Bill Fields */}
          <InputTag
            LName="Current Bill Id"
            {...register('current_bill_id')}
           readOnly={true}
            errorMsg={errors.current_bill_id?.message}
          />

          <InputTag
            LName="Current Bill Month"
            {...register('current_bill_month')}
           readOnly={true}
            errorMsg={errors.current_bill_month?.message}
          />

          <InputTag
            LName="Current Bill Units"
            {...register('current_bill_units')}
           readOnly={true}
            errorMsg={errors.current_bill_units?.message}
          />

          <InputTag
            LName="Current Month Bill Amount"
            {...register('current_month_bill')}
           readOnly={true}
            errorMsg={errors.current_month_outstandin_amt?.message}
          />
          <InputTag
            LName="Net Bill"
            {...register('current_net_bill_amt')}
           readOnly={true}
            errorMsg={errors.current_net_bill_amt?.message}
          />

          <InputTag
            LName="Current Paid Amount"
            {...register('current_paid_amt')}
           readOnly={true}
            errorMsg={errors.current_paid_amt?.message}
          />

          <InputTag
            LName="Current Month Outstanding Amount"
            {...register('current_month_outstandin_amt')}
           readOnly={true}
            errorMsg={errors.current_month_outstandin_amt?.message}
          />
          

          {/* Hidden Fields */}
          <InputTag
            LName=""
            type="hidden"
            {...register('region_code')}
           readOnly={true}
            errorMsg={errors.region_code?.message}
          />

          <InputTag
            LName=""
            type="hidden"
            {...register('circle_code')}
           readOnly={true}
            errorMsg={errors.circle_code?.message}
          />

          <InputTag
            LName=""
            type="hidden"
            {...register('division_code')}
           readOnly={true}
            errorMsg={errors.division_code?.message}
          />

          <InputTag
            LName=""
            type="hidden"
            {...register('connection_purpose_id')}
           readOnly={true}
            errorMsg={errors.connection_purpose_id?.message}
          />
        </div>
      </div>
      </>
  )}
     

