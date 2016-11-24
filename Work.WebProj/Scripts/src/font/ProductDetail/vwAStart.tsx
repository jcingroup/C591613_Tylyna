import React = require('react');
import Moment = require('moment');
import {TagShowAndHide, InputNum} from '../../components';
import {ac_type_comm} from '../../action_type';
import {config, UIText, IHideTypeData, IStockStateData, IPackTypeData} from '../../ts-comm/def-data';

declare var id: number;

export class AStart extends React.Component<any, any>{

    constructor() {
        super();
        this.openDetailModal = this.openDetailModal.bind(this);
        this.closeDetailModal = this.closeDetailModal.bind(this);
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
    renderDetail(i: number, detail: server.ProductDetail) {
        let d_html = [];
        if (detail.stock_state === StockState.replenishment) {//補貨中
            d_html.push(
                <td colSpan="2" className="text-left" key={'d-' + i}>
                    <span className="label label-secondary font-lg">補貨中</span>
                </td>
            );
        } else {
            d_html.push(
                <td className="num"  key={'d-t-' + i}>
                    <InputNum
                        inputClassName="form-element text-center"
                        inputViewMode={InputViewMode.edit}
                        required={true}
                        value={detail.qty}
                        onChange= {this.chgVal.bind(this, i, 'qty') }
                        min={1}
                        /> { }
                </td>
            );
            d_html.push(
                <td className="add-cart"  key={'d-b-' + i}>
                    <i className="icon-cart"></i>
                    <button className="btn">ADD</button>
                </td>
            );
        }
        return d_html;
    }
    render() {
        let out_html: JSX.Element = null;
        let item: server.Product = this.props.field;
        out_html =
            (<div>
                <div id="detail" className="modal">
                    <button className="btn-close icon-cross" onClick={this.closeDetailModal}></button>
                    <form className="modal-content animate-zoom">
                        <table className="shopping-list">
                            <tbody>
                                {
                                    item.Deatil.map((detail, i) => {
                                        return <tr key={i}>
                                            <td className="item">
                                                {this.getPackName(detail.pack_type) }
                                                <small className="block text-info">NT$ {detail.price}</small>
                                            </td>
                                            <td className="spec">
                                                {detail.weight}g/包
                                            </td>
                                            {this.renderDetail(i, detail) }
                                        </tr>;
                                    })
                                }
                            </tbody>
                        </table>
                    </form>
                </div>

                <section className="row">
                    <dl className="col-7 products-intro">
                        <dt>{item.product_name}</dt>
                        <dd dangerouslySetInnerHTML={{ __html: item.info }}>
                        </dd>
                        <dd className="btn-bar">
                            <TagShowAndHide TagName={TagName.Span} show={item.stock_state === StockState.on_store_shelves}>
                                <a className="btn bg-danger" onClick={this.openDetailModal}>我要購買</a>
                            </TagShowAndHide>
                            <TagShowAndHide TagName={TagName.Span} show={item.stock_state === StockState.replenishment}>
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


