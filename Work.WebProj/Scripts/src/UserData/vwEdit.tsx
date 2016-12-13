import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {config, UIText} from '../ts-comm/def-data';
import {ac_type_comm} from '../action_type';
import {InputText, InputNum, SelectText, RadioBox, AreaText, PWButton, TagShowAndHide} from '../components';
import {Init_Params} from './pub';
import {clone, tosMessage} from '../ts-comm/comm-func';

export class Edit extends React.Component<any,any>{

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
        let field: server.Product = this.props.field;
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
        let field: server.Customer = pp.field;
        let view_mode: InputViewMode = InputViewMode.edit;

        out_html =
            (
                <form className="form form-sm" onSubmit={this.handleSubmit}>
                    <h3 className="h3">
                        {gb_caption}<small className="sub"><i className="fa-angle-double-right"></i> {UIText.edit}</small>
                    </h3>

                    hello

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