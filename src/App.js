import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Settings from './pages/Settings';
import Home from './pages/Home';
import About from './pages/About';
import NoPage from './pages/NoPage';
import Header from './components/Header';
import { saveAs } from 'file-saver';

function App() {
  const [xmlDoc, setXmlDoc] = useState();
  const [tracks, setTracks] = useState([]);
  const [beatportTracks, setBeatportTracks] = useState([]);
  const [dups, setDups] = useState([]);
  const [deltas, setDeltas] = useState([]);
  const [trackFilter, setTrackFilter] = useState();
  const [shownTracks, setShownTracks] = useState([]);
  const [saveMessage, setSaveMessage] = useState();
  const [saveType, setSaveType] = useState();

  const [copySettings, setCopySettings] = useState({
    color: true,
    comments: true,
    rating: true,
    queues: false,
    grid: false
  });

  const [playlistSettings, setPlaylistSettings] = useState({
    add: false,
    replace: false
  });

 const TrackClass = useMemo(() => {
  class Track {
    constructor(xmlTrack) {
      this.xmlTrack = xmlTrack;
      this._edited = false;
      this._trackName = xmlTrack.getAttribute('Name');
      this._kind = xmlTrack.getAttribute('Kind');
      this._length = xmlTrack.getAttribute('TotalTime');
      this._trackId = xmlTrack.getAttribute('TrackID');
      this._color = xmlTrack.getAttribute('Colour');
      this._grouping = xmlTrack.getAttribute('Grouping');
      this._rating = xmlTrack.getAttribute('Rating');
      this._comments = xmlTrack.getAttribute('Comments');
      this._grid = Array.from(xmlTrack.getElementsByTagName("TEMPO")).map(te => {
        return {
          start: te.getAttribute('Inizio'),
          bpm: te.getAttribute('Bpm'),
          metro: te.getAttribute('Metro'),
          beat: te.getAttribute('Battito')
        }
      });
      this._queues = Array.from(xmlTrack.getElementsByTagName("POSITION_MARK")).map(p => {
        return {
          name: p.getAttribute('Name'),
          type: p.getAttribute('Type'),
          start: p.getAttribute('Start'),
          num: p.getAttribute('Num')
        }
      });
    }

    get trackName() {
      return this._trackName;
    }

    set trackName(t) {
      this._trackName = t;
    }

    get kind() {
      return this._kind;
    }

    set kind(k) {
      this._kind = k;
    }

    get length() {
      return this._length;
    }

    set length(l) {
      this._length = l;
    }

    get trackId() {
      return this._trackId;
    }

    set trackId(t) {
      this._trackId = t;
    }

    get color() {
      return this._color;
    }

    set color(color) {
      this.edited = true;
      this._color = color;
    }

    get grouping() {
      return this._grouping;
    }

    set grouping(g) {
      this.edited = true;
      this._grouping = g;
    }

    get rating() {
      return this._rating;
    }

    set rating(r) {
      this._rating = r;
    }

    get comments() {
      return this._comments;
    }

    set comments(c) {
      this.edited = true;
      this._comments = c;
    }

    get grid() {
      return this._grid;
    }

    set grid(g) {
      this.edited = true;
      this._grid = g;
    }

    get queues() {
      return this._queues;
    }

    set queues(q) {
      this.edited = true;
      this._queues = q;
    }

    get edited() {
      return this._edited;
    }

    set edited(edited) {
      this._edited = edited;
    }

    writeColor() {
      this.xmlTrack.setAttribute('Colour', this.color);
    }

    writeComments() {
      this.xmlTrack.setAttribute('Comments', this.comments);
    }

    writeRating() {
      this.xmlTrack.setAttribute('Rating', this.rating);
    }

    writeGrid(xmlDoc) {
      Array.from(this.xmlTrack.getElementsByTagName("TEMPO")).forEach(te => {
        te.parentNode.removeChild(te);
      });
      this.grid.forEach(_ => {
        const newEl = xmlDoc.createElement("TEMPO");
        newEl.setAttribute('Inizio', _.start);
        newEl.setAttribute('Bpm', _.bpm);
        newEl.setAttribute('Metro', _.metro);
        newEl.setAttribute('Battito', _.beat);
        this.xmlTrack.appendChild(newEl);
      })
    }

    writeQueues(xmlDoc) {
      Array.from(this.xmlTrack.getElementsByTagName("POSITION_MARK")).forEach(p => {
        p.parentNode.removeChild(p);
      });
      this.queues.forEach(_ => {  
        const newEl = xmlDoc.createElement("POSITION_MARK");
        newEl.setAttribute('Name', _.name);
        newEl.setAttribute('Type', _.type);
        newEl.setAttribute('Start', _.start);
        newEl.setAttribute('Num', _.num);
        this.xmlTrack.appendChild(newEl);
      })
    }
    serialize(xmlDoc) {
      this.writeColor();
      this.writeComments();
      this.writeRating();
      this.writeGrid(xmlDoc);
      this.writeQueues(xmlDoc);
    }
  }
  return Track;
 }, []);

const updatePlaylists = useCallback((fromTrackId, toTrackId) => {
  const playlistNodes = xmlDoc.getElementsByTagName("PLAYLISTS")[0].getElementsByTagName("NODE");
  Array.from(playlistNodes).forEach(n => {
    if (n.getAttribute("Type") === "1") {
      const tracks = Array.from(n.getElementsByTagName("TRACK"));
      const from = tracks.find(t => t.trackId === fromTrackId);
      const to = tracks.find(t => t.trackId === toTrackId);
      if (from && !to) {
        const el = xmlDoc.createElement("TRACK");
        el.setAttribute("Key", toTrackId);
        tracks.parent.appendChild(el);
      }
      if (playlistSettings.replace) {
        tracks.parent.removeChild(from);
      }
    }
  })
}, [xmlDoc, playlistSettings.replace])

const copyTrack = useCallback(async (from, to) => {
    const newTrack = new TrackClass(to.xmlTrack);
    if (copySettings.comments) newTrack.comments = from.comments;
    if (copySettings.queues) newTrack.queues = from.queues;
    if (copySettings.grid) {
      newTrack.grid = from.grid;
      newTrack.grouping = from.grouping;
    }
    if (copySettings.color) newTrack.color = from.color;
    if (copySettings.rating) newTrack.rating = from.rating;

    // replace in tracks array
    const idx = tracks.indexOf(tracks.find(t => t.trackName === to.trackName));
    const _tracks = [...tracks];
    _tracks[idx] = newTrack;
    setTracks(_tracks);

    (playlistSettings.add || playlistSettings.replace) && updatePlaylists(from.trackId, to.trackId)
  }, [tracks, TrackClass, copySettings, playlistSettings.add, playlistSettings.replace, updatePlaylists])

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

  const newXmlDoc = useCallback(() => {
    // Create a new xmlDoc for adding changes to
    const newXmlDoc = xmlDoc.cloneNode(true);
    Array.from(newXmlDoc.getElementsByTagName("COLLECTION")).forEach(t => {
      t.parentNode.removeChild(t);
    });

    const copiedTracks = tracks.filter(t => t.edited);
    const newCollection = newXmlDoc.createElement("COLLECTION");
    newCollection.setAttribute("Entries", copiedTracks.length);
    newXmlDoc.getElementsByTagName("DJ_PLAYLISTS")[0].appendChild(newCollection);

    copiedTracks.forEach(t => {
      newCollection.appendChild(t.xmlTrack.cloneNode(true))
    })

    return newXmlDoc;
  }, [xmlDoc, tracks])

  const saveFile = useCallback(async () => {
    // Write the changes to the xmlDoc
    tracks.forEach(t => {
      t.serialize(xmlDoc);
    });

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
    const doc = saveType === 'full' ? xmlDoc : newXmlDoc()
    var resultDoc = xsltProcessor.transformToDocument(doc);
    const xmlStr = serializer.serializeToString(resultDoc);
    const blob = new Blob([xmlStr], {type: "application/xml"});
    try {
      saveAs(blob, `boxer_export.xml`);
    } catch (err) {
      setSaveMessage(err);
      return
    }
    setSaveMessage('File saved');
  }, [saveType, xmlDoc, newXmlDoc, tracks]);

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
      if (trackFilter) {
        setShownTracks(trackFilter === 'dups' ? dups : deltas);
      } else {
        setShownTracks(dups);
      }
    }
  }, [deltas, dups, shownTracks, trackFilter])

  useEffect(() => {
    if (saveMessage) {
      setTimeout(() => setSaveMessage(undefined), 3000);
    }
  }, [saveMessage])

  useEffect(() => {
    if (playlistSettings.add || playlistSettings.replace) {
      // force all tracks
      setSaveType('full');
    }
  }, [playlistSettings])

  return (
    <BrowserRouter>
        <Header/>
        <Routes>
            <Route index element={<Home 
              shownTracks={shownTracks} 
              copyTrack={copyTrack}
              loadFile={loadFile} 
              setShownTracks={setShownTracks}
              setTrackFilter={setTrackFilter}
              setSaveType={setSaveType}
              saveType={saveType}
              saveFile={saveFile}
              saveMessage={saveMessage}/>}
            />
            <Route path="settings" element={<Settings 
              saveType={saveType} 
              setSaveType={setSaveType}
              copySettings={copySettings}
              setCopySettings={setCopySettings}
              playlistSettings={playlistSettings}
              setPlaylistSettings={setPlaylistSettings}/>} />
            <Route path="*" element={<NoPage />} />
            <Route path="about" element={<About/>} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
