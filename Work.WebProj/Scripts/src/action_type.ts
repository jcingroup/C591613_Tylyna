﻿export const ac_type_comm = {
    load: 'load', //進人報表 一般為ajax調用
    load_list: 'load_list',
    load_field: 'load_field',
    get_init: 'get_init',//載入 參數
    grid: 'grid', //Gird List 狀態
    add: 'add', //新增編輯狀態
    update: 'update', //修改狀態
    cancel: 'cancel', //取消
    define: 'define',//確認 新增or修改
    chg_fld_val: 'change_field_value',
    chg_sch_val: 'chg_sch_val',
    //row
    chg_grid_val: 'chg_grid_val',
    update_row: 'update_row',
    add_row: 'add_row',
    cancel_row: 'cancel_row',
    update_pageinfo: 'update_pageinfo',
    //detail
    get_dil_data: 'get_detail_data',
    chg_dil_fld_val: 'change_detail_field_value',
    add_dil: 'add_detail',
    del_dil: 'del_detail',
    update_dil: 'update_detail',
    cancel_dil: 'cancel_detail',
    //換頁
    chg_oper_page: 'change_operator_page'
}

export const remit_type = {
    chg_remit_list: 'change_remit_list'
}

export const customer_type = {
    email_update: 'email_update',
    email_cancel: 'email_cancel',
    pw_update: 'password_update',
    pw_cancel: 'password_cancel'
}

export const param_type = {
    chg_s_grid_val: 'chg_ship_grid_val',
    chg_d_grid_val: 'chg_discount_grid_val',
    add_d_row: 'add_discount_row',
    del_d_row: 'del_discount_row'
}