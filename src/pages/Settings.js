import Header from '../components/Header';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

const CopyInfo = styled.div`
    display: block;
`

const ExportFile = styled.div`
    display: block;
`
function Settings(props) {
    return <div className="App">
         <Header loadFile={props.loadFile} 
            setShownTracks={props.setShowsTracks} 
            newFileName={props.newFileName}
            setNewFileName={props.setNewFileName}
            setSaveType={props.setSaveType}
            saveType={props.saveType}
            saveMessage={props.saveMessage}/>
        <Link to="/">&lt;&lt;Back</Link>
        <h1>Settings</h1>
        <CopyInfo>
            <div>Copy Info</div>
            <input type="checkbox" name="color" onChange={e => props.setCopySettings({...props.copySettings, color: e.target.checked})} checked={props.copySettings.color}/>
            <label for="color">Color</label><br/>
            <input type="checkbox" name="rating" onChange={e => props.setCopySettings({...props.copySettings, rating: e.target.checked})} checked={props.copySettings.rating}/>
            <label for="color">Rating</label><br/>
            <input type="checkbox" name="comments" onChange={e => props.setCopySettings({...props.copySettings, comments: e.target.checked})} checked={props.copySettings.comments}/>
            <label for="color">Comments</label><br/>
            <input type="checkbox" name="grid" onChange={e => props.setCopySettings({...props.copySettings, grid: e.target.checked})} checked={props.copySettings.grid}/>
            <label for="color">Beat Grid (experimintal)</label><br/>
            <input type="checkbox" name="queues" onChange={e => props.setCopySettings({...props.copySettings, queues: e.target.checked})} checked={props.copySettings.queues}/>
            <label for="color">Queues (experimental)</label><br/>
        </CopyInfo>
        <ExportFile>
            <div>Export File</div>
            <input type="radio" id="full" name="save_type" value="FULL" onChange={_e => props.setSaveType('full')} checked={props.saveType === 'full'}/>
            <label for="full">FULL</label>
            <input type="radio" id="changes" name="save_type" value="CHANGES" onChange={_e => props.setSaveType('changes')} checked={!props.saveType || props.saveType === 'changes'}/>
            <label for="full">CHANGES</label>
        </ExportFile>
    </div>
}

export default Settings;
