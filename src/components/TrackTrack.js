import { useCallback } from 'react';
import styled from 'styled-components';
import {ReactComponent as Star} from '../star.svg';

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

const Comments = styled.div`
    height: 1em;
`

const Color = styled.div`
    border-radius: 25px;
    display: inline-block;
    background-color: ${props => props.color?.replace('0x', '#')};
    width: 1em;
    height: 1em;
    margin-right: 0.5em;
`

const TrackHeader = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 2px;
`

const ratings = {
    0xFF: 5,
    0xCC: 4,
    0x99: 3,
    0x66: 2,
    0x33: 1,
    0: 0
  };

function Stars(props) {
    const stars = [];
    for (let i = 0; i < props.rating; i++) {
        stars.push(<Star/>);
    }
    return <div>{stars}</div>
}

function TrackTrack(props) {
    const lengthString = useCallback((length) => {
        const minutes = Math.floor(length / 60);
        const seconds = (length - minutes * 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }, []);

    return <> 
        <TrackHeader>
            <Color color={props.track.color}/>
            {props.track.trackName} 
            ({lengthString(props.track.length)})
            <Stars rating={ratings[props.track.rating]}/>
        </TrackHeader>
        <TrackRegion>
            {props.track.queues.map(q => <Q start={q.start/props.track.length * 100} num={props.num}/>)}
        </TrackRegion>
        <Comments>{props.track.comments}</Comments>
    </>
}

export default TrackTrack;
