declare module server {
    interface BaseEntityTable {
        edit_type?: number;
        check_del?: boolean;
        expland_sub?: boolean;
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
        val?: number;
        Lname?: string;
    }
    interface Community extends BaseEntityTable {
        community_id?: number;
        community_name?: string;
        account?: string;
        passwd?: string;
        intro?: string;
        finish?: string;
        address?: string;
        typeOfBuild?: string;
        total_floor?: number;
        holders?: number;
        perOfHolder?: number;
        manage?: string;
        company?: string;
        build?: string;
        txt_spot?: string;
        txt_public?: string;
        tel?: string;
        email?: string;
        contact?: string;
        age?: number;
        info_content?: string;

        under_floor?: number;
        over_floor?: number;
        map_iframe?: string;
        group_buying_url?: string;

        list_src?: string;
        imgurl_CommunityList?: string;
        imgurl_CommunityDoor?: Array<string>;
        imgurl_CommunityPublic?: Array<string>;
    }
    interface Community_News {
        community_news_id?: number;
        community_id?: number;
        title?: string;
        context?: string;
        start_date?: string;
        end_date?: string;
        state?: string;
        community_name?: string;
    }

    interface Community_Banner {
        community_banner_id?: number;
        community_id?: number;
        title?: string;
        context?: string;
        start_date?: string;
        end_date?: string;
        state?: string;
        community_name?: string;
        imgurl_CommunityBannerPhoto_1?: string;
    }

    interface Edit extends BaseEntityTable {
        edit_id?: number;
        edit_name?: string;
        edit_content?: string;
        sort?: number;
    }
    interface Matter {
        matter_id?: number;
        community_id?: number;
        zip?: string;
        city?: string;
        country?: string;
        address?: string;
        bedrooms?: number;
        livingrooms?: number;
        bathrooms?: number;
        rooms?: number;
        build_area?: number;
        land_area?: number;
        house_area?: number;
        balcony_area?: number;
        umbrella_aea?: number;
        public_area?: number;
        age?: number;
        buildhouses?: number;
        typeOfHouse?: string;
        managementFeeOfMonth?: number;
        architecture?: string;
        parking?: string;
        orientation?: string;
        guard?: string;
        is_end?: boolean;
        is_darkroom?: boolean;
        wall_materials?: string;
        matter_name?: string;
        info_type?: string;
        start_date?: Date;
        end_date?: Date;
        state?: string;
        title?: string;
        price?: number;

        rentOfMonh?: number;

        rent_management?: string;
        rent_short_date?: string;
        rent_cook?: string;
        rent_pet?: string;
        rent_identity?: string;
        rent_sex?: string;
        rent_start_date?: string;
        rent_furniture?: string;
        rent_equip?: string;
        unit_area_price?: number;

        list_src?: string;
        sn?: string;
        context_life?: string;
        map_iframe?: string;
        total_floor?: number;
        site_floor?: string;
        is_elevator?: boolean;
        community_name?: string;
        imgurl_MatterPhoto_1?: string;
        imgurl_MatterPhoto?: Array<string>;
        imgurl_MatterStyle?: string;

        deposit?: number;
        build_state?: string;
    }
} 