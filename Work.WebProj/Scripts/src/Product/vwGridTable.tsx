import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {UIText, IHideTypeData} from '../ts-comm/def-data';
import {PWButton, RadioBox} from '../components';
import { OrderButton } from '../ts-comm/OrderButton';
import {ac_type_comm} from '../action_type';
import {Init_Params, Search_Data} from './pub';


export class GridTable extends React.Component<any, any>{

    constructor() {
        super();
        this.setSort = this.setSort.bind(this);
        this.state = {
        };
    }
    setSort(field, sort) {
        let pinfo = this.props.page_operator;
        var parms = {
            page: pinfo.page,
            sort: sort,
            field: field
        };
        $.extend(parms, this.props.search);

        this.props.callGridLoad(parms);
    }
    deleteItem(id: number | string) {
        if (!confirm(UIText.delete_sure)) {
            return;
        }
        let params = this.props.search;
        params['page'] = this.props.page_operator.page;
        this.props.callDelete(id, params);
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let grid: Array<server.Product> = pp.grid;
        out_html =
            (
                <table className="table table-sm table-bordered table-striped table-hover">
                    <colgroup>
                        <col span={2} style={{ "width": "5%" }} />
                        <col span={3} />
                        <col span={2} style={{ "width": "8%" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th className="text-xs-center">{UIText.delete}</th>
                            <th className="text-xs-center">{UIText.modify}</th>
                            <th>
                                <OrderButton
                                    title="	主分類"
                                    field={'product_kind_id'}
                                    sort={pp.page_operator.sort}
                                    now_field={pp.page_operator.field}
                                    setSort={this.setSort} />
                            </th>
                            <th>產品品名</th>
                            <th>包裝規格</th>
                            <th>
                                <OrderButton
                                    title="前台顯示"
                                    field={'i_Hide'}
                                    sort={pp.page_operator.sort}
                                    now_field={pp.page_operator.field}
                                    setSort={this.setSort} />
                            </th>
                            <th>
                                <OrderButton
                                    title="排序"
                                    field={'sort'}
                                    sort={pp.page_operator.sort}
                                    now_field={pp.page_operator.field}
                                    setSort={this.setSort} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {grid.map((item, i) => {
                            return <tr key={i}>
                                <td className="text-xs-center">
                                    <PWButton iconClassName="fa-times" className="btn btn-link btn-lg text-danger"
                                        title={UIText.delete} enable={true} onClick={this.deleteItem.bind(this, item.product_id) } />
                                </td>
                                <td className="text-xs-center">
                                    <PWButton iconClassName="fa-pencil" className="btn btn-link btn-lg"
                                        title={UIText.modify} enable={true} onClick={this.props.callUpdateItem.bind(this, item.product_id) } />
                                </td>
                                <td>{item.kind_name}</td>
                                <td>{item.product_name}</td>
                                <td>
                                    <span className="w3-tag label-primary">10入濾掛式包</span>
                                    <span className="w3-tag label-primary">5入濾掛式包</span>
                                    <span className="w3-tag label-primary">袋裝咖啡豆</span>
                                </td>
                                <td className="text-xs-center">
                                    <RadioBox
                                        inputViewMode={InputViewMode.view}
                                        name={"i_Hide-" + i}
                                        id={"i_Hide-" + i}
                                        value={item.i_Hide}
                                        radioList={IHideTypeData}
                                        />
                                </td>
                                <td className="text-xs-center">{item.sort}</td>
                            </tr>;
                        }) }
                    </tbody>
                </table>
            );

        return out_html;
    }
}