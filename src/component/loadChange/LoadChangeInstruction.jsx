import React, { useState } from 'react';
import Input from '../Input';
import { useNavigate, Link } from 'react-router-dom';
import { getHtConsumerData } from '../../utils/htConsumerApi.js';
import { transformDataKeys } from '../../utils/transFormDataKey.js';

import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/slices/userSlice";

export default function LoadChangeInstruction() {
  const [consumer, setConsumer] = useState('');
  const [error, setError] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(''); // reset message

    if (!consumer) {
      setError({ Consumer_id: 'Please enter Consumer ID' });
      return;
    }
    const formattedConsumer = consumer.trim().charAt(0).toUpperCase() + consumer.trim().slice(1);
    console.log(formattedConsumer, "formattedConsumer")

    setIsDisabled(true);


    try {
      const result = await getHtConsumerData(formattedConsumer);
      console.log(result, 'result')
      if (result?.list?.length > 0) {
        let current_month_outstandin_amt = Number(result.list[0].netBill) - Number(result.list[0].paidAmt)
        const transformedData = transformDataKeys(result.list[0]);
        console.log(transformedData,'transformedData')
        transformedData.current_month_outstandin_amt = current_month_outstandin_amt;
        transformedData.current_bill_units = result?.list?.[0]?.billedUnits
          ? Math.round(result.list[0].billedUnits)
          : 0;
        if (Number(current_month_outstandin_amt) <= Number(result.list[0].currentMonthBill)) {
          console.log("✅ Load Enhancement Allowed");
          transformedData.LoadEnhancement = true
        } else {
          console.log("❌ Load Enhancement Not Allowed");
          transformedData.LoadEnhancement = false

        }
        setError({});
        setMessage('');
        dispatch(setUserData(transformedData));
        navigate(`/ht-load-change/consumer-registration/${transformedData.consumer_id}`, {
          state: { data: transformedData },
        });
      } else {
        setError({ Consumer_id: 'Consumer ID not matched' });
        setMessage('Consumer ID not matched');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setMessage('Error fetching data. Please try again.');
    } finally {
      setIsDisabled(false); // re-enable form
    }
  };

  return (
    <>
      <div className='flex '>
        <div className='w-1/5  p-4'>
          <div className="counts relative rounded-lg shadow-lg p-4 text-center mb-5 bg-white hover:shadow-xl transition-shadow duration-300">
            <Link
              to="/applicant-login"
              className="text-sky-900 font-semibold text-base hover:text-sky-700"
            >
              Track Load Change Application Status
              <br />
              <span className="text-sm text-gray-600">आवेदन की स्थिति जानें</span>
            </Link>
          </div>
        </div>
        <div className='w-3/5'>
          <div className="space-y-12 container mx-auto border rounded-md border-gray shadow-md">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="border-b pb-4 mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Important Instructions for Load Change Application
                  </h2>

                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block bg-blue-600 text-white font-medium px-4 py-2 rounded">
                      <div> To apply for Load Change in HT connection, following documents/details are required:</div>
                      <div> (एचटी कनेक्शन में लोड परिवर्तन हेतु आवेदन करने के लिए निम्नलिखित दस्तावेज/विवरण आवश्यक हैं)</div>
                    </label>

                    <ul className="list-disc list-inside mt-4 space-y-4 text-gray-700">

                      <li>
                        <p className='inline'>
                          Geographical Area Map: In case area of supply is expended then upload the Map of Area of Supply.
                          <br />
                          <span className="text-sm">(भौगोलिक क्षेत्र मानचित्र: यदि आपूर्ति का क्षेत्र विस्तृत है तो आपूर्ति क्षेत्र का मानचित्र अपलोड करें।) </span>
                        </p>
                      </li>
                      <li>
                        <p className='inline'>
                          Load Justification / Technical Details: In case of Load Enhancement load justification / technical details such as sanctioned load, proposed load, connected machinery details etc. may be uploaded for justification of total required Contract Demand
                          <span className="text-sm">(लोड औचित्य / तकनीकी विवरण: लोड वृद्धि के मामले में, कुल आवश्यक अनुबंध मांग के औचित्य के लिए लोड औचित्य / तकनीकी विवरण जैसे स्वीकृत लोड, प्रस्तावित लोड, कनेक्टेड मशीनरी विवरण आदि अपलोड किए जा सकते हैं।) </span>
                        </p>
                        {/* <ul className="list-disc ml-6 mt-2">
                      <li>
                        <p className="text-sm inline">
                          <strong>Note:</strong>As per Madhya Pradesh Electricity Supply Code, 2021, dated 20-08-2021 and amendment there of, list of applicable documents, may be attached with the application form.
                          <a
                            href="{{download_documents.supply_code.url}}"
                            className="text-blue-600 underline"
                            target="_blank"
                          >
                            Download List
                          </a>
                          <br />
                          मध्य प्रदेश विद्युत आपूर्ति संहिता, 2021, दिनांक 20-08-2021 एवं उसमें संशोधन के अनुसार लागू दस्तावेजों की सूची आवेदन पत्र के साथ संलग्न की जा सकती है। 
                        </p>
                      </li>
                    </ul> */}
                      </li>

                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800 mt-6">Important Points (महत्वपूर्ण बिन्दु)</p>
                    <ul className="list-disc list-inside space-y-4 text-gray-700 mt-2">
                      <li>
                        As per Madhya Pradesh Electricity Supply Code, 2021 (and amendments), additional documents may be sought by the Discom during processing.
                        <br />
                        <span className="text-sm">(मध्य प्रदेश विद्युत आपूर्ति संहिता, 2021 एवं संशोधन अनुसार, प्रसंस्करण के दौरान वितरण कंपनी अतिरिक्त दस्तावेज मांग सकती है।) </span>
                      </li>
                      <li>
                        Revised Supply Voltage Norms (MPERC Supply Code Amendment, 2025):
                        <br />
                        <span className="text-sm">(संशोधित आपूर्ति वोल्टेज मानक) </span>
                      </li>
                      <li>
                        The supply Voltage for Different Contract Demands shall normally be as follows:
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>11 KV: 50 kVA to 300 kVA</li>
                          <li>33 KV: 100 kVA to 10000 kVA</li>
                          <li>132 KV: 5000 kVA to 50000 kVA</li>
                          <li>220 KV+: 40000 kVA and above</li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <label className="block bg-blue-600 text-white font-medium px-4 py-2 rounded mt-4">
                      <div>For making payments and document upload please note following details</div>
                      <div>(भुगतान / दस्तावेज़ अपलोड के लिए कृपया ध्यान दें)</div>
                    </label>

                    <ul className="list-disc list-inside mt-4 space-y-4 text-gray-700">

                      <li>
                        Billing Impact: In case of excess demand, billing will be done as per tariff order and Supply Code provisions.
                        <br />
                        <span className="text-sm">(यदि उपभोक्ता स्वीकृत माँग से अधिक खपत करता है तो बिलिंग प्रावधान अनुसार की जाएगी।) </span>
                      </li>
                      <li>
                        Online Submission: All documents must be uploaded in PDF format only. File size should be less than 2 MB.
                        <br />
                        <span className="text-sm">(सभी दस्तावेज केवल पीडीएफ प्रारूप में ही अपलोड किए जाएं, फाइल का आकार 2 एमबी से कम होना चाहिए।)</span>
                      </li>
                      <li>
                        Applicable Charges: Consumer has to pay the charges for registration, Supply Affording Charges and Security Deposit as applicable at the time of Application submission.
                        <br />
                        <span className="text-sm">(उपभोक्ता को आवेदन जमा करते समय लागू पंजीकरण शुल्क, आपूर्ति वहन शुल्क और सुरक्षा जमा का भुगतान करना होगा।)
                        </span>
                      </li>
                      <li>
                        Demand Note of Extension work and/or ME Cost: If there is any extension work or ME Change required, separate demand note will be issued which have to be paid by consumer before agreement finalization.

                        <br />
                        <span className="text-sm">
                          (यदि कोई विस्तार कार्य या एमई परिवर्तन आवश्यक है, तो अलग से मांग पत्र जारी किया जाएगा, जिसका भुगतान उपभोक्ता को अनुबंध को अंतिम रूप देने से पहले करना होगा।)
                        </span>
                      </li>
                      <li>
                        Payment of Fees: All the charges are payable only through online payment / VAN (Virtual Account Number) provided in the challan generated by HT Sanyojan Portal.
                        <br />
                        <span className="text-sm">
                          (सभी शुल्क केवल ऑनलाइन भुगतान / एचटी संयोजन पोर्टल द्वारा जारी चालान में दिए गए VAN (वर्चुअल अकाउंट नंबर) के माध्यम से देय हैं।)
                        </span>
                      </li>
                      {/* <li>
                        If any extension work and/or Metering Equipment (ME) change is required for the submitted application, a separate demand note shall be issued. The consumer shall be required to pay the same before finalization of the agreement
                        <br />
                        <span className="text-sm">यदि प्रस्तुत आवेदन के लिए किसी प्रकार का विस्तार कार्य और/या मीटरिंग उपकरण (ME) परिवर्तन आवश्यक है, तो एक अलग मांग नोट जारी किया जाएगा। उपभोक्ता को समझौते के अंतिम रूप देने से पूर्व इसका भुगतान करना अनिवार्य होगा।
                        </span>
                      </li> */}
                      <li>
                        Consumer Responsibility: Any bank charges during payment will be borne by the consumer/applicant.
                        <br />
                        <span className="text-sm">

                        </span>

                        {/* <ul className="list-disc ml-6 mt-2 space-y-2">
                      <li>
                       If you have Net banking / Credit Card / Debit Card then you can pay through payment gateway linked with the HT Sanyojan Application Portal of the MPMKVVCL Bhopal 
                        <br />
                        <span className="text-sm">यदि आपके पास नेट बैंकिंग/क्रेडिट कार्ड/डेबिट कार्ड है तो आप एमपीएमकेवीवीसीएल भोपाल के एचटी संयोग एप्लीकेशन पोर्टल से जुड़े पेमेंट गेटवे के माध्यम से भुगतान कर सकते हैं। </span>
                      </li>
                      <li>
                       If you don't have any way by which you can pay online then go to mponline kiosk, fill the form and pay to that kiosk center. 
                        <br />
                        <span className="text-sm">(यदि आपके पास ऑनलाइन भुगतान करने का कोई विकल्प नहीं हो, तो आप एमपी ऑनलाइन कियोस्क पर जाकर भुगतान कर सकते है।) </span>
                      </li>
                    </ul> */}
                      </li>
                      {/* <li>
                   For documents to be uploaded, Please take care of following things
                    <br />
                    <span className="text-sm">( दस्तावेजों को अपलोड करने के लिए, कृपया निम्न बिन्दुओं का ध्यान रखें। ) </span>
                    <ul className="list-disc ml-6 mt-2 space-y-2">
                      <li>
                        The document should be of type 
                        <br />
                        <span className="text-sm">(दस्तावेज़ केवल पीडीएफ फ़ारमैट मे ही होना चाहिए )</span>
                      </li>
                      <li>
                        File size should be less than 2 mb. 
                        <br />
                        <span className="text-sm">( फ़ाइल की साइज़ 2 एमबी से कम होना चाहिए। ) </span>
                      </li>
                    </ul>
                  </li> */}
                    </ul>
                  </div>
                  {/* <div>
                Important Instructions for Load Change Application
(लोड परिवर्तन हेतु महत्वपूर्ण निर्देश)
To apply for Load Change in HT connection, following documents/details are required:
(एचटी कनेक्शन में लोड परिवर्तन हेतु आवेदन करने के लिए निम्नलिखित दस्तावेज/विवरण आवश्यक हैं)
1.	Geographical Area Map: In case area of supply is expended then upload the Map of Area of Supply.  
(भौगोलिक क्षेत्र मानचित्र: यदि आपूर्ति का क्षेत्र विस्तृत है तो आपूर्ति क्षेत्र का मानचित्र अपलोड करें।)
2.	Load Justification / Technical Details: In case of Load Enhancement load justification / technical details such as sanctioned load, proposed load, connected machinery details etc. may be uploaded for justification of total required Contract Demand
(लोड औचित्य / तकनीकी विवरण: लोड वृद्धि के मामले में, कुल आवश्यक अनुबंध मांग के औचित्य के लिए लोड औचित्य / तकनीकी विवरण जैसे स्वीकृत लोड, प्रस्तावित लोड, कनेक्टेड मशीनरी विवरण आदि अपलोड किए जा सकते हैं।)
________________________________________
Important Points (महत्वपूर्ण बिन्दु):
•	As per Madhya Pradesh Electricity Supply Code, 2021 (and amendments), additional documents may be sought by the Discom during processing.
(मध्य प्रदेश विद्युत आपूर्ति संहिता, 2021 एवं संशोधन अनुसार, प्रसंस्करण के दौरान वितरण कंपनी अतिरिक्त दस्तावेज मांग सकती है।)
•	Revised Supply Voltage Norms (MPERC Supply Code Amendment, 2025):
(संशोधित आपूर्ति वोल्टेज मानक)
o	11 KV → Contract demand 50 kVA to 300 kVA
o	33 KV → Contract demand 100 kVA to 10000 kVA
o	132 KV → Contract demand 5000 kVA to 50000 kVA
o	220 KV & above → Contract demand ≥ 40000 kVA
•	Billing Impact: In case of excess demand, billing will be done as per tariff order and Supply Code provisions.
(यदि उपभोक्ता स्वीकृत माँग से अधिक खपत करता है तो बिलिंग प्रावधान अनुसार की जाएगी।)
•	Online Submission: All documents must be uploaded in PDF format only. File size should be less than 2 MB.
(सभी दस्तावेज केवल पीडीएफ प्रारूप में ही अपलोड किए जाएं, फाइल का आकार 2 एमबी से कम होना चाहिए।)
•	Applicable Charges: Consumer has to pay the charges for registration, Supply Affording Charges and Security Deposit as applicable at the time of Application submission.
(उपभोक्ता को आवेदन जमा करते समय लागू पंजीकरण शुल्क, आपूर्ति वहन शुल्क और सुरक्षा जमा का भुगतान करना होगा।)
•	Demand Note of Extension work and/or ME Cost: If there is any extension work or ME Change required, separate demand note will be issued which have to be paid by consumer before agreement finalization.
(यदि कोई विस्तार कार्य या एमई परिवर्तन आवश्यक है, तो अलग से मांग पत्र जारी किया जाएगा, जिसका भुगतान उपभोक्ता को अनुबंध को अंतिम रूप देने से पहले करना होगा।)
•	Payment of Fees: Registration fees and demand note charges are payable only through online payment / VAN (Virtual Account Number) provided in the challan generated by HT Sanyojan Portal.
(पंजीकरण शुल्क एवं डिमांड नोट का भुगतान केवल ऑनलाइन अथवा एचटी संयोजन पोर्टल से जारी चालान में दिए गए VAN (Virtual Account Number)  के माध्यम से ही किया जाएगा।)
•	Consumer Responsibility: Any bank charges during payment will be borne by the consumer/applicant.
(भुगतान के दौरान यदि बैंक द्वारा कोई शुल्क लगाया जाता है तो वह उपभोक्ता/आवेदक को वहन करना होगा।)


              </div> */}

                  <form onSubmit={handleSubmit}>
                    <div className="border-b border-gray-900/10 pb-12 ">

                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8 bg-gray-300 p-3 rounded-md border-gray shadow-md">

                        <Input
                          LName="Consumer Id"
                          Iname="consumer_id"
                          type="text"
                          value={consumer}
                          placeholder="Please Enter Consumer Id"
                          errorMsg={error.Consumer_id}
                          disabled={isDisabled}
                          onChange={e => setConsumer(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="bg-blue-500 text-white  rounded hover:bg-blue-600 disabled:opacity-50 transition-all duration-200 shadow-md mt-8 mb-1"

                          disabled={isDisabled}
                        >
                          Process
                        </button>
                      </div>
                      {message && <p className="text-red-600 text-sm mt-2 ml-2">{message}</p>}

                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-1/5  p-4'>
          <div className="counts relative rounded-lg shadow-lg p-4 text-center mb-5 bg-white hover:shadow-xl transition-shadow duration-300">
            <Link
              to="/applicant-login"
              className="text-sky-900 font-semibold text-base hover:text-sky-700"
            >
              Track Load Change Application Status
              <br />
              <span className="text-sm text-gray-600">आवेदन की स्थिति जानें</span>
            </Link>
          </div>
        </div>
      </div>


    </>
  );
}
