import { useMemo, useCallback } from "react";
import TrackCell from './TrackCell';
import styled from 'styled-components';

function DupRow(props) {
    const TrackButtons = styled.div`
        justify-self: center;
    `
    const bpt = useMemo(() => {
        return props.dup[0]
    }, [props.dup])

    const dlt = useMemo(() => {
        return props.dup[1]
    }, [props.dup])

    const copyRight = useCallback(async (e) => {
        props.copyRight(bpt, dlt);
    }, [props, bpt, dlt])

    return <>
        <TrackCell track={bpt}/>
        <TrackButtons><button onClick={copyRight}>copy</button></TrackButtons>
        <TrackCell track={dlt}/>
    </>
}

export default DupRow;