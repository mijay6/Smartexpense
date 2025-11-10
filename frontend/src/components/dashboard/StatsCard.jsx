export function StatsCard({ title, value, change, icon: Icon, iconColor }) {

    return (
        <div className={"bg-white rounded-lg shadow border border-gray-200 p-4"}>
            <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500">{title}</p>
                <div className={`p-1.5 rounded-lg ${iconColor}`}>
                    <Icon className="h-3 w-3 text-white" />
                </div>
            </div>
            <div className="text-xl font-semibold text-gray-900">{value}</div>
            {change &&  (<p className="text-xs text-gray-500 mt-1">{change}</p>)}
        </div>
    );
}

export default StatsCard;