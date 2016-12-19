import React = require('react');
import Moment = require('moment');
import {Init_Params} from './pub';
import {ac_type_comm} from '../action_type';
import {HeadView} from '../ts-comm/vwHeadView';
import {InputText, InputNum, PWButton} from '../components';
import {config, UIText} from '../ts-comm/def-data';

export class AStart extends React.Component<any, any>{

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {};
    }
    chgVal(name: string, value: any, e: React.SyntheticEvent) {
        this.props.setInputValue(ac_type_comm.chg_fld_val, name, value);
    }
    handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let params: Init_Params = this.props.params;

        this.props.callSubmit(params);
        return;
    }
    render() {
        let out_html: JSX.Element = null;
        let view_mode: InputViewMode = InputViewMode.edit;
        let params: Init_Params = this.props.params;

        out_html =
            (
                <div>
                    <HeadView />
                    <h3 className="h3">
                        {gb_caption}
                    </h3>
                    <div className="alert alert-warning text-sm">
                        <strong>YouTube注意事項: </strong><br/>
                        嵌入連結路徑如圖示 (<a href="/Content/images/sys/youtube.jpg" target="new">點選看圖示</a>)
                    </div>
                    <form className="form form-sm" onSubmit={this.handleSubmit}>

                        <InputText
                            type="text"
                            inputClassName="form-control m-b-1"
                            inputViewMode={view_mode}
                            value={params.YoutubeUrl}
                            onChange= {this.chgVal.bind(this, 'YoutubeUrl') }
                            required={true}
                            maxLength={256}
                            placeholder="請在此輸入Youtube嵌入連結路徑..."
                            />

                        <div className="form-action text-xs-center clear">
                            <PWButton iconClassName="fa-check" className="btn btn-primary btn-sm"
                                title={UIText.save} enable={true} type="submit" >{UIText.save}</PWButton> { }
                        </div>
                    </form>
                </div>
            );

        return out_html;
    }
}