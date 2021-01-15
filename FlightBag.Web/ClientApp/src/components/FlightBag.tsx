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

const ItemData = (props: { type: string, url: string, changeUrl: (u: string) => void }) => {
    switch (props.type) {
        case "URL":
            return <div>
                <StyledLabel htmlFor="url">URL</StyledLabel>
                <input value={props.url} onChange={e => props.changeUrl(e.target.value)} type="url" placeholder="Enter URL" />
            </div>;
        case "Image":
            return <ImageUpload onUrlChange={url => props.changeUrl(url)} />;
        default:
            return null;
    }
}

const ItemDataDisplay = (props: { type: string, data: any }) => {
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
    const [title, changeTitle] = React.useState('');
    const [type, changeType] = React.useState('URL');
    const [url, changeUrl] = React.useState('');

    const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.onAddItem({
            title: title,
            type: type,
            data: url
        })
    }

    return <StyledContainer>
        <h4>Flight Bag <button onClick={props.onClose}>Close</button></h4>

        <p>Copy the following code into MSFS or share with another pilot. <input value={props.bag.id} /></p>

        <StyledForm onSubmit={handleAdd}>
            <div>
                <StyledLabel htmlFor="title">Title</StyledLabel>
                <input value={title} onChange={e => changeTitle(e.target.value)} name="title" required placeholder="Enter title" />
            </div>
            <div>
                <StyledLabel htmlFor="type">Type</StyledLabel>
                <select value={type} onChange={e => changeType(e.target.value)} name="type">
                    <option>URL</option>
                    <option>Image</option>
                </select>
            </div>
            <ItemData type={type} url={url} changeUrl={changeUrl} />
            <StyledButton type="submit">Add</StyledButton>
        </StyledForm>

        <StyledList>
            {props.bag.items.map(item => <StyledListItem>
                <StyledTitle>{item.title}</StyledTitle>
                <StyledType>{item.type}</StyledType>
                <ItemDataDisplay type={item.type} data={item.data} />
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