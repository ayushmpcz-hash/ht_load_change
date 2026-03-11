// import { Tuple } from '@reduxjs/toolkit';
// import{TypeOfValue} from '../component/newComponents/commonOption'

//   const handleSupplyVoltage = (currentVoltage,subTypeName,)=> {
//     console.log(currentVoltage,"dfdgfd")
//     console.log(subTypeName,"dfgdhgfhdg")

//     const currentVolt = getNumericVoltage(currentVoltage);
//     let filteredVoltages = [];

//     // ------------------- Enhancement Cases -------------------
//     if (subTypeName === 'Load_Enhancement_with_Voltage_Change') {
//       filteredVoltages = TypeOfValue.supplyVoltage.filter(
//         v => getNumericVoltage(v.value) > currentVolt
//       );
//       return filteredVoltages

//     } else if (subTypeName === 'Load_Enhancement_without_Voltage_Change') {
//       filteredVoltages = TypeOfValue.supplyVoltage.filter(
//         v => getNumericVoltage(v.value) === currentVolt
//       );
//       return filteredVoltages

//     } else if (subTypeName === 'Only_Voltage_Upgrade') {
//       filteredVoltages = TypeOfValue.supplyVoltage.filter(
//         v => getNumericVoltage(v.value) > currentVolt
//       );
//       return filteredVoltages

//     } else if (subTypeName === 'Load_Enhancement_with_Downgrade_Voltage_Level') {
//       filteredVoltages = TypeOfValue.supplyVoltage.filter(
//         v => getNumericVoltage(v.value) < currentVolt
//       );
//       return filteredVoltages

//     }

//     // ------------------- Reduction Cases -------------------
//     else if (subTypeName === 'Load_Reduction_without_Voltage_Change') {
//       filteredVoltages = TypeOfValue.supplyVoltage.filter(
//         v => getNumericVoltage(v.value) === currentVolt
//       );
//        return filteredVoltages
//     }

//     // } else if (subTypeName === 'Load_Reduction_with_Voltage_Change') {
//     //   filteredVoltages = TypeOfValue.supplyVoltage.filter(
//     //     v => getNumericVoltage(v.value) !== currentVolt
//     //   );
//     //   setContractDemand('');
//     //   setContractDemandDiff('');
//     //   setIsContractDemandDisabled(false);
//     // } else if (subTypeName === 'Load_Reduction_with_Upgrade_Voltage_Level') {
//     //   filteredVoltages = TypeOfValue.supplyVoltage.filter(
//     //     v => getNumericVoltage(v.value) > currentVolt
//     //   );
//     //   setContractDemand('');
//     //   setContractDemandDiff('');
//     //   setIsContractDemandDisabled(false);
//     // } else if (subTypeName === 'Only_Voltage_Downgrade') {
//     //   filteredVoltages = TypeOfValue.supplyVoltage.filter(
//     //     v => getNumericVoltage(v.value) < currentVolt
//     //   );
//     //   setContractDemand('');
//     //   setContractDemandDiff('');
//     //   setIsContractDemandDisabled(true);
//     //   setContractDemand(currentContractDemand);
//     // }

//     // ------------------- Final Update -------------------
//     // setSupplyVoltage(filteredVoltages);
//     // if (filteredVoltages.length > 0) {
//     //   setSupplyVoltageValue(filteredVoltages[0].value);
//     // } else {
//     //   setSupplyVoltageValue('');
//     // }
//   };
// const getNumericVoltage = v => parseInt(v.replace(' KV', ''));
// const contractDemandRange = (voltage, value) => {
//   const ranges = {
//     '11 KV': { min: 50, max: 300, message: 'The value should be 50 to 300 KVA' },
//     '33 KV': { min: 100, max: 10000, message: 'The value should be 100 to 10000 KVA' },
//     '132 KV': { min: 5000, max: 49999, message: 'The value should be between 5000 and 49999 KVA' },
//     '220 KV': { min: 40000, max: 100000, message: 'The value should be equal and above 40000 KVA' },
//   };

//   const range = ranges[voltage];
//   if (range && (value < range.min || value > range.max)) {
//     return range.message;
//   }

//   return '';
// };




//     const checkLoadReductionDate = (htConsumers) => {
//     const connectionDate = new Date(htConsumers?.connection_date);
//     const lastReductionDate = new Date(htConsumers?.last_reduction_date);
//     const currentDate = new Date();
//     const totalYearConnDate = (currentDate - connectionDate) / (1000 * 60 * 60 * 24 * 365.25);
//     const totalYearLastReduction =(currentDate - lastReductionDate) / (1000 * 60 * 60 * 24 * 365.25);
//     let CountOfConnYear = totalYearConnDate.toFixed(1);
//     let CountOfLastReduction = totalYearLastReduction.toFixed(1);
//     let existing_contract_demand = Number(htConsumers.existing_contract_demand)/2
//   console.log(CountOfConnYear,"CountOfConnYear")
//   console.log(CountOfLastReduction,"CountOfLastReduction")


//     if (Number(CountOfConnYear) < 2 && !htConsumers?.last_reduction_date) {
//       return {  
//         "dividedContractDemand":existing_contract_demand,
//         "lastReductionDate":null,
//         "divided":true,
//         "Load_Reduction":true

//       }

//     }else if(Number(CountOfConnYear) > 2 && !htConsumers?.last_reduction_date){
//       return {  
//         "dividedContractDemand":existing_contract_demand,
//         "lastReductionDate":null,
//         "divided":false,
//         "Load_Reduction":true

//       }

//     }
//     else if(htConsumers?.last_reduction_date && Number(totalYearLastReduction) > 1 ){
//       return {  
//         "dividedContractDemand":existing_contract_demand,
//         "lastReductionDate":null,
//         "divided":false,
//         "Load_Reduction":true

//       } 
//     }else if(Number(CountOfConnYear) > 2 && Number(totalYearLastReduction) > 1  && htConsumers?.last_reduction_date){
//       return {  
//         "dividedContractDemand":existing_contract_demand,
//         "lastReductionDate":null,
//         "divided":false,
//         "Load_Reduction":true

//       }

//     }else{
//       return {  
//         "dividedContractDemand":existing_contract_demand,
//         "lastReductionDate":null,
//         "divided":false,
//         "Load_Reduction":false

//       } 

//     }

//       // if (!htConsumers?.last_reduction_date) {
//       //   return totalYearConnDate
//       // } else if (htConsumers?.last_reduction_date && totalYearLastReduction > 1) {
//       //  return totalYearConnDate
//       // } else {
//       //   return false
//       // }
//     // } else {
//     //     if (Number(CountOfLastReduction) < 2 && !htConsumers?.last_reduction_date) {
//     //       // console.log(formatted,"kjkj")
//     //       return CountOfLastReduction
//     //     } else {
//     //       return false
//     //     }
//     // }
//   };
//   const validateContractDemand = (type, value, typesOfChangeValue,htConsumers,totalYearConnectionDate,loadReductionApply) => {
//   if (type === 'Load_Enhancement') {
//     console.log(htConsumers.existing_contract_demand,"htConsumers.existing_contract_demand")
//     if(typesOfChangeValue !=="Only_Voltage_Upgrade" && Number(value) < Number(htConsumers.existing_contract_demand)){
//       return `Contract demand cannot be less than Current demand (${htConsumers.existing_contract_demand} KVA)`;
//     }
//     else{
//        return ``;
//     }
//   }else if (type === 'Load_Reduction') {
//    if(loadReductionApply?.Load_Reduction && loadReductionApply?.divided && Number(loadReductionApply?.dividedContractDemand) > Number(value)) {
//       return "Contract demand divided hamesha value se jyada hona chahiye";
//     }else if(loadReductionApply.Load_Reduction && Number(value) >= Number(htConsumers.existing_contract_demand) ){
//       return `Contract demand cannot be greater than current demand (${htConsumers.existing_contract_demand} KVA)`;

//     }


//     // if (Number(value) < Number(htConsumers.existing_contract_demand)) {
//     //   const contractDemand = Math.floor(htConsumers.existing_contract_demand / 2);
//     //   // console.log(totalYearConnectionDate)
//     //   if(Number(totalYearConnectionDate)<2){

//     //   }

//     //   // if (
//     //   //   totalYearConnectionDate < 2 &&
//     //   //   !htConsumers?.last_reduction_date &&
//     //   //   contractDemand > value
//     //   // ) {
//     //   //   return `The connection has not completed two years yet ${htConsumers.existing_contract_demand} KVA)`;
//     //   // }
//     // } else {
//     //   return `Contract demand cannot be greater than current demand (${htConsumers.existing_contract_demand} KVA)`;
//     // }
//   }
// // return '';
// }
// export {handleSupplyVoltage,contractDemandRange,validateContractDemand,checkLoadReductionDate}


import { Tuple } from '@reduxjs/toolkit';
import { TypeOfValue } from '../component/newComponents/commonOption'

const handleSupplyVoltage = (currentVoltage, subTypeName,) => {
  console.log(currentVoltage, "dfdgfd")
  console.log(subTypeName, "dfgdhgfhdg")

  const currentVolt = getNumericVoltage(currentVoltage);
  let filteredVoltages = [];

  // ------------------- Enhancement Cases -------------------
  if (subTypeName === 'Load_Enhancement_with_Voltage_Change') {
    filteredVoltages = TypeOfValue.supplyVoltage.filter(
      v => getNumericVoltage(v.value) > currentVolt
    );
    return filteredVoltages

  } else if (subTypeName === 'Load_Enhancement_without_Voltage_Change') {
    filteredVoltages = TypeOfValue.supplyVoltage.filter(
      v => getNumericVoltage(v.value) === currentVolt
    );
    return filteredVoltages

  } else if (subTypeName === 'Only_Voltage_Upgrade') {
    filteredVoltages = TypeOfValue.supplyVoltage.filter(
      v => getNumericVoltage(v.value) > currentVolt
    );
    return filteredVoltages

  } else if (subTypeName === 'Load_Enhancement_with_Downgrade_Voltage_Level') {
    filteredVoltages = TypeOfValue.supplyVoltage.filter(
      v => getNumericVoltage(v.value) < currentVolt
    );
    return filteredVoltages

  }


  // ------------------- Reduction Cases -------------------

  else if (subTypeName === 'Load_Reduction_without_Voltage_Change') {
    filteredVoltages = TypeOfValue.supplyVoltage.filter(
      v => getNumericVoltage(v.value) === currentVolt
    );
    return filteredVoltages;
  }

  else if (subTypeName === 'Load_Reduction_with_Voltage_Downgrade') {

    // Only allowed from 33 KV → 11 KV
    if (currentVolt === 33) {
      filteredVoltages = TypeOfValue.supplyVoltage.filter(
        v => getNumericVoltage(v.value) === 11
      );
    } else {
      filteredVoltages = [];
    }

    return filteredVoltages;
  }
};
const getNumericVoltage = v => parseInt(v.replace(' KV', ''));
const contractDemandRange = (voltage, value) => {
  const ranges = {
    '11 KV': { min: 50, max: 300, message: 'The value should be 50 to 300 KVA' },
    '33 KV': { min: 100, max: 10000, message: 'The value should be 100 to 10000 KVA' },
    '132 KV': { min: 5000, max: 49999, message: 'The value should be between 5000 and 49999 KVA' },
    '220 KV': { min: 40000, max: 100000, message: 'The value should be equal and above 40000 KVA' },
  };

  const range = ranges[voltage];
  if (range && (value < range.min || value > range.max)) {
    return range.message;
  }

  return '';
};




const checkLoadReductionDate = (htConsumers) => {
  const connectionDate = new Date(htConsumers?.connection_date);
  const lastReductionDate = new Date(htConsumers?.last_reduction_date);
  const currentDate = new Date();
  const totalYearConnDate = (currentDate - connectionDate) / (1000 * 60 * 60 * 24 * 365.25);
  const totalYearLastReduction = (currentDate - lastReductionDate) / (1000 * 60 * 60 * 24 * 365.25);
  let CountOfConnYear = totalYearConnDate.toFixed(1);
  let CountOfLastReduction = totalYearLastReduction.toFixed(1);
  let existing_contract_demand = Number(htConsumers.existing_contract_demand) / 2
  console.log(CountOfConnYear, "CountOfConnYear")
  console.log(CountOfLastReduction, "CountOfLastReduction")


  if (Number(CountOfConnYear) < 2 && !htConsumers?.last_reduction_date) {
    return {
      "dividedContractDemand": existing_contract_demand,
      "lastReductionDate": null,
      "divided": true,
      "Load_Reduction": true

    }

  } else if (Number(CountOfConnYear) > 2 && !htConsumers?.last_reduction_date) {
    return {
      "dividedContractDemand": existing_contract_demand,
      "lastReductionDate": null,
      "divided": false,
      "Load_Reduction": true

    }

  }
  else if (htConsumers?.last_reduction_date && Number(totalYearLastReduction) > 1) {
    return {
      "dividedContractDemand": existing_contract_demand,
      "lastReductionDate": null,
      "divided": false,
      "Load_Reduction": true

    }
  } else if (Number(CountOfConnYear) > 2 && Number(totalYearLastReduction) > 1 && htConsumers?.last_reduction_date) {
    return {
      "dividedContractDemand": existing_contract_demand,
      "lastReductionDate": null,
      "divided": false,
      "Load_Reduction": true

    }

  } else {
    return {
      "dividedContractDemand": existing_contract_demand,
      "lastReductionDate": null,
      "divided": false,
      "Load_Reduction": false

    }

  }
};
const validateContractDemand = (type, value, typesOfChangeValue, htConsumers, totalYearConnectionDate, loadReductionApply) => {
  if (type === 'Load_Enhancement') {
    console.log(htConsumers.existing_contract_demand, "htConsumers.existing_contract_demand")
    if (typesOfChangeValue !== "Only_Voltage_Upgrade" && Number(value) < Number(htConsumers.existing_contract_demand)) {
      return `Contract demand cannot be less than Current demand (${htConsumers.existing_contract_demand} KVA)`;
    }
    else {
      return ``;
    }
  } else if (type === 'Load_Reduction') {
    if (loadReductionApply?.Load_Reduction && loadReductionApply?.divided && Number(loadReductionApply?.dividedContractDemand) > Number(value)) {
      return "Contract demand divided hamesha value se jyada hona chahiye";
    } else if (loadReductionApply.Load_Reduction && Number(value) >= Number(htConsumers.existing_contract_demand)) {
      return `Contract demand cannot be greater than current demand (${htConsumers.existing_contract_demand} KVA)`;

    }
  }
}
export { handleSupplyVoltage, contractDemandRange, validateContractDemand, checkLoadReductionDate }