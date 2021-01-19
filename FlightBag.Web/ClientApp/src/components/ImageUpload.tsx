import * as React from 'react';
import uploadFileToBlob from '../logics/azure-storage-blob';

interface Props {
    onUrlChange: (url: string) => void;
}

const ImageUpload = (props: Props) => {
    // current file to upload into container
    const [fileSelected, setFileSelected] = React.useState<File | null>(null);
    const [inputKey, setInputKey] = React.useState(Math.random().toString(36));
    const [url, setUrl] = React.useState('');
    const [uploading, setUploading] = React.useState(false);

    const handleFileUpload = async () => {
        // prepare UI
        setUploading(true);

        const response = await fetch('/api/Storage/RequestUploadUrl', {
            method: 'post'
        });
        if (response.ok) {
            const sasUrl = await response.text();

            // *** UPLOAD TO AZURE STORAGE ***
            const url = await uploadFileToBlob(fileSelected, sasUrl);
            if (url) {
                // prepare UI for results
                setUrl(url);
                props.onUrlChange(url);
            }
        }

        // reset state/form
        setFileSelected(null);
        setUploading(false);
        setInputKey(Math.random().toString(36));
    }

    return <div>
        <input type="file" onChange={e => setFileSelected(e.target.files && e.target.files[0])} key={inputKey} />
        <button onClick={handleFileUpload} disabled={!fileSelected || uploading}>Upload</button>
        {url && <img src={url} alt='Uploaded' style={{ maxWidth: 300 }} />}
    </div>;
}

export default ImageUpload;