import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {config, UIText, IHideTypeData} from '../ts-comm/def-data';
import { clone, MntV} from '../ts-comm/comm-func'
import {ac_type_comm} from '../action_type';


export class Edit extends React.Component<any, any>{

    constructor() {
        super();

        this.state = {
        };
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let field: server.Product = pp.field;
        out_html =
            (
                <form className="form form-sm">
                    <h4 className="h4">文章內容</h4>

                      testadfadfadfadfa

                </form>
            );

        return out_html;
    }
}