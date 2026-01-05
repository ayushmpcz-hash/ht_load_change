import React from 'react';

function Footer() {
  return (
    <div className="relative isolate overflow-hidden bg-[#0E5063] p-1 ">
      <div class="container mx-auto px-4 h-full">
        <div className="flex border-b border-white">
          <div className="w-2/6 pb-2">
            <div className="col-span-6 px-5">
              <h3 className="text-left text-white font-medium uppercase text-lg mb-2">
                CALL US NOW
              </h3>
              <p className="text-left text-white ">+91 755 2551222</p>
              <p className="text-left text-white">+91 755 2551222</p>
            </div>
          </div>
          <div className="w-1/6"> </div>

          <div className="w-2/6 pb-2">
            <div className="col-span-6 px-5">
              <h3 className="ttext-left text-white font-medium uppercase text-lg mb-2">
                CONNECT WITH US
              </h3>
              <p className="text-left text-white"> +91 755 2551222</p>
            </div>
          </div>
          <div className="w-1/6"> </div>

          <div className="w-3/6 pb-2">
            <span className="text-left text-white font-medium uppercase text-lg mb-2">
              ADDRESS:
            </span>
            <span className="text-left text-white">
              <p>IT CELL, O/O. MANAGING DIRECTOR, MPMKVVCL,</p>
            </span>
            <span className="text-left text-white">
              {' '}
              <p>NISHTHA PARISAR, GOVINDPURA, BHOPAL - 462023.</p>
            </span>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 h-full mt-4">
        <div className="flex">
          <div className="w-3/6 pb-2">
            <div className="col-span-6 px-5">
              <p className="text-left text-white">2023 , ALL RIGHTS RESERVED BY MPMKVVCL</p>
            </div>
          </div>  
 
          <div className="w-2/6 pb-2">
            <p className="text-left text-white">Version 1.3</p>
          </div>
 
          <div className="w-3/6 pb-2">
            <p className="text-left text-white">
              Developed and Managed by : IT CELL, MPMKVVCL BHOPAL
            </p>
          </div>
        </div>
      </div>
    </div> 
  );
}

export default Footer;
