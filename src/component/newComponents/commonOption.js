const TypeOfValue = {
  typeOfChanges: [
    { label: 'Load Enhancement', value: 'Load_Enhancement' },
    { label: 'Load Reduction', value: 'Load_Reduction' },
    // { label: 'Only Voltage Upgrade', value: 'Only_Voltage_Upgrade' },
  ],
  supplyVoltage: [
    { label: '11 KV', value: '11 KV' },
    { label: '33 KV', value: '33 KV' },
    { label: '132 KV', value: '132 KV' },
    { label: '220 KV', value: '220 KV' },
  ],
  enhancementOptions: [
    { label: 'Load Enhancement without Voltage Change', value: 'Load_Enhancement_without_Voltage_Change' },
    { label: 'Load Enhancement with Voltage Change', value: 'Load_Enhancement_with_Voltage_Change' },
    { label: 'Only Voltage Upgrade', value: 'Only_Voltage_Upgrade' },
    // { label: 'Load Enhancement with Downgrade Voltage Level', value: 'Load_Enhancement_with_Downgrade_Voltage_Level' },
  ],
  reductionOptions: [
    { label: 'Load Reduction without Voltage Change', value: 'Load_Reduction_without_Voltage_Change' },
    // { label: 'Load Reduction with Voltage Change', value: 'Load_Reduction_with_Voltage_Change' },
    // { label: 'Load Reduction with Upgrade Voltage Level', value: 'Load_Reduction_with_Upgrade_Voltage_Level' },
    // { label: 'Only Voltage Downgrade', value: 'Only_Voltage_Downgrade' },
  ],
};




const responseOption = [
    { label: "Accept", value: "Accepted" },
    { label: "Revert", value: "Reverted" }
  ]
  
export const PaymentOption = [
    { label: "Online", value: "Online" },
    { label: "Challan", value: "Challan" }

  ]
const revertOption = [
    { label: "Due On the premise", value: "Due On the premise" },
    { label: "ROW Issue", value: "ROW Issue" },
    { label: "Incomplete/Wrong Document Uploaded", value: "Incomplete/Wrong Document Uploaded" },
    { label: "Applicant Requested", value: "Applicant Requested" },

  ]

export const region = [
    { value: '2', label: 'Bhopal' },
    { value: '3', label: 'Gwalior' },

  ];
export const lineType = [
    { value: '11 KV', label: '11 KV' },
    { value: '33 KV', label: '33 KV' },
    { value: '132 KV', label: '132 KV' },
    { value: '220 KV', label: '220 KV' },
  ];
export const conductorType = [
    { value: 'AAAC_DOG', label: 'AAAC DOG' },
    { value: 'AAAC_Panther', label: 'AAAC Panther' },
    { value: 'AAAC_Rabbit', label: 'AAAC Rabbit' },
    { value: 'AAAC_RACCOON', label: 'AAAC RACCOON' },
    { value: 'ACSR_DOG', label: 'ACSR DOG' },
    { value: 'ACSR_Panther', label: 'ACSR Panther' },
    { value: 'ACSR_Rabbit', label: 'ACSR Rabbit' },
    { value: 'ACSR_RACCOON', label: 'ACSR RACCOON' },
    { value: 'Covered_Conductor_Last_Span', label: 'Covered Conductor Last Span' },
  ];
export const poleType = [
    { value: 'PPC_8_mtr', label: 'PPC 8 mtr' },
    { value: 'PCC_9_mtr', label: 'PPC 9 mtr' },
    { value: 'H_Beam_11_mtr', label: 'H-Beam 11 mtr' },
    { value: 'H_Beam_13_mtr', label: 'H-Beam 13 mtr' },
    { value: 'H_Beam_15_mtr', label: 'H-Beam 15 mtr' },

  ];
export const setSurveyOptions =[
      { label: 'Estimate is Required', value: 'is_estimate_required' },
      { label: 'Agreement is Required', value: 'is_agreement_required' },
    ];
 const setEstimateOption=[
  { label: '(Me Meter Estimate)Estimate is Required', value: 'is_me_meter_required' },
  { label: ' Extension Work is Required', value: 'is_extension_work_required' },
 
]




 
const getEstimateOptions = (existingVoltage, newVoltage) => {
  if (existingVoltage === newVoltage) {
    
    return [{ label: '(Me Meter Estimate)Estimate is Required', value: 'is_me_meter_required' }];
  }
  return setEstimateOption;
};

  export {responseOption,revertOption,TypeOfValue,getEstimateOptions}