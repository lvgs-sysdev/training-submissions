import MyUploadAdapter from './MyUploadAdapter';

export default function MyUploadAdapterPlugin(editor: any, onSuccess: (url: string) => void) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
        return new MyUploadAdapter(loader, onSuccess);
    };
}
