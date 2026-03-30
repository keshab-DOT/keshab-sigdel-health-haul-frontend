import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import {
  MapContainer, TileLayer, Marker, Popup,
  Polyline, useMap,
} from "react-leaflet";
import L from "leaflet";

// ── Fix Leaflet's broken marker icons in Vite ─────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const makeIcon = (emoji, bgColor) =>
  L.divIcon({
    html: `<div style="
      background:${bgColor};color:white;border-radius:50%;
      width:36px;height:36px;display:flex;align-items:center;justify-content:center;
      font-size:17px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);
    ">${emoji}</div>`,
    className: "", iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
  });

const PHARMACY_ICON = makeIcon("🏥", "#16a34a");
const USER_ICON     = makeIcon("📍", "#2563eb");

function BoundsFitter({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length >= 2) {
      map.fitBounds(L.latLngBounds(positions), { padding: [40, 40], animate: true });
    } else if (positions.length === 1) {
      map.setView(positions[0], 15, { animate: true });
    }
  }, [positions, map]);
  return null;
}

async function fetchOsrmRoute(from, to) {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${from[1]},${from[0]};${to[1]},${to[0]}` +
    `?overview=full&geometries=geojson`;
  try {
    const res  = await fetch(url);
    const data = await res.json();
    if (data.routes?.[0]) {
      return {
        coords:   data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]),
        distance: (data.routes[0].distance / 1000).toFixed(1),
        duration: Math.round(data.routes[0].duration / 60),
      };
    }
  } catch (e) { console.error("OSRM:", e); }
  return null;
}

/**
 * Props:
 *   role             — "user" | "pharmacy" | "admin"
 *   userId           — logged-in user's _id
 *   orderId          — active order's _id
 *   pharmacyId       — pharmacy's _id (from order)
 *   pharmacyName     — pharmacy display name
 *   userDeliveryLat  — from order.deliveryAddress.lat (may be null)
 *   userDeliveryLng  — from order.deliveryAddress.lng (may be null)
 */
export default function OrderMapCard({
  role, userId, orderId,
  pharmacyId, pharmacyName,
  userDeliveryLat, userDeliveryLng,
}) {
  const [pharmacyPos,  setPharmacyPos]  = useState(null);
  const [userPos,      setUserPos]      = useState(null);
  const [route,        setRoute]        = useState(null);
  const [showRoute,    setShowRoute]    = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError,   setRouteError]   = useState(null);
  const [otherOnline,  setOtherOnline]  = useState(false);
  const [sharing,      setSharing]      = useState(false);
  const [locError,     setLocError]     = useState(null);
  const [gpsLoading,   setGpsLoading]   = useState(false);

  const socketRef = useRef(null);
  const watchRef  = useRef(null);
  const apiRef    = useRef(null);

  const isUser     = role === "user";
  const isPharmacy = role === "pharmacy";
  const isAdmin    = role === "admin";
  const DEFAULT_CENTER = [27.7172, 85.324];

  // ── 1. Load user delivery coords from props (if saved in order) ───────
  useEffect(() => {
    const lat = Number(userDeliveryLat);
    const lng = Number(userDeliveryLng);
    if (lat && lng) setUserPos([lat, lng]);
  }, [userDeliveryLat, userDeliveryLng]);

  // ── 2. Load pharmacy saved coords from DB ─────────────────────────────
  useEffect(() => {
    if (!pharmacyId || isPharmacy) return;
    import("../../../api/axios").then(({ default: api }) => {
      apiRef.current = api;
      api.get(`/auth/user/${pharmacyId}`)
        .then(({ data }) => {
          const loc = data?.location || data?.user?.location;
          const lat = Number(loc?.latitude);
          const lng = Number(loc?.longitude);
          if (lat && lng) setPharmacyPos([lat, lng]);
        })
        .catch(() => {});
    });
  }, [pharmacyId, isPharmacy]);

  // ── 3. Socket: connect + listen for real-time location updates ─────────
  useEffect(() => {
    if (!orderId || !userId) return;

    import("../../../api/axios").then(({ default: api }) => {
      apiRef.current = api;
    });

    const socket = io("http://localhost:3000", {
      query: { userId, role },
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.emit("joinUserRoom",  userId);
    socket.emit("joinOrderRoom", orderId);
    if (isAdmin) socket.emit("joinAdminRoom");

    // User/admin receives pharmacy live GPS
    if (isUser || isAdmin) {
      socket.on("pharmacyLocation", ({ latitude, longitude }) => {
        setPharmacyPos([latitude, longitude]);
        setOtherOnline(true);
      });
    }

    // Pharmacy/admin receives user live GPS
    if (isPharmacy || isAdmin) {
      socket.on("userLocation", ({ latitude, longitude }) => {
        setUserPos([latitude, longitude]);
        setOtherOnline(true);
      });
    }

    socket.on("participantOffline", ({ role: r }) => {
      if ((isUser && r === "pharmacy") || (isPharmacy && r === "user")) {
        setOtherOnline(false);
      }
    });

    return () => {
      socket.emit("leaveOrderRoom", orderId);
      socket.emit("leaveUserRoom",  userId);
      socket.disconnect();
      if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    };
  }, [orderId, userId, role, isUser, isPharmacy, isAdmin]);

  // ── 4. Share my live location ─────────────────────────────────────────
  const handleStartSharing = useCallback(() => {
    if (!navigator.geolocation) {
      setLocError("Geolocation not supported in your browser.");
      return;
    }
    setGpsLoading(true);
    setLocError(null);

    watchRef.current = navigator.geolocation.watchPosition(
      ({ coords: { latitude, longitude } }) => {
        setGpsLoading(false);
        setSharing(true);

        // Update my own marker immediately
        if (isPharmacy) setPharmacyPos([latitude, longitude]);
        if (isUser)     setUserPos([latitude, longitude]);

        // Broadcast to order room
        const event   = isPharmacy ? "pharmacyShareLocation" : "userShareLocation";
        const payload = isPharmacy
          ? { orderId, latitude, longitude, pharmacyName }
          : { orderId, latitude, longitude };
        socketRef.current?.emit(event, payload);

        // Pharmacy also persists to DB
        if (isPharmacy && apiRef.current) {
          apiRef.current.put("/auth/update-location", { latitude, longitude }).catch(() => {});
        }
      },
      (err) => {
        setGpsLoading(false);
        setSharing(false);
        setLocError("Location access denied. Please allow location in browser settings.");
        console.error("Geolocation error:", err);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  }, [isPharmacy, isUser, orderId, pharmacyName]);

  const handleStopSharing = () => {
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    watchRef.current = null;
    setSharing(false);
    setGpsLoading(false);
  };

  // ── 5. Get driving route ──────────────────────────────────────────────
  const handleGetRoute = useCallback(async () => {
    if (!pharmacyPos || !userPos) return;
    setRouteLoading(true);
    setRouteError(null);
    const from   = isPharmacy ? pharmacyPos : userPos;
    const to     = isPharmacy ? userPos     : pharmacyPos;
    const result = await fetchOsrmRoute(from, to);
    setRouteLoading(false);
    if (result) { setRoute(result); setShowRoute(true); }
    else setRouteError("Couldn't get directions. Check your connection and try again.");
  }, [pharmacyPos, userPos, isPharmacy]);

  const handleClearRoute = () => { setRoute(null); setShowRoute(false); setRouteError(null); };

  const visiblePositions = [pharmacyPos, userPos].filter(Boolean);

  // ── Status label ──────────────────────────────────────────────────────
  const otherLabel = isUser ? (pharmacyName || "Pharmacy") : "Customer";
  let statusText = `Waiting for ${otherLabel} to share location…`;
  if (otherOnline) statusText = `${otherLabel} is sharing live location`;
  else if ((isUser && pharmacyPos) || (isPharmacy && userPos)) statusText = `${otherLabel} location loaded from DB`;

  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-white/10">

      {/* ── Status bar ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-2 bg-black/40 border-b border-white/10">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${otherOnline ? "bg-green-400 animate-pulse" : "bg-gray-500"}`} />
          <span className="text-[11px] font-semibold text-white/70 truncate">{statusText}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          {pharmacyPos && userPos && !showRoute && (
            <button
              onClick={handleGetRoute}
              disabled={routeLoading}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition"
            >
              {routeLoading
                ? <span className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin" />
                : "🗺️"}
              {routeLoading ? "Routing…" : "Directions"}
            </button>
          )}
          {showRoute && (
            <button onClick={handleClearRoute} className="text-[10px] text-white/40 hover:text-white/70 px-2 py-1 rounded-lg transition">
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Route info strip ──────────────────────────────────────────── */}
      {route && showRoute && (
        <div className="flex items-center justify-center gap-5 px-3 py-1.5 bg-blue-600/20 border-b border-white/10">
          <span className="text-[11px] text-blue-200 font-bold">📏 {route.distance} km</span>
          <div className="w-px h-3 bg-white/20" />
          <span className="text-[11px] text-blue-200 font-bold">⏱ ~{route.duration} min</span>
        </div>
      )}

      {routeError && (
        <div className="px-3 py-1.5 bg-red-500/20 border-b border-white/10">
          <p className="text-[11px] text-red-300 text-center">{routeError}</p>
        </div>
      )}

      {/* ── Map ───────────────────────────────────────────────────────── */}
      <MapContainer
        center={pharmacyPos || userPos || DEFAULT_CENTER}
        zoom={14}
        style={{ height: "220px", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {visiblePositions.length > 0 && <BoundsFitter positions={visiblePositions} />}

        {pharmacyPos && (
          <Marker position={pharmacyPos} icon={PHARMACY_ICON}>
            <Popup>
              <div className="text-[12px] font-semibold">
                🏥 {pharmacyName || "Pharmacy"}
                {isPharmacy && <span className="block text-[10px] text-gray-500 font-normal">Your location</span>}
              </div>
            </Popup>
          </Marker>
        )}

        {userPos && (
          <Marker position={userPos} icon={USER_ICON}>
            <Popup>
              <div className="text-[12px] font-semibold">
                📍 Delivery Address
                {isUser && <span className="block text-[10px] text-gray-500 font-normal">Your location</span>}
              </div>
            </Popup>
          </Marker>
        )}

        {showRoute && route && (
          <Polyline
            positions={route.coords}
            pathOptions={{ color: "#3b82f6", weight: 5, opacity: 0.85, dashArray: "10 5" }}
          />
        )}
      </MapContainer>

      {/* ── Bottom action bar ─────────────────────────────────────────── */}
      {!isAdmin && (
        <div className="px-3 py-2.5 bg-black/40 border-t border-white/10">
          {/* Not sharing yet */}
          {!sharing && !gpsLoading && (
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] text-white/40 leading-tight">
                {isUser
                  ? "Share your live location so the pharmacy can find you"
                  : "Share your live location to start delivery"}
              </p>
              <button
                onClick={handleStartSharing}
                className="flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition flex-shrink-0"
              >
                📡 Share Location
              </button>
            </div>
          )}

          {/* GPS acquiring */}
          {gpsLoading && !sharing && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <p className="text-[11px] text-green-400 font-medium">Acquiring GPS signal…</p>
              <button onClick={handleStopSharing} className="ml-auto text-[10px] text-white/30 hover:text-white/60 px-2 py-1 rounded transition">
                Cancel
              </button>
            </div>
          )}

          {/* Actively sharing */}
          {sharing && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              <p className="text-[11px] text-green-400 font-medium">Broadcasting live location…</p>
              <button onClick={handleStopSharing} className="ml-auto text-[10px] text-white/30 hover:text-white/60 px-2 py-1 rounded transition">
                Stop
              </button>
            </div>
          )}

          {/* Location error */}
          {locError && (
            <p className="text-[11px] text-red-400 font-medium text-center mt-1">{locError}</p>
          )}
        </div>
      )}
    </div>
  );
}