import React, { useId } from "react";
const InputTag = React.forwardRef(function InputTag({
    LName,
    type = 'text',
    className = "",
    placeholder,
    errorMsg,
    disabled,
    // register,
    // name
    ...props
}, ref) {
    const id = useId()
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
                    // {...register}
                    {...props}
                    id={id}
                    disabled={disabled}
                />
            </div>
            {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
        </div>
    );
})
export default InputTag