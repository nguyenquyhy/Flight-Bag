import * as React from 'react';
import styled from 'styled-components';
import * as signalR from '@microsoft/signalr';
import { Bag, BagItem } from '../Models';

interface Props {
    hub: signalR.HubConnection;
    bag: Bag;

    onAddItem: (item: BagItem) => void;
    onClose: () => void;
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
                changeIframeTitle(`[${item.type}] ${item.title}`);
                changeIframeSrc(item.data as string);
                break;
        }

    }

    return <StyledContainer>
        <div>
            <h3>
                Flight Bag {props.bag.id}
                <StyledCloseButton onClick={props.onClose}>Close</StyledCloseButton>
            </h3>
            {props.bag.items.length === 0 ?
                <p>Your flight bag is empty. Open <strong>flightbag.flighttracker.tech</strong> to add items to the bag.</p> :
                <StyledList>
                    {props.bag.items.map(item => <StyledListItem>
                        <StyledListButton onClick={() => handleItemClick(item)}>{item.title}</StyledListButton>
                    </StyledListItem>)}
                </StyledList>}
        </div>

        {!!iframeSrc && <>
            <StyledFrameTitle>{iframeTitle}</StyledFrameTitle>
            <iframe src={iframeSrc} title={iframeTitle}></iframe>
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
border: none;
margin: 0;

:hover {
    background-color: white;
    color: #00b4ff;
}
`

const StyledListButton = styled(StyledButton)`
font-size: 1.5em;
padding: 5px 10px;
`

const StyledCloseButton = styled(StyledButton)`
position: absolute;
right: 10px;
`

const StyledFrameTitle = styled.div`
background-color: rgba(0,0,0,0.2);
font-size: 1.2em;
padding: 10px;
`

export default FlightBagMSFS;