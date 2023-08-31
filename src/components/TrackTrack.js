import { useCallback } from 'react';
import styled from 'styled-components';

const TrackRegion = styled.div`
        position: relative;
        width: 100%;
        height: 3em;
        background-color: black;
`

const Q = styled.div`
    position: absolute;
    width: 1px;
    height: 3em;
    background-color: ${props => props.num > 0 ? 'green' : 'red' };
    left: ${props => props.start}%;
`
function TrackTrack(props) {
    const lengthString = useCallback((length) => {
        const minutes = Math.floor(length / 60);
        const seconds = length - minutes * 60;
        return `${minutes}:${seconds}`;
    }, []);

    return <> 
        <div>{props.track.trackName} ({lengthString(props.track.length)})</div>
        <TrackRegion>
            {props.track.queues.map(q => <Q start={q.start/props.track.length * 100} num={props.num}/>)}
        </TrackRegion>
        <div>{props.track.comments}</div>
    </>
}

export default TrackTrack;