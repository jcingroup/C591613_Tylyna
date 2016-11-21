interface Array<T> {
    movesort(old_index: number, new_index: number): void;
    sum<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): number;

}

interface Number {
    floatSpot(pos: number): number
    divisor(num: number): number
}

interface Window {
    CallRefreshReportList(): void;
}

interface SignalR {
    HubFileState: any
}
