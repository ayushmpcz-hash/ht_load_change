import React, { Children } from 'react';
import { NavLink } from 'react-router-dom';
// import { HT_HOME_URL } from '../api/api'
('use client');

import { useState } from 'react';
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid';

// const menu=[
//         {label:"Home",path:"/"},
//         {label:"HT NSC Service", children:[
//             {label:"HT New Service Connection(NSC)",path:"/NewServiceConnection"},
//             {label:"HT Load Change (NSC)",path:"/LoadChange"},
//             {label:"HT Name Transfer (NSC)",path:"/NameTransfer"},
//             {label:"HT Green Tariff  (NSC)",path:"/GreenTariff"},

//         ]},
//         {label:"Applicant Login",path:"/applicant_login"},
//         {label:"Department Login",path:"/Department_login"},

//     ]

const products = [
  {
    name: 'Home',
    description: 'Get a better understanding of your traffic',
    href: '/',
    icon: ChartPieIcon,
  },
  {
    name: 'Applicant Login',
    description: 'Speak directly to your customers',
    href: '/applicant_login',
    icon: CursorArrowRaysIcon,
  },
  {
    name: 'Department Login',
    description: 'Your customers’ data will be safe and secure',
    href: '/Department_login',
    icon: FingerPrintIcon,
  },
];
const callsToAction = [
  { name: 'HT New Service Connection(NSC)', href: '/NewServiceConnection', icon: PlayCircleIcon },
  { name: 'HT Load Change (NSC)', href: '/ht-load-change', icon: PhoneIcon },
  { name: 'HT Name Transfer (NSC)', href: '/NameTransfer', icon: PhoneIcon },
  { name: 'HT Green Tariff (NSC)', href: '/GreenTariff', icon: PhoneIcon },
];

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);

// console.log(HT_HOME_URL,"HT_HOME_URLLLLLLLLl")
  return (
    <header className="relative w-full bg-[#1B4560] p-1">
      <nav aria-label="Global" className="flex items-start justify-start">
        <div className="navbar flex items-start justify-start  w-1/5 hidden">
          <NavLink to="/" className="-m-1.5 p-1.5">
            Home
            <img
              alt=""
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              className="h-8 w-auto"
            />
          </NavLink>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
          </button>
        </div>

        <PopoverGroup className="hidden lg:flex lg:gap-x-0 flex items-center justify-start">
          {/* <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
              Ht NSC Service
              <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute top-full -left-8 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
            >
              <div className="p-4">
                {products.map((item, index) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                  >
                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon
                        aria-hidden="true"
                        className="size-6 text-gray-600 group-hover:text-indigo-600"
                      />
                    </div>
                    <div className="flex-auto">
                      <NavLink to={item.href} className="block font-semibold text-gray-900">
                        {item.name}
                        <span className="absolute inset-0" />
                      </NavLink>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                {callsToAction.map(item => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100"
                  >
                    <item.icon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </PopoverPanel>
          </Popover> */}
          {/* <NavLink
            to="/"
            className="text-base font-medium text-white capitalize p-4 hover:bg-[#45c4e9]"
          >
            Home
          </NavLink> */}
          <a
            href={"https://htsanyojan.mpcz.in:8089"}
            className="text-base font-medium text-white capitalize p-4 hover:bg-[#45c4e9]"
          >
            Home
          </a>


          {/*  */}

          {/* <div className="relative inline-block text-left">
      <NavLink
        onClick={() => setOpen(!open)}
        className="text-base font-medium text-white capitalize p-4 hover:bg-[#45c4e9] flex item-center"
      >
        HT NSC Services
        <svg
          className="w-5 h-5 ml-2 -mr-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </NavLink>

      {open && (
        <div className="absolute right-0 mt-2 w-44 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
           <NavLink to="https://htsanyojanuat.mpcz.in:8088/applicationInstructions">
            HT New Service Connection (NSC)
          </NavLink>
          </button>
          <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
           <NavLink to="/ht-load-change">
            HT Load Change (NSC)
          </NavLink>
          </button>
        </div>
      )}
    </div> */}
          <NavLink
            to="/ht-load-change"
            className="text-base font-medium text-white capitalize p-4 hover:bg-[#45c4e9]"
          >
            HT Load Change
          </NavLink>




          <NavLink
            to="department-login"
            className="text-base font-medium text-white capitalize p-4 hover:bg-[#45c4e9]"
          >
            Department Login
          </NavLink>
          <NavLink
            to="applicant-login"
            className="text-base font-medium text-white capitalize p-4 hover:bg-[#45c4e9]"
          >
            Applicant Login
          </NavLink>
          {/* <NavLink to="track-application" className="text-sm/6 font-semibold text-gray-900">
            Track Application
          </NavLink> */}
          {/* <a href="#" className="text-sm/6 font-semibold text-gray-900">
            Marketplace
          </a> */}
          {/* <a href="#" className="text-sm/6 font-semibold text-gray-900">
            Company
          </a> */}
        </PopoverGroup>
        {/* <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="text-sm/6 font-semibold text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div> */}
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                    Product
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-5 flex-none group-data-open:rotate-180"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...products, ...callsToAction].map(item => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Marketplace
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Company
                </a>
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
