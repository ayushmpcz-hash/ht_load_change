import React from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ApplicantBasicDetails } from '../../importComponents';

const LoadAgreementFinalizeView = () => {
  const location = useLocation();
  const { items } = location.state || {};

  const {
    register,
    formState: { errors },
  } = useForm({
    defaultValues: items || {},
  });

  return (
    <>
      <div className="card mt-2 mb-2 bg-white rounded shadow-md">
        <div className="card-header px-4 py-2 border-b border-gray-300">
          <h2 className="text-lg font-bold capitalize">
            HT Load Change – Agreement Finalize
          </h2>
        </div>

        <div className="card-body px-4 pb-4">
          <div className="mt-6 overflow-x-auto">
            <ApplicantBasicDetails
              htConsumers={items}
              register={register}
              errors={errors}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadAgreementFinalizeView;
