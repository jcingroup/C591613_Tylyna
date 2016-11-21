import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {UIText, IHideTypeData} from '../ts-comm/def-data';
import {PWButton, InputText, InputNum, RadioBox} from '../components';
import {ac_type_comm} from '../action_type';
import {clone} from '../ts-comm/comm-func';
import {Init_Params} from './pub';


let EditRowButton = ({view_mode, updateState, cancelState, iKey }) => {
    if (view_mode === InputViewMode.view) {
        return (
            <span>
                <PWButton iconClassName="fa fa-pencil fa-lg" className="btn btn-link text-success" title={UIText.edit} enable={true} onClick={updateState } />
            </span>
        );
    } else {
        return (
            <span>
                <PWButton iconClassName="fa fa-reply" className="btn btn-link text-muted" title={UIText.cancel} enable={true} onClick={cancelState } /> { }
                <PWButton iconClassName="fa fa-check fa-lg" className="btn btn-link text-primary" name={'Done-' + iKey} title={UIText.done} enable={true} type="submit"/>
            </span>
        );
    }
}
interface GridTableProps {
    grid: Array<server.ProductKind>;
    params: Init_Params;
    updateRowState?: Function;
    cancelRowState?: Function;
    setRowInputValue?: Function;
    callSubmit: Function;
}
export class GridTable extends React.Component<GridTableProps, any>{

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
        };
    }
    keep_grid: Array<server.ProductKind> = [];
    chgRowVal(i: number, name: string, value: any, e: React.SyntheticEvent) {
        this.props.setRowInputValue(ac_type_comm.chg_grid_val, i, name, value);
    }
    editRowState(i: number, id: number, e: React.SyntheticEvent) {
        this.keep_grid = clone(this.props.grid);//每次按修改按鈕就重新複製Grid
        this.props.updateRowState(i, id);
    }
    cancelState(i: number, edit_type: IEditType, e: React.SyntheticEvent) {
        let item: server.ProductKind = null;

        if (edit_type == IEditType.update) {//修改
            item = this.keep_grid[i];
            item.view_mode = InputViewMode.view;
        }
        this.props.cancelRowState(edit_type, i, item);
    }
    handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        var $btn = $(document.activeElement);
        let key: number = parseInt($btn.attr("name").split("-")[1]);
        this.props.callSubmit(this.props.params.id, this.props.grid[key], this.props.grid[key].edit_type);
        return;
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;

        out_html =
            (
                <form onSubmit={this.handleSubmit}>
                    <table className="table table-sm table-bordered table-striped table-hover">
                        <colgroup>
                            <col style={{ "width": "8%" }} />
                            <col />
                            <col style={{ "width": "15%" }} />
                            <col style={{ "width": "20%" }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="text-xs-center">{UIText.edit}</th>
                                <th>主分類</th>
                                <th>排序</th>
                                <th>狀態</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pp.grid.map((item, i) => {
                                return <tr key={i}>
                                    <td className="text-xs-center">
                                        <EditRowButton
                                            key={i}
                                            iKey={i}
                                            view_mode={item.view_mode}
                                            updateState={this.editRowState.bind(this, i, item.product_kind_id) }
                                            cancelState={this.cancelState.bind(this, i, item.edit_type) }/>
                                    </td>
                                    <td>
                                        <InputText
                                            type="text"
                                            inputClassName="form-control form-control-sm"
                                            inputViewMode={item.view_mode}
                                            value={item.kind_name}
                                            onChange= {this.chgRowVal.bind(this, i, 'kind_name') }
                                            required={true}
                                            maxLength={64}
                                            placeholder="請輸入產品品名..."
                                            />
                                    </td>
                                    <td className="text-xs-center">
                                        <InputNum
                                            inputClassName="form-control form-control-sm text-xs-center"
                                            inputViewMode={item.view_mode}
                                            value={item.sort}
                                            onChange= {this.chgRowVal.bind(this, i, 'sort') }
                                            required={true}
                                            /> { }
                                    </td>
                                    <td className="text-xs-center">
                                        <RadioBox
                                            wrapperClassName="radio-group-stacked"
                                            inputViewMode={item.view_mode}
                                            name={"i_Hide-" + i}
                                            id={"i_Hide-" + i}
                                            value={item.i_Hide}
                                            required={true}
                                            labelClassName="c-input c-radio"
                                            spanClassName="c-indicator"
                                            textClassName="text-sm"
                                            radioList={IHideTypeData}
                                            />
                                    </td>
                                </tr>;
                            }) }
                        </tbody>
                    </table>
                </form>
            );

        return out_html;
    }
}