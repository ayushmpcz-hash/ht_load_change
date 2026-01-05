import { fetchDataAll } from '../utils/handleApi.js';
import {HT_NSC_BASE} from "../api/api.js"

// export const fetchCtPtData = async (items) => {
//   console.log(items,"items")
//   let supply_voltage = items?.new_supply_voltage?.replace(/kv/i, "").trim()
//       try {

//         const [ct_respones, pt_respones] = await Promise.all([
//           fetchDataAll(`${HT_NSC_BASE}/CtRatioApi?supply_voltage=${supply_voltage}`),
//           fetchDataAll(`${HT_NSC_BASE}/PtRatioApi?supply_voltage=${supply_voltage}`)
//         ]);

//         const [ct_result, pt_result] = await Promise.all([
//           ct_respones.json(),
//           pt_respones.json()
//         ]);
//         const matched = getCTRatio(ct_result.data,supply_voltage, items?.new_contact_demand);
//        return {matched,ct_result,pt_result};
        
        
//       } catch (error) {
//         console.error("Error fetching data:", error);

//       }
//     };
// console.log(HT_NSC_BASE,'HT_NSC_BASE inside me ratio')
export const fetchCtPtData = async (items) => {
  // console.log(items,"items")
   if (!items || !items.new_supply_voltage) {
    console.error("fetchCtPtData: Invalid items", items);
    return null;   // Prevent further errors
  }

  let supply_voltage = items.new_supply_voltage
    .replace(/kv/i, "")
    .trim();
      try {

        const [ct_respones, pt_respones] = await Promise.all([
          fetchDataAll(`${HT_NSC_BASE}/CtRatioApi?supply_voltage=${supply_voltage}`),
          fetchDataAll(`${HT_NSC_BASE}/PtRatioApi?supply_voltage=${supply_voltage}`)
        ]);

        const [ct_result, pt_result] = await Promise.all([
          ct_respones.json(),
          pt_respones.json()
        ]);
        const matched = getCTRatio(ct_result.data,supply_voltage, items?.new_contact_demand);
       return {matched,ct_result,pt_result};
        
        
      } catch (error) {
        console.error("Error fetching data:", error);

      }
    };


  //    function getCTRatio(dataList, supplyVoltage, contractDemand) {
  //   // Clean the number and check ranges
  //   const parseRange = (rangeStr) => {
  //     const cleaned = rangeStr.replace(/KVA/gi, '').trim();
  //     const match = cleaned.match(/(\d+)\s*to\s*(\d+)/i);
  //     console.log(match,"match")
  //     if (match) {
  //       return [parseInt(match[1], 10), parseInt(match[2], 10)];
  //     }
  //     // Handle 'Upto' case or single value
  //     const uptoMatch = cleaned.match(/Upto\s*(\d+)/i);
  //     if (uptoMatch) {
  //       return [0, parseInt(uptoMatch[1], 10)];
  //     }
  //     return null;
  //   };

  //   for (const item of dataList) {
  //     console.log(item.existing_metering_120_loading,"item")
  //     if (item.supply_voltage === supplyVoltage) {
  //       const range = parseRange(item.existing_metering_120_loading);
  //       if (range && contractDemand >= range[0] && contractDemand <= range[1]) {
  //         return item.ct_ratio_me;
  //       }
  //     }
  //   }

  //   return 'No matching CT ratio found';
  // }
  
     function getCTRatio(dataList, supplyVoltage, contractDemand) {
    // Clean the number and check ranges
    const parseRange = (rangeStr) => {
      if (!rangeStr) return null;   // Prevent null.replace()
  const cleaned = rangeStr.replace(/KVA/gi, '').trim();
      const match = cleaned.match(/(\d+)\s*to\s*(\d+)/i);
      console.log(match,"match")
      if (match) {
        return [parseInt(match[1], 10), parseInt(match[2], 10)];
      }
      // Handle 'Upto' case or single value
      const uptoMatch = cleaned.match(/Upto\s*(\d+)/i);
      if (uptoMatch) {
        return [0, parseInt(uptoMatch[1], 10)];
      }
      return null;
    };

    for (const item of dataList) {
      console.log(item.existing_metering_120_loading,"item")
      if (item.supply_voltage === supplyVoltage) {
        const range = parseRange(item.existing_metering_120_loading);
        if (range && contractDemand >= range[0] && contractDemand <= range[1]) {
          return item.ct_ratio_me;
        }
      }
    }

    return 'No matching CT ratio found';
  }

