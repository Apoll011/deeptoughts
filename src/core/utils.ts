import type {ThoughtBlock, LocationInfo} from "../models/types.ts";

export function generateUUID(): string {
    return crypto.randomUUID();
}

export function sortBlocksByPosition(blocks: ThoughtBlock[]): ThoughtBlock[] {
    return [...blocks].sort((a, b) => a.position - b.position);
}

export function formatLocation(loc: LocationInfo): string {
    const parts: string[] = []

    parts.push(loc.name)

    if (loc.address) parts.push(loc.address)
    if (loc.city) parts.push(loc.city)
    if (loc.country) parts.push(loc.country)

    if (loc.coordinates) {
        parts.push(`(${loc.coordinates.lat}, ${loc.coordinates.lng})`)
    }

    return parts.join(", ")
}

export  function formatWeather(loc: LocationInfo): string {
    const parts: string[] = []

    if (loc.weather?.condition) parts.push(loc.weather.condition)
    if (loc.weather?.temperature) parts.push("" + loc.weather.temperature + "°C")

    return parts.join(", ")
}