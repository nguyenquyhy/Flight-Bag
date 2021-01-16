import * as React from 'react';
import styled from 'styled-components';
import { parse } from '../logics/TwitchMessageParser';

export interface TwitchMessage {
    id: string;
    author: string;
    message: string;
    emotesTag?: string;
    rawLine?: string;
}

interface Props {
    messages: TwitchMessage[];
}

const TwitchMessageList = (props: Props) => {
    const messageEl = React.useRef<HTMLUListElement>(null);

    React.useLayoutEffect(() => {
        if (messageEl && messageEl.current) {
            messageEl.current.addEventListener('DOMNodeInserted', (e: Event) => {
                if (e.currentTarget) {
                    const list = e.currentTarget as HTMLUListElement;
                    list.scroll({ top: list.scrollHeight, behavior: 'smooth' })
                }
            });
        }
    }, [])

    return <>
        <StyledFrameTitle>Twitch Channel</StyledFrameTitle>
        <StyledList ref={messageEl}>
            {props.messages.map(message => <StyledItem key={message.id}>{message.author}: {parse(message.message, message.emotesTag)}</StyledItem>)}
        </StyledList>
    </>
}

const StyledFrameTitle = styled.div`
background-color: rgba(0,0,0,0.2);
font-size: 1.2em;
padding: 10px;
`

const StyledList = styled.ul`
list-style: none;
padding: 0;
margin: 0;
overflow-y: auto;
`

const StyledItem = styled.li`
font-size: 1.2em;
padding: 5px 0 0 10px;
margin: 0;
`

export default TwitchMessageList;