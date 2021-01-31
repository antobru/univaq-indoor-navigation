export class Beacon {
    public advertising: ArrayBuffer;
    public parsed_advertising: any;
    public id: string;
    public name: string;
    public rssi: number;
    public distance: number;
    public tx: string;
    public data: { url?: string, minor?: string, major?: string };

    constructor(beacon: Beacon) {
        beacon.data = {};
        Object.assign(this, beacon);
        beacon.data = beacon.data || {};
    }
}