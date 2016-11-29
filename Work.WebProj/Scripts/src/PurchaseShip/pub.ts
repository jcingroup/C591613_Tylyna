export interface Search_Data {
    keyword?: string;
    order_start?: any;
    order_end?: any;
}

export interface ShipData {
    p_name?: string;
    Detail?: Array<ShipPD>;
    field?: string;
    sort?: string;
}

export interface ShipPD {
    purchase_no?: string;
    purchase_detail_id?: number;//訂單明細-編號
    product_detail_id?: number;//產品明細-編號
    p_d_pack_type?: number;//產品包裝
    order_date?: any;//下單日期
    receive_name?: string;//購買人
    weight?: number;//重量
    qty?: number;//數量
}
