import styled from 'styled-components';
import DupRow from './DupRow';

function Duplicates(props) {
    const DupTable = styled.div`
        display: grid;
        grid-template-columns: 1fr 0.25fr 1fr;
        gap: 10px;
        grid-auto-rows: minmax(100px, auto);
        align-items: center;
        justify-content: center;
    `

    return <DupTable>
        <div>Beat</div>
        <div>Action</div>
        <div>Down</div>
        {props.dups.map(d => <DupRow copyRight={props.copyRight} dup={d}></DupRow>)}
    </DupTable>
}

export default Duplicates;