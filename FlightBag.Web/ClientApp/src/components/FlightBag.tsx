import * as React from 'react';
import styled from 'styled-components';
import * as signalR from '@microsoft/signalr';
import { Bag, BagItem } from '../Models';
import ImageUpload from './ImageUpload';

interface Props {
    hub: signalR.HubConnection;
    bag: Bag;

    onAddItem: (item: BagItem) => void;
    onMoveUp: (item: BagItem) => void;
    onMoveDown: (item: BagItem) => void;
    onRemove: (item: BagItem) => void;
    onClose: () => void;
}

interface ItemInputProps {
    type: string;
    url: string;
    onUrlChange: (u: string) => void;
    oauthToken: string;
    onOAuthTokenChange: (token: string) => void;
    channel: string;
    onChannelChange: (channel: string) => void;
}

const ItemInput = (props: ItemInputProps) => {
    switch (props.type) {
        case "URL":
            return <div>
                <StyledLabel htmlFor="url">URL</StyledLabel>
                <input value={props.url} onChange={e => props.onUrlChange(e.target.value)} name="url" type="url" placeholder="Enter URL" required />
            </div>;
        case "Image":
            return <ImageUpload url={props.url} onUrlChange={url => props.onUrlChange(url)} />;
        case "Twitch":
            return <>
                <div>
                    <StyledLabel htmlFor="oauth">Twitch OAuth token: <a href="Twitch/Auth" target="_blank" rel="noreferrer">Get one here</a></StyledLabel>
                    <input value={props.oauthToken} onChange={e => props.onOAuthTokenChange(e.target.value)} name="oauth" type="text" placeholder="OAuth token" required />
                </div>
                <div>
                    <StyledLabel htmlFor="channel">Twitch channel:</StyledLabel>
                    <input value={props.channel} onChange={e => props.onChannelChange(e.target.value)} name="channel" type="text" placeholder="channel name" required />
                </div>
            </>;
        default:
            return null;
    }
}

const ItemDisplay = (props: { type: string, data: any }) => {
    switch (props.type) {
        case "URL":
            return <div>{props.data}</div>;
        case "Image":
            return <img src={props.data} alt="" style={{ maxHeight: 100 }} />;
        default:
            return null;
    }
}

const FlightBag = (props: Props) => {
    const [isAdding, setIsAdding] = React.useState(false);

    const [title, setTitle] = React.useState('');
    const [type, setType] = React.useState('URL');
    const [url, setUrl] = React.useState('');
    const [oauthToken, setOAuthToken] = React.useState('');
    const [channel, setChannel] = React.useState('');

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsAdding(true);

            await props.onAddItem({
                title: title,
                type: type,
                data: ((type, url, oauthToken, channel) => {
                    switch (type) {
                        case "URL":
                        case "Image":
                            return url;
                        case "Twitch":
                            return {
                                oauthToken: oauthToken,
                                channel: channel
                            };
                        default: return null;
                    }
                })(type, url, oauthToken, channel)
            })

            setTitle('');
            setUrl('');
            setOAuthToken('');
            setChannel('');
        }
        finally {
            setIsAdding(false);
        }
    }

    return <StyledContainer>
        <h4>Flight Bag <button onClick={props.onClose}>Close</button></h4>

        <p>Copy the following code into MSFS or share with another pilot. <input value={props.bag.id} /></p>

        <StyledForm onSubmit={handleAdd}>
            <div>
                <StyledLabel htmlFor="title">Title</StyledLabel>
                <input value={title} onChange={e => setTitle(e.target.value)} name="title" required placeholder="Enter title" />
            </div>
            <div>
                <StyledLabel htmlFor="type">Type</StyledLabel>
                <select value={type} onChange={e => setType(e.target.value)} name="type">
                    <option value="URL">URL</option>
                    <option value="Image">Image</option>
                    <option value="Twitch">Twitch Chat</option>
                </select>
            </div>
            <ItemInput type={type}
                url={url} onUrlChange={setUrl}
                oauthToken={oauthToken} onOAuthTokenChange={setOAuthToken}
                channel={channel} onChannelChange={setChannel} />
            <StyledButton type="submit" disabled={isAdding}>Add</StyledButton>
        </StyledForm>

        <StyledList>
            {props.bag.items.map(item => <StyledListItem key={item.title}>
                <StyledTitle>{item.title}</StyledTitle>
                <StyledType>{item.type}</StyledType>
                <ItemDisplay type={item.type} data={item.data} />
                <div>
                    <button onClick={() => props.onMoveUp(item)}>Up</button>
                    <button onClick={() => props.onMoveDown(item)}>Down</button>
                    <button onClick={() => props.onRemove(item)}>Remove</button>
                </div>
            </StyledListItem>)}
        </StyledList>
    </StyledContainer>
}

const StyledContainer = styled.div`
padding: 10px 20px;
`

const StyledForm = styled.form`
border: 1px solid rgba(0,0,0,0.2);
width: 400px;
padding: 0 10px 10px 10px;
`

const StyledLabel = styled.label`
display: block;
color: #333;
margin-top: 5px;
`

const StyledButton = styled.button`
margin-top: 5px;
`

const StyledList = styled.ul`
list-style: none;
padding: 0;
`

const StyledListItem = styled.li`
padding: 10px;
border: 1px solid rgba(0,0,0,0.2);
margin-bottom: 4px;
`

const StyledTitle = styled.div`
font-weight: bold;
`

const StyledType = styled.div`
font-style: italic;
`

export default FlightBag;