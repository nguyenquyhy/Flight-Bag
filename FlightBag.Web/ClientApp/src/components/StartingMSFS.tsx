import * as React from 'react';
import styled from 'styled-components';

interface Props {
    bagCode: string;
    onBagCodeChange: (code: string) => void;
    onBagOpen: () => void;
}

const StartingMSFS = (props: Props) => {
    return <StyledContainer>
        <p>Create your flight bag at <strong>flightbag.flighttracker.tech</strong> and paste (Ctrl+V) the flight bag code below.</p>
        <div>
            <StyledInput value={props.bagCode} onChange={e => props.onBagCodeChange(e.target.value)} placeholder="Flight bag code" />
            <StyledButton onClick={props.onBagOpen}>Open</StyledButton>
        </div>
    </StyledContainer>;
}

const StyledContainer = styled.div`
color: white;
font-size: 1.2em;
`

const StyledInput = styled.input`
border: none;
margin: 0;
padding: 10px;
line-height: 20px;
font-size: 20px;
`

const StyledButton = styled.button`
background-color: #00b4ff;
color: white;
border: none;
margin: 0;
padding: 12px;
line-height: 20px;
font-size: 20px;

:hover {
    background-color: white;
    color: #00b4ff;
}
`

export default StartingMSFS;