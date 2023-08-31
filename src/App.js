import React, { useEffect, useState, useCallback, useMemo } from 'react';
import logo from './rb.png';
import './App.css';
import Duplicates from './components/Duplicates';
import styled from 'styled-components';
import { saveAs } from 'file-saver';

const Toolbar = styled.div`
  display: flex;
  justify-content: center;
`

const Filters = styled.div`
  display: flex;
  justify-content: space-around;
`

const Filter = styled.div`
  padding: 0 0.25em;
  cursor: pointer;
`

function App() {
  const [xmlDoc, setXmlDoc] = useState();
  const [tracks, setTracks] = useState([]);
  const [beatportTracks, setBeatportTracks] = useState([]);
  const [dups, setDups] = useState([]);
  const [deltas, setDeltas] = useState([]);
  const [shownTracks, setShownTracks] = useState([]);
  const [newFileName, setNewFileName] = useState();
  const [saveMessage, setSaveMessage] = useState();

 const TrackClass = useMemo(() => {
  class Track {
    constructor(xmlTrack) {
      this.xmlTrack = xmlTrack;
      this._edited = false;
    }
    get trackName() {
      return this.xmlTrack.getAttribute('Name');
    }

    get kind() {
      return this.xmlTrack.getAttribute('Kind');
    }

    get length() {
      return this.xmlTrack.getAttribute('TotalTime');
    }

    get color() {
      return this.xmlTrack.getAttribute('Colour');
    }

    set color(color) {
      this._edited = true;
      this.xmlTrack.setAttribute('Colour', color);
    }

    get comments() {
      return this.xmlTrack.getAttribute('Comments');
    }

    set comments(c) {
      this._edited = true;
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
      this._edited = true;
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
      this._edited = true;
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

    get edited() {
      return this._edited;
    }

    set edited(edited) {
      this._edited = edited;
    }
  }
  return Track;
 }, [xmlDoc]);

  const copyTrack = useCallback(async (from, to) => {
    const newTrack = new TrackClass(to.xmlTrack);
    newTrack.comments = from.comments;
    newTrack.queues = from.queues;
    newTrack.grid = from.grid;
    newTrack.color = from.color;
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
    const serializer = new XMLSerializer();
    const xmlStr = serializer.serializeToString(xmlDoc);
    const blob = new Blob([xmlStr], {type: "text/xml"});
    try {
      saveAs(blob, newFileName);
    } catch (err) {
      setSaveMessage(err);
      return
    }
    setSaveMessage('File saved');
  }, [xmlDoc, newFileName]);

  useEffect(() => {
    if (beatportTracks && beatportTracks.length > 0) {
      const dups = beatportTracks.map(bpt => {
          const d = tracks.filter(t => {
            return t.trackName
              && t.trackName.indexOf(bpt.trackName) === 0
              && t.length === bpt.length;
          });
          return d.length > 0 ? [bpt, d[0]] : undefined;
      }).filter(d => typeof d !== 'undefined');
      setDups(dups)
      const deltas = dups.filter(d => {
        return d[1].edited || d[0].edited || d[0].queues.length > d[1].queues.length || d[0].comments !== d[1].comments;
      });
      setDeltas(deltas);
    }
  }, [beatportTracks, tracks])

  useEffect(() => {
    if (deltas && dups) {
      if (!shownTracks || shownTracks.length === 0) {
        setShownTracks(dups);
      }
    }
  }, [deltas, dups, shownTracks])

  useEffect(() => {
    if (saveMessage) {
      setTimeout(() => setSaveMessage(undefined), 3000);
    }
  }, [saveMessage])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" /> <h1>BOXER</h1>
      </header>
      <Toolbar>
        <input type="file" id="file-selector" onChange={e => loadFile(e.target.files[0])}></input>
        <Filters>
          <Filter onClick={_e => setShownTracks(dups)}>Dups</Filter>
          <Filter onClick={_e => setShownTracks(deltas)}>Deltas</Filter>
        </Filters>
        <input onChange={e => setNewFileName(e.target.value)} value={newFileName}></input>
        <button onClick={saveFile}>Save Changes</button>
        <div>{saveMessage}</div>
      </Toolbar>
      <Duplicates dups={shownTracks} copyTrack={copyTrack}/>
    </div>
  );
}

export default App;
