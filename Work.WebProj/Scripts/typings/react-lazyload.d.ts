
declare namespace ReactLazyload {
    interface ReactLazyloadProps extends React.Props<ReactLazyloadClass> {

    }
    interface ReactLazyloadClass extends React.ComponentClass<ReactLazyloadProps> {
    }
    class Lazyload extends React.Component<ReactLazyloadProps, any> {

    }

    interface __ReactLazyload {
        (): any
        lazyload(): any
        lazyload(p1: any): any
    }
}


declare module 'react-lazyload' {
    import moment= ReactLazyload.Lazyload;
    export = moment;
}