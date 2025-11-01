export function Select({
    label,
    name,          
    value,
    onChange,
    options = [],
    placeholder = 'Select...',
    required = false,
    error,
}) {
    return(   
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select 
                name={name}       
                value={value}
                onChange={onChange}
                required={required}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`}
            >
                <option value="">{placeholder}</option>
                {Array.isArray(options) && options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}    
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}

export default Select;