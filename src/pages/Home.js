import Duplicates from '../components/Duplicates';
import Toolbar from '../components/Toolbar';
import styled from 'styled-components';

const HomeContent = styled.div`
    padding: 0 1em;
`

function Home(props) {
    return <HomeContent>
        <Toolbar loadFile={props.loadFile} 
            saveFile={props.saveFile}
            setShownTracks={props.setShownTracks} 
            setTrackFilter={props.setTrackFilter}
            setSaveType={props.setSaveType}
            saveType={props.saveType}
            saveMessage={props.saveMessage}/>
        <Duplicates dups={props.shownTracks} copyTrack={props.copyTrack}/>
    </HomeContent>
}

export default Home
