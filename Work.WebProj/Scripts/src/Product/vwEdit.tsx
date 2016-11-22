import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {config, UIText, IHideTypeData} from '../ts-comm/def-data';
import {ac_type_comm} from '../action_type';
import {InputText, InputNum, SelectText, RadioBox, PWButton, TagShowAndHide} from '../components';
import {MasterImageUpload} from '../ts-comm/comm-cmpt';


export class Edit extends React.Component<any, any>{

    constructor() {
        super();

        this.state = {
        };
    }
    componentWillMount() {
        var tab = $('.js-tab');
        var tabContent = '.tab-pane';
        $(tab.eq(0).addClass('active').attr('href')).siblings(tabContent).hide();
        tab.click(function () {
            event.preventDefault();
            $($(this).attr('href')).fadeIn().siblings(tabContent).hide();
            $(this).toggleClass('active');
            tab.not(this).removeClass('active');
        });
    }
    chgVal(name: string, value: any, e: React.SyntheticEvent) {
        this.props.setInputValue(ac_type_comm.chg_fld_val, name, value);
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let field: server.Product = pp.field;
        let view_mode: InputViewMode = InputViewMode.edit;

        out_html =
            (
                <form className="form form-sm">
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
                                    is_blank={true}
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
                                    onChange= {this.chgVal.bind(this, 'product_kind_id') }
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
                        <TagShowAndHide className="form-group row m-b-0" TagName={TagName.dl} show={pp.edit_type == IEditType.update}>
                            <dt className="col-xs-2 form-control-label text-xs-right">代表圖</dt>
                            <dd className="col-xs-10">
                                <MasterImageUpload FileKind="ProductImg"
                                    MainId={field.product_id}
                                    ParentEditType={pp.edit_type}
                                    url_upload={gb_approot + 'Active/ProductData/axFUpload'}
                                    url_list={gb_approot + 'Active/ProductData/axFList'}
                                    url_delete={gb_approot + 'Active/ProductData/axFDelete'}
                                    url_sort={gb_approot + 'Active/ProductData/axFSort'} />
                                <small className="text-muted">可上傳 1 張照片，檔案大小不可超過 5000 KB</small>
                            </dd>
                        </TagShowAndHide>
                    </section>

                    <table className="table table-sm table-bordered table-striped table-hover m-b-2">
                        <caption className="table-header">
                            <span className="w3-large">產品規格明細</span>
                            <button type="button" className="btn btn-sm btn-success pull-xs-right">
                                <i className="fa-plus-circle"></i> 新增
                            </button>
                        </caption>
                        <colgroup>
                            <col style={{ "width": "7%" }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="text-xs-center">編輯</th>
                                <th className="text-xs-center">料號</th>
                                <th className="text-xs-center">包裝</th>
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
                                            <button className="btn btn-link text-danger" title="刪除"><i className="fa fa-trash fa-lg"></i></button>
                                            <button className="btn btn-link text-success" title="編輯"><i className="fa fa-pencil fa-lg"></i></button>
                                        </td>
                                        <td>P2-010-02</td>
                                        <td>5入濾掛式包</td>
                                        <td className="text-xs-center">55g</td>
                                        <td className="text-xs-right">NT$ 190</td>
                                        <td className="text-xs-center">
                                            <span className="w3-tag label-success w3-round">上架</span>
                                        </td>
                                    </tr>;
                                })
                            }
                        </tbody>
                    </table>
                    <section>
                        <nav className="nav nav-tabs">
                            <a href="#tab1" className="js-tab active">產品簡介</a>
                            <a href="#tab2" className="js-tab">產品更多介紹</a>
                        </nav>
                        <div className="tab-content">
                            <article id="tab1" className="tab-pane active">
                                <textarea className="form-control" rows="8" value="">
                                    風味：入口明朗的漿果風味，果酸細緻多變，若隱若現的花香氣息，層次豐富迷人。
                                    香: 3 甘: 2 苦: 3 酸: 3 醇: 2 (1~5)
                                    處理法：水洗
                                    焙度：中淺烘焙
                                    保存期限：60天 製造日期：詳見包裝
                                    風味鑑賞：前段檸檬皮的清香，李子的果酸，質地乾淨，尾段回甜快。
                                    保存方式：避免陽光直射，存放在陰涼處，若超過14天可冷藏以延長最佳風味。
                                </textarea>
                            </article>
                            <article id="tab2" className="tab-pane">
                                <textarea className="form-control" value="">請在此輸入產品更多介紹...</textarea>
                            </article>
                        </div>
                    </section>

                    <div className="form-action">
                        <PWButton iconClassName="fa-check" className="btn btn-primary btn-sm col-xs-offset-1 m-b-1"
                            title={UIText.save} enable={true} type="submit" >{UIText.save}</PWButton>
                        <PWButton iconClassName="fa-times" className="btn btn-secondary btn-sm"
                            title={UIText.save} enable={true} onClick={this.props.callGridLoad.bind(this, null) } >{UIText.return}</PWButton>
                    </div>

                </form>
            );

        return out_html;
    }
}