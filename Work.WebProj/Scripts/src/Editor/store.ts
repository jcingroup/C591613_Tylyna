import update = require('react-addons-update');
import { combineReducers } from 'redux'
import {ac_type_comm} from '../action_type';
import {Init_Params, Search_Data} from './pub';


let init_f: server.Editor_L1 = {
    sort: 0,
    Editor_L2: []
};
const detail = 'Deatil';
const field = (state: server.Editor_L1 = init_f, action) => {
    switch (action.type) {
        case ac_type_comm.load:
            return init_f;
        case ac_type_comm.add:
            return action.data;
        case ac_type_comm.update:
            return action.data;
        case ac_type_comm.chg_fld_val:
            let f_struct_1 = {
                [action.name]: { $set: action.value }
            };
            let n_state_1 = update(state, f_struct_1);
            return n_state_1;
        case ac_type_comm.chg_dil_fld_val:
            let f_struct_2 = {
                [detail]: {
                    [action.i]: {
                        [action.name]: { $set: action.value }
                    }
                }
            };
            let n_state_2 = update(state, f_struct_2);
            return n_state_2;
        case ac_type_comm.add_dil:
            let f_struct_3 = {
                [detail]: { $push: [action.add_item] }
            };
            let n_state_3 = update(state, f_struct_3);
            return n_state_3;
        case ac_type_comm.del_dil:
            let n_state_4 = state;
            let f_struct_4 = {
                [detail]: { $splice: [[action.i, 1]] }
            };
            n_state_4 = update(state, f_struct_4);
            return n_state_4;
        case ac_type_comm.get_dil_data:
            let f_struct_5 = {
                [detail]: { $set: action.data }
            };
            let n_state_5 = update(state, f_struct_5);
            return n_state_5;
        default:
            return state
    }
}
const edit_type = (state = IEditType.none, action: Redux.Action): IEditType => {
    switch (action.type) {
        case ac_type_comm.load:
            return IEditType.none;
        case ac_type_comm.grid:
            return IEditType.none;
        case ac_type_comm.add:
            return IEditType.insert;
        case ac_type_comm.update:
            return IEditType.update;
        default:
            return state
    }
}


let init_params: Init_Params = { id: null };
const params = (state = init_params, action): any => {
    switch (action.type) {
        case ac_type_comm.load: {
            return init_params;
        }
        case ac_type_comm.add:
            let r_a: Init_Params = {
                id: 0
            };
            return r_a;
        case ac_type_comm.update:
            let r_u: Init_Params = {
                id: action.id
            };
            return r_u;
        default:
            return state
    }
}

export const combine = combineReducers({
    params,field, edit_type
})

export default combine;