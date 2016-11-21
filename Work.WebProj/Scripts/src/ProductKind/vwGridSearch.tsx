import React = require('react');
import Moment = require('moment');
import {UIText, IHideTypeData} from '../ts-comm/def-data';
import {InputText, SelectText, PWButton} from '../components';

import {ac_type_comm} from '../action_type';

interface GridSearchProps {
    search: any,
    changeSearchVal: Function
}

export class GridSearch extends React.Component<GridSearchProps, any>{

    constructor() {
        super();
        this.state = {
        };
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
                                        onChange= {pp.changeSearchVal.bind(this, 'name') }
                                        required={false}
                                        maxLength={100}
                                        placeholder="請輸入關鍵字..."
                                        /> { }
                                    <label className="text-sm">前台顯示</label> { }
                                    <SelectText
                                        inputClassName="form-control form-control-sm"
                                        inputViewMode={InputViewMode.edit}
                                        id={'search-hide'}
                                        value={search.i_Hide}
                                        onChange= {pp.changeSearchVal.bind(this, 'i_Hide') }
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