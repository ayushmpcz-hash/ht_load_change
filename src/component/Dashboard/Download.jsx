import React, { useState} from 'react';
import { useSelector } from 'react-redux';
import { useLocation} from 'react-router-dom'
import { useForm } from 'react-hook-form';

import {ApplicantBasicDetails,AlertModalBox} from '../importComponents.js';
const Download = () => {
  const location = useLocation();
  const { items } = location.state || {};
  
  const {register,formState: { errors },} = useForm({defaultValues: items || {},});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(() => () => {});
  const showModal = (message, action = () => {}) => {
    setModalMessage(message);
    setModalAction(() => action); // save callback
    setModalOpen(true);
  };
  return (
    <>
      <div>
          <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
            <div className="card-header px-4 py-2 border-b border-gray-300">
              <h2 className="text-lg font-bold capitalize ">
                HT Load Change load Sanction
                </h2>
            </div>
            <div className="card-body px-4 pb-4">
              <div className="mt-6 overflow-x-auto">
                <div className="">
                  <AlertModalBox
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    message={modalMessage}
                    onConfirm={modalAction}
                  />
                  <ApplicantBasicDetails htConsumers={items} register={register} errors={errors} />
                </div>
              </div>
            </div>
          </div>
      </div>
    </>
  );
};
export default Download;
