import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {config, UIText, IHideTypeData} from '../ts-comm/def-data';
import {ac_type_comm} from '../action_type';
import {InputText, InputNum, SelectText, RadioBox, AreaText, PWButton, TagShowAndHide} from '../components';
import {Init_Params} from './pub';
import {uniqid} from '../ts-comm/comm-func';


export class Edit extends React.Component<any, any>{

    constructor() {
        super();
        this.goList = this.goList.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
        };
    }
    componentDidMount() {
        CKEDITOR.replace('a_content', { customConfig: '../ckeditor/ConfigMin.js?v2=' + uniqid() });
    }
    chgVal(name: string, value: any, e: React.SyntheticEvent) {
        this.props.setInputValue(ac_type_comm.chg_fld_val, name, value);
    }
    handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let field: server.FAQ = this.props.field;
        let pp = this.props;

        field.a_content = CKEDITOR.instances['a_content'].getData();

        this.props.callSubmit(pp.params.id, field, pp.edit_type);
        return;
    }
    goList() {
        this.props.callGridLoad(null);
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let field: server.FAQ = pp.field;
        let view_mode: InputViewMode = InputViewMode.edit;
        out_html =
            (
                <form className="form form-sm" onSubmit={this.handleSubmit}>
                    <h3 className="h3">
                        {gb_caption}<small className="sub"><i className="fa-angle-double-right"></i> {UIText.edit}</small>
                    </h3>

                    <section className="form-group row">
                        <label className="col-xs-1 form-control-label text-xs-right">
                            <span className="text-danger">*</span> 標題
                        </label>
                        <div className="col-xs-7">
                            <InputText
                                type="text"
                                inputClassName="form-control"
                                inputViewMode={view_mode}
                                value={field.q_title}
                                onChange= {this.chgVal.bind(this, 'q_title') }
                                required={true}
                                maxLength={128}
                                placeholder="請輸入標題..."
                                /> { }
                        </div>
                    </section>
                    <section className="form-group row">
                        <label className="col-xs-1 form-control-label text-xs-right">
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
                        <small className="col-xs-4 text-muted">數字愈大愈前面</small>
                    </section>
                    <section className="form-group row">
                        <label className="col-xs-1 form-control-label text-xs-right">
                            <span className="text-danger">*</span> 狀態
                        </label>
                        <div className="col-xs-7">
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
                    <section className="form-group row">
                        <label className="col-xs-1 form-control-label text-xs-right">
                            <span className="text-danger">*</span> 內容
                        </label>
                        <div className="col-xs-10">
                            <div className="alert alert-warning text-sm">
                                <strong>編輯器注意事項: </strong><br/>
                                從 WORD 複製文字時，請使用下方的 <img src="/Content/images/icon-word.jpg" /> 圖示來貼上 WORD 文字，避免跑版<br/>
                                編輯器上傳圖片或新增表格等時，請勿設定寬度及高度(將數字刪除) ，以免行動裝置顯示時會跑版。<br/>
                                檔案尺寸寬度超過 1600 或 高度超過1200 的圖片會被壓縮(PNG透明背景會變成不透明)<br/>
                                youtube 可勾選「用自適應縮放模式」
                            </div>
                            <AreaText
                                id="a_content" name="a_content"
                                value={field.a_content} onChange={this.chgVal.bind(this, 'a_content') }
                                inputClassName="form-control"
                                inputViewMode={view_mode}
                                required={false}
                                maxLength={512}
                                rows={5}
                                placeholder="請輸入常見問答內容..."
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