export interface Init_Params {
    no: string,
}
export interface Search_Data {
    keyword?: string;
    pay_start?: any;
    pay_end?: any;
    state?: number;
}

export interface Init_Data {

}

export interface IOrderState {
    type?: number;
    val?: number;
    name?: string;
}
export const IOrderStateData: Array<IOrderState> = [
    { type: null, val: null, name: '全部' },
    { type: 1, val: 0, name: '待付款' },
    { type: 1, val: 1, name: '已付款待確認' },
    { type: 1, val: 2, name: '已付款' },
    { type: 2, val: 0, name: '待出貨' },
    { type: 2, val: 1, name: '已出貨' },
    { type: 1, val: -1, name: '取消訂單' },
];
