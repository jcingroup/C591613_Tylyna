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
}

interface IResultData<T> extends IResultBase {
    data: T;
}