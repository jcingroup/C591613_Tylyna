import React = require('react');
import Moment = require('moment');

import { clone, makeInputValue} from '../ts-comm/comm-func';
import {config} from '../ts-comm/def-data';
import {ac_type_comm} from '../action_type';
//view
import {GridTable} from './vwGridTable';
import {GridSearch} from './vwGridSearch';
import {NavPage} from '../components';

export class Grid extends React.Component<any, any>{

    constructor() {
        super();
        this.changeSDVal = this.changeSDVal.bind(this);
        this.submitQuery = this.submitQuery.bind(this);
        this.queryGridData = this.queryGridData.bind(this);

        this.addType = this.addType.bind(this);
        this.deleteItem = this.deleteItem.bind(this);

        this.state = {
        };
    }
    queryGridData(page?: number) {
        let params = this.props.search;

        params['page'] = page == null ? this.props.page_operator.page : page;

        this.props.ajaxGridItem(params);
    }
    submitQuery(e: React.SyntheticEvent) {
        e.preventDefault();

        let params = this.props.search;
        params['page'] = this.props.page_operator.page;

        this.props.callGridLoad(params);
        return;
    }
    changeSDVal(name: string, e: React.SyntheticEvent) {
        let value = makeInputValue(e);
        this.props.setInputValue(ac_type_comm.chg_sch_val, name, value);
    }
    addType() {
        let data: server.ProductKind = {
            product_kind_id: 0,
            kind_name: '',
            sort: 0,
            i_Hide: false,
            i_Lang: 'zh-TW'
        };
        this.props.addRowState(data);
    }
    deleteItem(id: number | string) {
        if (!confirm('確定是否刪除?')) {
            return;
        }
        let params = this.props.search;
        params['page'] = this.props.page_operator.page;
        this.props.callDelete(id, params);
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let p_info: server.PageInfo = pp.page_operator;
        let grid: Array<server.ProductKind> = pp.grid;
        out_html =
            (
                <div>
                    <GridSearch search={pp.search} changeSearchVal={this.changeSDVal} />
                    <GridTable grid={grid}
                        params={pp.params}
                        callSubmit={this.props.callSubmit}
                        setRowInputValue={this.props.setRowInputValue}
                        updateRowState={this.props.updateRowState}
                        cancelRowState={this.props.cancelRowState}/>
                    <footer className="table-footer clearfix">
                        <small className="pull-xs-right">共 {grid.length} 筆</small>
                    </footer>
                </div>
            );

        return out_html;
    }
}