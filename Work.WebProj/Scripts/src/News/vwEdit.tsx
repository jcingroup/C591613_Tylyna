import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {config, UIText, IHideTypeData} from '../ts-comm/def-data';
import {ac_type_comm} from '../action_type';
import {InputText, InputNum, SelectText, RadioBox, AreaText, PWButton, TagShowAndHide} from '../components';
import {MasterImageUpload} from '../ts-comm/comm-cmpt';
import {Init_Params} from './pub';
import {MntV} from '../ts-comm/comm-func'

import DatePicker = require('react-datepicker');
import "react-datepicker/dist/react-datepicker.css";

export class Edit extends React.Component<any, any>{

    constructor() {
        super();
        this.goList = this.goList.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
        };
    }
    componentDidMount() {
        CKEDITOR.replace('news_content', { customConfig: '../ckeditor/ConfigMin.js?v2' });
    }
    chgVal(name: string, value: any, e: React.SyntheticEvent) {
        this.props.setInputValue(ac_type_comm.chg_fld_val, name, value);
    }
    chgDate(name: string, MM: moment.Moment) {
        let value = (MM != null) ? MM.format() : null;
        this.props.setInputValue(ac_type_comm.chg_fld_val, name, value);
    }
    handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let field: server.News = this.props.field;
        let pp = this.props;

        field.news_content = CKEDITOR.instances['news_content'].getData();

        this.props.callSubmit(pp.params.id, field, pp.edit_type);
        return;
    }
    goList() {
        this.props.callGridLoad(null);
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let field: server.News = pp.field;
        let view_mode: InputViewMode = InputViewMode.edit;
        let mnt_day = MntV(field.day);
        out_html =
            (
                <form className="form form-sm" onSubmit={this.handleSubmit}>
                    <h3 className="h3">
                        {gb_caption}<small className="sub"><i className="fa-angle-double-right"></i> {UIText.edit}</small>
                    </h3>

                    <section className="col-xs-6">
                        <div className="form-group row">
                            <label className="col-xs-2 form-control-label text-xs-right">
                                <span className="text-danger">*</span> 發佈日期
                            </label>
                            <div className="col-xs-10">
                                <DatePicker selected={mnt_day}
                                    dateFormat={config.dateFT}
                                    isClearable={true}
                                    required={true}
                                    locale="zh-TW"
                                    showYearDropdown
                                    onChange={this.chgDate.bind(this, 'day') }
                                    className="form-control" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xs-2 form-control-label text-xs-right">
                                排序
                            </label>
                            <div className="col-xs-7">
                                <InputNum
                                    inputClassName="form-control"
                                    inputViewMode={view_mode}
                                    required={true}
                                    value={field.sort}
                                    onChange= {this.chgVal.bind(this, 'sort') }
                                    /> { }
                            </div>
                            <small className="col-xs-3 text-muted">數字愈大愈前面</small>
                        </div>
                        <div className="form-group row">
                            <label className="col-xs-2 form-control-label text-xs-right">
                                <span className="text-danger">*</span> 狀態
                            </label>
                            <div className="col-xs-10">
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
                        </div>
                        <div className="form-group row">
                            <label className="col-xs-2 form-control-label text-xs-right">
                                <span className="text-danger">*</span> 首頁顯示
                            </label>
                            <div className="col-xs-10">
                                <RadioBox
                                    inputViewMode={view_mode}
                                    name={"no_index"}
                                    id={"no_index"}
                                    value={field.no_index}
                                    onChange= {this.chgVal.bind(this, 'no_index') }
                                    required={true}
                                    labelClassName="c-input c-radio"
                                    spanClassName="c-indicator"
                                    textClassName="text-sm"
                                    radioList={IHideTypeData}
                                    />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xs-2 form-control-label text-xs-right">
                                <span className="text-danger">*</span> 消息標題
                            </label>
                            <div className="col-xs-10">
                                <InputText
                                    type="text"
                                    inputClassName="form-control"
                                    inputViewMode={view_mode}
                                    value={field.news_title}
                                    onChange= {this.chgVal.bind(this, 'news_title') }
                                    required={true}
                                    maxLength={64}
                                    placeholder="請輸入最新消息標題..."
                                    /> { }
                            </div>
                        </div>
                    </section>

                    <section className="col-xs-6">
                        <div className="form-group row">
                            <label className="col-xs-2 form-control-label text-xs-right">代表圖</label>
                            <div className="col-xs-10">
                                <MasterImageUpload FileKind="NewsImg"
                                    MainId={field.news_id}
                                    ParentEditType={pp.edit_type}
                                    url_upload={gb_approot + 'Active/WebData/axFUpload'}
                                    url_list={gb_approot + 'Active/WebData/axFList'}
                                    url_delete={gb_approot + 'Active/WebData/axFDelete'}
                                    url_sort={gb_approot + 'Active/WebData/axFSort'} />
                                <small className="text-muted">可上傳 1 張照片，檔案大小不可超過 800 KB</small>
                            </div>
                        </div>
                    </section>

                    <section className="form-group row clear">
                        <label className="col-xs-1 form-control-label text-xs-right">
                            <span className="text-danger">*</span> 消息內容
                        </label>
                        <div className="col-xs-11">
                            <AreaText
                                id="news_content" name="news_content"
                                value={field.news_content} onChange={this.chgVal.bind(this, 'news_content') }
                                inputClassName="form-control"
                                inputViewMode={view_mode}
                                required={false}
                                maxLength={512}
                                rows={5}
                                placeholder="請輸入最新消息內容..."
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