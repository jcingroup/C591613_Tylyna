export interface Init_Params {
    no: string,
}
export interface Search_Data {
    keyword?: string;
    order_date?: any;
    pay_date?: any;
    type?: number;
    type_val?: number;
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
    { type: 1, val: 2, name: '確認收款' },
    { type: 2, val: 0, name: '待出貨' },
    { type: 2, val: 1, name: '已出貨' },
    { type: 1, val: -1, name: '訂單取消' },
];
