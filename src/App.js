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
  const [newXmlDoc, setNewXmlDoc] = useState();
  const [tracks, setTracks] = useState([]);
  const [beatportTracks, setBeatportTracks] = useState([]);
  const [dups, setDups] = useState([]);
  const [deltas, setDeltas] = useState([]);
  const [shownTracks, setShownTracks] = useState([]);
  const [newFileName, setNewFileName] = useState();
  const [saveMessage, setSaveMessage] = useState();
  const [saveType, setSaveType] = useState();

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
      this.edited = true;
      this.xmlTrack.setAttribute('Colour', color);
    }

    get grouping() {
      return this.xmlTrack.getAttribute("Grouping");
    }

    set grouping(g) {
      this.edited = true;
      this.xmlTrack.setAttribute('Grouping', g);
    }

    get rating() {
      return this.xmlTrack.getAttribute('Rating');
    }

    set rating(r) {
      this.xmlTrack.setAttribute('Rating', r);
    }

    get comments() {
      return this.xmlTrack.getAttribute('Comments');
    }

    set comments(c) {
      this.edited = true;
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
      this.edited = true;
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
      this.edited = true;
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
    newTrack.rating = from.rating;
    newTrack.grouping = from.grouping;

    // replace in uploaded xml
    const idx = tracks.indexOf(tracks.find(t => t.trackName === to.trackName));
    const _tracks = [...tracks];
    _tracks[idx] = newTrack;
    setTracks(_tracks);

    // set or replace in new xml
    const existingTrack = Array.from(newXmlDoc.getElementsByTagName("TRACK")).find(t => t.getAttribute("Name") === newTrack.trackName);
    if (!existingTrack) {
      const entries =  newXmlDoc.getElementsByTagName("COLLECTION")[0].getAttribute("Entries");
      newXmlDoc.getElementsByTagName("COLLECTION")[0].setAttribute("Entries", Number(entries) + 1);
      const newXmlTrack = newTrack.xmlTrack.cloneNode(true);
      const collection = newXmlDoc.getElementsByTagName("COLLECTION")[0];
      collection.appendChild(newXmlTrack);
    }

  }, [tracks, TrackClass, newXmlDoc])

  const loadFile = useCallback(file => {
    const reader = new FileReader();
    const parser = new DOMParser();
    reader.onload = (evt) => {
      const xmlDoc = parser.parseFromString(evt.target.result, "text/xml");
      setXmlDoc(xmlDoc);
      const tracks = xmlDoc.getElementsByTagName("TRACK");
      setTracks(Array.from(tracks).filter(t => t.getAttribute('Kind') !== 'Unknown Format').map(t => new TrackClass(t)));
      setBeatportTracks(Array.from(tracks).filter(t => t.getAttribute('Kind') === 'Unknown Format').map(t => new TrackClass(t)));

      // Create a new xmlDoc for adding changes to
      const newXmlDoc = xmlDoc.cloneNode(true);
      Array.from(newXmlDoc.getElementsByTagName("COLLECTION")).forEach(t => {
        t.parentNode.removeChild(t);
      });

      Array.from(newXmlDoc.getElementsByTagName("PLAYLISTS")).forEach(t => {
        t.parentNode.removeChild(t);
      });
      const newCollection = newXmlDoc.createElement("COLLECTION");
      newCollection.setAttribute("Entries", "0");
      newXmlDoc.getElementsByTagName("DJ_PLAYLISTS")[0].appendChild(newCollection);
      setNewXmlDoc(newXmlDoc);
    };
    reader.readAsText(file);
  }, [TrackClass]);

  const saveFile = useCallback(async () => {
    const serializer = new XMLSerializer();
    var xsltDoc = new DOMParser().parseFromString([
      // describes how we want to modify the XML - indent everything
      '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
      '  <xsl:strip-space elements="*"/>',
      '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
      '    <xsl:value-of select="normalize-space(.)"/>',
      '  </xsl:template>',
      '  <xsl:template match="node()|@*">',
      '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
      '  </xsl:template>',
      '  <xsl:output indent="yes"/>',
      '</xsl:stylesheet>',
  ].join('\n'), 'application/xml');

    var xsltProcessor = new XSLTProcessor();    
    xsltProcessor.importStylesheet(xsltDoc);
    var resultDoc = xsltProcessor.transformToDocument(saveType === 'full' ? xmlDoc : newXmlDoc);
    const xmlStr = serializer.serializeToString(resultDoc);
    const blob = new Blob([xmlStr], {type: "application/xml"});
    try {
      saveAs(blob, newFileName);
    } catch (err) {
      setSaveMessage(err);
      return
    }
    setSaveMessage('File saved');
  }, [newXmlDoc, newFileName, saveType, xmlDoc]);

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
        <button onClick={saveFile}>Save</button>
        <input type="radio" id="full" name="save_type" value="FULL" onChange={_e => setSaveType('full')} checked={saveType === 'full'}/>
        <label for="full">FULL</label>
        <input type="radio" id="changes" name="save_type" value="CHANGES" onChange={_e => setSaveType('changes')} checked={!saveType || saveType === 'changes'}/>
        <label for="full">CHANGES</label>
        <div>{saveMessage}</div>
      </Toolbar>
      <Duplicates dups={shownTracks} copyTrack={copyTrack}/>
    </div>
  );
}

export default App;
