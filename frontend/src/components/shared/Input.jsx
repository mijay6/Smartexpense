export function Input({
    label,
    type = 'text',
    name,          
    value,
    onChange,
    placeholder,
    required = false,
    error,
    min,
    step,
    maxLength,
}){
    return (
        <div className="mb-4" >
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1"> 
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                name={name}         // ← NUEVO: Pasar name al input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                min={min}
                step={step}
                maxLength={maxLength}
                lang="en-GB"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}     
        </div>
    );
}

export default Input;