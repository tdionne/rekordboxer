import styled from 'styled-components';
import { Link } from "react-router-dom";

const Filters = styled.div`
    display: flex;
    justify-content: space-around;
    gap: 0.5em;
`

const Links = styled.div`
  display: flex;
  gap: 0.5em;
`

const Filter = styled.div`
    padding: 0 0.25em;
    color: black;
    background-color: lightgray;
    text-decoration: none;
    border-radius: 5px;
    padding: 0.5em;
    font-size: small;
    cursor: pointer;
`

const Tb = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 1em;
  margin-bottom: 1em;
  flex-wrap: wrap;
`

function Toolbar(props) {
    return <Tb>
        <Filters>
          <input type="file" id="file-selector" onChange={e => props.loadFile(e.target.files[0])}></input>
          <button onClick={props.saveFile}>Save</button>
        </Filters>
        <Filters>
          <Filter onClick={_e => props.setTrackFilter('dups')}>All</Filter>
          <Filter onClick={_e => props.setTrackFilter('deltas')}>Diffs</Filter>
        </Filters>
        <Links>
          <Link to="/about">About</Link>
          <Link to="/settings">Settings</Link>
        </Links>
    </Tb>
}

export default Toolbar;
