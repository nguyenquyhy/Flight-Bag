import * as React from 'react';

export const parse = (message: string, emotesTag?: string) => {
    if (!emotesTag) {
        return <>{message}</>;
    }

    let lastIndex = 0;
    const items = [];

    const emotes = emotesTag.split('/');
    let emoteIndex = 0;
    for (var emoteItem of emotes)
    {
        const emoteTokens = emoteItem.split(':');
        const emoteId = emoteTokens[0];
        const emoteRange = emoteTokens[1];
        const emoteRangeTokens = emoteRange.split('-');
        const emoteStart = Number(emoteRangeTokens[0]);
        const emoteEnd = Number(emoteRangeTokens[1]);

        // Copy raw string from last index
        if (lastIndex < emoteStart) {
            items.push(message.substr(lastIndex, emoteStart - lastIndex));
        }

        const emoteText = message.substr(emoteStart, emoteEnd - emoteStart + 1)
        items.push(<img key={emoteIndex} src={`https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1.0`} alt={emoteText} />)

        lastIndex = emoteEnd + 1;
        emoteIndex++;
    }

    if (lastIndex < message.length) {
        items.push(message.substr(lastIndex));
    }

    return <>{items}</>
}