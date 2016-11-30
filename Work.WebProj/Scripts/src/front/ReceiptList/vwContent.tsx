import React = require('react');
import Moment = require('moment');

interface CheckState {
    Account?: string,
    ReceiptList?: string,
    Product?: string
}

export class Content extends React.Component<any, CheckState>{

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
                    <header class="text-left underline">
                        <span class="font-xl text-danger">訂單編號：P201610010001</span>
                        如有訂單等問題，請來電洽詢 0979-777-270 或 03-4275832
                        <a href="~/User/Receipt_list" class="font-lg float-r">回列表</a>
                    </header>

                    <table class="payment-list">
                        <caption class="text-left p-a-8 bg-primary text-white">訂單明細</caption>
                        <thead>
                            <tr>
                                <th colspan="2">商品</th>
                                <th>數量</th>
                                <th>單價</th>
                                <th class="text-left">小計</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="pic">
                                    <a href="~/Products/Detail#main" class="text-success"><img src="~/Content/images/Products/pic.jpg" alt="商品縮圖demo" /></a>
                                </td>
                                <td class="text-left">
                                    產品編號: 02-010-01
                                    <h5>耶加雪菲</h5>
                                    規格型號: 10入濾掛包
                                </td>
                                <td>1</td>
                                <td>NT$ 490</td>
                                <td class="text-left">NT$ 490</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="4" class="text-right">運費</td>
                                <td class="text-left">NT$ 80</td>
                            </tr>
                            <tr>
                                <td colspan="4" class="text-right">總計</td>
                                <td class="text-left text-danger">NT$ 500</td>
                            </tr>
                        </tfoot>
                    </table>

                    <table class="payment-list m-t-32">
                        <caption class="text-left p-a-8 bg-primary text-white">收件資訊</caption>
                        <tr>
                            <th>收件人</th>
                            <th>收件人電話</th>
                            <th>收件地址</th>
                            <th>出貨狀態</th>
                            <th class="text-left">付款明細</th>
                        </tr>
                        <tr>
                            <td>王小明</td>
                            <td>00000</td>
                            <td>000000000</td>
                            <td>出貨時間：2016/10/13</td>
                            <td class="text-left">【轉帳匯款】日期：2016/10/13 帳號後5碼：00000</td>
                        </tr>
                    </table>
                </div>
            );

        return out_html;
    }
}


