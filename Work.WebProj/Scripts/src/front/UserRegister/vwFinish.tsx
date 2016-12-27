import React = require('react');
import Moment = require('moment');
import {InputText, PWButton} from '../../components';
import {ac_type_comm} from '../../action_type';
import {config, UIText} from '../../ts-comm/def-data';

export class Finish extends React.Component<any, any>{

    constructor() {
        super();
        this.state = {
        };
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let field: server.Customer = pp.field;
        let view_mode: InputViewMode = InputViewMode.edit;

        out_html = (
            <div>
                <h2>感謝您的註冊！我們將發送會員註冊通知Mail。</h2>
            </div>
        );
        return out_html;
    }
}


