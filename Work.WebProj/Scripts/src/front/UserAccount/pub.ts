export interface Init_Data {

}
export const InputProps: Object = {
    required: true
};

export const IGenderData: Array<server.OptionTemplate> = [
    { val: true, Lname: '男性', className: 'w3-tag label-success w3-round' },
    { val: false, Lname: '女性', className: 'w3-tag label-default w3-round' }
];

export interface PadParm {
    OldPassword?: string;
    NewPassword?: string;
    ConfirmPassword?: string;
}