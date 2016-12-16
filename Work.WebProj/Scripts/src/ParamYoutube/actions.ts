import {fetchGet, fetchDelete, fetchPost, fetchPut} from '../ts-comm/ajax';
import {ac_type_comm} from '../action_type';
import {UIText} from '../ts-comm/def-data';
import {tosMessage} from '../ts-comm/comm-func';
import { mask_show, mask_off} from '../ts-comm/vwMaskLoading';
import {Init_Params} from './pub';

//ajax--
const apiPath: string = gb_approot + 'api/Param';
export const callParamLoad = () => {
    return dispatch => {
        mask_show(UIText.mk_loading);
        return fetchGet(apiPath + "/GetYoutube", {})
            .then((data: IResultData<Init_Params>) => {
                mask_off();
                if (data.result) {
                    dispatch(getParamItem(data.data));
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }
}
export const callSubmit = (md: Init_Params) => {
    return dispatch => {
        let pm = { md: md };

        mask_show(UIText.mk_updating);
        return fetchPost(apiPath + '/PostYoutube', md)
            .then((data: IResultData<Init_Params>) => {
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
const getParamItem = (data: Init_Params) => {
    return {
        type: ac_type_comm.load,
        params: {
            YoutubeUrl: data.YoutubeUrl
        }
    }
}

export const setInputValue = (type, name, value) => {
    return {
        type: type,
        name,
        value
    }
}

