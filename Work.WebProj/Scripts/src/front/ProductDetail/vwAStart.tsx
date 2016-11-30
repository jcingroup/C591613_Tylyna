import React = require('react');
import Moment = require('moment');
import {TagShowAndHide, InputNum} from '../../components';
import {ac_type_comm} from '../../action_type';
import {IPackTypeData} from '../../ts-comm/def-data';
import {fmt_money} from '../../ts-comm/comm-func';

declare var id: number;

export class AStart extends React.Component<any, any>{

    constructor() {
        super();
        this.openDetailModal = this.openDetailModal.bind(this);
        this.closeDetailModal = this.closeDetailModal.bind(this);
        this.addProductToCart = this.addProductToCart.bind(this);
        this.state = {
        };
    }
    openDetailModal() {
        document.getElementById('detail').style.display = 'block';
    }
    closeDetailModal() {
        document.getElementById('detail').style.display = 'none';
    }
    getPackName(val: number): string {
        let res: string = "";
        let item = IPackTypeData.find(x => x.val === val);
        res = (item != null && item != undefined) ? item.Lname : res;
        return res;
    }
    chgVal(i: number, name: string, value: any, e: React.SyntheticEvent) {
        this.props.setRowInputValue(ac_type_comm.chg_dil_fld_val, i, name, value);
    }
    addProductToCart(detail: server.ProductDetail) {
        let item: server.Product = this.props.field;
        let md: server.PurchaseDetail = {
            purchase_detail_id: 0,
            purchase_no: '',
            product_id: detail.product_id,
            product_detail_id: detail.product_detail_id,
            qty: detail.qty,
            price: detail.price,
            sub_total: detail.qty * detail.price,
            p_d_sn: detail.sn,
            p_d_pack_type: detail.pack_type,
            p_name: item.product_name
        };
        this.props.addCart(md);
    }
    render() {
        let out_html: JSX.Element = null;
        let item: server.Product = this.props.field;
        out_html =
            (<div>
                <div id="detail" className="modal">
                    <form className="modal-content animate-zoom">
                        <button className="btn-close icon-cross" onClick={this.closeDetailModal}></button>
                        <table className="shopping-list">
                            <tbody>
                                {
                                    item.Deatil.map((detail, i) => {
                                        return <tr key={i}>
                                            <td className="item">
                                                {this.getPackName(detail.pack_type) }
                                                <small className="block text-info">NT$ {fmt_money(detail.price) }</small>
                                            </td>
                                            <td className="spec">
                                                {fmt_money(detail.weight) }g/包
                                            </td>
                                            <TagShowAndHide TagName={TagName.Td} show={detail.stock_state === IStockState.replenishment} colSpan={2} className="text-left" key={'d-' + i}>
                                                <span className="label label-secondary font-lg">補貨中</span>
                                            </TagShowAndHide>
                                            <TagShowAndHide TagName={TagName.Td}  show={detail.stock_state !== IStockState.replenishment} className="num"  key={'d-t-' + i}>
                                                <InputNum
                                                    inputClassName="form-element text-center"
                                                    inputViewMode={InputViewMode.edit}
                                                    required={true}
                                                    value={detail.qty}
                                                    onChange= {this.chgVal.bind(this, i, 'qty') }
                                                    min={1}
                                                    />
                                            </TagShowAndHide>
                                            <TagShowAndHide TagName={TagName.Td}  show={detail.stock_state !== IStockState.replenishment} className="add-cart"  key={'d-b-' + i}>
                                                <i className="icon-cart"></i>
                                                <button className="btn" type="button" onClick={this.addProductToCart.bind(this, detail) }>ADD</button>
                                            </TagShowAndHide>
                                        </tr>;
                                    })
                                }
                            </tbody>
                        </table>
                        <footer className="submit text-left">
                            <a href="/Order/Cart" className="btn font-lg bg-success">我要結帳 <i className="icon-navigate_next"></i></a>
                        </footer>
                    </form>
                </div>

                <section className="row">
                    <dl className="col-7 products-intro">
                        <dt>{item.product_name}</dt>
                        <dd dangerouslySetInnerHTML={{ __html: item.info }}>
                        </dd>
                        <dd className="btn-bar">
                        <TagShowAndHide TagName={TagName.Span} show={item.stock_state === IStockState.on_store_shelves}>
                                <a className="btn bg-danger" onClick={this.openDetailModal}>我要購買</a>
                            </TagShowAndHide>
                        <TagShowAndHide TagName={TagName.Span} show={item.stock_state === IStockState.replenishment}>
                                {/* 後台設定補貨中時，上列連結隱藏，下列文字顯示 */}
                                <span className="label label-secondary font-lg">補貨中</span>
                            </TagShowAndHide>
                        </dd>
                    </dl>
                    <TagShowAndHide TagName={TagName.div} className="col-5 products-pic" show={item.img_src != null}>
                        <img src={item.img_src} alt={item.product_name} />
                    </TagShowAndHide>
                </section>
                <section className="editor" dangerouslySetInnerHTML={{ __html: item.more_info }}>
                </section>
            </div>
            );

        return out_html;
    }
}


