import * as React from 'react';
import styled, { css } from 'styled-components';
import * as signalR from '@microsoft/signalr';
import { ChatClient } from 'twitch-chat-client';
import { StaticAuthProvider } from 'twitch-auth';
import { Bag, BagItem, TwitchData } from '../Models';
import TwitchMessageList, { TwitchMessage } from './TwitchMessageList';

interface Props {
    vr: boolean;

    hub: signalR.HubConnection;
    bag: Bag;

    onAddItem: (item: BagItem) => Promise<void>;
    onClose: () => void;
}

declare global {
    namespace twitchEmoji {
        export function parse(text: string, options?: any): string;
    }
}

const FlightBagMSFS = (props: Props) => {
    const [showCode, setShowCode] = React.useState(false);

    const [selectedItem, setSelectedItem] = React.useState<BagItem | null>(null);

    const [iframeTitle, setIframeTitle] = React.useState('');
    const [iframeSrc, setIframeSrc] = React.useState('');

    const [text, setText] = React.useState('');

    const [twitchOAuthToken, setTwitchOAuthToken] = React.useState('');
    const [twitchChannel, setTwitchChannel] = React.useState('');

    const [twitchMessages, setTwitchMessages] = React.useState<TwitchMessage[]>([]);

    const handleItemClick = (item: BagItem) => {
        setSelectedItem(item);
        switch (item.type) {
            case 'URL':
                setIframeTitle(`[${item.type}] ${item.title}: ${item.data as string}`);
                setIframeSrc(item.data as string);
                break;
            case 'Image':
                setIframeTitle(`[${item.type}] ${item.title}`);
                setIframeSrc(item.data as string);
                break;
            case 'Text':
                setText(item.data as string);
                break;
            case 'Twitch':
                const twitchData = item.data as TwitchData;
                setTwitchOAuthToken(twitchData.oauthToken);
                setTwitchChannel(twitchData.channel);
                break;
        }
    }

    React.useEffect(() => {
        if (twitchOAuthToken) {
            const f = async () => {
                const authProvider = new StaticAuthProvider('2a29t3dlfov5mqozz2b8biy8oqxs13', twitchOAuthToken);
                const chatClient = new ChatClient(authProvider, { channels: [twitchChannel] });

                chatClient.onMessage((channel, user, message, msg) => {
                    setTwitchMessages(messages => messages.concat({
                        id: msg.id,
                        author: msg.userInfo.displayName,
                        message: msg.message.value,
                        emotesTag: msg.tags.get('emotes'),
                        rawLine: msg.rawLine
                    }));
                });
                await chatClient.connect();
            };
            f();
        }
    }, [twitchOAuthToken, twitchChannel]);

    return <StyledContainer zoom={props.vr ? 2 : 1}>
        <div>
            <h3>
                {props.vr && <StyledVR>VR</StyledVR>}
                Flight Bag <em onClick={() => setShowCode(!showCode)}>[{!showCode ? "Show code" : props.bag.id}]</em>
                <StyledCloseButton onClick={props.onClose}>Close</StyledCloseButton>
            </h3>
            {props.bag.items.length === 0 ?
                <p>Your flight bag is empty. Open <strong>flightbag.flighttracker.tech</strong> to add items to the bag.</p> :
                <StyledList>
                    {props.bag.items.map(item => <StyledListItem key={item.title}>
                        <StyledListButton onClick={() => handleItemClick(item)}>{item.title}</StyledListButton>
                    </StyledListItem>)}
                </StyledList>}
        </div>

        {selectedItem && <Display vr={props.vr} type={selectedItem.type} iframeSrc={iframeSrc} iframeTitle={iframeTitle} text={text} messages={twitchMessages} />}
    </StyledContainer>
}

const StyledVR = styled.span`
background: white;
color: black;
padding: 0 5px;
margin-right: 5px;
`

const StyledContainer = styled.div<{zoom: number}>`
zoom: ${props => props.zoom};
display: grid;
height: calc(100% - 8px);
color: white;
align-items: stretch;
grid-template-rows: min-content min-content auto;
margin: 0 8px 8px 8px;

h3 {
    padding-left: 5px;
    padding: 10px;
    margin: 0;
    background-color: rgba(0,0,0,0.2);
    position: relative;
}

iframe {
    border: none;
    margin: 0;
    padding: 0;
    width: 100%;
}
`

interface DisplayProps {
    vr: boolean;
    type: string;
    iframeSrc: string;
    iframeTitle: string;
    text: string;
    messages: TwitchMessage[];
}

var top: number | null = null;
var left: number | null = null;
var x: number | null = null;
var y: number | null = null;

const Display = (props: DisplayProps) => {
    const [zoom, setZoom] = React.useState(1);
    const imgRef = React.useRef<HTMLImageElement>(null);
    const imgWrapperRef = React.useRef<HTMLDivElement>(null);
    const step = 0.1;

    const handleMouseDown = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        if (imgWrapperRef.current) {
            top = imgWrapperRef.current.scrollTop;
            left = imgWrapperRef.current.scrollLeft;
            x = e.clientX;
            y = e.clientY;
        }
    }

    const handleMouseUp = (e: any) => {
        top = null;
        left = null;
        x = null;
        y = null;
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        if (imgWrapperRef.current && top !== null && left !== null && x !== null && y !== null) {
            imgWrapperRef.current.scrollTop = top - (e.clientY - y);
            imgWrapperRef.current.scrollLeft = left - (e.clientX - x);
        }
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        document.addEventListener('mouseup', handleMouseUp);
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        document.removeEventListener('mouseup', handleMouseUp);
    }

    switch (props.type) {
        case "URL":
            return !!props.iframeSrc ? <>
                <StyledFrameTitle>{props.iframeTitle}</StyledFrameTitle>
                <StyledIframe src={props.iframeSrc} title={props.iframeTitle}></StyledIframe>
            </> : null;
        case "Image":
            return <>
                <StyledFrameTitle>
                    <div style={{ marginTop: -6, marginBottom: -6, marginLeft: -6, display: 'inline-block' }}>
                        <StyledZoomButton onClick={() => setZoom(zoom => zoom + step)}>+</StyledZoomButton>
                        <StyledZoomButton onClick={() => setZoom(zoom => zoom > step ? zoom - step : zoom)}>-</StyledZoomButton>
                    </div>
                    <span>{props.iframeTitle} ({Math.floor(zoom * 100)}%)</span>
                </StyledFrameTitle>
                <StyledImageWrapper ref={imgWrapperRef}>
                    <img ref={imgRef} src={props.iframeSrc} title={props.iframeTitle} style={{ width: imgRef.current ? imgRef.current.naturalWidth * zoom : 'auto' }}
                        onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter} />
                </StyledImageWrapper>
            </>;
        case "Text":
            return <>
                <div>&nbsp;</div>
                <StyledText vr={props.vr}>{props.text}</StyledText>
            </>
        case "Twitch":
            return <TwitchMessageList messages={props.messages} />
        default:
            return null;
    }
}

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

const StyledZoomButton = styled(StyledButton)`
height: 36px;
width: 36px;
line-height: 36px;
margin-right: 4px;
padding: 0;
font-size: 1.5em;
`

const StyledScrollbar = css`
::-webkit-scrollbar {
    width: 1.3em;
    height: 1.3em;
}

::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar-thumb {
    background-color: #00b4ff;
    outline: 1px solid slategrey;
}

::-webkit-scrollbar-corner {
    background-color: transparent;
}
`

const StyledFrameTitle = styled.div`
background-color: rgba(0,0,0,0.2);
font-size: 1.2em;
padding: 10px;
`

const StyledIframe = styled.iframe`
${StyledScrollbar}
`

const StyledImageWrapper = styled.div`
overflow: auto;

${StyledScrollbar}

img {
    transition: all ease-in-out 0.2s;
}
`

const StyledText = styled.pre<{ vr: boolean }>`
font-size: ${props => props.vr ? '3em' : '1.5em'};
overflow-x: auto;
white-space: pre-wrap;
white-space: -moz-pre-wrap;
white-space: -pre-wrap;
white-space: -o-pre-wrap;
word-wrap: break-word;
overflow: auto;

${StyledScrollbar}
`

export default FlightBagMSFS;