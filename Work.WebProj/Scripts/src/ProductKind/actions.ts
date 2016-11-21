import {fetchGet, fetchDelete, fetchPost, fetchPut} from '../ts-comm/ajax';
import {ac_type_comm} from '../action_type';
import {UIText} from '../ts-comm/def-data';
import {tosMessage} from '../ts-comm/comm-func';
import { mask_show, mask_off} from '../ts-comm/vwMaskLoading';

//ajax--
const apiPath: string = gb_approot + 'api/ProductKind';
export const callGridLoad = (search: any) => {
    return dispatch => {
        mask_show(UIText.mk_loading);
        return fetchGet(apiPath, search)
            .then((data) => {
                mask_off();
                dispatch(getGridItem(data));
            })
            .catch((reason) => { mask_off(); })
    }
}
export const callSubmit = (id, md: server.ProductKind, edit_type: IEditType) => {
    return dispatch => {
        let pm = { id: id, md: md };

        if (edit_type == IEditType.insert) {
            mask_show(UIText.mk_updating);
            return fetchPost(apiPath, md)
                .then((data: IResultData<server.ProductKind>) => {
                    mask_off();
                    if (data.result) {
                        tosMessage(null, UIText.fi_insert, 1);
                        dispatch(callGridLoad(null));
                    } else {
                        alert(data.message);
                    }
                })
                .catch((reason) => { mask_off(); })
        }

        if (edit_type == IEditType.update) {
            return fetchPut(apiPath, pm)
                .then((data: IResultData<server.ProductKind>) => {
                    if (data.result) {
                        tosMessage(null, UIText.fi_update, 1);
                        dispatch(callGridLoad(null));
                    } else {
                        alert(data.message);
                    }
                })
                .catch((reason) => { mask_off(); })
        }
    }
}
export const callDelete = (id: number | string, params) => {

    return dispatch => {
        mask_show(UIText.mk_updating);
        return fetchDelete(apiPath, { id: id })
            .then((data: IResultData<server.ProductKind>) => {
                mask_off();
                if (data.result) {
                    tosMessage(null, UIText.fi_delete, 1);
                    dispatch(callGridLoad(params));
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }
}


//ajax--
const getGridItem = (data) => {
    return {
        type: ac_type_comm.load,
        items: data.rows,
        pageinfo: {
            total: data.total,
            page: data.page,
            records: data.records,
            startcount: data.startcount,
            endcount: data.endcount
        }
    }
}

export const setRowInputValue = (type, i, name, value) => {
    return {
        type: type,
        i,
        name,
        value
    }
}

export const addRowState = (add_item: any, e: React.SyntheticEvent) => {
    //新增狀態
    return {
        type: ac_type_comm.add_row,
        add_item
    }

}
export const updateRowState = (i: number, id: number) => {
    //修改狀態
    return {
        type: ac_type_comm.update_row,
        i,
        id
    }
}
export const cancelRowState = (edit_type: IEditType, i: number, item: any) => {
    //取消狀態
    return {
        type: ac_type_comm.cancel_row,
        edit_type,
        i,
        item
    }
}