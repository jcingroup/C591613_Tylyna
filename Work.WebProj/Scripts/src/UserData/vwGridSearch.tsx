import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {UIText} from '../ts-comm/def-data';
import {InputText, SelectText, PWButton} from '../components';
import {Search_Data} from './pub';
import {ac_type_comm} from '../action_type';
import {uniqid, ifrmDown} from '../ts-comm/comm-func';

interface GridSearchProps {
    search: Search_Data,
    page_operator: server.PageInfo,
    setInputValue: Function,
    callGridLoad: Function
}

export class GridSearch extends React.Component<GridSearchProps, any>{

    constructor() {
        super();
        this.dwExcel = this.dwExcel.bind(this);
        this.state = {
        };
    }
    chgShVal(name: string, value: any, e: React.SyntheticEvent) {
        this.props.setInputValue(ac_type_comm.chg_sch_val, name, value);

        let params = this.props.search;
        params['page'] = this.props.page_operator.page;
        params[name] = value;

        this.props.callGridLoad(params);
    }
    dwExcel(e: React.SyntheticEvent) {
        e.preventDefault();
        let url_pm = '';
        let pm = {
            tid: uniqid()
        };
        $.extend(pm, this.props.search);
        url_pm = $.param(pm);

        let src = gb_approot + "Base/ExcelReport/Excel_Customer?" + url_pm;
        ifrmDown(src);
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let search = pp.search;

        out_html =
            (
                <div className="table-responsive">
                    <div className="table-header">
                        <div className="table-filter">
                            <div className="form-inline">
                                <div className="form-group">
                                    <label className="sr-only">關鍵字</label> { }
                                    <InputText
                                        type="text"
                                        inputClassName="form-control form-control-sm"
                                        inputViewMode={InputViewMode.edit}
                                        value={search.name}
                                        onChange= {this.chgShVal.bind(this, 'name') }
                                        required={false}
                                        maxLength={100}
                                        placeholder="請輸入關鍵字..."
                                        /> { }
                                </div>
                                <PWButton className="btn btn-success btn-sm pull-xs-right"
                                    iconClassName="fa-print" enable={true} onClick={this.dwExcel}> {UIText.print}</PWButton>
                            </div>
                        </div>
                    </div>
                </div>
            );

        return out_html;
    }
}