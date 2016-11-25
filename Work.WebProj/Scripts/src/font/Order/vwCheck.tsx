import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {TagShowAndHide, InputNum, PWButton} from '../../components';
import {ac_type_comm} from '../../action_type';
import {UIText, IPackTypeData} from '../../ts-comm/def-data';
import {fmt_money, makeInputValue} from '../../ts-comm/comm-func';

export class Check extends React.Component<any, any>{

    constructor() {
        super();
        this.state = {
        };
    }
    render() {
        let out_html: JSX.Element = null;
        let field: server.Purchase = this.props.field;
        let ship: Array<server.Shipment> = this.props.ship;
        out_html =
            (<div>
                確認訂單
            </div>
            );

        return out_html;
    }
}


