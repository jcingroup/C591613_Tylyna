import {fetchGet, fetchDelete, fetchPost, fetchPut} from '../../ts-comm/ajax';
import {ac_type_comm} from '../../action_type';
import {UIText} from '../../ts-comm/def-data';
import {tosMessage} from '../../ts-comm/comm-func';
import { mask_show, mask_off} from '../../ts-comm/vwMaskLoading';

import Moment = require('moment');
import {config} from '../../ts-comm/def-data';


//ajax--
const apiPath: string = gb_approot + 'api/FrontUser';
export const callLoad = () => {
    return dispatch => {
        mask_show(UIText.mk_loading);
        return fetchGet(apiPath + "/GetItem", {})
            .then((data: IResultData<server.Customer>) => {
                mask_off();
                if (data.result) {
                    let item = data.data;
                    item.birthday = Moment(item.birthday).format(config.dateFT);
                    dispatch(setData(item));
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }
}

export const callSumbit = (md: server.Purchase) => {
    return dispatch => {
        mask_show(UIText.mk_updating);
        return fetchPut(apiPath, md)
            .then((data: IResultData<server.Customer>) => {
                mask_off();
                if (data.result) {
                    tosMessage(null, UIText.fi_update, 1);
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }
}
//ajax--
export const setData = (data: server.Purchase) => {
    return {
        type: ac_type_comm.load,
        item: data
    }
}

export const setInputValue = (type, name, value) => {
    return {
        type: type,
        name,
        value
    }
}

export const chgOperPage = (data) => {
    return {
        type: ac_type_comm.chg_oper_page,
        data
    }
}

