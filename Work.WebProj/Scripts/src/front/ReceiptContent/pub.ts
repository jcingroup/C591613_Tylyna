export interface Init_Data {

}

export interface Search_Data {
    id?: number;
    state?: number;
    state_val?: number;
}

export interface ReceiptList extends server.PurchaseDetail {
    order_date?: any;
    pay_type?: number;
    pay_state?: number;
    ship_state?: number;
}

export interface IOrderState extends Search_Data {
    name?: string;
}
export const IOrderStateData: Array<IOrderState> = [
    { id: null, state: null, state_val: null, name: '全部' },
    { id: 1, state: 1, state_val: 0, name: '待付款' },
    { id: 2, state: 1, state_val: 1, name: '已付款待確認' },
    { id: 3, state: 1, state_val: 2, name: '已付款' },
    { id: 4, state: 2, state_val: 0, name: '待出貨' },
    { id: 5, state: 2, state_val: 1, name: '已出貨' },
    { id: 6, state: 1, state_val: -1, name: '取消訂單' },
    { id: 7, state: 3, state_val: null, name: '完成訂單' },
];
