import React, { useEffect, useState, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
import Duplicates from './components/Duplicates';

function App() {
  const [xmlDoc, setXmlDoc] = useState();
  const [tracks, setTracks] = useState([]);
  const [beatportTracks, setBeatportTracks] = useState([]);
  const [dups, setDups] = useState([]);

  const trackData = useCallback(t => {
    return {
      name: t.getAttribute('Name'),
      kind: t.getAttribute('Kind'),
      length: t.getAttribute('TotalTime'),
      comments: t.getAttribute('Comments'),
      grid: Array.from(t.getElementsByTagName("TEMPO")).map(te => {
        return {
          start: te.getAttribute('Inizio'),
          bpm: te.getAttribute('Bpm'),
          metro: te.getAttribute('Metro'),
          beat: te.getAttribute('Battito')
        }
      }),
      queues: Array.from(t.getElementsByTagName("POSITION_MARK")).map(p => {
        return {
          name: p.getAttribute('Name'),
          type: p.getAttribute('Type'),
          start: p.getAttribute('Start'),
          num: p.getAttribute('Num')
        }
      })
    }
  }, []);

  const copyRight = useCallback(async (bpt, dlt) => {
    const _dlt = {...dlt, 
      grid: bpt.grid, 
      queues: bpt.queues,
      comments: bpt.comments
    };
    const idx = tracks.indexOf(tracks.find(t => t.name === dlt.name));
    const _tracks = [...tracks];
    _tracks[idx] = _dlt;
    setTracks(_tracks);
  }, [tracks])

  const loadFile = (file) => {
    const reader = new FileReader();
    const parser = new DOMParser();
    reader.onload = (evt) => {
      const xmlDoc = parser.parseFromString(evt.target.result, "text/xml");
      setXmlDoc(xmlDoc);
      const tracks = xmlDoc.getElementsByTagName("TRACK");
      setTracks(Array.from(tracks).filter(t => t.getAttribute('Kind') !== 'Unknown Format').map(trackData));
      setBeatportTracks(Array.from(tracks).filter(t => t.getAttribute('Kind') === 'Unknown Format').map(trackData));
    };
    reader.readAsText(file);
  }

  useEffect(() => {
    if (beatportTracks && beatportTracks.length > 0) {
      const dups = beatportTracks.map(bpt => {
          const d = tracks.filter(t => {
            return t.name
              && t.name.indexOf(bpt.name) === 0
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
        <img src={logo} className="App-logo" alt="logo" />
        <input type="file" id="file-selector" onChange={e => loadFile(e.target.files[0])}></input>
      </header>
      <Duplicates dups={dups} copyRight={copyRight}/>
    </div>
  );
}

export default App;
