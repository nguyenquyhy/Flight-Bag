import * as React from 'react';
import styled from 'styled-components';
import * as signalR from '@microsoft/signalr';
import { Bag, BagItem } from '../Models';

interface Props {
    hub: signalR.HubConnection;
    bag: Bag;

    onAddItem: (item: BagItem) => void;
    onMoveUp: (item: BagItem) => void;
    onMoveDown: (item: BagItem) => void;
    onRemove: (item: BagItem) => void;
    onClose: () => void;
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

    return <>
        <h4>Flight Bag <input value={props.bag.id} /> <button onClick={props.onClose}>Close</button></h4>

        <form onSubmit={handleAdd}>
            <input value={title} onChange={e => changeTitle(e.target.value)} required placeholder="Enter title" />
            <select value={type} onChange={e => changeType(e.target.value)}>
                <option>URL</option>
                <option disabled>Image</option>
            </select>
            {type === 'URL' ? <><input value={url} onChange={e => changeUrl(e.target.value)} type="url" placeholder="Enter URL" /></> :
                type === 'Image' ? <>
                    <input type="url" placeholder="Enter image URL" />
                </> : null}
            <button type="submit">Add</button>
        </form>

        <StyledList>
            {props.bag.items.map(item => <StyledListItem>
                <StyledTitle>{item.title}</StyledTitle>
                <StyledType>{item.type}</StyledType>
                <div>{item.data}</div>
                <div>
                    <button onClick={() => props.onMoveUp(item)}>Up</button>
                    <button onClick={() => props.onMoveDown(item)}>Down</button>
                    <button onClick={() => props.onRemove(item)}>Remove</button>
                </div>
            </StyledListItem>)}
        </StyledList>
    </>
}

const StyledList = styled.ul`
list-style: none;
padding: 0;
`

const StyledListItem = styled.li`
padding: 10px;
border: 1px solid #aaa;
margin-bottom: 4px;
`

const StyledTitle = styled.div`
font-weight: bold;
`

const StyledType = styled.div`
font-style: italic;
`

export default FlightBag;