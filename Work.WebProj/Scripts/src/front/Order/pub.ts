export interface Init_Data {
    purchase: server.Purchase,
    ship: Array<server.Shipment>,
    discount: Array<server.Discount>
}