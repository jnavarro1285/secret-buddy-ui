import { useState } from "react";
import { createEvent, addParticipants, setReady } from "../service/api";

export default function Organizer() {
  const [name, setName] = useState("Amigo Secreto");
  const [eventId, setEventId] = useState(null);
  const [csv, setCsv] = useState("");
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState([]);

  async function onCreate() {
    setLoading(true);
    try {
      const ev = await createEvent(name);
      console.log("Created event", ev);
      setEventId(ev.id);
    } finally {
      setLoading(false);
    }
  }

  function parseCsv(text) {
    // simple CSV: name,phone per line
    return text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [n, p] = line.split(",").map((s) => s.trim());
        return { name: n, phone: p };
      });
  }

  async function onUpload() {
    if (!eventId) return alert("Create an event first");
    const items = parseCsv(csv);
    console.log("Parsed items", items);
    if (items.length === 0) return alert("No participants found in CSV");
    setLoading(true);
    try {
      const saved = await addParticipants(eventId, items);
      setParticipants(saved);
    } catch (e) {
      alert(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  }

  async function onReady() {
    if (!eventId) return alert("Create an event first");
    setLoading(true);
    try {
      await setReady(eventId);
      alert("Event marked as READY");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <section className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-semibold mb-4">Create Event</h2>
        <div className="space-y-2">
          <input
            className="w-full border rounded px-3 py-2 mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex gap-2 mb-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={onCreate}
              disabled={loading}
            >
              Create
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => {
                setName("Amigo Secreto");
              }}
            >
              Reset
            </button>
          </div>
          {eventId && (
            <div className="text-sm text-gray-600">
              Event ID: <code className="text-red-800">{eventId}</code>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">
          Upload participants (CSV)
        </h2>
        <p className="text-sm text-gray-500">
          Format: <code>Nombre,telefono</code> per line
        </p>
        <textarea
          className="w-full border rounded p-3 h-40 mt-2"
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
        />
        <div className="flex gap-2 mt-3">
          <button
            onClick={onUpload}
            disabled={loading || !eventId}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Upload
          </button>
          <button
            onClick={onReady}
            disabled={!eventId}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Mark Ready
          </button>
        </div>
        {participants.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium">Participants (preview)</h3>
            <ul className="list-disc pl-5 mt-2">
              {participants.map((p) => (
                <li key={p.id}>
                  {p.name} — link: <a href={p.joinLink} className="text-blue-600 text-sm">{p.joinLink}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="text-sm text-gray-500 mt-4">
        When participants are uploaded they receive a <code>joinToken</code>.
        Use links:{" "}
        <code>
          /join/{"{eventId}"}/{"{joinToken}"}
        </code>
      </section>
    </div>
  );
}
