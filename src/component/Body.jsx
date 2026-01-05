import React from 'react';
import mpGovLogo from '../assets/image/mp_gov_logo.png';
import digitalIndia from '../assets/image/digital-india.png';
import coverPage from '../assets/image/cover_page.jpg';
import { Link } from 'react-router-dom';

function Body() {
  return (
    <div className="relative isolate overflow-hidden bg-[#E6E6FF]">
      <div className="flex items-start">
        <div className="w-1/6  p-4">
          {/* <div className="counts relative rounded-sm shadow-lg p-2 text-center mb-5">
            <Link to="#">
              Track Ht NSC Application Status
              <br></br>
              आवेदन की स्थिति जानें
            </Link>
          </div> */}

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
{/* 
          <div className="counts relative rounded-sm shadow-lg p-2 text-center mb-4">
            Track Name Transfer Application Status
            <br></br>
            आवेदन की स्थिति जानें
          </div> */}
        </div>
        <div className="w-4/6">
          <div className="relative mt-2 mb-2 bg-white">
            <div className="flex bg-white border border-[#999] items-center mb-2">
              <div className="w-1/6">
                <div className="flex justify-start">
                  <img alt="" src={mpGovLogo} className="w-20 h-auto" />
                </div>
              </div>
              <div className="w-4/6">
                <p className="text-center text-black text-lg font-bold">
                  उच्चदाब संयोजन पोर्टल... समस्त अति मूल्यवान उच्चदाब उर्जा सेवाओं को सरल, सुलभ एवं
                  पारदर्शी बनाने का एक संकल्प
                </p>
              </div>
              <div className="w-1/6">
                <div className="flex justify-center">
                  <img alt="" src={digitalIndia} className="w-20 h-auto" />
                </div>
              </div>
            </div> 
            <div className="col-span-3">
              <img alt="" src={coverPage} className="w-full h-auto object-cover" />
              <div className="absolute inset-0 flex items-center justify-center  ">
                <h6 className="bg-black/50 text-[16px] md:text-[30px] text-center p-2 text-white w-[90%]">
                  उच्चदाब संयोजन पोर्टल
                </h6>
              </div>
            </div> 

              <div className=" grid grid-cols-[auto_2fr_auto] mx-0 sm:mx-4 md:mx-20 lg:mx-60 items-center rounded-bl-lg rounded-br-lg border border-solid bg-sky-900 overflow-hidden"></div>
            </div> 
        </div>
        <div className="w-1/6  p-4">
          {/* <div className="counts relative rounded-sm shadow-lg p-2 text-center mb-5 bg-[#E6E6FF]">
            Track Application Status
            <br></br>
            आवेदन की स्थिति जानें
          </div> */}

          {/* <div className="counts relative rounded-sm shadow-lg p-2 text-center mb-5">
            Track Application Status
            <br></br>
            आवेदन की स्थिति जानें
          </div> */}

          {/* <div className="counts relative rounded-sm shadow-lg p-2 text-center mb-4">
            Track Application Status
            <br></br>
            आवेदन की स्थिति जानें
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Body;
