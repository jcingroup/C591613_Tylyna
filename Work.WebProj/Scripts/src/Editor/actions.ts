import {fetchGet, fetchDelete, fetchPost, fetchPut} from '../ts-comm/ajax';
import {ac_type_comm} from '../action_type';
import {UIText} from '../ts-comm/def-data';
import {tosMessage} from '../ts-comm/comm-func';
import { mask_show, mask_off} from '../ts-comm/vwMaskLoading';

export const callLoad = () => {
    return {
        type: ac_type_comm.load
    }
}

//ajax--
const apiPath: string = gb_approot + 'api/Editor_L1';
export const callUpdateItem = (id) => {
    return dispatch => {
        let pm = { id: id };
        mask_show(UIText.mk_loading);
        return fetchGet(apiPath, pm)
            .then((data: IResultData<server.Editor_L1>) => {
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
export const callSubmit = (id, md: server.Editor_L1, edit_type: IEditType) => {
    return dispatch => {
        let pm = { id: id, md: md };
        return fetchPut(apiPath, pm)
            .then((data: IResultData<server.Editor_L1>) => {
                if (data.result) {
                    tosMessage(null, UIText.fi_update, 1);
                    dispatch(callUpdateItem(id));
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }
}
//ajax--

//ajax-deatil--
const apiDetailPath: string = gb_approot + 'api/Editor_L2';
export const callDetailDel = (i: number, id: number | string) => {
    return dispatch => {
        mask_show(UIText.mk_updating);
        return fetchDelete(apiDetailPath, { id: id })
            .then((data: IResultData<server.Editor_L2>) => {
                mask_off();
                if (data.result) {
                    tosMessage(null, UIText.fi_delete, 1);
                    dispatch(delRowState(i));
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }
}
//ajax-deatil--


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


//detail
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
        type: ac_type_comm.add_dil,
        add_item
    }

}
export const delRowState = (i: number) => {
    //刪除狀態
    return {
        type: ac_type_comm.del_dil,
        i
    }
}
//deatil