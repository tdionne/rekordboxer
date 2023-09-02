import styled from 'styled-components';
import { Link } from "react-router-dom";

const Filters = styled.div`
    display: flex;
    justify-content: space-around;
`

const Filter = styled.div`
    padding: 0 0.25em;
    cursor: pointer;
`

const Tb = styled.div`
  display: flex;
  justify-content: center;
`

function Toolbar(props) {
    return <Tb>
        <input type="file" id="file-selector" onChange={e => props.loadFile(e.target.files[0])}></input>
        <Filters>
          <Filter onClick={_e => props.setShownTracks('dups')}>Dups</Filter>
          <Filter onClick={_e => props.setShownTracks('deltas')}>Deltas</Filter>
        </Filters>
        <input onChange={e => props.setNewFileName(e.target.value)} value={props.newFileName}></input>
        <button onClick={props.saveFile}>Save</button>
        <Link to="/settings">Settings</Link>
        <div>{props.saveMessage}</div>
    </Tb>
}

export default Toolbar;
