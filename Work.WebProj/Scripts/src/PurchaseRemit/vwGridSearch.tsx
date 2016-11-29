import React = require('react');
import Moment = require('moment');
import {config, UIText, IPayStateDataForRemit} from '../ts-comm/def-data';
import {InputText, SelectText, PWButton} from '../components';
import {Search_Data, Init_Data} from './pub';
import {ac_type_comm} from '../action_type';
import {MntV} from '../ts-comm/comm-func';

import DatePicker = require('react-datepicker');
import "react-datepicker/dist/react-datepicker.css";

interface GridSearchProps {
    search: Search_Data,
    init_data: Init_Data,
    page_operator: server.PageInfo,
    setInputValue: Function,
    callGridLoad: Function
}
interface GridSearchState {
    icon?: Array<{ class: string, icon: string }>
}
export class GridSearch extends React.Component<GridSearchProps, GridSearchState>{

    constructor() {
        super();
        this.state = {
            icon: [{ class: "btn btn-sm btn-warning", icon: "fa-exclamation-circle" },
                { class: "btn btn-sm btn-success", icon: "fa-check" }]       
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
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let search = pp.search;
        let mnt_pay_start = MntV(search.pay_start);
        let mnt_pay_end = MntV(search.pay_end);
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
                                    <label className="text-sm">付款日期</label>
                                    <DatePicker selected={mnt_pay_start}
                                        dateFormat={config.dateFT}
                                        isClearable={true}
                                        required={false}
                                        locale="zh-TW"
                                        showYearDropdown
                                        onChange={this.chgDate.bind(this, 'pay_start') }
                                        className="form-control form-control-sm" />
                                    <label className="text-sm">~</label>
                                    <DatePicker selected={mnt_pay_end}
                                        dateFormat={config.dateFT}
                                        isClearable={true}
                                        required={false}
                                        locale="zh-TW"
                                        showYearDropdown
                                        onChange={this.chgDate.bind(this, 'pay_end') }
                                        className="form-control form-control-sm" /> { }
                                    <label className="text-sm">狀態</label> { }
                                    <SelectText
                                        inputClassName="form-control form-control-sm"
                                        inputViewMode={InputViewMode.edit}
                                        id={'s-state'}
                                        value={search.state}
                                        onChange= {this.chgShVal.bind(this, 'state') }
                                        required={false}
                                        is_blank={true}
                                        blank_text="全部"
                                        options={IPayStateDataForRemit}
                                        />
                                </div>
                            </div>
                            <div className="form-inline">
                                {
                                    IPayStateDataForRemit.map((item, i) => {
                                        return <span key={i}>
                                            <PWButton className={this.state.icon[i].class}
                                                iconClassName={this.state.icon[i].icon} enable={true}> {item.Lname}</PWButton> { }
                                        </span>;
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            );

        return out_html;
    }
}