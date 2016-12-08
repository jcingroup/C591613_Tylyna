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
