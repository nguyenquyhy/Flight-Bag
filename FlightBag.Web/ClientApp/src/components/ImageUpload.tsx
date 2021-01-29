import * as React from 'react';
import styled from 'styled-components';
import uploadFileToBlob from '../logics/azure-storage-blob';

interface Props {
    url: string;
    onUrlChange: (url: string) => void;
}

const ImageUpload = (props: Props) => {
    // current file to upload into container
    const [fileSelected, setFileSelected] = React.useState<File | null>(null);
    const [inputKey, setInputKey] = React.useState(Math.random().toString(36));
    const [uploading, setUploading] = React.useState(false);

    const handleFileUpload = async () => {
        // prepare UI
        setUploading(true);

        const response = await fetch('/api/Storage/RequestUploadInfo', {
            method: 'post'
        });
        if (response.ok) {
            const uploadInfo = await response.json() as { sas: string, containerName: string };

            // *** UPLOAD TO AZURE STORAGE ***
            const uploadedUrl = await uploadFileToBlob(fileSelected, uploadInfo.sas, uploadInfo.containerName);
            if (uploadedUrl) {
                // prepare UI for results
                props.onUrlChange(uploadedUrl);
            }
        }

        // reset state/form
        setFileSelected(null);
        setUploading(false);
        setInputKey(Math.random().toString(36));
    }

    const urlInputRef = React.useRef<HTMLInputElement>(null);

    if (urlInputRef.current) {
        urlInputRef.current.setCustomValidity('Please choose an image and press Upload');
    }

    const url = props.url;

    return <div style={{ position: 'relative' }}>
        {!url && <StyledInvisibleInput ref={urlInputRef} required />}
        <input type="file" accept="image/*" onChange={e => setFileSelected(e.target.files && e.target.files[0])} key={inputKey} />
        <button onClick={handleFileUpload} disabled={!fileSelected || uploading}>Upload</button>
        {url && <img src={url} alt='Uploaded' style={{ maxWidth: 300 }} />}
    </div>;
}

const StyledInvisibleInput = styled.input`
position: absolute;
top: 0;
bottom: 0;
left: 0;
width: 0;
z-index: -1;
`

export default ImageUpload;