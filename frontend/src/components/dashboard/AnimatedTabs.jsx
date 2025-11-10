import { motion } from 'framer-motion';

export function AnimatedTabs({ value, onValueChange, tabs }) {

    const activeIndex = tabs.findIndex(tab => tab.value === value);

    return(
        <div className="relative inline-flex items-center bg-gray-100 p-1 rounded-lg">
            {/* animated background*/}
            <motion.div
                className="absolute h-[calc(100%-8px)] rounded-md bg-white shadow-sm z-0" 
                initial={false}
                animate={{
                    left: `${(activeIndex * 100 / tabs.length) + 1}%`,
                    width: `calc(${100 / tabs.length}% - 8px)`,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 40}}
            />
            { /* tabs */}
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={()=> onValueChange(tab.value)}
                    className={`relative z-10 px-3 py-1.5 text-xs transition-colors rounded-md cursor-pointer ${
                    value === tab.value
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={{ minWidth: '85px' }}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export default AnimatedTabs;