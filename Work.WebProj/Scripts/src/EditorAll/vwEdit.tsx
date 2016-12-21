import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {config, UIText, IHideTypeData} from '../ts-comm/def-data';
import {ac_type_comm} from '../action_type';
import {InputText, InputNum, SelectText, RadioBox, AreaText, PWButton, TagShowAndHide} from '../components';
import {Init_Params} from './pub';

import {EditDetailView} from './containers';

export class Edit extends React.Component<any, any>{

    constructor() {
        super();
        this.goList = this.goList.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
        };
    }
    chgVal(name: string, value: any, e: React.SyntheticEvent) {
        this.props.setInputValue(ac_type_comm.chg_fld_val, name, value);
    }
    handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let field: server.Editor_L1 = this.props.field;
        let pp = this.props;

        this.props.callSubmit(pp.params.id, field, pp.edit_type);
        return;
    }
    goList() {
        this.props.callGridLoad(null);
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let field: server.Editor_L1 = pp.field;
        let view_mode: InputViewMode = InputViewMode.edit;

        out_html =
            (
                <form className="form form-sm" onSubmit={this.handleSubmit}>
                    <h3 className="h3">
                        {gb_caption}<small className="sub"><i className="fa-angle-double-right"></i> {UIText.edit}</small>
                    </h3>

                    <section className="form-group row">
                        <label className="col-xs-1 form-control-label text-xs-right">
                            <span className="text-danger">*</span> 名稱
                        </label>
                        <div className="col-xs-5">
                            <InputText
                                type="text"
                                inputClassName="form-control"
                                inputViewMode={view_mode}
                                value={field.name}
                                onChange= {this.chgVal.bind(this, 'name') }
                                required={true}
                                maxLength={64}
                                placeholder="請輸入名稱..."
                                /> { }
                        </div>
                        <label className="col-xs-1 form-control-label text-xs-right">
                            排序
                        </label>
                        <div className="col-xs-2">
                            <InputNum
                                inputClassName="form-control"
                                inputViewMode={view_mode}
                                required={true}
                                value={field.sort}
                                onChange= {this.chgVal.bind(this, 'sort') }
                                /> { }
                        </div>
                        <small className="col-xs-3 text-muted">數字愈大愈前面</small>
                    </section>
                    <section className="form-group row">
                        <label className="col-xs-1 form-control-label text-xs-right">
                            <span className="text-danger">*</span> 新增
                        </label>
                        <div className="col-xs-2">
                            <RadioBox
                                inputViewMode={view_mode}
                                name={"hide_add"}
                                id={"hide_add"}
                                value={field.hide_add}
                                onChange= {this.chgVal.bind(this, 'hide_add') }
                                required={true}
                                labelClassName="c-input c-radio"
                                spanClassName="c-indicator"
                                textClassName="text-sm"
                                radioList={IHideTypeData}
                                />
                        </div>
                        <label className="col-xs-1 form-control-label text-xs-right">
                            <span className="text-danger">*</span> 刪除
                        </label>
                        <div className="col-xs-2">
                            <RadioBox
                                inputViewMode={view_mode}
                                name={"hide_del"}
                                id={"hide_del"}
                                value={field.hide_del}
                                onChange= {this.chgVal.bind(this, 'hide_del') }
                                required={true}
                                labelClassName="c-input c-radio"
                                spanClassName="c-indicator"
                                textClassName="text-sm"
                                radioList={IHideTypeData}
                                />
                        </div>
                        <label className="col-xs-1 form-control-label text-xs-right">
                            <span className="text-danger">*</span> 排序
                        </label>
                        <div className="col-xs-2">
                            <RadioBox
                                inputViewMode={view_mode}
                                name={"hide_sort"}
                                id={"hide_sort"}
                                value={field.hide_sort}
                                onChange= {this.chgVal.bind(this, 'hide_sort') }
                                required={true}
                                labelClassName="c-input c-radio"
                                spanClassName="c-indicator"
                                textClassName="text-sm"
                                radioList={IHideTypeData}
                                />
                        </div>
                    </section>

                    <EditDetailView />

                    <div className="form-action">
                        <PWButton iconClassName="fa-check" className="btn btn-primary btn-sm col-xs-offset-1"
                            title={UIText.save} enable={true} type="submit" >{UIText.save}</PWButton> { }
                        <PWButton iconClassName="fa-times" className="btn btn-secondary btn-sm"
                            title={UIText.save} enable={true} onClick={this.goList} >{ UIText.return }</PWButton>
                    </div>

                </form>
            );

        return out_html;
    }
}