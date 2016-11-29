import React = require('react');
import Moment = require('moment');
import {TagShowAndHide, InputNum, PWButton} from '../../components';
import {ac_type_comm} from '../../action_type';
import {UIText, IPackTypeData} from '../../ts-comm/def-data';
import {fmt_money} from '../../ts-comm/comm-func';

export class AStart extends React.Component<any, any>{

    constructor() {
        super();
        this.goOrder = this.goOrder.bind(this);
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
        if (grid[i].qty < 1) {
            alert(`產品編號:${grid[i].p_d_sn}數量不可小於1!`);
            return;
        }
        this.props.chgProductQty(grid[i].product_detail_id, grid[i].qty);
    }
    goOrder() {
        location.href = gb_approot + "Order/Step1_order";
    }
    render() {
        let out_html: JSX.Element = null;
        let grid: Array<server.PurchaseDetail> = this.props.grid;
        out_html =
            (<div>
                <h2 className="text-left">購物車</h2>
                <table className="cart-list">
                    <thead>
                        <tr>
                            <th colSpan="2">商品</th>
                            <th>數量</th>
                            <th>單價</th>
                            <th>小計</th>
                            <th>刪除</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TagShowAndHide TagName={TagName.Tr} show={grid.length <= 0}>
                            <td colSpan="6">目前購物車無產品資料...</td>
                        </TagShowAndHide>
                        {
                            grid.map((item, i) => {
                                return <tr key={i}>
                                    <td className="pic"><img src={item.img_src} alt={item.p_name} /></td>
                                    <td className="text-left">
                                        產品編號: {item.p_d_sn}
                                        <h5>{item.p_name}</h5>
                                        規格型號: {this.getPackName(item.p_d_pack_type) }
                                    </td>
                                    <td>
                                        <InputNum
                                            inputClassName="form-element text-center"
                                            inputViewMode={InputViewMode.edit}
                                            required={true}
                                            value={item.qty}
                                            onChange= {this.chgVal.bind(this, i, 'qty') }
                                            min={1}
                                            onBlur={this.chgProductQty.bind(this, i) }
                                            />
                                    </td>
                                    <td>NT$ {fmt_money(item.price) }</td>
                                    <td><strong>NT$ {fmt_money(item.sub_total) }</strong></td>
                                    <td>
                                        <button className="font-xl text-danger icon-trash-can2" type="button" title="刪除此項商品" onClick={this.delProduct.bind(this, item.product_detail_id) }></button>
                                    </td>
                                </tr>;
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="6" className="text-right">
                                總計：<strong className="text-danger">NT$ {fmt_money(grid.sum(x => x.sub_total)) }</strong> (未含運費)
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <footer className="submit">
                    <a href={gb_approot + "Products"} className="float-l icon-navigate_before">繼續選購</a>
                    <PWButton className="float-r btn font-lg btn-success" iconClassName="icon-navigate_next"
                        enable={grid.length > 0} onClick={this.goOrder}>確定結帳</PWButton>
                </footer>
            </div>
            );

        return out_html;
    }
}


