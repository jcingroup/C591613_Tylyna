export interface Init_Params {
    Email?: string;
    //匯款帳戶資料
    AccountName?: string;
    BankName?: string;
    BankCode?: string;
    AccountNumber?: string;
}

export interface ajaxParams extends Init_Params {
    ship?: Array<server.Shipment>;
}