import Duplicates from '../components/Duplicates';
import Header from '../components/Header';
import Toolbar from '../components/Toolbar';

function Home(props) {
    return <>
        <Header/>
        <Toolbar loadFile={props.loadFile} 
            saveFile={props.saveFile}
            setShownTracks={props.setShownTracks} 
            setTrackFilter={props.setTrackFilter}
            setSaveType={props.setSaveType}
            saveType={props.saveType}
            saveMessage={props.saveMessage}/>
        <Duplicates dups={props.shownTracks} copyTrack={props.copyTrack}/>
    </>
}

export default Home
