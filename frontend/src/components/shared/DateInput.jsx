import DatePicker from 'react-datepicker';
import { enGB } from 'date-fns/locale';

export function DateInput({
    label,
    name,
    value,
    onChange,
    required = false,
    error,
    placeholder = 'Select date',
}) {
    const dateValue = value ? new Date(value) : null;

    const handleChange = (date) => {
        if (!date) {
            onChange({ target: { name, value: '' } });
            return;
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        onChange({ target: { name, value: formattedDate } });
    };

    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <DatePicker
                selected={dateValue}
                onChange={handleChange}
                dateFormat="dd/MM/yyyy"
                locale={enGB}
                placeholderText={placeholder}
                isClearable
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`}
                wrapperClassName="w-full"
                calendarClassName="border rounded-lg shadow-lg"
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}

export default DateInput;
