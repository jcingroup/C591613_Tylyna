import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {config, UIText, IHideTypeData, IStockStateData} from '../ts-comm/def-data';
import {ac_type_comm} from '../action_type';
import {InputText, InputNum, SelectText, RadioBox, AreaText, PWButton, TagShowAndHide} from '../components';
import {MasterImageUpload} from '../ts-comm/comm-cmpt';
import {Init_Params} from './pub';
import {clone, tosMessage, uniqid} from '../ts-comm/comm-func';


let EditRowButton = ({view_mode, is_edit, del, update, cancel, done}) => {
    if (view_mode === InputViewMode.view) {
        return (
            <span>
                <PWButton iconClassName="fa fa-trash fa-lg" className="btn btn-link text-danger" title={UIText.delete} enable={!is_edit} onClick={del} /> { }
                <PWButton iconClassName="fa fa-pencil fa-lg" className="btn btn-link text-success" title={UIText.edit} enable={!is_edit} onClick={update } />
            </span>
        );
    } else {
        return (
            <span>
                <PWButton iconClassName="fa fa-reply" className="btn btn-link text-muted" title={UIText.cancel} enable={true} onClick={cancel} /> { }
                <PWButton iconClassName="fa fa-check fa-lg" className="btn btn-link text-primary" title={UIText.done} enable={true} onClick={done}  />
            </span>
        );
    }
}
export class Edit extends React.Component<any, { tab: Array<{ id: string, name: string, class: string }> }>{

    constructor() {
        super();
        this.goList = this.goList.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            tab: [{ id: 'tab1', name: '產品簡介', class: 'js-tab active' },
                { id: 'tab2', name: '產品更多介紹', class: 'js-tab' }]
        };
    }
    keep_detail: Array<server.ProductDetail> = [];
    componentDidMount() {
        CKEDITOR.replace('info', { customConfig: '../ckeditor/ConfigMin.js?v2=' + uniqid() });
        CKEDITOR.replace('more_info', { customConfig: '../ckeditor/Config.js?v2=' + uniqid() });
    }
    chgVal(name: string, value: any, e: React.SyntheticEvent) {
        this.props.setInputValue(ac_type_comm.chg_fld_val, name, value);
    }
    //detail
    chgDetailVal(i: number, name: string, value: any, e: React.SyntheticEvent) {
        this.props.setRowInputValue(ac_type_comm.chg_dil_fld_val, i, name, value);
    }
    addDetail() {
        let params: Init_Params = this.props.params;
        let data: server.ProductDetail = {
            product_detail_id: 0,
            product_id: params.id,
            sn: null,
            pack_name: null,
            weight: 0,
            price: 0,
            stock_state: IStockStateData[0].val,
            edit_type: IEditType.insert,
            view_mode: InputViewMode.edit
        };

        this.props.addRowState(data);
    }
    editDetail(i: number, e: React.SyntheticEvent) {
        this.keep_detail = clone(this.props.field.Deatil);//每次按修改按鈕就重新複製Grid
        this.props.updateRowState(i);
    }
    cancelDetail(i: number, edit_type: IEditType, e: React.SyntheticEvent) {
        let item: server.ProductDetail = null;

        if (edit_type == IEditType.update) {//修改
            item = this.keep_detail[i];
            item.view_mode = InputViewMode.view;
        }
        this.props.cancelRowState(edit_type, i, item);
    }
    delDetail(id: number) {
        if (!confirm(UIText.delete_sure)) {
            return;
        }
        let params: Init_Params = this.props.params;
        this.props.callDetailDel(id, params.id);
    }
    doneDetail(i: number) {
        let params: Init_Params = this.props.params;
        let item: server.ProductDetail = this.props.field.Deatil[i];

        let check: boolean = false, err_list: Array<string> = [];
        if (item.sn === null || item.sn === undefined || item.sn === "") {
            check = true;
            err_list.push("「料號」欄位未填寫");
        }
        if (item.weight === null || item.weight === undefined || item.weight.toString() === "") {
            check = true;
            err_list.push("「重量」欄位未填寫");
        }
        if (item.price === null || item.price === undefined || item.price.toString() === "") {
            check = true;
            err_list.push("「單價」欄位未填寫");
        }
        if (check) {
            tosMessage("資料未填完整!", err_list.join("\n"), ToastrType.error);
            return;
        }

        this.props.callDetailSubmit(params.id, item.product_detail_id, item, item.edit_type);
    }
    //detail
    tabClick(tab_id: string, e: React.SyntheticEvent) {
        e.preventDefault();
        $('#' + tab_id).fadeIn().siblings(".tab-pane").hide();

        let tab = this.state.tab;
        tab.forEach((item) => {
            item.class = item.id === tab_id ? "js-tab active" : "js-tab";
        })
        this.setState({ tab: tab })
    }
    handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let field: server.Product = this.props.field;
        let pp = this.props;
        if (this.props.is_edit) {
            alert("規格明細未編輯完成，請按下確認符號!");
            return;
        }

        field.info = CKEDITOR.instances['info'].getData();
        field.more_info = CKEDITOR.instances['more_info'].getData();

        this.props.callSubmit(pp.params.id, field, pp.edit_type);
        return;
    }
    goList() {
        if (this.props.is_edit) {
            alert("規格明細未編輯完成，請按下確認符號!");
            return;
        }
        this.props.callGridLoad(null);
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let field: server.Product = pp.field;
        let view_mode: InputViewMode = InputViewMode.edit;

        out_html =
            (
                <form className="form form-sm" onSubmit={this.handleSubmit}>
                    <h3 className="h3">
                        {gb_caption}<small className="sub"><i className="fa-angle-double-right"></i> {UIText.edit}</small>
                    </h3>
                    <section className="col-xs-6 m-b-1">
                        <dl className="form-group row m-b-0">
                            <dt className="col-xs-2 form-control-label text-xs-right">
                                <span className="text-danger">*</span> 主分類
                            </dt>
                            <dd className="col-xs-9">
                                <SelectText
                                    inputClassName="form-control form-control-sm"
                                    inputViewMode={view_mode}
                                    id={'product_kind_id'}
                                    value={field.product_kind_id}
                                    onChange= {this.chgVal.bind(this, 'product_kind_id') }
                                    required={true}
                                    is_blank={false}
                                    options={pp.init_data.kind_list}
                                    />
                            </dd>
                        </dl>
                        <dl className="form-group row m-b-0">
                            <dt className="col-xs-2 form-control-label text-xs-right">
                                <span className="text-danger">*</span> 品名
                            </dt>
                            <dd className="col-xs-9">
                                <InputText
                                    type="text"
                                    inputClassName="form-control form-control-sm"
                                    inputViewMode={view_mode}
                                    value={field.product_name}
                                    onChange= {this.chgVal.bind(this, 'product_name') }
                                    required={true}
                                    maxLength={64}
                                    placeholder="請輸入品名..."
                                    /> { }
                            </dd>
                        </dl>
                        <dl className="form-group row m-b-0">
                            <dt className="col-xs-2 form-control-label text-xs-right">
                                <span className="text-danger">*</span> 前台顯示
                            </dt>
                            <dd className="col-xs-9">
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
                            </dd>
                        </dl>
                        <dl className="form-group row m-b-0">
                            <dt className="col-xs-2 form-control-label text-xs-right">
                                <span className="text-danger">*</span> 狀態
                            </dt>
                            <dd className="col-xs-9">
                                <RadioBox
                                    inputViewMode={view_mode}
                                    name={"stock_state"}
                                    id={"stock_state"}
                                    value={field.stock_state}
                                    onChange= {this.chgVal.bind(this, 'stock_state') }
                                    required={true}
                                    labelClassName="c-input c-radio"
                                    spanClassName="c-indicator"
                                    textClassName="text-sm"
                                    radioList={IStockStateData}
                                    />
                            </dd>
                        </dl>
                        <dl className="form-group row m-b-0">
                            <dt className="col-xs-2 form-control-label text-xs-right">
                                排序
                            </dt>
                            <dd className="col-xs-3">
                                <InputNum
                                    inputClassName="form-control"
                                    inputViewMode={view_mode}
                                    required={true}
                                    value={field.sort}
                                    onChange= {this.chgVal.bind(this, 'sort') }
                                    placeholder="請輸入數字..."
                                    /> { }
                            </dd>
                            <dd className="col-xs-6">
                                <small className="text-muted">數字愈大愈前面</small>
                            </dd>
                        </dl>
                    </section>
                    <section className="col-xs-6 m-b-1">
                        <dl className="form-group row m-b-0">
                            <dt className="col-xs-2 form-control-label text-xs-right">代表圖</dt>
                            <dd className="col-xs-10">
                                <MasterImageUpload FileKind="ProductImg"
                                    MainId={field.product_id}
                                    ParentEditType={pp.edit_type}
                                    url_upload={gb_approot + 'Active/ProductData/axFUpload'}
                                    url_list={gb_approot + 'Active/ProductData/axFList'}
                                    url_delete={gb_approot + 'Active/ProductData/axFDelete'}
                                    url_sort={gb_approot + 'Active/ProductData/axFSort'} />
                                <small className="text-muted">可上傳 1 張照片，圖片尺寸：寬度 500 px(高度不限) ，檔案大小不可超過 450 KB</small>
                            </dd>
                        </dl>
                    </section>

                    <table className="table table-sm table-bordered table-striped table-hover m-b-2">
                        <caption className="table-header">
                            <span className="w3-large">產品規格明細</span>
                            <TagShowAndHide className="btn pull-xs-right" show={pp.edit_type == IEditType.insert} TagName={TagName.Span}>
                                <small className="text-danger">請先存檔後，再新增產品規格!</small>
                            </TagShowAndHide>
                            <PWButton iconClassName="fa-plus-circle"
                                className="btn btn-sm btn-success pull-xs-right"
                                hidden={pp.edit_type == IEditType.insert}
                                title={UIText.add} enable={!pp.is_edit } onClick={this.addDetail.bind(this) } >
                                { } {UIText.add}
                            </PWButton>
                        </caption>
                        <colgroup>
                            <col style={{ "width": "7%" }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="text-xs-center">編輯</th>
                                <th>料號</th>
                                <th>包裝</th>
                                <th className="text-xs-center">重量(總計) (g) </th>
                                <th className="text-xs-center">單價</th>
                                <th className="text-xs-center">狀態</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                field.Deatil.map((item, i) => {
                                    return <tr key={i}>
                                        <td className="text-xs-center">
                                            <EditRowButton
                                                view_mode={item.view_mode}
                                                is_edit={pp.is_edit}
                                                update={this.editDetail.bind(this, i) }
                                                del={this.delDetail.bind(this, item.product_detail_id) }
                                                cancel={this.cancelDetail.bind(this, i, item.edit_type) }
                                                done={this.doneDetail.bind(this, i) }
                                                />
                                        </td>
                                        <td>
                                            <InputText
                                                type="text"
                                                inputClassName="form-control"
                                                inputViewMode={item.view_mode}
                                                value={item.sn}
                                                onChange= {this.chgDetailVal.bind(this, i, 'sn') }
                                                required={true}
                                                maxLength={64}
                                                placeholder="請輸入料號..."
                                                />
                                        </td>
                                        <td>
                                            <InputText
                                                type="text"
                                                inputClassName="form-control"
                                                inputViewMode={item.view_mode}
                                                value={item.pack_name}
                                                onChange= {this.chgDetailVal.bind(this, i, 'pack_name') }
                                                required={true}
                                                maxLength={64}
                                                placeholder="請輸入包裝..."
                                                />
                                        </td>
                                        <td className="text-xs-center">
                                            <div className={item.view_mode == InputViewMode.edit ? "input-group" : ""}>
                                                <InputNum
                                                    inputClassName="form-control text-xs-center"
                                                    inputViewMode={item.view_mode}
                                                    required={true}
                                                    value={item.weight}
                                                    onChange= {this.chgDetailVal.bind(this, i, 'weight') }
                                                    placeholder="請輸入數字..."
                                                    min={0}
                                                    />
                                                <span className={item.view_mode == InputViewMode.edit ? "input-group-addon" : ""}>g</span>
                                            </div>
                                        </td>
                                        <td className="text-xs-right">
                                            <div className={item.view_mode == InputViewMode.edit ? "input-group" : ""}>
                                                <span className={item.view_mode == InputViewMode.edit ? "input-group-addon" : ""}> NT$</span>
                                                <InputNum
                                                    inputClassName="form-control text-xs-center"
                                                    inputViewMode={item.view_mode}
                                                    required={true}
                                                    value={item.price}
                                                    onChange= {this.chgDetailVal.bind(this, i, 'price') }
                                                    placeholder="請輸入數字..."
                                                    min={0}
                                                    />
                                            </div>
                                        </td>
                                        <td className="text-xs-center">
                                            <RadioBox
                                                inputViewMode={item.view_mode}
                                                name={"stock_state-" + i}
                                                id={"stock_state-" + i}
                                                value={item.stock_state}
                                                onChange= {this.chgDetailVal.bind(this, i, 'stock_state') }
                                                required={true}
                                                labelClassName="c-input c-radio"
                                                spanClassName="c-indicator"
                                                textClassName="text-sm"
                                                radioList={IStockStateData}
                                                />
                                        </td>
                                    </tr>;
                                })
                            }
                        </tbody>
                    </table>
                    <section>
                        <div className="alert alert-warning text-sm">
                            {/* <PWButton className="close" iconClassName="fa-times" enable={true} onClick={this.hideInfo.bind(this) } /> */}
                            <strong>編輯器注意事項: </strong><br/>
                            從 WORD 複製文字時，請使用下方的 <img src="/Content/images/icon-word.jpg" /> 圖示來貼上 WORD 文字，避免跑版<br/>
                            編輯器上傳圖片或新增表格等時，請勿設定寬度及高度(將數字刪除) ，以免行動裝置顯示時會跑版。<br/>
                            檔案尺寸寬度超過 1600 或 高度超過1200 的圖片會被壓縮(PNG透明背景會變成不透明)<br/>
                            youtube 可勾選「用自適應縮放模式」
                        </div>
                        <nav className="nav nav-tabs">
                            {
                                this.state.tab.map((item, i) => {
                                    return <a key={i} href={"#" + item.id} className={item.class} onClick={this.tabClick.bind(this, item.id) }>{item.name}</a>;
                                })
                            }
                        </nav>
                        <div className="tab-content">
                            <article id="tab1" className="tab-pane active">
                                <AreaText
                                    id="info" name="info"
                                    value={field.info} onChange={this.chgVal.bind(this, 'info') }
                                    inputClassName="form-control"
                                    inputViewMode={view_mode}
                                    required={false}
                                    maxLength={512}
                                    rows={8}
                                    />
                            </article>
                            <article id="tab2" className="tab-pane">
                                <AreaText
                                    id="more_info" name="more_info"
                                    value={field.more_info} onChange={this.chgVal.bind(this, 'more_info') }
                                    inputClassName="form-control"
                                    inputViewMode={view_mode}
                                    required={false}
                                    maxLength={512}
                                    rows={8}
                                    />
                            </article>
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