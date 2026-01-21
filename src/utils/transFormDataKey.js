export const transformDataKeys = apiData => {
  const transformed = {};
  for (const key in apiData) {
    if (keyMapping[key]) {
      transformed[keyMapping[key]] = apiData[key]; // rename
    } else {
      transformed[key] = apiData[key]; // optional: keep original key if not mapped
    }
  }
  return transformed;
};

const keyMapping = {
  regionCode: 'region_code',
  region: 'region',
  circleCode: 'circle_code',
  circle: 'circle',
  divisionCode: 'division_code',
  division: 'division',
  consumerId: 'consumer_id',
  conectionDate: 'connection_date',
  lastReducedCdDate: 'last_reduction_date',
  oldAccountId: 'old_account_id',
  billCycle: 'bill_cycle',
  consumerName: 'consumer_name',
  address: 'address',
  email: 'email',
  mobile: 'mobile',
  connectionType: 'connection_type',
  panCard: 'pan_card_no',
  vos: 'existing_supply_voltage',
  premiseType: 'premise_type',
  purposeInstal: 'connection_purpose',
  tariff: 'connection_category',
  tariffDes: 'connection_sub_category',
  // sanctionLoad: 'existing_contract_demand',
 cd: 'existing_contract_demand',


  unit: 'unit',
  // cd: 'cd',
  tempCd: 'temporaryLoad',
  govtFlag: 'govt_flag',
  meterMake: 'meter_make',
  meterNo: 'meter_no',
  meterType: 'meter_type',
  meterCtRatio: 'meter_ct_ratio',
  meterPtRatio: 'meter_pt_ratio',
  dialFactor: 'dial_factor',
  meterAccuracyClass: 'meter_accuracy',
  overallMf: 'mf',
  modemNumber: 'modem_number',
  simServiceProvider: 'sim_service_provider',
  simNumber: 'sim_number',
  substationCode: 'substation_code',
  substationName: 'substation_name',
  feederCode: 'feeder_code',
  feederName: 'feeder_name',
  meMake: 'me_make',
  meSerial: 'me_serial_no',
  meCtRatio: 'me_ct_ratio',
  mePtRatio: 'me_pt_ratio',
  solarInstallationCapacity: 'solar_installation_capacity',
  netMeterInstallDate: 'net_meter_install_date',
  curTime: 'cur_time',
  billMonth: 'current_bill_month',
  billId: 'current_bill_id',
  billedUnits: 'current_bill_units',
  netBill: 'current_net_bill_amt',
  paidAmt:'current_paid_amt',
  currentMonthBill:'current_month_bill',
  previousBillMonth: 'prev_bill_month',
  previousBillId: 'prev_bill_id',
  previousBilledUnits: 'prev_bill_units',
  previousNetBill: 'prev_net_bill_amt',
  loadEffectiveDate: 'load_effective_date',
  thirdLastBillMonth: 'third_last_bill_month',
  thirdLastBillId: 'third_last_bill_id',
  thirdLastBilledUnits: 'third_last_bill_units',
  thirdLastNetBill: 'third_last_net_bill',
  purposeInstId:"connection_purpose_id",
  lastReducedCdDate:"last_reduction_date",
  govtFlag:"govt_flag"
};
