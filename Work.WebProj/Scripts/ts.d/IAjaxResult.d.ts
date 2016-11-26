declare enum InfoType {
    Info,
    Warnning,
    Error
}

interface IResultBase {
    result: boolean;
    message: string;
    hasData: boolean;
    data: any;
    infoType: InfoType;
    id: number;
    no: string;
}

interface IResultData<T> extends IResultBase {
    data: T;
}