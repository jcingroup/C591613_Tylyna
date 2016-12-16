/* 承心 2016-08-09
** 編輯檢視共用元件 依據傳入 InputViewMode 屬性進行切換
*/
import React = require('react');
import ReactDOM = require('react-dom');
import Moment = require('moment');
import { makeInputValue, isValidJSONDate, pad, isNumeric } from './ts-comm/comm-func';
import { UIText, twDistrict, config } from './ts-comm/def-data';
import { UITpl } from './ts-comm/tpl';
import * as Modal from 'react-modal';

//Input 
interface InputTextProps {
    inputViewMode: InputViewMode
    inputClassName?: string;
    width?: string;
    style?: React.CSSProperties;
    viewClassName?: string;
    disabled?: boolean;
    onChange?: Function;
    value?: string | number;
    type: string;
    id?: string;
    required?: boolean;
    maxLength?: number;
    onBlur?: React.EventHandler<React.FocusEvent>;
    onFocus?: React.EventHandler<React.FocusEvent>;
    ref?: string | any;
    tabIndex?: number;
    patternString?: string;
    patternInfo?: string;
    onInput?: string;
    autoFocus?: string;
    onclick?: string;
    placeholder?: string;
}
export class InputText extends React.Component<InputTextProps, any>{

    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
    }
    static defaultProps = {
        type: 'text',
        disabled: false,
        inputViewMode: InputViewMode.edit
    }
    onChange(e: React.SyntheticEvent) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let value = makeInputValue(e);
        this.props.onChange(value, e);
    }
    render() {
        let out_html = null;
        let value = this.props.value == undefined ? '' : this.props.value;

        if (this.props.inputViewMode == InputViewMode.edit) {
            out_html =
                (
                    <input
                        id={this.props.id}
                        type={this.props.type}
                        className={this.props.inputClassName}
                        width={this.props.width}
                        style={this.props.style}
                        value={value}
                        onChange={this.onChange}
                        disabled={this.props.disabled}
                        required={this.props.required}
                        maxLength={this.props.maxLength}
                        onBlur={this.props.onBlur}
                        onFocus={this.props.onFocus}
                        tabIndex={this.props.tabIndex}
                        pattern={this.props.patternString}
                        title={this.props.patternInfo}
                        onInput = {this.props.onInput}
                        autoFocus = {this.props.autoFocus}
                        onClick={this.props.onclick}
                        placeholder={this.props.placeholder}
                        />
                );
        }

        if (this.props.inputViewMode == InputViewMode.view) {
            out_html =
                (
                    <span
                        id={this.props.id}
                        className={this.props.viewClassName}>
                        {value}
                    </span>
                );
        }
        return out_html;
    }
}

//Input 只能輸入數字
interface InputNumProps {
    inputViewMode: InputViewMode
    inputClassName?: string;
    width?: string;
    style?: React.CSSProperties;
    viewClassName?: string;
    disabled?: boolean;
    onChange?: Function;
    value?: string | number;
    id?: string;
    required?: boolean;
    onFocus?: React.EventHandler<React.FocusEvent>;
    onBlur?: Function;
    tabIndex?: number;
    max?: number;
    min?: number;
    maxLength?: number;
    placeholder?: string;
    only_positive?: boolean; //只能為正數
}
interface InputNumState {
    show_value?: any
    prv_value?: any
    neg_sign_flag?: boolean
}

export class InputNum extends React.Component<InputNumProps, InputNumState>{

    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);

        this.state = {
            show_value: 0,
            prv_value: 0,
            neg_sign_flag: false
        };
    }
    static defaultProps = {
        type: 'text',
        disabled: false,
        inputViewMode: InputViewMode.edit,
        only_positive: true
    }
    is_get_value = false;
    componentDidMount() {
        const pp_value = this.props.value;
        this.setState({ show_value: pp_value, prv_value: pp_value });
    }
    componentDidUpdate(prevProps, prevState) {
        //alert(this.props.value != prevProps.value && isNumeric(this.props.value))
        if (this.props.value != prevProps.value && isNumeric(this.props.value)) {
            //console.log(this.props.id, this.props.value, prevProps.value)
            const pp_value = this.props.value;
            this.setState({ prv_value: pp_value, show_value: pp_value })
        } else if (this.props.value != prevProps.value && (this.props.value == null || this.props.value == '')) {
            this.setState({ prv_value: '', show_value: '' })
        }
    }
    onChange(e: React.SyntheticEvent) {

        if (this.props.onChange == undefined || this.props.onChange == null)
            return;

        let input: HTMLInputElement = e.target as HTMLInputElement;
        let value = input.value;
        this.state.neg_sign_flag = false;

        if (value === null || value === '' || value === null || value === undefined) {
            this.setState({ prv_value: null, show_value: null })
            this.props.onChange('', e);
        } else {
            //console.log('value', value, 'isNumeric', isNumeric(value));
            if (value == '-' && !this.props.only_positive) { //可輸入負號
                this.setState({ show_value: '-', prv_value: value })
                this.props.onChange(0, e);
            } else if (value == '-' && this.props.only_positive) { //不可輸入負號
                this.setState({ show_value: '', prv_value: '' })
                this.props.onChange('', e);
            } else if (isNumeric(value)) {

                let n = parseFloat(value);

                if (this.props.only_positive && n < 0) { //不可輸入負號 值卻小於０
                    const prv_value = this.state.prv_value === undefined ? '' : this.state.prv_value;
                    this.setState({ show_value: prv_value })
                    this.props.onChange(prv_value, e);
                } else {
                    this.setState({ show_value: value, prv_value: n }) // 123. 經parseFloat會變成 123
                    this.props.onChange(n, e);
                }

            } else {
                const prv_value = this.state.prv_value === undefined ? '' : this.state.prv_value;
                this.setState({ show_value: prv_value })
                this.props.onChange(prv_value, e);
            }
        }
    }
    onBlur(e: React.SyntheticEvent) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let value = input.value;
        let pp = this.props;
        if (value === '-') {
            this.setState({ show_value: '', prv_value: '' })
            pp.onChange('', e);
        } else {
            if (pp.min != undefined && pp.min != null && pp.value.toString() != '' && pp.value < pp.min) {
                this.setState({ show_value: '', prv_value: '' })
                pp.onChange('', e);
            }

            if (pp.max != undefined && pp.max != null && pp.value != '' && pp.value > pp.max) {
                this.setState({ show_value: '', prv_value: '' })
                pp.onChange('', e);
            }
        }
        if (this.props.onBlur)
            this.props.onBlur(e);
    }
    render() {
        let out_html = null;
        let pp = this.props;

        if (this.props.inputViewMode == InputViewMode.edit) {
            out_html =
                (
                    <input
                        id={pp.id}
                        type="number"
                        className={pp.inputClassName}
                        width={pp.width}
                        style={pp.style}
                        value={this.state.show_value}
                        onChange={this.onChange}
                        disabled={pp.disabled}
                        required={pp.required}
                        onFocus={pp.onFocus}
                        tabIndex={pp.tabIndex}
                        placeholder={pp.placeholder}
                        min={pp.min}
                        max={pp.max}
                        onBlur={this.onBlur}
                        maxLength={pp.maxLength}
                        />
                );
        }

        if (this.props.inputViewMode == InputViewMode.view) {
            out_html =
                (
                    <span
                        id={this.props.id}
                        className={this.props.viewClassName}>
                        {this.state.show_value}
                    </span>
                );
        }
        return out_html;
    }
}

interface SelectTextProps {
    inputViewMode: InputViewMode
    inputClassName?: string;
    viewClassName?: string;
    disabled?: boolean;
    onChange?: Function;
    value?: any;
    id?: string;
    options?: Array<server.Option>;
    required?: boolean;
    is_blank?: boolean;
    blank_text?: string;
    show_type?: SelectShowType;
    ref?: string | any;
    group?: string;
    is_int_type?: boolean;
}
export class SelectText extends React.Component<SelectTextProps, any>{

    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
    }
    static defaultProps = {
        disabled: false,
        inputViewMode: InputViewMode.edit,
        required: false,
        is_blank: false,
        blank_text: UIText.option_blank,
        show_type: SelectShowType.label,
        is_int_type: false
    }
    onChange(e: React.SyntheticEvent) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let value = makeInputValue(e);

        if (value !== undefined && value !== null && this.props.is_int_type) {
            this.props.onChange(parseFloat(value), e);
        } else {
            this.props.onChange(value, e);
        }
    }
    render() {
        let out_html = null;
        let value = this.props.value == undefined ? '' : this.props.value.toString();
        if (this.props.inputViewMode == InputViewMode.edit) {

            let blank_option = this.props.is_blank ? <option value="">{this.props.blank_text}</option> : '';

            out_html =
                (
                    <select
                        id={this.props.id}
                        className={this.props.inputClassName}
                        value={value}
                        onChange={this.onChange}
                        disabled={this.props.disabled}
                        required={this.props.required}
                        data-group={this.props.group}
                        >
                        {blank_option}
                        {
                            this.props.options.map((item, i) => {
                                if (item.val == this.props.value) {
                                    return <option key={i} value={item.val} defaultValue={item.val}>{item.Lname}</option>
                                } else {
                                    return <option key={i} value={item.val}>{item.Lname}</option>
                                }
                            })
                        }
                    </select>
                );
        }

        if (this.props.inputViewMode == InputViewMode.view) {
            out_html = <span className={this.props.viewClassName} id={this.props.id}></span>; //無

            this.props.options.forEach((item, i) => {
                if (item.val == this.props.value) {
                    if (this.props.show_type == SelectShowType.label)
                        out_html = <span id={this.props.id} className={this.props.viewClassName}>{item.Lname}</span>

                    if (this.props.show_type == SelectShowType.value)
                        out_html = <span id={this.props.id} className={this.props.viewClassName}>{item.val}</span>
                }
            })
        }
        return out_html;
    }
}

//TextArea 
interface AreaTextProps {
    inputViewMode: InputViewMode
    inputClassName?: string;
    viewClassName?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    onChange?: Function;
    value?: string;
    rows?: number;
    cols?: number;
    id?: string;
    required?: boolean;
    isHtml?: boolean;
    ref?: string | any;
    defaultValue?: string;
    maxLength?: number;
    name?: string;
    placeholder?: string;
}
export class AreaText extends React.Component<AreaTextProps, any>{

    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
    }
    static defaultProps = {
        disabled: false,
        isHtml: false,
        inputViewMode: InputViewMode.edit
    }
    onChange(e: React.SyntheticEvent) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let value = makeInputValue(e);
        this.props.onChange(value, e);
    }
    areaTextBr(val: string) {
        return val.replace(config.RegNewLineBR, "<br />");
    }
    render() {
        let out_html = null;
        let value = this.props.value == undefined ? '' : this.props.value;
        const pp = this.props;

        if (this.props.inputViewMode == InputViewMode.edit) {
            out_html =
                (
                    <textarea
                        id={pp.id}
                        name={pp.name}
                        className={this.props.inputClassName}
                        onChange={this.onChange}
                        disabled={pp.disabled}
                        rows={pp.rows}
                        cols={pp.cols}
                        required={pp.required}
                        style={pp.style}
                        value={value}
                        defaultValue={pp.defaultValue}
                        maxLength={pp.maxLength}
                        placeholder={pp.placeholder}
                        ></textarea>
                );
        }

        if (this.props.inputViewMode == InputViewMode.view) {
            if (this.props.isHtml) {
                out_html =
                    (
                        <span
                            id={this.props.id}
                            className={this.props.viewClassName}
                            dangerouslySetInnerHTML={{ __html: this.areaTextBr(value.toString()) }}>
                        </span>
                    );
            } else {
                out_html =
                    (
                        <span
                            id={this.props.id}
                            className={this.props.viewClassName}>
                            {value}
                        </span>
                    );
            }

        }
        return out_html;
    }
}

//PW_Button
interface PWButtonProps {
    onClick?: React.EventHandler<React.MouseEvent>;
    id?: string;
    className?: string;
    iconClassName?: string;
    enable?: boolean;
    type?: string;
    title?: string;
    name?: string;
    formName?: string;
    style?: React.CSSProperties;
    hidden?: boolean;
}
export class PWButton extends React.Component<PWButtonProps, any>{

    constructor() {
        super();
    }
    static defaultProps = {
        disabled: false,
        type: 'button',
        hidden: false
    }
    render() {
        let out_html = null;
        let set_style: React.CSSProperties = null;
        if (this.props.style)
            set_style = this.props;
        else
            if (this.props.hidden)
                set_style = { display: 'none' };
        out_html =
            (
                <button type={this.props.type}
                    className={this.props.className}
                    onClick={this.props.onClick}
                    disabled={!this.props.enable}
                    id={this.props.id}
                    title={this.props.title}
                    name={this.props.name}
                    form={this.props.formName}
                    style={set_style}>
                    <i  className={this.props.iconClassName}></i>
                    {this.props.children}
                </button>
            );


        return out_html;
    }
}
interface NavPageProps {
    page?: number,
    startcount?: number,
    endcount?: number,
    total?: number,
    records?: number,
    showAdd?: boolean
    showDelete?: boolean,
    clickInsertState?: Function,
    clickDelete?: Function,
    mapPage: Function
}
export class NavPage extends React.Component<NavPageProps, any> {
    constructor(props) {
        super(props)
        this.nextPage = this.nextPage.bind(this);
        this.prvePage = this.prvePage.bind(this);
        this.firstPage = this.firstPage.bind(this);
        this.lastPage = this.lastPage.bind(this);
    }
    static defaultProps = {
        showAdd: true,
        showDelete: true
    };
    firstPage() {
        this.props.mapPage(1);
    }
    lastPage() {
        this.props.mapPage(this.props.total);
    }
    nextPage() {
        if (this.props.page < this.props.total) {
            this.props.mapPage(this.props.page + 1);
        }
    }
    prvePage() {
        if (this.props.page > 1) {
            this.props.mapPage(this.props.page - 1);
        }
    }
    jumpPage() {

    }
    render() {
        var setAddButton = null, setDeleteButton = null;
        if (this.props.showAdd) {
            setAddButton = <button className="btn btn-sm btn-success"
                type="button"
                onClick={this.props.clickInsertState}>
                <i className="fa-plus-circle"></i> {UIText.add}
            </button>;
        }

        if (this.props.showDelete) {
            setDeleteButton = <button className="btn btn-sm btn-danger" type="button"
                onClick={this.props.clickDelete}>
                <i className="fa-trash-o"></i> {UIText.delete}
            </button>;

        }
        var oper = null;

        oper = (
            <div className="table-footer clearfix">
                <div className="pull-xs-left">
                    {setAddButton} { }
                    {setDeleteButton}
                </div>
                <small className="pull-xs-right">第{this.props.startcount}-{this.props.endcount}筆，共{this.props.records}筆</small>

                <ul className="pager pager-sm">
                    <li>
                        <a href="#" title="移至第一頁" tabIndex={-1} onClick={this.firstPage}>
                            <i className="fa-angle-double-left"></i>
                        </a>
                    </li> { }
                    <li>
                        <a href="#" title="上一頁" tabIndex={-1} onClick={this.prvePage}>
                            <i className="fa-angle-left"></i>
                        </a>
                    </li> { }
                    <li className="form-inline">
                        <div className="form-group">
                            <label>第</label>
                            {' '}
                            <input style={{ "width": "100px" }} className="form-control form-control-sm text-xs-center" type="number" min="1" tabIndex={-1} value={this.props.page }
                                onChange={this.jumpPage} />
                            {' '}
                            <label>頁，共{this.props.total}頁</label>
                        </div>
                    </li> { }
                    <li>
                        <a href="#" title="下一頁" tabIndex={-1} onClick={this.nextPage}>
                            <i className="fa-angle-right"></i>
                        </a>
                    </li> { }
                    <li>
                        <a href="#" title="移至最後一頁" tabIndex={-1} onClick={this.lastPage}>
                            <i className="fa-angle-double-right"></i>
                        </a>
                    </li>
                </ul>
            </div>
        );

        return oper;
    }
}

//RadioBox
interface RadioBoxProps {
    inputViewMode: InputViewMode
    radioList: Array<server.OptionTemplate>;
    name?: string;
    id?: string;
    wrapperClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    spanClassName?: string;
    textClassName?: string;
    disabled?: boolean;
    onChange?: Function;
    value?: any;
    required?: boolean;
}
export class RadioBox extends React.Component<RadioBoxProps, any>{

    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
    }
    static defaultProps = {
        disabled: false,
        inputViewMode: InputViewMode.edit
    }
    getLname(val, getName): string {
        let result: string = '';
        this.props.radioList.forEach((item, i) => {
            result = val == item.val ? item[getName] : result;
        });
        return result;
    }
    onChange(e: React.SyntheticEvent) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let value = makeInputValue(e);
        this.props.onChange(value, e);
    }
    render() {
        let out_html = null;
        let value = this.props.value == undefined ? '' : this.props.value;

        if (this.props.inputViewMode == InputViewMode.edit) {
            out_html =
                (
                    <span className={this.props.wrapperClassName}>
                        {
                            this.props.radioList.map((item, i) => {
                                return <label className={this.props.labelClassName} key={this.props.name + '-' + i}>
                                    <input type="radio"
                                        className={this.props.inputClassName}
                                        name={this.props.name}
                                        value={item.val.toString() }
                                        id={this.props.id + '-' + i}
                                        onChange={this.onChange}
                                        disabled={this.props.disabled}
                                        required={this.props.required}
                                        checked={value == item.val}
                                        />
                                    <span className={this.props.spanClassName}></span> { }
                                    <span className={this.props.textClassName}>{item.Lname}</span>
                                </label>;
                            })
                        }

                    </span>
                );
        }

        if (this.props.inputViewMode == InputViewMode.view) {
            out_html =
                (
                    <span
                        id={this.props.id}
                        className={this.getLname(value, 'className') }>
                        {this.getLname(value, 'Lname') }
                    </span>
                );
        }
        return out_html;
    }
}

export class TagShowAndHide extends React.Component<{ show: boolean, className?: string, style?: any, colSpan?: number, TagName: TagName }, any>
{
    constructor() {
        super();
        this.state = {};
    }
    render() {
        let out_html = null;
        let pp = this.props;

        if (pp.show) {
            if (pp.TagName === TagName.Td) {
                out_html = (
                    <td style={pp.style} className={pp.className} colSpan={this.props.colSpan}>
                        {pp.children}
                    </td>
                );
            } else if (pp.TagName === TagName.Tr) {
                out_html = (
                    <tr style={pp.style} className={pp.className} colSpan={this.props.colSpan}>
                        {pp.children}
                    </tr>
                );
            } else if (pp.TagName === TagName.Th) {
                out_html = (
                    <th style={pp.style} className={pp.className}>
                        {pp.children}
                    </th>
                );
            }
            else if (pp.TagName === TagName.Span) {
                out_html = (
                    <span style={pp.style} className={pp.className}>
                        {pp.children}
                    </span>
                );
            } else if (pp.TagName === TagName.col) {
                out_html = (
                    <col style={pp.style} className={pp.className}>
                        {pp.children}
                    </col>
                );
            } else if (pp.TagName === TagName.dl) {
                out_html = (
                    <dl style={pp.style} className={pp.className}>
                        {pp.children}
                    </dl>
                );
            }
            else if (pp.TagName === TagName.div) {
                out_html = (
                    <div style={pp.style} className={pp.className}>
                        {pp.children}
                    </div>
                );
            } else if (pp.TagName === TagName.table) {
                out_html = (
                    <table style={pp.style} className={pp.className}>
                        {pp.children}
                    </table>
                );
            }
            else if (pp.TagName === TagName.Thead) {
                out_html = (
                    <thead style={pp.style} className={pp.className}>
                        {pp.children}
                    </thead>
                );
            }
        }
        return out_html;
    }
}