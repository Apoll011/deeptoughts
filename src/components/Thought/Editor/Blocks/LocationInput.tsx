import {type LocationInfo, type ThoughtBlock, weatherConditions, weatherIcons} from "../../../../models/types.ts";
import {MapPin, Thermometer} from "lucide-react";

export function LocationInput({block, onUpdateBlock, onUseCurrentLocation}: { block: ThoughtBlock, onUpdateBlock: (id: string, updates: Partial<ThoughtBlock>) => void, onUseCurrentLocation: (blockId: string) => void}) {
    return (
        <div className="space-y-4">
            <button
                onClick={() => onUseCurrentLocation(block.id)}
                className="flex items-center w-full justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
                <MapPin className="w-4 h-4" />
                <span>Use current location</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                    type="text"
                    value={block.location?.name || ''}
                    onChange={(e) => onUpdateBlock(block.id, {
                        location: { ...block.location, name: e.target.value } as LocationInfo
                    })}
                    placeholder="Location name"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <input
                    type="text"
                    value={block.location?.address || ''}
                    onChange={(e) => onUpdateBlock(block.id, {
                        location: { ...block.location, address: e.target.value } as LocationInfo
                    })}
                    placeholder="Address"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <input
                    type="text"
                    value={block.location?.city || ''}
                    onChange={(e) => onUpdateBlock(block.id, {
                        location: { ...block.location, city: e.target.value } as LocationInfo
                    })}
                    placeholder="City"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <input
                    type="text"
                    value={block.location?.country || ''}
                    onChange={(e) => onUpdateBlock(block.id, {
                        location: { ...block.location, country: e.target.value } as LocationInfo
                    })}
                    placeholder="Country"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                    <Thermometer className="w-4 h-4" />
                    <span>Weather</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select
                        value={block.location?.weather?.condition || 'clear'}
                        onChange={(e) => onUpdateBlock(block.id, {
                            location: {
                                ...block.location,
                                weather: {
                                    ...block.location?.weather,
                                    condition: e.target.value,
                                    icon: weatherIcons[e.target.value]
                                }
                            } as LocationInfo
                        })}
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                        {weatherConditions.map(condition => (
                            <option key={condition} value={condition}>
                                {weatherIcons[condition]} {condition.charAt(0).toUpperCase() + condition.slice(1).replace('-', ' ')}
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center space-x-2 w-full">
                        <input
                            type="number"
                            value={block.location?.weather?.temperature ?? ''}
                            onChange={(e) =>
                                onUpdateBlock(block.id, {
                                    location: {
                                        ...block.location,
                                        weather: {
                                            ...block.location?.weather,
                                            temperature: parseInt(e.target.value),
                                        },
                                    } as LocationInfo,
                                })
                            }
                            placeholder="Temperature"
                            className="w-[100%] pl-3 pr-2 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <span className="text-sm font-semibold text-gray-700">°C</span>
                    </div>

                </div>
            </div>
        </div>
    );
}