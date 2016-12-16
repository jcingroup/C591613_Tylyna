import React = require('react');
import Moment = require('moment');

import { clone, makeInputValue} from '../ts-comm/comm-func';
import {config} from '../ts-comm/def-data';
import {ac_type_comm} from '../action_type';
import {TagShowAndHide, PWButton} from '../components';
//view
import {GridTableView} from './containers';
import {GridSearch} from './vwGridSearch';
import {NavPage} from '../components';

export class Grid extends React.Component<any, { infoShow: boolean }>{

    constructor() {
        super();
        this.queryGridData = this.queryGridData.bind(this);

        this.addType = this.addType.bind(this);
        this.deleteItem = this.deleteItem.bind(this);

        this.state = {
            infoShow: true
        };
    }
    queryGridData(page?: number) {//navpage 用
        let params = this.props.search;

        params['page'] = page == null ? this.props.page_operator.page : page;

        this.props.callGridLoad(params);
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
    hideInfo(e) {
        this.setState({ infoShow: false });
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let p_info: server.PageInfo = pp.page_operator;
        let grid: Array<server.ProductKind> = pp.grid;
        out_html =
            (
                <div>
                    <TagShowAndHide show={this.state.infoShow} TagName={TagName.div}  className="alert alert-warning">
                        <PWButton className="close" iconClassName="fa-times" enable={true} onClick={this.hideInfo.bind(this) } />
                        <strong>前台顯示排序：</strong> 數字愈大愈前面
                    </TagShowAndHide>
                    <GridSearch search={pp.search} page_operator={pp.page_operator}
                        setInputValue={this.props.setInputValue}
                        callGridLoad={this.props.callGridLoad}/>
                    {/*<GridTable grid={grid}
                        params={pp.params}
                        search={pp.search}
                        page_operator={p_info}
                        setPageInfo={this.props.setPageInfo}
                        callGridLoad={this.props.callGridLoad}
                        callSubmit={this.props.callSubmit}
                        setRowInputValue={this.props.setRowInputValue}
                        updateRowState={this.props.updateRowState}
                */    }
                    <GridTableView />
                    <footer className="table-footer clearfix">
                        <small className="pull-xs-right">共 {grid.length} 筆</small>
                    </footer>
                </div>
            );

        return out_html;
    }
}