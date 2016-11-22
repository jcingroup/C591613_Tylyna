import {fetchGet, fetchDelete, fetchPost, fetchPut} from '../ts-comm/ajax';
import {ac_type_comm} from '../action_type';
import {UIText} from '../ts-comm/def-data';
import {tosMessage} from '../ts-comm/comm-func';
import { mask_show, mask_off} from '../ts-comm/vwMaskLoading';

//ajax--
const apiPath: string = gb_approot + 'api/Product';
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
export const getInitData = () => {
    return dispatch => {
        mask_show(UIText.mk_loading);
        return fetchGet(apiPath + '/GetInitData', {})
            .then((data) => {
                mask_off();
                dispatch(setInitData(data));
            })
            .catch((reason) => { mask_off(); })
    }
}
export const callUpdateItem = (id) => {
    return dispatch => {
        let pm = { id: id };
        mask_show(UIText.mk_loading);
        return fetchGet(apiPath, pm)
            .then((data: IResultData<server.ProductKind>) => {
                mask_off();
                if (data.result) {
                    dispatch(editState(ac_type_comm.update, id, data.data));
                } else {
                    alert(data.message);
                }
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
                        dispatch(callUpdateItem(data.id));
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
                        //dispatch(callGridLoad(null));
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
            endcount: data.endcount,
            field: data.field,
            sort: data.sort
        }
    }
}

export const setInitData = (data) => {
    return {
        type: ac_type_comm.get_init,
        data
    }
}
export const setInputValue = (type, name, value) => {
    return {
        type: type,
        name,
        value
    }
}
export const editState = (type, id, data) => {
    return {
        type: type,
        id,
        data
    }
}