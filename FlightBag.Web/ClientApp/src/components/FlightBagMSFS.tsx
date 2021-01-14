import * as React from 'react';
import styled from 'styled-components';
import * as signalR from '@microsoft/signalr';
import { Bag, BagItem } from '../Models';

interface Props {
    hub: signalR.HubConnection;
    bag: Bag;

    onAddItem: (item: BagItem) => void;
}

const FlightBagMSFS = (props: Props) => {
    const [iframeTitle, changeIframeTitle] = React.useState('');
    const [iframeSrc, changeIframeSrc] = React.useState('');

    const handleItemClick = (item: BagItem) => {
        switch (item.type) {
            case 'URL':
                changeIframeTitle(`[${item.type}] ${item.title}: ${item.data as string}`);
                changeIframeSrc(item.data as string);
                break;
            case 'Image':
                break;
        }

    }

    return <StyledContainer>
        <div>
            <h3>Flight Bag {props.bag.id}</h3>
            <StyledList>
                {props.bag.items.map(item => <StyledListItem>
                    <StyledButton onClick={() => handleItemClick(item)}>{item.title}</StyledButton>
                </StyledListItem>)}
            </StyledList>
        </div>

        {!!iframeSrc && <>
            <StyledFrameTitle>{iframeTitle}</StyledFrameTitle>
            <iframe src={iframeSrc}></iframe>
        </>}
    </StyledContainer>
}

const StyledContainer = styled.div`
display: grid;
height: 100%;
color: white;
align-items: stretch;
grid-template-rows: min-content min-content auto;

h3 {
    padding-left: 5px;
    padding: 10px;
    margin: 0;
    background-color: rgba(0,0,0,0.2);
}

iframe {
    border: none;
    margin: 0;
    padding: 0;
    width: 100%;
}
`

const StyledList = styled.ul`
list-style: none;
padding: 0;
margin: 0;
`

const StyledListItem = styled.li`
display: inline-block;
padding: 0;
margin: 0 3px 0 0;
`

const StyledButton = styled.button`
background-color: #00b4ff;
color: white;
font-size: 1.5em;
border: none;
margin: 0;
padding: 5px 10px;

:hover {
    background-color: white;
    color: #00b4ff;
}
`

const StyledFrameTitle = styled.div`
background-color: rgba(0,0,0,0.2);
font-size: 1.2em;
padding: 10px;
`

export default FlightBagMSFS;