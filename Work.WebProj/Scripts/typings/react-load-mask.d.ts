/// <reference path="./react/react.d.ts" />
/// <reference path="./redux/redux.d.ts" />


declare namespace ReactLoadMask {
    interface ReactLoadMaskProps extends React.Props<ReactLoadMaskClass> {
        visible: boolean,
        size?: number,
        theme ?:string
    }
    interface ReactLoadMaskClass extends React.ComponentClass<ReactLoadMaskProps> {
    }
    export class LoadMask extends __React.Component<ReactLoadMaskProps, any> { }

}


declare module 'react-load-mask' {
    export = ReactLoadMask;
}