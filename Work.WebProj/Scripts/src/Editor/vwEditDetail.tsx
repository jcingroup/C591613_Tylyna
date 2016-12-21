import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import Sortable = require('sortablejs');
import ReactBootstrap = require("react-bootstrap");
import {config, UIText} from '../ts-comm/def-data';
import {InputText, InputNum, AreaText, PWButton, TagShowAndHide} from '../components';
import {uniqid, tosMessage} from '../ts-comm/comm-func';

import {ac_type_comm} from '../action_type';

interface DetailFieldProps {
    key: any,
    iKey: number,
    field: server.Editor_L2,
    chgDVal?: Function,
    delItem?: any,
    hideDel?: boolean
    hideSort?: boolean
}
export class DetailField extends React.Component<DetailFieldProps, { open?: boolean, editorObj?: any }>{
    constructor() {
        super()
        this.componentDidMount = this.componentDidMount.bind(this);
        this.chgDetailVal = this.chgDetailVal.bind(this);
        this.setEditor = this.setEditor.bind(this);
        this.state = {
            open: true,
            editorObj: null
        }
    }
    static defaultProps = {
        key: 0,
        field: {}
    }
    componentDidMount() {
        this.setEditor('content-' + this.props.iKey, this.props.iKey);
    }
    chgDetailVal(name: string, value: any, e: React.SyntheticEvent) {
        this.props.chgDVal(ac_type_comm.chg_dil_fld_val, this.props.iKey, name, value);
    }
    setEditor(editorName: string, iKey) {
        let editorObj = this.state.editorObj, _this = this;

        editorObj = CKEDITOR.replace(editorName, { customConfig: '../ckeditor/inlineConfig.js?v=' + uniqid() });
        editorObj.on('change', function (evt) {
            _this.props.chgDVal(ac_type_comm.chg_dil_fld_val, iKey, 'l2_content', editorObj.getData());
        }.bind(this));
    }
    collaspesDetail() {
        this.setState({ open: !this.state.open });
    }
    render() {
        let out_html = null;
        let Collapse = ReactBootstrap.Collapse;
        let pp = this.props;
        let view_mode: InputViewMode = InputViewMode.edit;
        let field: server.Editor_L2 = pp.field;

        out_html = (
            <article className="w3-card-2 m-y-1" data-id={pp.iKey + '-' + field.editor_l2_id}>
                <header className="w3-padding w3-light-blue form-inline text-sm">
                    <ul className="list-inline clearfix m-b-0">
                        <TagShowAndHide className="pull-xs-left" TagName={TagName.li} show={!pp.hideSort}>
                            <strong className="fa-bars"></strong>
                        </TagShowAndHide>
                        <li className="pull-xs-left"># {pp.iKey}</li>
                        <li className="pull-xs-left">
                            <InputText
                                type="text"
                                inputClassName="form-control form-control-sm"
                                inputViewMode={view_mode}
                                value={field.l2_name}
                                onChange= {this.chgDetailVal.bind(this, 'l2_name') }
                                required={true}
                                maxLength={64}
                                placeholder="請輸入名稱..."
                                />
                        </li>
                        <li className="pull-xs-right m-l-1">
                            <PWButton className="btn btn-link text-lg text-danger" iconClassName="fa-times" enable={true} hidden={pp.hideDel}
                                onClick={this.props.delItem}/>
                        </li>
                        <li className="pull-xs-right m-l-1">
                            <PWButton onClick={this.collaspesDetail.bind(this) } enable={true} className="btn btn-link btn-sm text-white" iconClassName="fa-chevron-down"> 收合/展開</PWButton>
                        </li>
                        <TagShowAndHide className="pull-xs-right m-l-1" TagName={TagName.li} show={!pp.hideSort}>
                            <InputNum
                                inputClassName="form-control w-x-5 text-xs-center"
                                inputViewMode={view_mode}
                                required={true}
                                value={field.sort}
                                onChange= {this.chgDetailVal.bind(this, 'sort') }
                                placeholder="排序."
                                /> { }
                        </TagShowAndHide>
                    </ul>
                </header>
                <Collapse in={this.state.open}>
                    <main className="w3-padding">
                        <AreaText
                            id={'content-' + pp.iKey} name={'content-' + pp.iKey}
                            value={field.l2_content} onChange={this.chgDetailVal.bind(this, 'l2_content') }
                            inputClassName="form-control form-control-sm"
                            inputViewMode={view_mode}
                            required={false}
                            maxLength={512}
                            rows={8}
                            />
                    </main>
                </Collapse>

            </article>
        );

        return out_html;
    }
}
export class EditDetail extends React.Component<any, any>{
    _sortable: any;
    constructor() {
        super();
        this.addDetail = this.addDetail.bind(this);
        this.delDetail = this.delDetail.bind(this);
        this.sortableGroup = this.sortableGroup.bind(this);
        this._sortable = null;
        this.state = {
        };
    }
    addDetail(e: React.SyntheticEvent) {
        let data: server.Editor_L2 = {
            editor_l1_id: this.props.params.id,
            editor_l2_id: 0,
            l2_name: '',
            l2_content: '',
            sort: 0,
            i_Hide: false,
            edit_type: IEditType.insert
        };

        this.props.addRowState(data);
    }
    delDetail(i: number, id: number, edit_state: IEditType, e: React.SyntheticEvent) {
        if (!confirm(UIText.delete_sure)) {
            return;
        }
        if (edit_state == IEditType.insert) {//新增狀態直接刪除
            tosMessage(null, UIText.fi_delete, 1);
            this.props.delRowState(i);
        } else if (edit_state == IEditType.update) {//修改狀態需call api
            this.props.callDetailDel(i, id);
        }
    }
    sortableGroup(componentBackingInstance) {
        if (componentBackingInstance) {
            let _this = this;
            let field: server.Editor_L1 = _this.props.field;
            let options = {
                handle: '.fa-bars',
                draggable: "article",
                group: "shared",
                disabled: field.hide_sort,
                onSort: function (evt) {
                    var itemEl = evt.item;
                    let detail: Array<server.Editor_L2> = field.Deatil == undefined ? [] : field.Deatil;

                    detail.movesort(evt.oldIndex, evt.newIndex);

                    let count = detail.length;
                    detail.forEach((item, i) => {//更新排序
                        item.sort = count - i;
                    })

                    _this.props.getDetailData(detail);
                }
            };

            this._sortable = Sortable.create(componentBackingInstance, options);
        }
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;

        let field: server.Editor_L1 = pp.field;
        let detail: Array<server.Editor_L2> = field.Deatil == undefined ? [] : field.Deatil;

        if (pp.edit_type == IEditType.update) {
            out_html =
                (
                    <div>
                        <PWButton className="btn btn-success btn-sm" iconClassName="fa-plus-circle"
                            enable={true}
                            hidden={field.hide_add}
                            onClick={this.addDetail}> {UIText.add}</PWButton>
                        <div ref={this.sortableGroup}>
                            {
                                detail.map((item, i) => {
                                    return <DetailField
                                        key={i + '-' + item.editor_l2_id}
                                        iKey={i}
                                        field={item}
                                        hideDel={field.hide_del}
                                        hideSort={field.hide_sort}
                                        chgDVal={this.props.setRowInputValue}
                                        delItem={this.delDetail.bind(this, i, item.editor_l2_id, item.edit_type) }/>;
                                })
                            }
                        </div>
                    </div>
                );
        }

        return out_html;
    }
}