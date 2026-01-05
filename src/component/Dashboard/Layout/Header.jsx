
// import logo from '../../../assets/image/logo.jpg'
// import Modal from '../Modal'
// import { useState } from 'react';

// const Header = ({ toggleSidebar }) => {
//   const [ModalIsOpen, setModalIsOpen] = useState(false);

//   const openModal = () => {
//     console.log(ModalIsOpen,'ModalIsOpen')
//     setModalIsOpen(true);
//   };

//   const closeModal = () => {
//     setModalIsOpen(() => setModalIsOpen(prev => !prev));
//   };
//   return (
//     <header className="flex-shrink-0 shadow bg-white">
//       <div className="flex items-center justify-between p-2">
//         {/* Navbar left */}
//         <div className="flex items-center space-x-3">
//           <span className="p-2 text-xl font-semibold tracking-wider uppercase lg:hidden">K-WD</span>
//           <button onClick={toggleSidebar} className="p-2 rounded-md focus:outline-none focus:ring">
//             <svg
//               className="w-4 h-4 text-gray-600 transition-transform"
//               style={{ transform: 'rotate(0deg)' }}
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
//             </svg>
//           </button>
//         </div>

//         {/* Desktop search box */}
//         <div className="items-center hidden px-2 space-x-2 md:flex-1 md:flex md:mr-auto md:ml-5">
//           <span>
//             <svg
//               className="w-5 h-5 text-gray-500"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//           </span>
//           <input
//             type="text"
//             placeholder="Search"
//             className="px-4 py-3 rounded-md hover:bg-gray-100 lg:max-w-sm md:py-2 md:flex-1 focus:outline-none md:focus:bg-gray-100 md:focus:shadow md:focus:border"
//           />
//         </div>

//         {/* Navbar right */}
//         <div className="relative flex items-center space-x-3">
//           <div className="relative">
//             <div className="absolute right-0 p-1 bg-red-400 rounded-full animate-ping"></div>
//             <div className="absolute right-0 p-1 bg-red-400 border rounded-full"></div>
//             <button className="" onClick={() => openModal()}>
//               <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
//                 <path d="M18.5 19.5L20 21M4 21C4 17.134 7.13401 14 11 14M19 17.5C19 18.8807 17.8807 20 16.5 20C15.1193 20 14 18.8807 14 17.5C14 16.1193 15.1193 15 16.5 15C17.8807 15 19 16.1193 19 17.5ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//                 />
//               </svg>
//             </button>
//           </div>


//           {/* Avatar */}
//           <div className="relative">
//             <button className="p-1 bg-gray-200 rounded-full focus:outline-none focus:ring">
//               <img
//                 className="object-cover w-8 h-8 rounded-full"
//                 src={logo}
//                 alt="logo"
//               />
//             </button>
//             <div className="absolute right-0 p-1 bg-green-400 rounded-full bottom-3 animate-ping"></div>
//             <div className="absolute right-0 p-1 bg-green-400 border border-white rounded-full bottom-3"></div>
//           </div>
//         </div>
//       </div>
//       {ModalIsOpen && <Modal closeModal={closeModal} />}

//     </header>
//   );
// };

// export default Header;


import logo from '../../../assets/image/logo.jpg'
import Modal from '../Modal'
import { useState, useMemo } from 'react';
import { useSelector,useDispatch } from "react-redux";
import {setSearchText} from "../../../redux/slices/userSlice"
const Header = ({ toggleSidebar }) => {
  const [ModalIsOpen, setModalIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [value, setValue] = useState("");

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleSearch = (e) => {
    const val = e.target.value;
    console.log(val,'valueeeee')
    setValue(val);
    dispatch(setSearchText(val));   // 👈 GLOBAL UPDATE
  };

  // const openModal = () => {
  //   console.log(ModalIsOpen,'ModalIsOpen')
  //   setModalIsOpen(true);
  // };

  // const closeModal = () => {
  //   setModalIsOpen(() => setModalIsOpen(prev => !prev));
  // };

  return (
    <header className="flex-shrink-0 shadow bg-white">
      <div className="flex items-center justify-between p-2">
        {/* Navbar left */}
        <div className="flex items-center space-x-3">
          <span className="p-2 text-xl font-semibold tracking-wider uppercase lg:hidden">K-WD</span>
          <button onClick={toggleSidebar} className="p-2 rounded-md focus:outline-none focus:ring">
            <svg
              className="w-4 h-4 text-gray-600 transition-transform"
              style={{ transform: 'rotate(0deg)' }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Desktop search box */}
        <div className="items-center hidden px-2 space-x-2 md:flex-1 md:flex md:mr-auto md:ml-5">
          <span>
            <svg
              className="w-5 h-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
              <input
      type="text"
      value={value}
      onChange={handleSearch}
      placeholder="Search Application No / Consumer Name"
      className="px-4 py-2 rounded-md border focus:ring"
    />
        </div>

        {/* Navbar right */}
        <div className="relative flex items-center space-x-3">
          <div className="relative">
            <div className="absolute right-0 p-1 bg-red-400 rounded-full animate-ping"></div>
            <div className="absolute right-0 p-1 bg-red-400 border rounded-full"></div>
            <button className="" onClick={() => openModal()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                <path d="M18.5 19.5L20 21M4 21C4 17.134 7.13401 14 11 14M19 17.5C19 18.8807 17.8807 20 16.5 20C15.1193 20 14 18.8807 14 17.5C14 16.1193 15.1193 15 16.5 15C17.8807 15 19 16.1193 19 17.5ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
          </div>


          {/* Avatar */}
          <div className="relative">
            <button className="p-1 bg-gray-200 rounded-full focus:outline-none focus:ring" onClick={openModal}>
              <img
                className="object-cover w-8 h-8 rounded-full"
                src={logo}
                alt="logo"
              />
            </button>
            <div className="absolute right-0 p-1 bg-green-400 rounded-full bottom-3 animate-ping"></div>
            <div className="absolute right-0 p-1 bg-green-400 border border-white rounded-full bottom-3"></div>
          </div>
        </div>
      </div>
      {ModalIsOpen && <Modal closeModal={closeModal} />}

    </header>
  );
};

export default Header;