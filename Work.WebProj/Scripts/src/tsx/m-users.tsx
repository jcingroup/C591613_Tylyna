import $ = require('jquery');
import React = require('react');
import ReactDOM = require('react-dom');
import Moment = require('moment');
import ReactBootstrap = require("react-bootstrap");
import CommCmpt = require('comm-cmpt');
import CommFunc = require('comm-func');

namespace Users {
    interface Rows {
        Id?: string;
        check_del?: boolean,
        user_name_c?: string;
        UserName?: string;
        Email?: string;
    }
    interface FormState<G, F> extends BaseDefine.GirdFormStateBase<G, F> {

    }
    interface FormResult extends IResultBase {
        ID: string
    }
    
    class GridRow extends React.Component<BaseDefine.GridRowPropsBase<Rows>, BaseDefine.GridRowStateBase> {
        constructor() {
            super();
            this.delCheck = this.delCheck.bind(this);
            this.modify = this.modify.bind(this);
        }
        static defaultProps = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPathName: gb_approot + 'api/Users'
        }
        delCheck(i, chd) {
            this.props.delCheck(i, chd);
        }
        modify() {
            this.props.updateType(this.props.primKey)
        }
        render() {

            return <tr>
                <td className="text-xs-center">
                    <CommCmpt.GridCheckDel iKey={this.props.ikey} chd={this.props.itemData.check_del} delCheck={this.delCheck} />
                </td>
                <td className="text-xs-center">
                    <CommCmpt.GridButtonModify modify={this.modify} />
                </td>
                <td>
                    {this.props.itemData.UserName}
                </td>
                <td>
                    {this.props.itemData.user_name_c}
                </td>
                <td>
                    {this.props.itemData.Email}
                </td>
            </tr>;

        }
    }
    export class GridForm extends React.Component<BaseDefine.GridFormPropsBase, FormState<Rows, server.AspNetUsers>>{

        constructor() {

            super();
            this.updateType = this.updateType.bind(this);
            this.noneType = this.noneType.bind(this);
            this.queryGridData = this.queryGridData.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.deleteSubmit = this.deleteSubmit.bind(this);
            this.delCheck = this.delCheck.bind(this);
            this.checkAll = this.checkAll.bind(this);
            this.componentDidMount = this.componentDidMount.bind(this);
            this.insertType = this.insertType.bind(this);
            this.changeGDValue = this.changeGDValue.bind(this);
            this.changeFDValue = this.changeFDValue.bind(this);
            this.setInputValue = this.setInputValue.bind(this);
            this.render = this.render.bind(this);
            this.setRolesCheck = this.setRolesCheck.bind(this);


            this.state = {
                fieldData: { role_array: [] },
                gridData: { rows: [], page: 1 },
                edit_type: 0
            }
        }
        static defaultProps: BaseDefine.GridFormPropsBase = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/Users'
        }
        componentDidMount() {
            this.queryGridData(1);
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
                    this.setState({ gridData: data });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        handleSubmit(e: React.FormEvent) {

            e.preventDefault();
            if (this.state.edit_type == 1) {
                CommFunc.jqPost(this.props.apiPath, this.state.fieldData)
                    .done((data: FormResult, textStatus, jqXHRdata) => {
                        if (data.result) {
                            CommFunc.tosMessage(null, '新增完成', 1);
                            this.updateType(data.ID);
                        } else {
                            alert(data.message);
                        }
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        CommFunc.showAjaxError(errorThrown);
                    });
            }
            else if (this.state.edit_type == 2) {
                CommFunc.jqPut(this.props.apiPath, this.state.fieldData)
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
        handleOnBlur(date) {

        }
        deleteSubmit() {

            if (!confirm('確定是否刪除?')) {
                return;
            }

            var ids = [];
            for (var i in this.state.gridData.rows) {
                if (this.state.gridData.rows[i].check_del) {
                    ids.push('ids=' + this.state.gridData.rows[i].Id);
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
            this.setState({ edit_type: 1, fieldData: { role_array: [] } });
        }
        updateType(id: number | string) {

            CommFunc.jqGet(this.props.apiPath, { id: id })
                .done((data, textStatus, jqXHRdata) => {
                    this.setState({ edit_type: 2, fieldData: data.data });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        noneType() {
            this.gridData(0)
                .done(function (data, textStatus, jqXHRdata) {
                    this.setState({ edit_type: 0, gridData: data });
                }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
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
            let obj = this.state[collentName];
            console.log(name);
            if (input.value == 'true') {
                obj[name] = true;
            } else if (input.value == 'false') {
                obj[name] = false;
            } else {
                obj[name] = input.value;
            }
            this.setState({ fieldData: obj });
        }

        setRolesCheck(index, e) {
            var obj = this.state[this.props.fdName];
            var roleObj = obj['role_array'];
            var item = roleObj[index];
            item.role_use = !item.role_use;
            this.setState({ fieldData: obj });
        }

        render() {

            var outHtml: JSX.Element = null;

            if (this.state.edit_type == 0) {
                let searchData = this.state.searchData;
                let GridNavPage = CommCmpt.GridNavPage;

                outHtml =
                    (
                        <div>

                            <ul className="breadcrumb">
                                <li><i className="fa-caret-right"></i> { } 
                                    {this.props.menuName}
                                </li>
                                <li><i className="fa-angle-right"></i> { } 
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
                                                    <label className="sr-only">使用者名稱</label> { }
                                                    <input type="text" className="form-control form-control-sm"
                                                        onChange={this.changeGDValue.bind(this, 'UserName') }
                                                        placeholder="使用者名稱" /> { }
                                                    <button className="btn btn-sm btn-primary" type="submit"><i className="fa-search"></i> 搜尋</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <table className="table table-sm table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th style={{"width" : "7%"}} className="text-xs-center">
                                                    <label className="c-input c-checkbox">
                                                        <input type="checkbox" checked={this.state.checkAll} onChange={this.checkAll} />
                                                        <span className="c-indicator"></span>
                                                        全選
                                                    </label>
                                                </th>
                                                <th style={{"width" : "7%"}} className="text-xs-center">修改</th>
                                                <th style={{"width" : "15%"}}>UserName</th>
                                                <th style={{"width" : "15%"}}>簡稱</th>
                                                <th style={{"width" : "56%"}}>Email</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.gridData.rows.map(
                                                    (itemData, i) =>
                                                        <GridRow key={i}
                                                            ikey={i}
                                                            primKey={itemData.Id}
                                                            itemData={itemData}
                                                            delCheck={this.delCheck}
                                                            updateType={this.updateType} />
                                                )
                                            }
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
                                    />
                            </form>
                        </div>
                    );
            }
            else if (this.state.edit_type == 1 || this.state.edit_type == 2) {
                let fieldData = this.state.fieldData;
                console.log('role_array', fieldData.role_array);

                outHtml = (
                    <div>
                        <ul className="breadcrumb">
                            <li><i className="fa-caret-right"></i> { } 
                                {this.props.menuName}
                            </li>
                            <li><i className="fa-angle-right"></i> { } 
                                {this.props.caption}
                            </li>
                            <li><i className="fa-angle-right"></i> { } 
                                資料維護
                            </li>
                        </ul>
                        <h3 className="h3"> {this.props.caption} <small className="sub"><i className="fa-angle-double-right"></i> 資料維護</small></h3>
                        <form className="form form-sm" onSubmit={this.handleSubmit}>
                            
                                <div className="form-group row">
                                    <label className="col-xs-1 form-control-label text-xs-right"><small className="text-danger">*</small> 登錄帳號</label>
                                    <div className="col-xs-7">
                                        <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'UserName') } value={fieldData.UserName} maxLength={16} disabled={this.state.edit_type == 2}
                                            required />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-xs-1 form-control-label text-xs-right"><small className="text-danger">*</small> 中文名稱</label>
                                    <div className="col-xs-7">
                                        <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'user_name_c') } value={fieldData.user_name_c} maxLength={32} required />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-xs-1 form-control-label text-xs-right">角色</label>
                                    <div className="col-xs-7">
                                        {fieldData.role_array.map((item, i) => {

                                            var out_check = <div
                                                className="checkbox"
                                                key={ item.role_id }>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={ item.role_use }
                                                        onChange={ this.setRolesCheck.bind(this, i) } />
                                                    {item.role_name}
                                                </label>
                                            </div>;

                                            return out_check;

                                        }) }
                                    </div>
                                </div>

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
ReactDOM.render(<Users.GridForm caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom);