import Header from '../components/Header';

function Settings(props) {
    return <>
         <Header loadFile={props.loadFile} 
            setShownTracks={props.setShowsTracks} 
            newFileName={props.newFileName}
            setNewFileName={props.setNewFileName}
            setSaveType={props.setSaveType}
            saveType={props.saveType}
            saveMessage={props.saveMessage}/>
        <h1>Settings</h1>
    </>
}

export default Settings;
