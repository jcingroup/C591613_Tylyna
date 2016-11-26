declare const enum IPayState {
    //付款狀態
    cancel_order = -1,//取消訂單
    unpaid = 0,//待付款
    paid_uncheck = 1,//已付款,待確認
    paid = 2//已付款
}