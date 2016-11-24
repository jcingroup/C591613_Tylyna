﻿declare module server {
    interface BaseEntityTable {
        edit_type?: number;
        check_del?: boolean;
        expland_sub?: boolean;
        view_mode?: InputViewMode;
    }
    interface i_Code {
        code: string;
        langCode: string;
        value: string;
    }
    interface CUYUnit {
        sign: string;
        code: string;
    }
    interface i_Lang extends BaseEntityTable {
        lang: string;
        area: string;
        memo: string;
        isuse: boolean;
        sort: any;
    }
    interface SelectFormat {
        id: number | string;
        label: string;
    }
    interface StateTemplate extends SelectFormat {
        className?: string;
        classNameforG: string;
    }
    interface loginField {
        lang: string;
        account: string;
        password: string;
        img_vildate: string;
        rememberme: boolean;

    }
    interface AspNetRoles extends BaseEntityTable {
        Id?: string;
        Name?: string;
        aspNetUsers?: any[];
    }
    interface UserRoleInfo {
        role_id: string;
        role_use: boolean;
        role_name: string;
    }
    interface AspNetUsers extends BaseEntityTable {
        Id?: string;
        email?: string;
        emailConfirmed?: boolean;
        passwordHash?: string;
        securityStamp?: string;
        phoneNumber?: string;
        phoneNumberConfirmed?: boolean;
        twoFactorEnabled?: boolean;
        lockoutEndDateUtc?: Date;
        lockoutEnabled?: boolean;
        accessFailedCount?: number;
        UserName?: string;
        user_name_c?: string;
        department_id?: number;
        aspNetRoles?: server.AspNetRoles[];
        role_array?: Array<UserRoleInfo>;
    }
    interface Menu extends BaseEntityTable {
        menu_id?: number;
        parent_menu_id?: number;
        menu_name?: string;
        description?: string;
        area?: string;
        controller?: string;
        action?: string;
        icon_class?: string;
        sort?: number;
        is_folder?: boolean;
        is_use?: boolean;
        is_on_tablet?: boolean;
        is_only_tablet?: boolean;
        aspNetRoles?: server.AspNetRoles[];
        role_array?: Array<UserRoleInfo>;
    }
    interface Option {//分類管理選單用
        val?: any;
        Lname?: string;
    }
    interface OptionTemplate extends Option {
        className?: string;
    }
    interface PageInfo {
        total: number;
        page: number;
        records: number;
        startcount: number;
        endcount: number;
        field?: string;
        sort?: string;
    }

    interface Shipment {
        shipment_id: number;
        pay_type: number;
        limit_money: number;
        shipment_fee: number;
        bank_charges: number;
    }
    interface ProductKind extends BaseEntityTable {
        product_kind_id?: number;
        kind_name?: string;
        sort?: number;
        i_Hide?: boolean;
        i_InsertUserID?: string;
        i_InsertDeptID?: number;
        i_InsertDateTime?: any;
        i_UpdateUserID?: string;
        i_UpdateDeptID?: number;
        i_UpdateDateTime?: any;
        i_Lang?: string;
        Product?: server.Product[];
    }
    interface Product extends BaseEntityTable {
        product_id?: number;
        product_kind_id?: number;
        product_name?: string;
        stock_state?: number;
        info?: string;
        more_info?: string;
        sort?: number;
        i_Hide?: boolean;
        i_InsertUserID?: string;
        i_InsertDeptID?: number;
        i_InsertDateTime?: Date;
        i_UpdateUserID?: string;
        i_UpdateDeptID?: number;
        i_UpdateDateTime?: Date;
        i_Lang?: string;
        kind_name?: string;
        ProductKind?: server.ProductKind;
        ProductDetail?: Array<server.ProductDetail>;

        Deatil?: Array<server.ProductDetail>;
        Pack?: Array<number>;
        img_src?: string;
    }
    interface ProductDetail extends BaseEntityTable {
        product_detail_id?: number;
        product_id?: number;
        sn?: string;
        pack_type?: number;
        weight?: number;
        price?: number;
        stock_state?: number;
        Product?: server.Product;
        //購物車用
        qty?: number;
    }

    interface Purchase {
        purchase_no?: string;
        customer_id?: number;
        order_date?: Date;
        payment_date?: Date;
        pay_type?: number;
        pay_state?: number;
        ship_state?: number;
        cancel_reason?: string;
        total?: number;
        ship_fee?: number;
        receive_email?: string;
        receive_name?: string;
        receive_tel?: string;
        receive_mobile?: string;
        receive_zip?: string;
        receive_address?: string;
        receive_memo?: string;
        remit_no?: string;
        remit_date?: Date;
        remit_money?: number;
        remit_memo?: string;
        PurchaseDetail?: Array<server.ProductDetail>;
    }

    interface PurchaseDetail {
        purchase_detail_id?: number;
        purchase_no?: string;
        product_id?: number;
        product_detail_id?: number;
        qty?: number;
        price?: number;
        sub_total?: number;
        p_d_sn?: string;
        p_name?: string;
        p_d_pack_type?: number;
        Product?: server.Product;
        ProductDetail?: server.ProductDetail;
        Purchase?: server.Purchase;
    }
} 