﻿import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {config, UIText, IHideTypeData} from '../ts-comm/def-data';
import {InputText, SelectText, PWButton} from '../components';
import {Search_Data, Init_Data, IOrderStateData, IOrderState} from './pub';
import {ac_type_comm} from '../action_type';
import {MntV, uniqid, ifrmDown} from '../ts-comm/comm-func';

import DatePicker = require('react-datepicker');
import "react-datepicker/dist/react-datepicker.css";

interface GridSearchProps {
    search: Search_Data,
    init_data: Init_Data,
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
    chgDate(name: string, MM: moment.Moment) {
        let value = (MM != null) ? MM.format() : null;
        this.props.setInputValue(ac_type_comm.chg_sch_val, name, value);

        let params = this.props.search;
        params['page'] = this.props.page_operator.page;
        params[name] = value;

        this.props.callGridLoad(params);
    }
    chgType(type: number, type_val: number) {
        this.props.setInputValue(ac_type_comm.chg_sch_val, "type", type);
        this.props.setInputValue(ac_type_comm.chg_sch_val, "type_val", type_val);

        let params = this.props.search;
        params['page'] = this.props.page_operator.page;
        params["type"] = type;
        params["type_val"] = type_val;

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

        let src = gb_approot + "Base/ExcelReport/Excel_Purchase?" + url_pm;
        ifrmDown(src);
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let search = pp.search;
        let mnt_order_day = MntV(search.order_date);
        let mnt_pay_day = MntV(search.pay_date);
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
                                    <DatePicker selected={mnt_order_day}
                                        dateFormat={config.dateFT}
                                        isClearable={true}
                                        required={false}
                                        locale="zh-TW"
                                        showYearDropdown
                                        onChange={this.chgDate.bind(this, 'order_date') }
                                        className="form-control form-control-sm" />
                                    <label className="text-sm">付款日期</label>
                                    <DatePicker selected={mnt_pay_day}
                                        dateFormat={config.dateFT}
                                        isClearable={true}
                                        required={false}
                                        locale="zh-TW"
                                        showYearDropdown
                                        onChange={this.chgDate.bind(this, 'pay_date') }
                                        className="form-control form-control-sm" />
                                </div>
                            </div>
                            <div className="form-inline">
                                <label className="text-sm">訂單狀態</label>
                                {
                                    IOrderStateData.map((item, i) => {
                                        let css_str: string = (search.type === item.type && search.type_val === item.val) ? "btn-primary" : "";
                                        return <span key={i}>
                                            <button className={"btn btn-sm " + css_str} onClick={this.chgType.bind(this, item.type, item.val) }>{item.name}</button> {}
                                        </span>;
                                    })
                                }
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