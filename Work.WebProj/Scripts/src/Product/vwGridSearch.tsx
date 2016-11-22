import React = require('react');
import Moment = require('moment');
import {UIText, IHideTypeData} from '../ts-comm/def-data';
import {InputText, SelectText, PWButton} from '../components';
import {Search_Data, Init_Data} from './pub';
import {ac_type_comm} from '../action_type';

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
                                        <label className="text-sm">主分類</label> { }
                                        <SelectText
                                            inputClassName="form-control form-control-sm"
                                            inputViewMode={InputViewMode.edit}
                                            id={'search-hide'}
                                            value={search.kind}
                                            onChange= {this.chgShVal.bind(this, 'kind') }
                                            required={true}
                                            is_blank={true}
                                            blank_text="全部"
                                            options={pp.init_data.kind_list}
                                            />
                                    <label className="text-sm">前台顯示</label> { }
                                    <SelectText
                                        inputClassName="form-control form-control-sm"
                                        inputViewMode={InputViewMode.edit}
                                        id={'search-hide'}
                                        value={search.i_Hide}
                                        onChange= {this.chgShVal.bind(this, 'i_Hide') }
                                        required={true}
                                        is_blank={true}
                                        blank_text="全部"
                                        options={IHideTypeData}
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );

        return out_html;
    }
}