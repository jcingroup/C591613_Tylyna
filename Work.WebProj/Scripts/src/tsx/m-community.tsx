import $ = require('jquery');
import React = require('react');
import ReactDOM = require('react-dom');
import update = require('react-addons-update');
import Moment = require('moment');
import ReactBootstrap = require("react-bootstrap");
import CommCmpt = require('comm-cmpt');
import CommFunc = require('comm-func');
import DatePicker = require('react-datepicker');
import "react-datepicker/dist/react-datepicker.css";

namespace Community {
    interface Rows {
        check_del: boolean,
        community_id: number,
        community_name: string
    }
    interface GirdFormState<G, F> extends BaseDefine.GirdFormStateBase<G, F> {
        searchData?: {
            keyword: string
        }
    }
    interface IDName {
        id: number | string //數字型用id 字串型用no
    }
    interface CallResult extends IResultBase, IDName { }
    
    class GridRow extends React.Component<BaseDefine.GridRowPropsBase2<Rows>, BaseDefine.GridRowStateBase> {
        constructor() {
            super();
            //this.delCheck = this.delCheck.bind(this);
            this.modify = this.modify.bind(this);
        }
        static defaultProps = {
        }
        //delCheck(i, chd) {
        //    this.props.delCheck(i, chd);
        //}
        modify() {
            this.props.updateType(this.props.primKey)
        }

        render() {
            return <tr>
                <td className="text-xs-center">
                    <CommCmpt.GridButtonDel
                        removeItemSubmit={this.props.removeItemSubmit}
                        primKey={this.props.primKey} />
                </td>
                <td className="text-xs-center">
                    <CommCmpt.GridButtonModify modify={this.modify}/>
                </td>
                <td>{this.props.itemData.community_id}</td>
                <td>{this.props.itemData.community_name}</td>
            </tr>;
        }
    }
    export class GirdForm extends React.Component<BaseDefine.GridFormPropsBase, GirdFormState<Rows, server.Community>>{

        constructor() {

            super();
            this.updateType = this.updateType.bind(this);
            this.noneType = this.noneType.bind(this);
            this.queryGridData = this.queryGridData.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.handleSearch = this.handleSearch.bind(this);
            this.removeItemSubmit = this.removeItemSubmit.bind(this);

            this.deleteSubmit = this.deleteSubmit.bind(this);
            this.delCheck = this.delCheck.bind(this);
            this.checkAll = this.checkAll.bind(this);

            this.componentDidMount = this.componentDidMount.bind(this);
            this.componentDidUpdate = this.componentDidUpdate.bind(this);
            this.componentWillUnmount = this.componentWillUnmount.bind(this);

            this.insertType = this.insertType.bind(this);
            this.state = {
                fieldData: null,
                gridData: { rows: [], page: 1 },
                edit_type: 0,
                searchData: { keyword: null },
                editPrimKey: null
            };

        }

        static defaultProps: BaseDefine.GridFormPropsBase = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/Community'
        }
        componentDidMount() {
            this.queryGridData(1);
        }
        componentDidUpdate(prevProps, prevState) {
            if ((prevState.edit_type == IEditType.none && (this.state.edit_type == IEditType.insert || this.state.edit_type == IEditType.update))) {
                CKEDITOR.replace('txt_spot', { customConfig: '../ckeditor/inlineConfig.js' });
                CKEDITOR.replace('txt_public', { customConfig: '../ckeditor/inlineConfig.js' });
            }
        }
        componentWillUnmount() {
            //元件被從 DOM 卸載之前執行，通常我們在這個方法清除一些不再需要地物件或 timer。
        }
        gridData(page: number) {

            var parms = {
                page: 0
            };

            if (page == 0) {
                parms.page = this.state.gridData.page;
            } else {
                parms.page = page;
            }

            $.extend(parms, this.state.searchData);

            return CommFunc.jqGet(this.props.apiPath, parms);
        }
        queryGridData(page: number) {
            this.gridData(page)
                .done((data, textStatus, jqXHRdata) => {
                    if (data.records == 0) {
                        CommFunc.tosMessage(null, '無任何資料', ToastrType.warning);
                    }
                    this.setState({ gridData: data });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        handleSubmit(e: React.FormEvent) {
            e.preventDefault();
            this.state.fieldData.txt_spot = CKEDITOR.instances['txt_spot'].getData();
            this.state.fieldData.txt_public = CKEDITOR.instances['txt_public'].getData();

            if (this.state.edit_type == 1) {
                CommFunc.jqPost(this.props.apiPath, this.state.fieldData)
                    .done((data: CallResult, textStatus, jqXHRdata) => {
                        if (data.result) {
                            CommFunc.tosMessage(null, '新增完成', 1);
                            this.updateType(data.id);
                        } else {
                            alert(data.message);
                        }
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        CommFunc.showAjaxError(errorThrown);
                    });
            }
            else if (this.state.edit_type == 2) {

                var packData = { id: this.state.editPrimKey, md: this.state.fieldData };

                CommFunc.jqPut(this.props.apiPath, packData)
                    .done((data, textStatus, jqXHRdata) => {
                        if (data.result) {
                            CommFunc.tosMessage(null, '修改完成', 1);
                        } else {
                            alert(data.message);
                        }
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        CommFunc.showAjaxError(errorThrown);
                    });
            };
            return;
        }
        deleteSubmit() {
            if (!confirm('確定是否刪除?')) {
                return;
            }

            var ids = [];
            for (var i in this.state.gridData.rows) {
                if (this.state.gridData.rows[i].check_del) {
                    ids.push('ids=' + this.state.gridData.rows[i].community_id);
                }
            }

            if (ids.length == 0) {
                CommFunc.tosMessage(null, '未選擇刪除項', 2);
                return;
            }

            CommFunc.jqDelete(this.props.apiPath + '?' + ids.join('&'), {})
                .done(function (data, textStatus, jqXHRdata) {
                    if (data.result) {
                        CommFunc.tosMessage(null, '刪除完成', 1);
                        this.queryGridData(0);
                    } else {
                        alert(data.message);
                    }
                }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        removeItemSubmit(primKey) {
            if (!confirm('確定是否刪除?')) {
                return;
            }

            CommFunc.jqDelete(this.props.apiPath, { id: primKey })
                .done(function (data, textStatus, jqXHRdata) {
                    if (data.result) {
                        CommFunc.tosMessage(null, '刪除完成', 1);
                        this.queryGridData(0);
                    } else {
                        alert(data.message);
                    }
                }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                    CommFunc.showAjaxError(errorThrown);
                });
        }

        handleSearch(e: React.FormEvent) {
            e.preventDefault();
            this.queryGridData(0);
            return;
        }
        delCheck(i: number, chd: boolean) {
            let newState = this.state;
            this.state.gridData.rows[i].check_del = !chd;
            this.setState(newState);
        }
        checkAll() {

            let newState = this.state;
            newState.checkAll = !newState.checkAll;
            for (var prop in this.state.gridData.rows) {
                this.state.gridData.rows[prop].check_del = newState.checkAll;
            }
            this.setState(newState);
        }
        insertType() {
            this.setState({
                edit_type: IEditType.insert, fieldData: {
                    group_buying_url:'http://www.jojogo168.com/'

                }
            });
        }
        updateType(id: number | string) {
            var idPack: IDName = { id: id }
            CommFunc.jqGet(this.props.apiPath, idPack)
                .done((data, textStatus, jqXHRdata) => {
                    this.setState({
                        edit_type: IEditType.update,
                        fieldData: data.data,
                        editPrimKey: id
                    });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        noneType() {
            this.gridData(0)
                .done((data, textStatus, jqXHRdata) => {
                    this.setState({ edit_type: IEditType.none, gridData: data, editPrimKey: null });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        changeFDValue(name: string, e: React.SyntheticEvent) {
            this.setInputValue(this.props.fdName, name, e);
        }
        changeGDValue(name: string, e: React.SyntheticEvent) {
            this.setInputValue(this.props.gdName, name, e);
        }
        setInputValue(collentName: string, name: string, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            let value;

            if (input.value == 'true') {
                value = true;
            } else if (input.value == 'false') {
                value = false;
            } else {
                value = input.value;
            }
            var objForUpdate = {
                [collentName]:
                {
                    [name]: { $set: value }
                }
            };
            var newState = update(this.state, objForUpdate);

            this.setState(newState);
        }

        render() {

            var outHtml: JSX.Element = null;
            var GridNavPage = CommCmpt.GridNavPage;

            if (this.state.edit_type == IEditType.none) {
                var search = this.state.searchData;
                outHtml =
                    (
                        <div>
                            <ul className="breadcrumb">
                                <li>
                                    <i className="fa-caret-right"></i> { }
                                    {this.props.menuName}
                                </li>
                                <li>
                                    <i className="fa-angle-right"></i> { }
                                    {this.props.caption}
                                </li>
                            </ul>
                            <h3 className="h3">
                                {this.props.caption}
                            </h3>
                            <form onSubmit={this.handleSearch}>
                                <div className="table-responsive">
                                    <div className="table-header">
                                        <div className="table-filter">
                                            <div className="form-inline">
                                                <div className="form-group">
                                                    <label className="sr-only">搜尋商家名稱</label> { }
                                                    <input type="text" className="form-control form-control-sm" onChange={this.changeGDValue.bind(this, 'keyword') } value={this.state.searchData.keyword} placeholder="商家名稱" /> { }
                                                    <button className="btn btn-sm btn-primary" type="submit"><i className="fa-search"></i> 搜尋</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <table className="table table-sm table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th style={{"width" : "7%"}} className="text-xs-center">刪除</th>
                                                <th style={{"width" : "7%"}} className="text-xs-center">修改</th>
                                                <th style={{"width" : "26%"}}>編號</th>
                                                <th style={{ "width": "60%" }}>商家名稱</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.gridData.rows.map(
                                                (itemData, i) =>
                                                    <GridRow key={i}
                                                        primKey={itemData.community_id}
                                                        itemData={itemData}
                                                        //delCheck={this.delCheck}
                                                        removeItemSubmit={this.removeItemSubmit}
                                                        updateType={this.updateType} />
                                            ) }
                                        </tbody>
                                    </table>
                                </div>
                                <GridNavPage
                                    startCount={this.state.gridData.startcount}
                                    endCount={this.state.gridData.endcount}
                                    recordCount={this.state.gridData.records}
                                    totalPage={this.state.gridData.total}
                                    nowPage={this.state.gridData.page}
                                    queryGridData={this.queryGridData}
                                    insertType={this.insertType}
                                    deleteSubmit={this.deleteSubmit}
                                    showDelete={false}
                                    />
                            </form>
                        </div>
                    );
            }
            else if (this.state.edit_type == IEditType.insert || this.state.edit_type == IEditType.update) {

                let field = this.state.fieldData;
                let up_CommunityList = null;
                let up_CommunityDoor = null;
                let up_CommunityPublic = null;



                if (this.state.edit_type == IEditType.update) {
                    up_CommunityList = <div className="form-group row">
                        <label className="col-xs-1 form-control-label text-xs-right">商家代表圖</label>
                        <div className="col-xs-7">
                            <CommCmpt.MasterImageUpload FileKind="CommunityList"
                                MainId={field.community_id}
                                ParentEditType={this.state.edit_type}
                                url_upload={gb_approot + 'Active/Matter/axFUpload'}
                                url_list={gb_approot + 'Active/Matter/axFList'}
                                url_delete={gb_approot + 'Active/Matter/axFDelete'}
                                url_sort={gb_approot + 'Active/Matter/axFSort'} />
                            <small className="text-muted">最多可上傳 1 張圖片</small>
                        </div>
                    </div>;


                    up_CommunityDoor = <div className="form-group row">
                        <label className="col-xs-1 form-control-label text-xs-right">商家相簿</label>
                        <div className="col-xs-7">
                            <CommCmpt.MasterImageUpload FileKind="CommunityDoor"
                                MainId={field.community_id}
                                ParentEditType={this.state.edit_type}
                                url_upload={gb_approot + 'Active/Matter/axFUpload'}
                                url_list={gb_approot + 'Active/Matter/axFList'}
                                url_delete={gb_approot + 'Active/Matter/axFDelete'}
                                url_sort={gb_approot + 'Active/Matter/axFSort'} />
                            <small className="text-muted">最多可上傳 10 張圖片</small>
                        </div>
                    </div>;

                    up_CommunityPublic = <div className="form-group row">
                        <label className="col-xs-1 form-control-label text-xs-right">社區公設</label>
                        <div className="col-xs-7">
                            <CommCmpt.MasterImageUpload FileKind="CommunityPublic"
                                MainId={field.community_id}
                                ParentEditType={this.state.edit_type}
                                url_upload={gb_approot + 'Active/Matter/axFUpload'}
                                url_list={gb_approot + 'Active/Matter/axFList'}
                                url_delete={gb_approot + 'Active/Matter/axFDelete'}
                                url_sort={gb_approot + 'Active/Matter/axFSort'} />
                            <small className="text-muted">最多可上傳 10 張圖片</small>
                        </div>
                    </div>;
                }

                var outHtml = (
                    <div>
                        <ul className="breadcrumb">
                            <li>
                                <i className="fa-caret-right"></i> { }
                                {this.props.menuName}
                            </li>
                            <li>
                                <i className="fa-angle-right"></i> { }
                                {this.props.caption}
                            </li>
                            <li>
                                <i className="fa-angle-right"></i> { }
                                資料維護
                            </li>
                        </ul>
                        <h3 className="h3"> {this.props.caption} <small className="sub"><i className="fa-angle-double-right"></i> 資料維護</small></h3>
                        <form className="form form-sm" onSubmit={this.handleSubmit}>

                            <h4 className="h4">商家基本資料</h4>
                            <div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right"><small className="text-danger">*</small>  商家名稱</label>
                                <div className="col-xs-7">
                                    <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'community_name') } value={field.community_name} maxLength={64}
                                        required />
                                </div>
                            </div>


                            {up_CommunityList}


                            {/*<div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right">建物地址</label>
                                <div className="col-xs-7">
                                    <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'address') } value={field.address} maxLength={128}
                                         />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right">建物型態</label>
                                <div className="col-xs-3">
                                    <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'typeOfBuild') } value={field.typeOfBuild} maxLength={128}
                                        />
                                </div>
                                <label className="col-xs-1 form-control-label text-xs-right">管理方式</label>
                                <div className="col-xs-3">
                                    <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'manage') } value={field.manage} maxLength={50}
                                        />
                                </div>
                            </div>
                            
                            <div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right">建物樓層</label>
                                <div className="col-xs-3">
                                    <input type="number" className="form-control" onChange={this.changeFDValue.bind(this, 'total_floor') } value={field.total_floor} 
                                        />
                                </div>
                                <div className="col-xs-2">
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-addon">地上</span>
                                        <input type="number" className="form-control" onChange={this.changeFDValue.bind(this, 'over_floor') } value={field.over_floor}
                                            />
                                        <span className="input-group-addon">層</span>
                                    </div>
                                </div>
                                <div className="col-xs-2">
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-addon">地下</span>
                                        <input type="number" className="form-control" onChange={this.changeFDValue.bind(this, 'under_floor') } value={field.under_floor}
                                            />
                                        <span className="input-group-addon">層</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right">總戶數</label>
                                <div className="col-xs-3">
                                    <div className="input-group input-group-sm">
                                        <input type="number" className="form-control" onChange={this.changeFDValue.bind(this, 'holders') } value={field.holders} />
                                        <span className="input-group-addon">戶</span>
                                    </div>
                                </div>
                                <label className="col-xs-1 form-control-label text-xs-right">同層戶數</label>
                                <div className="col-xs-3">
                                    <div className="input-group input-group-sm">
                                        <input type="number" className="form-control" onChange={this.changeFDValue.bind(this, 'perOfHolder') } value={field.perOfHolder} />
                                        <span className="input-group-addon">戶</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right">屋齡</label>
                                <div className="col-xs-3">
                                    <div className="input-group input-group-sm">
                                        <input type="number" className="form-control" onChange={this.changeFDValue.bind(this, 'age') } value={field.age} />
                                        <span className="input-group-addon">年</span>
                                    </div>
                                </div>
                                <label className="col-xs-1 form-control-label text-xs-right">完工日期</label>
                                <div className="col-xs-3">
                                    <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'finish') } value={field.finish} maxLength={10}
                                         />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right">建設公司</label>
                                <div className="col-xs-3">
                                    <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'company') } value={field.company} maxLength={50}
                                        />
                                </div>
                                <label className="col-xs-1 form-control-label text-xs-right">營造公司</label>
                                <div className="col-xs-3">
                                    <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'build') } value={field.build} maxLength={50}
                                        />
                                </div>
                            </div>
                            */}
                            <div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right">簡介</label>
                                <div className="col-xs-7">
                                    <textarea type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'info_content') } rows={5} value={field.info_content} maxLength={4000}>
                                        </textarea>               
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right">地圖嵌入</label>
                                <div className="col-xs-7">
                                    <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'map_iframe') } value={field.map_iframe} maxLength={4000}
                                        />
                                    <small className="text-muted">請使用 Google 地圖 的 內嵌地圖功能，操作方式請看 教學影片1</small>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right">商家特色</label>
                                <div className="col-xs-7">
                                    <textarea className="form-control" id="txt_spot" name="txt_spot"
                                        value={field.txt_spot} onChange={this.changeFDValue.bind(this, 'txt_spot') }></textarea>
                                </div>
                            </div>
                            <hr className="sm" />
                            <h4 className="h4">商家聯絡資訊</h4>
                            <div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right"><small className="text-danger">*</small> 登錄帳號</label>
                                <div className="col-xs-3">
                                    <input type="text" className="form-control"
                                        onChange={this.changeFDValue.bind(this, 'account') }
                                        value={field.account}
                                        maxLength={64}
                                        required />
                                </div>
                                <label className="col-xs-1 form-control-label text-xs-right"><small className="text-danger">*</small> 登錄密碼</label>
                                <div className="col-xs-3">
                                    <input type="password" className="form-control"
                                        onChange={this.changeFDValue.bind(this, 'passwd') }
                                        value={field.passwd}
                                        maxLength={64}
                                        required />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right">聯絡人</label>
                                <div className="col-xs-7">
                                    <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'contact') } value={field.contact}
                                        />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right">電話</label>
                                <div className="col-xs-7">
                                    <input type="tel" className="form-control" onChange={this.changeFDValue.bind(this, 'tel') } value={field.tel}
                                        />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right">E-mail</label>
                                <div className="col-xs-7">
                                    <input type="email" className="form-control" onChange={this.changeFDValue.bind(this, 'email') } value={field.email}
                                        />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right">團購連結</label>
                                <div className="col-xs-7">
                                    <input type="text" className="form-control"  onChange={this.changeFDValue.bind(this, 'group_buying_url') } value={field.group_buying_url}/>
                                    <small className="text-muted">請輸入完整網址 (包含 http://) </small>
                                </div>
                            </div>
                            <hr className="sm" />
                            <h4 className="h4">商家實景</h4>
                            <div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right">內容介紹</label>
                                <div className="col-xs-7">
                                    <textarea className="form-control" id="txt_public" name="txt_public"
                                        value={field.txt_public} onChange={this.changeFDValue.bind(this, 'txt_public') }></textarea>
                                </div>
                            </div>
                            {up_CommunityDoor}
                            {/*up_CommunityPublic*/}

                            <div className="form-action">
                                <div className="col-xs-offset-1">
                                    <button type="submit" className="btn btn-sm btn-primary"><i className="fa-check"></i> 儲存</button> { }
                                    <button type="button" onClick={this.noneType} className="btn btn-sm btn-secondary"><i className="fa-times"></i> 回前頁</button>
                                </div>
                            </div>

                        </form>
                    </div>
                );
            }
            return outHtml;
        }
    }
}

var dom = document.getElementById('page_content');
ReactDOM.render(<Community.GirdForm caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom); 