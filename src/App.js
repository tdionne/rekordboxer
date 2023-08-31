import React, { useEffect, useState, useCallback, useMemo } from 'react';
import logo from './rb.png';
import './App.css';
import Duplicates from './components/Duplicates';
import styled from 'styled-components';

const Toolbar = styled.div`
  display: flex;
  justify-content: center;
`

function App() {
  const [xmlDoc, setXmlDoc] = useState();
  const [tracks, setTracks] = useState([]);
  const [beatportTracks, setBeatportTracks] = useState([]);
  const [dups, setDups] = useState([]);

 const TrackClass = useMemo(() => {
  class Track {
    constructor(xmlTrack) {
      this.xmlTrack = xmlTrack;
    }
    get trackName() {
      return this.xmlTrack.getAttribute('Name');
    }

    set trackName(t) {
      this.xmlTrack.setAttribute('Name', t);
    }

    get kind() {
      return this.xmlTrack.getAttribute('Kind');
    }

    get length() {
      return this.xmlTrack.getAttribute('TotalTime');
    }

    get comments() {
      return this.xmlTrack.getAttribute('Comments');
    }

    set comments(c) {
      this.xmlTrack.setAttribute('Comments', c);
    }

    get grid() {
      return Array.from(this.xmlTrack.getElementsByTagName("TEMPO")).map(te => {
        return {
          start: te.getAttribute('Inizio'),
          bpm: te.getAttribute('Bpm'),
          metro: te.getAttribute('Metro'),
          beat: te.getAttribute('Battito')
        }
      });
    }

    set grid(g) {
      Array.from(this.xmlTrack.getElementsByTagName("TEMPO")).forEach(te => {
        te.parentNode.removeChild(te);
      });
      g.forEach(_ => {
        const newEl = xmlDoc.createElement("TEMPO");
        newEl.setAttribute('Inizio', _.start);
        newEl.setAttribute('Bpm', _.bpm);
        newEl.setAttribute('Metro', _.metro);
        newEl.setAttribute('Battito', _.beat);
        this.xmlTrack.appendChild(newEl);
      })
    }

    get queues() {
      return Array.from(this.xmlTrack.getElementsByTagName("POSITION_MARK")).map(p => {
        return {
          name: p.getAttribute('Name'),
          type: p.getAttribute('Type'),
          start: p.getAttribute('Start'),
          num: p.getAttribute('Num')
        };
      });
    }

    set queues(q) {
      Array.from(this.xmlTrack.getElementsByTagName("POSITION_MARK")).forEach(p => {
        p.parentNode.removeChild(p);
      });
      q.forEach(_ => {  
        const newEl = xmlDoc.createElement("POSITION_MARK");
        newEl.setAttribute('Name', _.name);
        newEl.setAttribute('Type', _.type);
        newEl.setAttribute('Start', _.start);
        newEl.setAttribute('Num', _.num);
        this.xmlTrack.appendChild(newEl);
      })
    }
  }
  return Track;
 }, [xmlDoc]);

  const copyTrack = useCallback(async (from, to) => {
    const newTrack = new TrackClass(to.xmlTrack);
    newTrack.comments = from.comments;
    newTrack.queues = from.queues;
    newTrack.grid = from.grid;
    const idx = tracks.indexOf(tracks.find(t => t.trackName === to.trackName));
    const _tracks = [...tracks];
    _tracks[idx] = newTrack;
    setTracks(_tracks);
  }, [tracks, TrackClass])

  const loadFile = useCallback(file => {
    const reader = new FileReader();
    const parser = new DOMParser();
    reader.onload = (evt) => {
      const xmlDoc = parser.parseFromString(evt.target.result, "text/xml");
      setXmlDoc(xmlDoc);
      const tracks = xmlDoc.getElementsByTagName("TRACK");
      setTracks(Array.from(tracks).filter(t => t.getAttribute('Kind') !== 'Unknown Format').map(t => new TrackClass(t)));
      setBeatportTracks(Array.from(tracks).filter(t => t.getAttribute('Kind') === 'Unknown Format').map(t => new TrackClass(t)));
    };
    reader.readAsText(file);
  }, [TrackClass]);

  const saveFile = useCallback(async () => {

  }, []);

  useEffect(() => {
    if (beatportTracks && beatportTracks.length > 0) {
      const dups = beatportTracks.map(bpt => {
          const d = tracks.filter(t => {
            return t.trackName
              && t.trackName.indexOf(bpt.trackName) === 0
              && t.length === bpt.length;
          });
          return d.length > 0 ? [bpt, d[0]] : undefined;
      })
      setDups(dups.filter(d => typeof d !== 'undefined'))
    }
  }, [beatportTracks, tracks, xmlDoc])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" /> <h1>BOXER</h1>
      </header>
      <Toolbar>
        <input type="file" id="file-selector" onChange={e => loadFile(e.target.files[0])}></input>
        <button onClick={saveFile}>Save Changes</button>
      </Toolbar>
      <Duplicates dups={dups} copyTrack={copyTrack}/>
    </div>
  );
}

export default App;
