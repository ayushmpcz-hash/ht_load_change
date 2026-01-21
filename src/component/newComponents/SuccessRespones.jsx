import { NavLink, useLocation } from "react-router-dom";
const SuccessRespones = ({}) => {
    const location = useLocation();
  const apiData = location.state || {};
 
  return (
    <>
    <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
        HT Load Change load Sanction
      </h2>
      <div className="overflow-x-auto">
    <div className="bg-white p-14 rounded shadow-md inline-block w-full">
      <div className="rounded-full h-[200px] w-[200px] bg-[#F8FAF5] flex items-center justify-center mx-auto">
        
            <span className="text-[#9ABC66] text-[100px] leading-[200px]">✓</span>
          
          
        
       
      </div>
      <h1 className="text-[#88B04B] font-black text-[40px] mt-4 mb-2">{apiData.message}</h1>
      <p className="text-[#404F5E] text-[20px] text-center">
        Application  submitted successfully 
        <br /> Further processing is under progress !
      </p>
      <div className="border-b border-gray-900/10 pb-12 ">
              <div className="mt-10 flex flex-col justify-center items-center">
                <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">
                  <button className="rounded-lg px-4 py-2 bg-blue-500 text-blue-100 hover:bg-green-600 duration-300">
                    <NavLink to="/dashboard">
                    Dashboard
                    </NavLink>
                    
                  </button>
                  {/* <button className="rounded-lg px-4 py-2 bg-blue-500 text-blue-100 hover:bg-green-600 duration-300">
                    Show Pandding Application
                  </button> */}
                   
                </div>
                
              </div>
            </div>
    </div>
    </div>
    </>
  );
};
export default SuccessRespones;
