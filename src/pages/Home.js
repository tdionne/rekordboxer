import Duplicates from '../components/Duplicates';
import Header from '../components/Header';
import Toolbar from '../components/Toolbar';

function Home(props) {
    return <>
        <Header/>
        <Toolbar loadFile={props.loadFile} 
            setShownTracks={props.setShowsTracks} 
            newFileName={props.newFileName}
            setNewFileName={props.setNewFileName}
            setSaveType={props.setSaveType}
            saveType={props.saveType}
            saveMessage={props.saveMessage}/>
        <Duplicates dups={props.shownTracks} copyTrack={props.copyTrack}/>
    </>
}

export default Home
