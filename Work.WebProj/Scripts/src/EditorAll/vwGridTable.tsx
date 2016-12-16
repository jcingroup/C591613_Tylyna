import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {config, UIText, IHideTypeData} from '../ts-comm/def-data';
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
        let grid: Array<server.Editor_L1> = pp.grid;
        out_html =
            (
                <table className="table table-sm table-bordered table-striped table-hover">
                    <colgroup>
                        <col span="2" style={{ "width": "8%" }} />
                        <col />
                        <col style={{ "width": "14%" }} />
                        <col span="4" style={{ "width": "10%" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th className="text-xs-center">{UIText.delete}</th>
                            <th className="text-xs-center">{UIText.modify}</th>
                            <th className="text-xs-center">
                                <OrderButton
                                    title="名稱"
                                    field={'name'}
                                    sort={pp.page_operator.sort}
                                    now_field={pp.page_operator.field}
                                    setSort={this.setSort} />
                            </th>
                            <th className="text-xs-center">
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
                                        title={UIText.delete} enable={true} onClick={this.deleteItem.bind(this, item.editor_l1_id) } />
                                </td>
                                <td className="text-xs-center">
                                    <PWButton iconClassName="fa-pencil" className="btn btn-link btn-lg"
                                        title={UIText.modify} enable={true} onClick={this.props.callUpdateItem.bind(this, item.editor_l1_id) } />
                                </td>
                                <td>{item.name}</td>
                                <td className="text-xs-center">{item.sort}</td>
                            </tr>;
                        }) }
                    </tbody>
                </table>
            );

        return out_html;
    }
}