export interface Init_Params {
    id: number,
}
export interface Search_Data {
    name?: string;
    kind?: number;
    i_Hide?: boolean;
}

export interface Init_Data {
    kind_list: Array<server.Option>
}