import React = require('react');
import Moment = require('moment');

interface CheckState {
    Account?: string,
    ReceiptList?: string,
    Product?: string
}

export class Finish extends React.Component<any, CheckState>{

    constructor() {
        super();
        this.state = {
            Account: gb_approot + "User/Account",
            ReceiptList: gb_approot + "User/Receipt_list",
            Product: gb_approot + "Products"
        };
    }
    render() {
        let out_html: JSX.Element = null;

        out_html =
            (
                <div>
                    <h2>感謝您的購買！我們將盡快核對資料出貨。</h2>
                    <h5>
                        您現在可至
                        <a href={this.state.Account} className="text-success">會員資料</a> 的
                        <a href={this.state.ReceiptList} className="text-success">歷史訂單</a> 查看訂單資訊及出貨進度
                    </h5>

                    <a href={this.state.Product} className="btn font-xl btn-success m-t-48">繼續購物 <i className="icon-navigate_next"></i></a>
                </div>
            );

        return out_html;
    }
}


