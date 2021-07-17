export class Beacon {
    public advertising?: ArrayBuffer;
    public parsed_advertising?: any;
    public id: string;
    public uuid?: string;
    public name?: string;
    public rssi?: number;
    public distance?: number;
    public tx?: number;
    public data?: { url?: string, minor?: string, major?: string };
    public coordinate: { lat: number, lng: number, z?: number };

    constructor(beacon: Beacon) {
        beacon.data = {};
        Object.assign(this, beacon);
        beacon.data = beacon.data || {};
    }
}