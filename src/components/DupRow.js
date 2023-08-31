import { useMemo, useCallback } from "react";

function DupRow(props) {
    
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
        <div>{bpt.trackName},{bpt.length},{bpt.comments},{bpt.queues.map(q => `${q.start}`).join(',')}</div>
        <div><button onClick={copyRight}>copy</button></div>
        <div>{dlt.trackName},{dlt.length},{dlt.kind},{dlt.comments},{dlt.queues.map(q => `${q.start}`).join(',')}</div>
    </>
}

export default DupRow;