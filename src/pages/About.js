import Header from '../components/Header';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const AboutHeader = styled.div`
    margin: auto;
    width: 85%;
`

const AboutContent = styled.div`
    margin: auto;
    width: 80%;
`

function About(props) {
    return <>
         <Header loadFile={props.loadFile} 
            setShownTracks={props.setShowsTracks} 
            newFileName={props.newFileName}
            setNewFileName={props.setNewFileName}
            setSaveType={props.setSaveType}
            saveType={props.saveType}
            saveMessage={props.saveMessage}/>
        <AboutHeader>
            <Link to="/">&lt;&lt;Back</Link>
            <h1>About</h1>
        </AboutHeader>
        <AboutContent>
        <p>
            Boxer is an app that will search for streaming tracks in your rekordbox library, and match them with downloaded tracks.
            Very often DJs will create playlists with streaming tracks, but then have a need to download them for export to USB.
            In these cases, the streaming tracks have been decorated with metadata like rating, tags/comments, color, and queue points.
            Instead of being forced to duplicate this effort for the downloaded tracks, this application will allow a DJ to copy the metadata
            from the streaming track to the downloaded track.
        </p>
        <h2>How to use it</h2>
        <p>
            <ol>
                <li>In rekordbox, export your library as XML (File -&gt; Export Collection in xml format)</li>
                <li>Using boxer, select the XML file you just created.</li>
                <li>In Settings, make sure you select the metadata you are interested in copying, and how you want to treat playlists.</li>
                <li>Back on the main page, using the filters, you can view all matched tracks, or just the ones that have different metadata</li>
                <li>When you find a track that you want to copy, simply click the &gt;&gt; button</li>
                <li>When you are done copying data, click the Save button</li>
                <li>This will create a new XML file with the changes you made</li>
                <li>In rekordbox, open Preferences, select the Advanced Tab and the Database subtab</li>
                <li>Find the rekordbox xml configuration</li>
                <li>Browse for the XML file you just exported from boxer</li>
                <li>Close Preferences, and then in your track browser, find the rekordbox xml node</li>
                <li>In this view, you can choose tracks to import to your library, and they will overwrite existing settings</li>
                <li>You can also import Playlists that changed</li>
            </ol>
        </p>
        <h2>Known Issues</h2>
            <ol>
                <li>It has become clear that streaming tracks and downloaded tracks are not identical, so beat grid and queue points can be off slightly.</li>
            </ol>
        </AboutContent>
    </>
}

export default About;
