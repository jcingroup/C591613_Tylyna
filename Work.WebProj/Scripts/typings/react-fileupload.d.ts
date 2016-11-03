declare namespace ReactFileupload {
    interface ReactFileuploadProps extends React.Props<ReactFileuploadClass> {
        options: any
    }
    interface ReactFileuploadClass extends React.ComponentClass<ReactFileuploadProps> {
    }
    class ReactFileupload extends React.Component<ReactFileuploadProps, any> {

    }
    interface __ReactFileupload {
        (): any
    }
}

declare module 'react-fileupload' {
    export = ReactFileupload.ReactFileupload;
}