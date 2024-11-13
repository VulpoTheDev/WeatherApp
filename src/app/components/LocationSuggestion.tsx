import React from 'react'
import { Location } from '../typings';

export default function LocationSuggestion({ location, selectFunc }: { location: Location, selectFunc: (location: Location) => void; }) {
    return (
        <li
            onClick={() => selectFunc(location)}
            className="p-2 hover:bg-gray-200 cursor-pointer"
        >
            {location.name}, {location.country}
        </li>
    )
}
