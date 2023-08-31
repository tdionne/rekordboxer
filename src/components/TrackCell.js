import TrackTrack from './TrackTrack';

function TrackCell(props) {
    return <div>
        <TrackTrack track={props.track}/>
    </div>
}

export default TrackCell;