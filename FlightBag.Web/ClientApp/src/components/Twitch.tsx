import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

const TwitchPage = (props: RouteComponentProps) => {
    const searchParams = new URLSearchParams(props.location.hash.substr(1));
    const token = searchParams.get('access_token');
    return <>Paste this token into the Twitch OAuth token text box in the previous tab.
        <pre>{token}</pre>
    </>;
}

export default TwitchPage;