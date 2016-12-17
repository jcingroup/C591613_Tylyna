import React = require('react');
import Moment = require('moment');
import {config, UIText} from '../ts-comm/def-data';
import {TagShowAndHide, PWButton} from '../components';
import {IEditorState} from './pub';

import {EditDetailView} from './containers';
import {HeadView} from '../ts-comm/vwHeadView';

export class AStart extends React.Component<any, { infoShow: boolean }>{

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = { infoShow: true };
    }
    handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let field: server.Editor_L1 = this.props.field;
        let pp = this.props;

        this.props.callSubmit(pp.params.id, field, pp.edit_type);
        return;
    }
    hideInfo(e) {
        this.setState({ infoShow: false });
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let field: server.Editor_L1 = pp.field;
        let view_mode: InputViewMode = InputViewMode.edit;

        out_html =
            (
                <div>
                    <HeadView />
                    <form className="form form-sm" onSubmit={this.handleSubmit}>
                        <h3 className="h3">
                            {gb_caption}<small className="sub"><i className="fa-angle-double-right"></i> {UIText.edit}</small>
                        </h3>
                        <TagShowAndHide show={this.state.infoShow && pp.params.id == IEditorState.Story} TagName={TagName.div}  className="alert alert-warning w3-small">
                            <PWButton className="close" iconClassName="fa-times" enable={true} onClick={this.hideInfo.bind(this) } />
                            編輯器上傳圖片或新增表格等時，請勿設定寬度及高度(將數字刪除) ，以免行動裝置顯示時會跑版。<br />
                            ps.youtube 可勾選「用自適應縮放模式」
                        </TagShowAndHide>
                        <EditDetailView />

                        <div className="form-action">
                            <PWButton iconClassName="fa-check" className="btn btn-primary btn-sm col-xs-offset-1"
                                title={UIText.save} enable={true} type="submit" >{UIText.save}</PWButton> { }
                        </div>

                    </form>
                </div>
            );

        return out_html;
    }
}