import { useMemo, useCallback } from "react";
import TrackCell from './TrackCell';
import styled from 'styled-components';

const TrackButtons = styled.div`
    justify-self: center;
`

function DupRow(props) {
    const bpt = useMemo(() => {
        return props.dup[0]
    }, [props.dup])

    const dlt = useMemo(() => {
        return props.dup[1]
    }, [props.dup])

    const copyRight = useCallback(async (e) => {
        props.copyTrack(bpt, dlt);
    }, [props, bpt, dlt])

    const copyLeft = useCallback(async () => {
        props.copyTrack(dlt, bpt);
    }, [props, bpt, dlt])

    return <>
        <TrackCell track={bpt}/>
        <TrackButtons><button onClick={copyLeft}>&lt;&lt;</button><button onClick={copyRight}>&gt;&gt;</button></TrackButtons>
        <TrackCell track={dlt}/>
    </>
}

export default DupRow;