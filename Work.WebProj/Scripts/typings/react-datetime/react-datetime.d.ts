interface ReactDateTimeProps extends React.Props<ReactDateTimeClass> {
    value?: Date;
    defaultValue?: Date;
    dateFormat?: boolean | string;
    timeFormat?: boolean | string;
    input?: boolean;
    open?: boolean;
    locale?: string;
    onChange?: Function;
    onFocus?: Function;
    onBlur?: Function;
    viewMode?: string | number;
    className?: string;
    inputProps?: Object;
    isValidDate?: Function;
    renderDay?: Function;
    renderMonth?: Function;
    renderYear?: Function;
    strictParsing?: boolean;
    closeOnSelect?: boolean;
}
interface ReactDateTimeClass extends React.ComponentClass<ReactDateTimeProps> {
}
declare module __ReactDateTime {
    class ReactDateTime extends React.Component<ReactDateTimeProps, any> {
    }
}

declare module "react-datetime" {
    export = __ReactDateTime.ReactDateTime;
}