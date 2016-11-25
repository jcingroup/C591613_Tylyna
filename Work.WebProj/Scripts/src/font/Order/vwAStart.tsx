import React = require('react');
import Moment = require('moment');
import {TagShowAndHide, InputNum, PWButton} from '../../components';
import {ac_type_comm} from '../../action_type';
import {config, UIText, IHideTypeData, IStockStateData, IPackTypeData} from '../../ts-comm/def-data';

export class AStart extends React.Component<any, any>{

    constructor() {
        super();
        this.state = {
        };
    }
    chgVal(i: number, name: string, value: any, e: React.SyntheticEvent) {
        let grid: Array<server.PurchaseDetail> = this.props.grid;
        let sub_total: number = grid[i].price * value;

        this.props.setRowInputValue(ac_type_comm.chg_grid_val, i, name, value);
        this.props.setRowInputValue(ac_type_comm.chg_grid_val, i, "sub_total", sub_total);
    }
    getPackName(val: number): string {
        let res: string = "";
        let item = IPackTypeData.find(x => x.val === val);
        res = (item != null && item != undefined) ? item.Lname : res;
        return res;
    }
    delProduct(id: number) {
        if (!confirm(UIText.delete_sure)) {
            return;
        }
        this.props.delProduct(id);
    }
    chgProductQty(i) {
        let grid: Array<server.PurchaseDetail> = this.props.grid;

        this.props.chgProductQty(grid[i].product_detail_id, grid[i].qty);
    }
    render() {
        let out_html: JSX.Element = null;
        let grid: Array<server.PurchaseDetail> = this.props.grid;
        out_html =
            (<div>
                <section className="m-b-32 text-left">
                    <h2 className="payment-title"><em>1</em>確定訂單明細</h2>
                    <table className="payment-list">
                        <tr>
                            <th colSpan="2">商品</th>
                            <th>數量</th>
                            <th>單價</th>
                            <th className="text-left">小計</th>
                        </tr>
                        <tr>
                            <td className="pic">
                                <a href="~/Products/Detail#main" className="text-success"><img src="~/Content/images/Products/pic.jpg" alt="商品縮圖demo" /></a>
                            </td>
                            <td className="text-left">
                                產品編號: 02-010-01
                                <h5>耶加雪菲</h5>
                                規格型號: 10入濾掛包 <a href="~/Products/Detail#main" className="text-success m-l-16">查看產品介紹</a>
                            </td>
                            <td>1</td>
                            <td>NT$ 490</td>
                            <td className="text-left">NT$ 490</td>
                        </tr>
                        <tfoot>
                            <tr>
                                <td colSpan="3" className="text-left">
                                    <span className="radio-group">
                                        <input type="radio" name="pay" id="pay1" />
                                        <label for="pay1" className="icon"></label>轉帳匯款(未滿NT$1000 運費NT$80)
                                    </span>

                                    <span className="radio-group">
                                        <input type="radio" name="pay" id="pay2" />
                                        <label for="pay2" className="icon"></label>貨到付款(未滿NT$2000 運費NT$120 手續費NT$30)
                                    </span>
                                </td>
                                <td className="text-right">運費</td>
                                <td className="text-left">NT$ 80</td>
                            </tr>
                            <tr>
                                <td colSpan="4" className="text-right">總計</td>
                                <td className="text-left text-danger">NT$ 500</td>
                            </tr>
                        </tfoot>
                    </table>
                </section>
            </div>
            );

        return out_html;
    }
}


