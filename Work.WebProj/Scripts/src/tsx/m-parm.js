"use strict";
const React = require('react');
const ReactDOM = require('react-dom');
const CommCmpt = require('comm-cmpt');
const CommFunc = require('comm-func');
var Parm;
(function (Parm) {
    class GridForm extends React.Component {
        constructor() {
            super();
            this.queryInitData = this.queryInitData.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.componentDidMount = this.componentDidMount.bind(this);
            this.setInputValue = this.setInputValue.bind(this);
            this.render = this.render.bind(this);
            this.state = {
                param: {
                    Email: null,
                    PurchaseTotal: 0,
                    HomoiothermyFee: 0,
                    RefrigerFee: 0,
                    AccountName: null,
                    BankName: null,
                    BankCode: null,
                    AccountNumber: null,
                    Fee: 0
                }
            };
        }
        componentDidMount() {
            this.queryInitData();
        }
        queryInitData() {
            CommFunc.jqGet(this.props.apiInitPath, {})
                .done((data, textStatus, jqXHRdata) => {
                this.setState({ param: data });
            })
                .fail((jqXHR, textStatus, errorThrown) => {
                CommFunc.showAjaxError(errorThrown);
            });
        }
        handleSubmit(e) {
            e.preventDefault();
            CommFunc.jqPost(this.props.apiPath, this.state.param)
                .done((data, textStatus, jqXHRdata) => {
                if (data.result) {
                    CommFunc.tosMessage(null, '修改完成', 1);
                }
                else {
                    alert(data.message);
                }
            })
                .fail((jqXHR, textStatus, errorThrown) => {
                CommFunc.showAjaxError(errorThrown);
            });
            return;
        }
        handleOnBlur(date) {
        }
        setInputValue(name, e) {
            let input = e.target;
            let obj = this.state.param;
            obj[name] = input.value;
            this.setState({ param: obj });
        }
        render() {
            var outHtml = null;
            let param = this.state.param;
            let InputDate = CommCmpt.InputDate;
            outHtml = (React.createElement("div", null, React.createElement("ul", {className: "breadcrumb"}, React.createElement("li", null, React.createElement("i", {className: "fa-list-alt"}), this.props.menuName)), React.createElement("h4", {className: "title"}, " ", this.props.caption, " 基本資料維護"), React.createElement("form", {className: "form-horizontal", onSubmit: this.handleSubmit}, React.createElement("div", {className: "col-xs-12"}, React.createElement("div", {className: "item-box"}, React.createElement("div", {className: "item-title text-center"}, React.createElement("h5", null, "Email信箱設定")), React.createElement("div", {className: "alert alert-warning", role: "alert"}, React.createElement("ol", null, React.createElement("li", null, "多筆信箱請用「", React.createElement("strong", {className: "text-danger"}, ", "), "」逗號分開。", React.createElement("br", null), "ex.", React.createElement("strong", null, "user1 @demo.com.tw, user2 @demo.com.tw")), React.createElement("li", null, "Email 前面可填收件人姓名，用「", React.createElement("strong", {className: "text-danger"}, ": "), "」冒號分隔姓名和信箱，此項非必要，可省略。", React.createElement("br", null), "ex.", React.createElement("strong", null, "收件人A: user1 @demo.com.tw, 收件人B: user2 @demo.com.tw")))), React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "col-xs-1 control-label"}, "收件信箱"), React.createElement("div", {className: "col-xs-9"}, React.createElement("input", {className: "form-control", type: "text", value: param.Email, onChange: this.setInputValue.bind(this, 'Email'), maxLength: 500, required: true}))), React.createElement("div", {className: "item-title text-center"}, React.createElement("h5", null, "訂單運費設定")), React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "col-xs-3 control-label"}, "會員下訂單，當訂單金額少於NT$"), React.createElement("div", {className: "col-xs-1"}, React.createElement("input", {className: "form-control", type: "number", value: param.PurchaseTotal, onChange: this.setInputValue.bind(this, 'PurchaseTotal'), min: 0, required: true})), React.createElement("label", {className: "col-xs-2 control-label"}, "元時須付常溫運費NT$"), React.createElement("div", {className: "col-xs-1"}, React.createElement("input", {className: "form-control", type: "number", value: param.HomoiothermyFee, onChange: this.setInputValue.bind(this, 'HomoiothermyFee'), min: 0, required: true})), React.createElement("label", {className: "col-xs-2 control-label"}, "元或冷凍(冷藏)運費NT$"), React.createElement("div", {className: "col-xs-1"}, React.createElement("input", {className: "form-control", type: "number", value: param.RefrigerFee, onChange: this.setInputValue.bind(this, 'RefrigerFee'), min: 0, required: true})), React.createElement("label", {className: "col-xs-1 control-label"}, "元")), React.createElement("div", {className: "item-title text-center"}, React.createElement("h5", null, "付款方式")), React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "col-xs-4 control-label"}, "當付款方式選擇『ATM轉帳』時，銀行帳號資料為: ")), React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "col-xs-2 control-label"}, "戶名: "), React.createElement("div", {className: "col-xs-3"}, React.createElement("input", {className: "form-control", type: "text", value: param.AccountName, onChange: this.setInputValue.bind(this, 'AccountName'), maxLength: 16, required: true}))), React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "col-xs-2 control-label"}, "銀行: "), React.createElement("div", {className: "col-xs-3"}, React.createElement("input", {className: "form-control", type: "text", value: param.BankName, onChange: this.setInputValue.bind(this, 'BankName'), maxLength: 16, required: true}))), React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "col-xs-2 control-label"}, "代碼: "), React.createElement("div", {className: "col-xs-3"}, React.createElement("input", {className: "form-control", type: "text", value: param.BankCode, onChange: this.setInputValue.bind(this, 'BankCode'), maxLength: 5, required: true}))), React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "col-xs-2 control-label"}, "帳號: "), React.createElement("div", {className: "col-xs-3"}, React.createElement("input", {className: "form-control", type: "text", value: param.AccountNumber, onChange: this.setInputValue.bind(this, 'AccountNumber'), maxLength: 16, required: true})))), React.createElement("div", {className: "form-action"}, React.createElement("div", {className: "col-xs-4 col-xs-offset-5"}, React.createElement("button", {type: "submit", className: "btn-primary"}, React.createElement("i", {className: "fa-check"}), " 儲存")))))));
            return outHtml;
        }
    }
    GridForm.defaultProps = {
        apiInitPath: gb_approot + 'Active/ParmData/aj_ParamInit',
        apiPath: gb_approot + 'api/GetAction/PostParamData'
    };
    Parm.GridForm = GridForm;
})(Parm || (Parm = {}));
var dom = document.getElementById('page_content');
ReactDOM.render(React.createElement(Parm.GridForm, {caption: gb_caption, menuName: gb_menuname, iconClass: "fa-list-alt"}), dom);
