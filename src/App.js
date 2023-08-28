import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [xmlDoc, setXmlDoc] = useState();
  const [tracks, setTracks] = useState([]);
  const [beatportTracks, setBeatportTracks] = useState([]);
  const [dups, setDups] = useState([]);

  const loadFile = (file) => {
    const reader = new FileReader();
    const parser = new DOMParser();
    reader.onload = (evt) => {
      const xmlDoc = parser.parseFromString(evt.target.result, "text/xml");
      setXmlDoc(xmlDoc);
      const tracks = xmlDoc.getElementsByTagName("TRACK");
      setTracks(Array.from(tracks).filter(t => t.getAttribute('Kind') !== 'Unknown Format'));
      setBeatportTracks(Array.from(tracks).filter(t => t.getAttribute('Kind') === 'Unknown Format'));
    };
    reader.readAsText(file);
  }

  useEffect(() => {
    if (beatportTracks && beatportTracks.length > 0) {
      const dups = beatportTracks.map(bpt => {
          const d = tracks.filter(t => {
            return t.getAttribute("Name") 
              && t.getAttribute("Name").indexOf(bpt.getAttribute("Name")) === 0
              && t.getAttribute("TotalTime") === bpt.getAttribute("TotalTime");
          });
          return d.length > 0 ? [d[0], bpt] : undefined;
      })
      setDups(dups.filter(d => typeof d !== 'undefined'))
    }
  }, [beatportTracks, tracks, xmlDoc])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input type="file" id="file-selector" onChange={e => loadFile(e.target.files[0])}></input>
        {Array.from(dups).map((t, i) => {
          return <div><span>{i}: BP: {t[1].getAttribute('Name')}</span>
                      <span>DL: {t[0].getAttribute('Name')}</span>
                      <span>{t[0].getAttribute('Kind')}</span></div>
        })}
      </header>
    </div>
  );
}

export default App;
