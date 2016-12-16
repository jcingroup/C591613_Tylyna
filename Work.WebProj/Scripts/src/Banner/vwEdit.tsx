import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {config, UIText, IHideTypeData} from '../ts-comm/def-data';
import {ac_type_comm} from '../action_type';
import {InputText, InputNum, RadioBox, PWButton, TagShowAndHide} from '../components';
import {MasterImageUpload} from '../ts-comm/comm-cmpt';
import {Init_Params} from './pub';

export class Edit extends React.Component<any, any>{

    constructor() {
        super();
        this.goList = this.goList.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
        };
    }
    componentDidMount() {
    }
    chgVal(name: string, value: any, e: React.SyntheticEvent) {
        this.props.setInputValue(ac_type_comm.chg_fld_val, name, value);
    }
    handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let field: server.Banner = this.props.field;
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
        let field: server.Banner = pp.field;
        let view_mode: InputViewMode = InputViewMode.edit;

        out_html =
            (
                <form className="form form-sm" onSubmit={this.handleSubmit}>
                    <h3 className="h3">
                        {gb_caption}<small className="sub"><i className="fa-angle-double-right"></i> {UIText.edit}</small>
                    </h3>

                    <section className="form-group row">
                        <label className="col-xs-1 form-control-label text-xs-right">
                            首頁輪播圖
                        </label>
                        <div className="col-xs-6">
                            <MasterImageUpload FileKind="BannerImg"
                                MainId={field.banner_id}
                                ParentEditType={pp.edit_type}
                                url_upload={gb_approot + 'Active/WebData/axFUpload'}
                                url_list={gb_approot + 'Active/WebData/axFList'}
                                url_delete={gb_approot + 'Active/WebData/axFDelete'}
                                url_sort={gb_approot + 'Active/WebData/axFSort'} />
                            <small>最多一張圖，尺寸 1280 * 420 px，每張圖最大不可超過 500 KB</small>
                        </div>
                    </section>
                    <section className="form-group row">
                        <label className="col-xs-1 form-control-label text-xs-right">
                            名稱
                        </label>
                        <div className="col-xs-6">
                            <InputText
                                type="text"
                                inputClassName="form-control form-control-sm"
                                inputViewMode={view_mode}
                                value={field.b_name}
                                onChange= {this.chgVal.bind(this, 'b_name') }
                                required={true}
                                maxLength={64}
                                /> { }
                        </div>
                    </section>
                    <section className="form-group row">
                        <label className="col-xs-1 form-control-label text-xs-right">
                            排序
                        </label>
                        <div className="col-xs-6">
                            <InputNum
                                inputClassName="form-control form-control-sm"
                                inputViewMode={view_mode}
                                required={true}
                                value={field.sort}
                                onChange= {this.chgVal.bind(this, 'sort') }
                                /> { }
                        </div>
                        <small className="col-xs-5">數字愈大愈前面</small>
                    </section>
                    <section className="form-group row">
                        <label className="col-xs-1 form-control-label text-xs-right">
                            狀態
                        </label>
                        <div className="col-xs-6">
                            <RadioBox
                                inputViewMode={view_mode}
                                name={"i_Hide"}
                                id={"i_Hide"}
                                value={field.i_Hide}
                                onChange= {this.chgVal.bind(this, 'i_Hide') }
                                required={true}
                                labelClassName="c-input c-radio"
                                spanClassName="c-indicator"
                                textClassName="text-sm"
                                radioList={IHideTypeData}
                                />
                        </div>
                    </section>
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