declare module server {
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
        pack_name?: string;
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
        ship_date?: Date;
        pay_type?: number;
        pay_state?: number;
        ship_state?: number;
        cancel_reason?: string;
        total?: number;
        ship_fee?: number;//運費
        bank_charges?: number;//手續費
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
        PurchaseDetail?: Array<server.PurchaseDetail>;
        Customer?: server.Customer;

        Deatil?: Array<server.PurchaseDetail>;
        customer_name?: string;
        cancel_order?: boolean;
        is_mail?: boolean;
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
        p_d_pack_name?: string;
        Product?: server.Product;
        ProductDetail?: server.ProductDetail;
        Purchase?: server.Purchase;

        img_src?: string;
    }
    interface Customer {
        customer_id?: number;
        email?: string;
        c_pw?: string;
        c_name?: string;
        gender?: boolean;
        tel?: string;
        mobile?: string;
        zip?: string;
        address?: string;
        birthday?: any;
        i_Hide?: boolean;
        i_InsertUserID?: string;
        i_InsertDeptID?: number;
        i_InsertDateTime?: Date;
        i_UpdateUserID?: string;
        i_UpdateDeptID?: number;
        i_UpdateDateTime?: Date;
        i_Lang?: string;
        Purchase?: Array<server.Purchase>;
    }

    interface Banner {
        banner_id?: number;
        b_name?: string;
        sort?: number;
        i_Hide?: boolean;
        i_InsertUserID?: string;
        i_InsertDeptID?: number;
        i_InsertDateTime?: Date;
        i_UpdateUserID?: string;
        i_UpdateDeptID?: number;
        i_UpdateDateTime?: Date;
        i_Lang?: string;
    }

    interface News {
        news_id?: number;
        news_title?: string;
        day?: any;
        news_content?: string;
        sort?: number;
        no_index?: boolean;
        i_Hide?: boolean;
        i_InsertUserID?: string;
        i_InsertDeptID?: number;
        i_InsertDateTime?: Date;
        i_UpdateUserID?: string;
        i_UpdateDeptID?: number;
        i_UpdateDateTime?: Date;
        i_Lang?: string;
    }
    interface FAQ {
        faq_id?: number;
        q_title?: string;
        a_content?: string;
        sort?: number;
        i_Hide?: boolean;
        i_InsertUserID?: string;
        i_InsertDeptID?: number;
        i_InsertDateTime?: Date;
        i_UpdateUserID?: string;
        i_UpdateDeptID?: number;
        i_UpdateDateTime?: Date;
        i_Lang?: string;
    }
    interface Editor_L1 {
        editor_l1_id?: number;
        name?: string;
        sort?: number;
        Editor_L2?: Array<server.Editor_L2>;

        Deatil?: Array<server.Editor_L2>;
    }
    interface Editor_L2 extends BaseEntityTable  {
        editor_l2_id?: number;
        editor_l1_id?: number;
        l2_name?: string;
        l2_content?: string;
        sort?: number;
        i_Hide?: boolean;
        i_InsertUserID?: string;
        i_InsertDeptID?: number;
        i_InsertDateTime?: Date;
        i_UpdateUserID?: string;
        i_UpdateDeptID?: number;
        i_UpdateDateTime?: Date;
        i_Lang?: string;
        Editor_L1?: server.Editor_L1;
    }
} 