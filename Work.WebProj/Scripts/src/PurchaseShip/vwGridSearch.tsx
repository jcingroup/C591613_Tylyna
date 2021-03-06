﻿import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {config, UIText} from '../ts-comm/def-data';
import {InputText, PWButton} from '../components';
import {Search_Data} from './pub';
import {ac_type_comm} from '../action_type';
import {MntV, uniqid, ifrmDown} from '../ts-comm/comm-func';

import DatePicker = require('react-datepicker');
import "react-datepicker/dist/react-datepicker.css";

interface GridSearchProps {
    search: Search_Data,
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
        params[name] = value;

        this.props.callGridLoad(params);
    }
    chgDate(name: string, MM: moment.Moment) {
        let value = (MM != null) ? MM.format() : null;
        this.props.setInputValue(ac_type_comm.chg_sch_val, name, value);

        let params = this.props.search;
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

        let src = gb_approot + "Base/ExcelReport/Excel_Ship?" + url_pm;
        ifrmDown(src);
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let search = pp.search;
        let mnt_order_start = MntV(search.order_start);
        let mnt_order_end = MntV(search.order_end);
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
                                        value={search.keyword}
                                        onChange= {this.chgShVal.bind(this, 'keyword') }
                                        required={false}
                                        maxLength={100}
                                        placeholder="請輸入關鍵字..."
                                        /> { }
                                    <label className="text-sm">下單日期</label>
                                    <DatePicker selected={mnt_order_start}
                                        dateFormat={config.dateFT}
                                        isClearable={true}
                                        required={false}
                                        locale="zh-TW"
                                        showYearDropdown
                                        onChange={this.chgDate.bind(this, 'order_start') }
                                        className="form-control form-control-sm" />
                                    <label className="text-sm">~</label>
                                    <DatePicker selected={mnt_order_end}
                                        dateFormat={config.dateFT}
                                        isClearable={true}
                                        required={false}
                                        locale="zh-TW"
                                        showYearDropdown
                                        minDate={mnt_order_start}
                                        onChange={this.chgDate.bind(this, 'order_end') }
                                        className="form-control form-control-sm" /> { }
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