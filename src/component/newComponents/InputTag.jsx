// import React, { useId } from "react";
// const InputTag = React.forwardRef(function InputTag({
//     LName,
//     type = 'text',
//     className = "",
//     placeholder,
//     errorMsg,
//     disabled,
//     // register,
//     // name
//     ...props
// }, ref) {
//     const id = useId()
//     return (
//         <div className="sm:col-span-2 font-group">
//             {LName &&
//                 <label htmlFor={id} className="block text-lg font-medium text-gray-900">
//                     {LName}
//                 </label>
//             }
//             <div className="mt-2">
//                 <input
//                     type={type}
//                     placeholder={placeholder}
//                     autoComplete="off"
//                     className={`border p-2 border-gray-400 rounded capitalize w-full ${className}`}
//                     ref={ref}
//                     // {...register}
//                     {...props}
//                     id={id}
//                     disabled={disabled}
//                 />
//             </div>
//             {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
//         </div>
//     );
// })
// export default InputTag

import React, { useId, useState } from "react";

const InputTag = React.forwardRef(function InputTag({
    LName,
    type = 'text',
    className = "",
    placeholder,
    errorMsg,
    disabled,
    acceptPdfOnly = false,   // ⭐ NEW PROP (default false)
    ...props
}, ref) {

    const id = useId();
    const [fileError, setFileError] = useState("");

    // ⭐ File validation
    const handleFileChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        // Only PDF validation
        if (acceptPdfOnly) {

            if (file.type !== "application/pdf") {

                setFileError("Only PDF files are allowed.");

                e.target.value = ""; // clear file

                return;
            }

        }

        setFileError("");

        // React-hook-form support
        if (props.onChange) {
            props.onChange(e);
        }
    };


    return (
        <div className="sm:col-span-2 font-group">

            {LName &&
                <label htmlFor={id} className="block text-lg font-medium text-gray-900">
                    {LName}
                </label>
            }

            <div className="mt-2">

                <input
                    type={type}
                    placeholder={placeholder}
                    autoComplete="off"
                    className={`border p-2 border-gray-400 rounded capitalize w-full ${className}`}
                    ref={ref}
                    {...props}
                    id={id}
                    disabled={disabled}

                    // ⭐ Accept only pdf
                    accept={type === "file" && acceptPdfOnly ? ".pdf" : undefined}

                    // ⭐ Validation
                    onChange={type === "file" ? handleFileChange : props.onChange}

                />

            </div>

            {/* React Hook Form Error */}
            {errorMsg &&
                <p className="text-red-500 text-sm mt-1">
                    {errorMsg}
                </p>
            }

            {/* File Error */}
            {fileError &&
                <p className="text-red-500 text-sm mt-1">
                    {fileError}
                </p>
            }

        </div>
    );
});

export default InputTag;