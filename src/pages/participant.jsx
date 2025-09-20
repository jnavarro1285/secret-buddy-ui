import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getParticipants, reveal, getJoinContext } from "../service/api";

export default function Participant() {
  const { eventId, token } = useParams();
  const [ctx, setCtx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [alreadyRevealed, setAlreadyRevealed] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!eventId || !token) return;
    setLoading(true);

    getJoinContext(eventId, token)
      .then((data) => {
        setCtx(data);
        if (data.alreadyRevealed) {
          setAlreadyRevealed(data.alreadyRevealed);
          setResult(data.receiverName || "Unknown");
          setLoading(false);
          return;
        }
        // después de obtener el contexto, solicitamos los participantes reales desde la API
        // Endpoint esperado: GET /api/v1/events/{eventId}/participants
        // que retorne array de { id, name, ... }
        return getParticipants(eventId, token)
          .then((participants) => {
            // si hay participantes reales, construimos la lista excluyendo al propio participante
            if (Array.isArray(participants) && participants.length > 0) {
              const selfName = data.participantName;
              const names = participants
                .map((p) => p.name)
                .filter((n) => n && n !== selfName);
              // si la lista queda vacía por alguna razón, usar fallback demo
              //setNames(names.length > 0 ? names : []);
            } else {
              // fallback demo
              //setNames([]);
            }
            setLoading(false);
          })
          .catch((err) => {
            // si el endpoint no existe o falla, usamos fallback
            console.warn(
              "Could not fetch participants list, falling back to demo names",
              err
            );
            return null;
          });
      })
      .catch((e) => {
        setLoading(false);
        alert("Invalid link or server error");
      });
  }, [eventId, token]);

  async function onSelect_() {
    if (running || result) return;
    setRunning(true);
    // show roulette animation and then call backend; we'll run both in parallel but ensure UX shows animation
    let finalNameFromBackend = null;
    try {
      const res = await reveal(eventId, token);
      finalNameFromBackend = res.receiverName;
    } catch (e) {
      alert("Reveal failed: " + (e.response?.data?.detail || e.message));
      setRunning(false);
      return;
    }

    // show roulette for 2s then show final
    setTimeout(() => {
      setResult(finalNameFromBackend);
      setAlreadyRevealed(true);
      setRunning(false);
    }, 2000);
  }

  async function onSelect() {
    if (running || result) return;
    setRunning(true);
    setProgress(0); // Reinicia el progreso al inicio
    const finalNameFromBackend = await reveal(eventId, token)
      .then((res) => res.receiverName)
      .catch((e) => {
        alert("Reveal failed: " + (e.response?.data?.detail || e.message));
        setRunning(false);
        return null;
      });

    if (!finalNameFromBackend) return;

    // Simular el avance de la barra de progreso
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setResult(finalNameFromBackend);
        setAlreadyRevealed(true);
        setRunning(false);
      }
    }, 100); // 200ms por cada 10% de avance, total 2s de animación
  }

  if (loading) return <div className="text-center">Loading...</div>;
  if (!ctx) return <div className="text-center">No context found.</div>;

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white p-8 rounded shadow">
        <h2 className="text-3xl text-gray-500 font-semibold">
          Hola{" "}
          <span className="text-3xl text-red-800">{ctx.participantName}</span>
        </h2>
        {!running && !alreadyRevealed && (
          <p className="text-sm text-gray-500 mt-2">
            Presiona el botón para seleccionar tu amigo secreto
          </p>
        )}

        <div className="my-6">
          {!alreadyRevealed && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={onSelect}
              disabled={running}
            >
              Seleccionar amigo secreto
            </button>
          )}

          {running && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden border border-gray-300">
                <div
                  className="bg-green-500 h-4 transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-500">Seleccionando...</p>
            </div>
          )}

          {alreadyRevealed && (
            <div className="mt-6 text-gray-500 font-medium">
              Tu amigo secreto es:
              <div className="mt-6 text-3xl font-medium bg-green-50 p-4 rounded text-green-600">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
