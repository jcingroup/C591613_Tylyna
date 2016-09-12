interface MatterListProps extends React.Props<MatterListClass> {
    community_id?: number;
    info_type?: string;
}
interface MatterListClass extends React.ComponentClass<MatterListProps> {

}
interface MatterListState {
    search?: {
        city?: string,
        footage?: number,
        info_type: string,
        price_top?: number,
        price_bottom?: number,
        footage_bottom?: number,
        footage_top?: number
    },
    lists?: Array<server.Matter>,
    loading?: boolean
}

declare module __comm_matter {
    class MatterList extends React.Component<MatterListProps, MatterListState> {
    }
}

declare module "comm-matter" {
    export = __comm_matter;
}