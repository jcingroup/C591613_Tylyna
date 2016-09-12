import $ = require('jquery');
import React = require('react');
import ReactDOM = require('react-dom');
import update = require('react-addons-update');
import Moment = require('moment');
import ReactBootstrap = require("react-bootstrap");
import CommCmpt = require('comm-cmpt');
import CommFunc = require('comm-func');
import dt = require('dt');
import DatePicker = require('react-datepicker');
import "react-datepicker/dist/react-datepicker.css";
declare var community_id: number;
namespace News {
    interface Rows {
        check_del: boolean,
        community_news_id: number,
        title: string,
        start_date: Date,
        end_date: Date,
        state: string,
        community_name: string

    }
    interface GirdFormState<G, F> extends BaseDefine.GirdFormStateBase<G, F> {
        searchData?: {
            keyword: string
        },
        options_community?: Array<server.Community>
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

            let state = [];
            state['A'] = <span className="label label-success">顯示</span>;
            state['C'] = <span className="label label-danger">關閉</span>;



            return <tr>
                <td className="text-xs-center">
                    <CommCmpt.GridButtonDel
                        removeItemSubmit={this.props.removeItemSubmit}
                        primKey={this.props.primKey} />
                </td>
                <td className="text-xs-center">
                    <CommCmpt.GridButtonModify modify={this.modify}/>
                </td>
                <td>{this.props.itemData.community_name}</td>
                <td>{this.props.itemData.title}</td>
                <td>{Moment(this.props.itemData.start_date).format(dt.dateFT) }</td>
                <td>{Moment(this.props.itemData.end_date).format(dt.dateFT) }</td>
                <td>{state[this.props.itemData.state]}</td>
            </tr>;
        }
    }
    export class GirdForm extends React.Component<BaseDefine.GridFormPropsBase, GirdFormState<Rows, server.Community_News>>{

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
            apiPath: gb_approot + 'api/CommunityNews'
        }
        componentDidMount() {
            //init component data
            CommFunc.jqGet(gb_approot + 'Api/GetAction/GetOptionsCommunity', {})
                .done((data: Array<server.Community>) => {
                    this.setState({ options_community: data });
                })

            this.queryGridData(1);
        }
        componentDidUpdate(prevProps, prevState) {
            if ((prevState.edit_type == IEditType.none && (this.state.edit_type == IEditType.insert || this.state.edit_type == IEditType.update))) {
                CKEDITOR.replace('news_content', { customConfig: '../ckeditor/inlineConfig.js' });
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

            this.state.fieldData.context = CKEDITOR.instances['news_content'].getData();

            if (this.state.edit_type == IEditType.insert) {
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
            else if (this.state.edit_type == IEditType.update) {

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
                    ids.push('ids=' + this.state.gridData.rows[i].community_news_id);
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
                edit_type: IEditType.insert,
                fieldData: {
                    start_date: Moment().format(dt.dateFT),
                    state: 'A',
                    community_id: community_id
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
            this.setEventValue(this.props.fdName, name, e);
        }
        changeGDValue(name: string, e: React.SyntheticEvent) {
            this.setEventValue(this.props.gdName, name, e);
        }
        setEventValue(collentName: string, name: string, e: React.SyntheticEvent) {
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
        setInputValue(collentName: string, name: string, v: any) {
            var objForUpdate = {
                [collentName]:
                {
                    [name]: { $set: v }
                }
            };
            var newState = update(this.state, objForUpdate);
            this.setState(newState);
        }
        setInputValueMuti(collentName: string, name: Array<string>, v: Array<any>) {

            var objForUpdate = { [collentName]: {} };
            for (var i in name) {
                var item = name[i];
                var value = v[i];
                objForUpdate[collentName][item] = { $set: value }
            }
            var newState = update(this.state, objForUpdate);
            this.setState(newState);
        }

        setChangeDate(collentName: string, name: string, date: moment.Moment) {

            var v = date == null ? null : date.format();
            var objForUpdate = {
                [collentName]:
                {
                    [name]: {
                        $set: v
                    }
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
                                                <th style={{ "width": "7%" }} className="text-xs-center">刪除</th>
                                                <th style={{ "width": "7%" }} className="text-xs-center">修改</th>
                                                <th style={{ "width": "20%" }}>商家名稱</th>
                                                <th style={{ "width": "30%" }}>標題</th>
                                                <th style={{ "width": "13%" }}>啟始日期</th>
                                                <th style={{ "width": "13%" }}>結束日期</th>
                                                <th style={{ "width": "10%" }}>狀態</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.gridData.rows.map(
                                                (itemData, i) =>
                                                    <GridRow key={i}
                                                        primKey={itemData.community_news_id}
                                                        itemData={itemData}
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

                let mnt_start_date = CommFunc.MntV(field.start_date);
                let mnt_end_date = CommFunc.MntV(field.end_date);

                let end_date_disabled: boolean = mnt_start_date == null ? true : false; //1、如啟始日期無值 結束日期不可填 2、另結束日期不可小於開始日期

                let fldState = {
                    label: field.state == 'A' ?
                        <label className="col-xs-1 form-control-label text-xs-right">狀態</label> :
                        <label className="col-xs-1 form-control-label text-xs-right">狀態</label>,
                    tip: field.state == 'A' ?
                        <span className="col-xs-1"></span> :
                        <span className="col-xs-1">
                            <CommCmpt.Tips comment="關閉說明：即使日期目前仍在有效範圍也不會顯示！"  />
                        </span>
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
                            <div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right"><small className="text-danger">*</small> 標題</label>
                                <div className="col-xs-8">
                                    <input type="text" className="form-control"
                                        onChange={this.changeFDValue.bind(this, 'title') }
                                        value={field.title}
                                        maxLength={128}
                                        required />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right"><small className="text-danger">*</small> 所屬商家</label>
                                <div className="col-xs-8">
                                    <select className="form-control"
                                        required
                                        value={field.community_id}
                                        onChange={this.changeFDValue.bind(this, 'community_id') }
                                        disabled={community_id != null}
                                        >
                                        <option value="" selected disabled>請選擇</option>
                                        {
                                            this.state.options_community.map(function (item, i) {
                                                return (
                                                    <option value={item.community_id} key={item.community_id}>{item.community_name}</option>);
                                            })
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right"><small className="text-danger">*</small> 刊登時間</label>
                                <div className="col-xs-4">
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-addon">起</span>
                                        <DatePicker selected={mnt_start_date}
                                            dateFormat={dt.dateFT}
                                            isClearable={true}
                                            required={true}
                                            locale="zh-TW"
                                            showYearDropdown
                                            minDate={Moment() }
                                            onChange={this.setChangeDate.bind(this, this.props.fdName, 'start_date') }
                                            className="form-control" />
                                    </div>
                                </div>
                                <div className="col-xs-4">
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-addon">迄</span>
                                        <DatePicker selected={mnt_end_date}
                                            dateFormat={dt.dateFT}
                                            isClearable={true}
                                            required={true}
                                            locale="zh-TW"
                                            showYearDropdown
                                            onChange={this.setChangeDate.bind(this, this.props.fdName, 'end_date') }
                                            className="form-control"
                                            minDate={mnt_start_date}
                                            disabled={end_date_disabled}
                                            />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group row">
                                {fldState.label}
                                <div className="col-xs-4">
                                    <select className="form-control"
                                        required
                                        value={field.state}
                                        onChange={this.changeFDValue.bind(this, 'state') }>
                                        <option value="A">顯示</option>
                                        <option value="C">關閉</option>
                                    </select>
                                </div>
                                {fldState.tip}
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-1 form-control-label text-xs-right">內容</label>
                                <div className="col-xs-8">
                                    <textarea type="date" className="form-control" id="news_content" name="news_content"
                                        value={field.context} onChange={this.changeFDValue.bind(this, 'context') }></textarea>
                                </div>
                            </div>
                            <div className="form-action">
                                <div className="col-xs-offset-1">
                                    <button type="submit" className="btn btn-sm btn-primary"><i className="fa-check"></i> 儲存</button> { }
                                    <button type="button" className="btn btn-sm btn-secondary" onClick={this.noneType}><i className="fa-times"></i> 回前頁</button>
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
ReactDOM.render(<News.GirdForm caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom); 