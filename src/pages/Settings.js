import Header from '../components/Header';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SettingsGrid = styled.div`
    margin: auto;
    width: 80%;
    display: flex;
    justify-content: space-around;
`

const SettingsHeader = styled.div`
    margin: auto;
    width: 85%;
`
const CopyInfo = styled.div`
    display: block;
`

const ExportFile = styled.div`
    display: block;
`

const PlaylistSettings = styled.div`
    display: block;
`

function Settings(props) {
    return <>
         <Header loadFile={props.loadFile} 
            setShownTracks={props.setShowsTracks} 
            newFileName={props.newFileName}
            setNewFileName={props.setNewFileName}
            setSaveType={props.setSaveType}
            saveType={props.saveType}
            saveMessage={props.saveMessage}/>
        <SettingsHeader>
            <Link to="/">&lt;&lt;Back</Link>
            <h1>Settings</h1>
        </SettingsHeader>
        <SettingsGrid>
            <CopyInfo>
                <h2>Copy Info</h2>
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
                <h2>Export File</h2>
                <input type="radio" id="full" name="save_type" value="FULL" onChange={_e => props.setSaveType('full')} checked={props.saveType === 'full'}/>
                <label for="full">All tracks</label><br/>
                <input type="radio" id="changes" name="save_type" value="CHANGES" onChange={_e => props.setSaveType('changes')} checked={!props.saveType || props.saveType === 'changes'}/>
                <label for="full">Changes only</label><br/>
            </ExportFile>
            <PlaylistSettings>
                <h2>Playlist Settings</h2>
                <input type="radio" id="full" name="playlist_settings" value="nothing" onChange={e => props.setPlaylistSettings({...props.playlistSettings, add: false, replace: false})} checked={!(props.playlistSettings.add || props.playlistSettings.replace)} />
                <label for="full">Do not add tracks to playlists</label><br/>
                <input type="radio" id="full" name="playlist_settings" value="add" onChange={e => props.setPlaylistSettings({...props.playlistSettings, add: e.target.checked})} checked={props.playlistSettings.add} />
                <label for="full">Add tracks to playlists</label><br/>
                <input type="radio" id="changes" name="playlist_settings" value="replace" onChange={e => props.setPlaylistSettings({...props.playlistSettings, replace: e.target.checked})} checked={props.playlistSettings.replace}/>
                <label for="full">Replace tracks in playlists</label><br/>
            </PlaylistSettings>
        </SettingsGrid>
    </>
}

export default Settings;
