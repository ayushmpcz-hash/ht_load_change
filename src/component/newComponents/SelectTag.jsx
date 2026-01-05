import React, { useId } from "react";
function SelectTag({
    LName,
    options,
    className = "",
    errorMsg,
    labelKey,
    valueKey,
    disabled,
    ...props
    }, ref) {
    const id = useId()
    
    return (
        <div className="sm:col-span-2 form-group mb-2">
            {LName &&
                <label htmlFor={id} className="block text-lg font-medium text-gray-900">
                    {LName}
                </label>
            }
            <div className="mt-1 form w-ull">
                <select {...props} id={id} ref={ref} disabled={disabled}
                 className={`border p-2 border-gray-400 rounded capitalize w-full ${className}`}>
            <option value="">select {LName}</option>
            {options?.map((option)=>(
                
                <option key={option[labelKey]} value={option[valueKey]}>
                    
                     {option[labelKey]}
                </option>
            ))}
                </select>
            </div>
            {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
        </div>
    );
}
export default React.forwardRef(SelectTag)