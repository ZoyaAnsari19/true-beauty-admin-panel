"use client";

import { useState, useMemo, useEffect, Fragment } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "react-simple-maps";

const TABS = [
  { id: "worldwide", label: "Worldwide" },
  { id: "country", label: "Country" },
  { id: "state-city", label: "State & City" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type RegionStats = { orders: number; revenue: number };

// Worldwide: country name -> orders & revenue (sales = orders for coloring)
const worldwideData: Record<string, RegionStats> = {
  India: { orders: 12450, revenue: 2845000 },
  "United States of America": { orders: 8920, revenue: 2120000 },
  "United Kingdom": { orders: 4320, revenue: 980000 },
  "United Arab Emirates": { orders: 2100, revenue: 520000 },
  Canada: { orders: 1850, revenue: 440000 },
  Australia: { orders: 1620, revenue: 385000 },
  Germany: { orders: 3200, revenue: 760000 },
  France: { orders: 2890, revenue: 692000 },
  Singapore: { orders: 1560, revenue: 412000 },
  Malaysia: { orders: 980, revenue: 228000 },
  "Saudi Arabia": { orders: 1450, revenue: 358000 },
  Japan: { orders: 2340, revenue: 588000 },
  "South Korea": { orders: 1180, revenue: 295000 },
  Brazil: { orders: 760, revenue: 178000 },
  "South Africa": { orders: 540, revenue: 125000 },
  Nigeria: { orders: 420, revenue: 98000 },
  Indonesia: { orders: 890, revenue: 198000 },
  Thailand: { orders: 670, revenue: 152000 },
  Philippines: { orders: 430, revenue: 102000 },
  Pakistan: { orders: 380, revenue: 88000 },
  Bangladesh: { orders: 290, revenue: 72000 },
  "Sri Lanka": { orders: 180, revenue: 45000 },
  Nepal: { orders: 150, revenue: 38000 },
};

// India states: state name -> orders & revenue
const indiaStateData: Record<string, RegionStats> = {
  "Andhra Pradesh": { orders: 1420, revenue: 342000 },
  "Arunachal Pradesh": { orders: 85, revenue: 18500 },
  Assam: { orders: 320, revenue: 72000 },
  Bihar: { orders: 480, revenue: 108000 },
  Chhattisgarh: { orders: 210, revenue: 48000 },
  Goa: { orders: 180, revenue: 52000 },
  Gujarat: { orders: 1680, revenue: 412000 },
  Haryana: { orders: 920, revenue: 228000 },
  "Himachal Pradesh": { orders: 290, revenue: 72000 },
  Jharkhand: { orders: 340, revenue: 78000 },
  Karnataka: { orders: 1950, revenue: 485000 },
  Kerala: { orders: 1120, revenue: 268000 },
  "Madhya Pradesh": { orders: 580, revenue: 132000 },
  Maharashtra: { orders: 2450, revenue: 628000 },
  Manipur: { orders: 95, revenue: 22000 },
  Meghalaya: { orders: 72, revenue: 16800 },
  Mizoram: { orders: 48, revenue: 11200 },
  Nagaland: { orders: 55, revenue: 12800 },
  Odisha: { orders: 410, revenue: 92000 },
  Punjab: { orders: 780, revenue: 188000 },
  Rajasthan: { orders: 650, revenue: 158000 },
  Sikkim: { orders: 62, revenue: 15200 },
  "Tamil Nadu": { orders: 1890, revenue: 462000 },
  Telangana: { orders: 1180, revenue: 288000 },
  Tripura: { orders: 88, revenue: 20500 },
  "Uttar Pradesh": { orders: 1320, revenue: 312000 },
  Uttarakhand: { orders: 380, revenue: 92000 },
  "West Bengal": { orders: 980, revenue: 235000 },
  "Andaman and Nicobar Islands": { orders: 45, revenue: 11200 },
  Chandigarh: { orders: 120, revenue: 32000 },
  "Dadra and Nagar Haveli and Daman and Diu": { orders: 38, revenue: 9200 },
  Delhi: { orders: 1560, revenue: 428000 },
  "Jammu and Kashmir": { orders: 420, revenue: 102000 },
  Ladakh: { orders: 95, revenue: 24800 },
  Lakshadweep: { orders: 18, revenue: 4800 },
  Puducherry: { orders: 85, revenue: 19800 },
};

// Cities with coordinates [lng, lat] and stats
const cityData: {
  city: string;
  state: string;
  coordinates: [number, number];
  orders: number;
  revenue: number;
}[] = [
  { city: "Mumbai", state: "Maharashtra", coordinates: [72.8777, 19.076], orders: 820, revenue: 248000 },
  { city: "Delhi", state: "Delhi", coordinates: [77.209, 28.6139], orders: 780, revenue: 228000 },
  { city: "Bangalore", state: "Karnataka", coordinates: [77.5946, 12.9716], orders: 690, revenue: 198000 },
  { city: "Chennai", state: "Tamil Nadu", coordinates: [80.2707, 13.0827], orders: 540, revenue: 158000 },
  { city: "Hyderabad", state: "Telangana", coordinates: [78.4867, 17.385], orders: 480, revenue: 142000 },
  { city: "Pune", state: "Maharashtra", coordinates: [73.8563, 18.5204], orders: 420, revenue: 125000 },
  { city: "Kolkata", state: "West Bengal", coordinates: [88.3639, 22.5726], orders: 380, revenue: 108000 },
  { city: "Ahmedabad", state: "Gujarat", coordinates: [72.5714, 23.0225], orders: 350, revenue: 98000 },
  { city: "Surat", state: "Gujarat", coordinates: [72.8311, 21.1702], orders: 220, revenue: 62000 },
  { city: "Jaipur", state: "Rajasthan", coordinates: [75.7873, 26.9124], orders: 190, revenue: 52000 },
];

const WORLD_MAP_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const INDIA_STATES_URL =
  "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson";

// Centroid of a GeoJSON feature (simplified: first ring average)
function getGeoCentroid(geo: { geometry?: unknown }): [number, number] | null {
  const geom = geo.geometry as { type?: string; coordinates?: unknown[] } | undefined;
  if (!geom || !geom.coordinates) return null;
  let coords: [number, number][] = [];
  if (geom.type === "Polygon") {
    coords = (geom.coordinates[0] as [number, number][]) || [];
  } else if (geom.type === "MultiPolygon") {
    const first = (geom.coordinates[0] as [number, number][][])?.[0];
    coords = first || [];
  }
  if (coords.length === 0) return null;
  const sum = coords.reduce(
    (a, c) => [a[0] + c[0], a[1] + c[1]],
    [0, 0],
  );
  return [sum[0] / coords.length, sum[1] / coords.length];
}

function getFillForSales(orders: number, maxOrders: number): string {
  if (!orders || orders <= 0) return "#e2e8f0";
  const intensity = Math.min(1, orders / maxOrders);
  return `hsl(330, 72%, ${88 - intensity * 50}%)`;
}

function getStrokeForSales(orders: number): string {
  if (!orders || orders <= 0) return "#cbd5e1";
  return "#ec4899";
}

function formatRevenue(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
const ZOOM_COUNTRY_LABELS = 3.2;
const ZOOM_STATE_LABELS_MIN = 1.2;
const ZOOM_STATE_LABELS_MAX = 4.5;
const ZOOM_CITY_LABELS = 3.2;

function MapZoomControls({
  mapZoom,
  setMapZoom,
}: {
  mapZoom: number;
  setMapZoom: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div className="absolute bottom-3 right-3 flex flex-col gap-1 rounded-lg border border-gray-200 bg-white/95 p-1 shadow-sm z-10">
      <button
        type="button"
        onClick={() => setMapZoom((z) => Math.min(z + 0.8, MAX_ZOOM))}
        disabled={mapZoom >= MAX_ZOOM}
        className="rounded p-1.5 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
        aria-label="Zoom in"
      >
        <ZoomIn className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => setMapZoom((z) => Math.max(z - 0.8, MIN_ZOOM))}
        disabled={mapZoom <= MIN_ZOOM}
        className="rounded p-1.5 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
        aria-label="Zoom out"
      >
        <ZoomOut className="h-5 w-5" />
      </button>
    </div>
  );
}

export function GeographyChart() {
  const [activeTab, setActiveTab] = useState<TabId>("worldwide");
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode>(null);
  const [mapZoom, setMapZoom] = useState(1);

  const maxWorldOrders = useMemo(
    () => Math.max(...Object.values(worldwideData).map((d) => d.orders), 1),
    [],
  );
  const maxStateOrders = useMemo(
    () => Math.max(...Object.values(indiaStateData).map((d) => d.orders), 1),
    [],
  );

  useEffect(() => {
    setMapZoom(1);
  }, [activeTab]);

  const showCountryLabels = activeTab === "worldwide" && mapZoom <= ZOOM_COUNTRY_LABELS;
  const showStateLabels =
    (activeTab === "country" || activeTab === "state-city") &&
    mapZoom >= ZOOM_STATE_LABELS_MIN &&
    mapZoom <= ZOOM_STATE_LABELS_MAX;
  const showCityMarkers = activeTab === "state-city" && mapZoom >= ZOOM_CITY_LABELS;

  const renderTooltip = (content: React.ReactNode) => (
    <div className="rounded-lg border border-pink-200 bg-white px-3 py-2.5 text-sm shadow-lg">
      {content}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Sales by Geography
          </h2>
          <p className="text-sm text-gray-500">
            Orders & revenue by region · Zoom for state & city labels
          </p>
        </div>
        <div className="inline-flex rounded-full bg-gray-100 p-1 text-xs sm:text-sm">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                  isActive
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 min-h-[320px] relative">
        {activeTab === "worldwide" && (
          <div className="w-full overflow-hidden rounded-xl border border-gray-100 bg-slate-50/50 relative">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 140, center: [20, 20] }}
              width={800}
              height={400}
              className="w-full h-auto max-w-full"
              style={{ width: "100%", height: "auto" }}
            >
              <ZoomableGroup
                center={[0, 20]}
                zoom={mapZoom}
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
              >
                <Geographies geography={WORLD_MAP_URL}>
                  {({ geographies, projection }) =>
                    geographies.map((geo) => {
                      const name = String(
                        geo.properties?.name ?? geo.properties?.NAME ?? "",
                      );
                      const stats = worldwideData[name] ?? { orders: 0, revenue: 0 };
                      const fill = getFillForSales(stats.orders, maxWorldOrders);
                      const stroke = getStrokeForSales(stats.orders);
                      const centroid = getGeoCentroid(geo);
                      const [x, y] = centroid && projection ? projection(centroid) : [0, 0];
                      return (
                        <Fragment key={geo.rsmKey}>
                          <Geography
                            geography={geo}
                            fill={fill}
                            stroke={stroke}
                            strokeWidth={stats.orders > 0 ? 0.8 : 0.5}
                            onMouseEnter={() =>
                              setTooltipContent(
                                renderTooltip(
                                  <>
                                    <p className="font-semibold text-gray-900">{name}</p>
                                    <p className="mt-1 text-xs text-gray-600">
                                      Orders: {stats.orders.toLocaleString("en-IN")} · Revenue: {formatRevenue(stats.revenue)}
                                    </p>
                                  </>,
                                ),
                              )
                            }
                            onMouseLeave={() => setTooltipContent(null)}
                            style={{
                              default: { outline: "none" },
                              hover: { outline: "none", fill: "#f9a8d4", cursor: "pointer" },
                              pressed: { outline: "none" },
                            }}
                          />
                          {showCountryLabels && centroid ? (
                            <text
                              x={x}
                              y={y}
                              textAnchor="middle"
                              className="pointer-events-none fill-gray-700"
                              style={{
                                fontSize: Math.max(8, 11 - mapZoom * 1.2),
                                fontWeight: 600,
                              }}
                            >
                              {name.length > 12 ? name.slice(0, 11) + "…" : name}
                            </text>
                          ) : null}
                        </Fragment>
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
            <MapZoomControls mapZoom={mapZoom} setMapZoom={setMapZoom} />
            {tooltipContent && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                {tooltipContent}
              </div>
            )}
          </div>
        )}

        {activeTab === "country" && (
          <div className="w-full overflow-hidden rounded-xl border border-gray-100 bg-slate-50/50 relative">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 1200, center: [78, 22] }}
              width={800}
              height={400}
              className="w-full h-auto max-w-full"
              style={{ width: "100%", height: "auto" }}
            >
              <ZoomableGroup
                center={[78, 22]}
                zoom={mapZoom}
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
              >
                <Geographies geography={INDIA_STATES_URL}>
                  {({ geographies, projection }) =>
                    geographies.map((geo) => {
                      const name = String(
                        geo.properties?.st_nm ??
                        geo.properties?.ST_NM ??
                        geo.properties?.STATE ??
                        geo.properties?.name ??
                        "",
                      );
                      const stats = indiaStateData[name] ?? { orders: 0, revenue: 0 };
                      const fill = getFillForSales(stats.orders, maxStateOrders);
                      const stroke = getStrokeForSales(stats.orders);
                      const centroid = getGeoCentroid(geo);
                      const [x, y] = centroid && projection ? projection(centroid) : [0, 0];
                      return (
                        <Fragment key={geo.rsmKey}>
                          <Geography
                            geography={geo}
                            fill={fill}
                            stroke={stroke}
                            strokeWidth={stats.orders > 0 ? 0.8 : 0.5}
                            onMouseEnter={() =>
                              setTooltipContent(
                                renderTooltip(
                                  <>
                                    <p className="font-semibold text-gray-900">{name}</p>
                                    <p className="mt-1 text-xs text-gray-600">
                                      Orders: {stats.orders.toLocaleString("en-IN")} · Revenue: {formatRevenue(stats.revenue)}
                                    </p>
                                  </>,
                                ),
                              )
                            }
                            onMouseLeave={() => setTooltipContent(null)}
                            style={{
                              default: { outline: "none" },
                              hover: { outline: "none", fill: "#f9a8d4", cursor: "pointer" },
                              pressed: { outline: "none" },
                            }}
                          />
                          {showStateLabels && centroid ? (
                            <text
                              x={x}
                              y={y}
                              textAnchor="middle"
                              className="pointer-events-none fill-gray-700"
                              style={{
                                fontSize: Math.max(7, 10 - mapZoom * 0.8),
                                fontWeight: 600,
                              }}
                            >
                              {name.length > 14 ? name.slice(0, 13) + "…" : name}
                            </text>
                          ) : null}
                        </Fragment>
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
            <MapZoomControls mapZoom={mapZoom} setMapZoom={setMapZoom} />
            {tooltipContent && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                {tooltipContent}
              </div>
            )}
          </div>
        )}

        {activeTab === "state-city" && (
          <div className="space-y-4">
            <div className="w-full overflow-hidden rounded-xl border border-gray-100 bg-slate-50/50 relative">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 1200, center: [78, 22] }}
                width={800}
                height={360}
                className="w-full h-auto max-w-full"
                style={{ width: "100%", height: "auto" }}
              >
                <ZoomableGroup
                  center={[78, 22]}
                  zoom={mapZoom}
                  minZoom={MIN_ZOOM}
                  maxZoom={MAX_ZOOM}
                >
                  <Geographies geography={INDIA_STATES_URL}>
                    {({ geographies, projection }) => (
                      <>
                        {geographies.map((geo) => {
                          const name = String(
                            geo.properties?.st_nm ??
                            geo.properties?.ST_NM ??
                            geo.properties?.STATE ??
                            geo.properties?.name ??
                            "",
                          );
                          const stats = indiaStateData[name] ?? { orders: 0, revenue: 0 };
                          const fill = getFillForSales(stats.orders, maxStateOrders);
                          const stroke = getStrokeForSales(stats.orders);
                          const centroid = getGeoCentroid(geo);
                          const [x, y] = centroid && projection ? projection(centroid) : [0, 0];
                          return (
                            <Fragment key={geo.rsmKey}>
                              <Geography
                                geography={geo}
                                fill={fill}
                                stroke={stroke}
                                strokeWidth={stats.orders > 0 ? 0.8 : 0.5}
                                onMouseEnter={() =>
                                  setTooltipContent(
                                    renderTooltip(
                                      <>
                                        <p className="font-semibold text-gray-900">{name}</p>
                                        <p className="mt-1 text-xs text-gray-600">
                                          Orders: {stats.orders.toLocaleString("en-IN")} · Revenue: {formatRevenue(stats.revenue)}
                                        </p>
                                      </>,
                                    ),
                                  )
                                }
                                onMouseLeave={() => setTooltipContent(null)}
                                style={{
                                  default: { outline: "none" },
                                  hover: { outline: "none", fill: "#f9a8d4", cursor: "pointer" },
                                  pressed: { outline: "none" },
                                }}
                              />
                              {showStateLabels && centroid ? (
                                <text
                                  x={x}
                                  y={y}
                                  textAnchor="middle"
                                  className="pointer-events-none fill-gray-700"
                                  style={{
                                    fontSize: Math.max(7, 10 - mapZoom * 0.8),
                                    fontWeight: 600,
                                  }}
                                >
                                  {name.length > 14 ? name.slice(0, 13) + "…" : name}
                                </text>
                              ) : null}
                            </Fragment>
                          );
                        })}
                        {showCityMarkers &&
                          cityData.map((c) => (
                            <Marker
                              key={`${c.city}-${c.state}`}
                              coordinates={c.coordinates}
                              onMouseEnter={() =>
                                setTooltipContent(
                                  renderTooltip(
                                    <>
                                      <p className="font-semibold text-gray-900">{c.city}</p>
                                      <p className="text-xs text-gray-500">{c.state}</p>
                                      <p className="mt-1 text-xs text-gray-600">
                                        Orders: {c.orders.toLocaleString("en-IN")} · Revenue: {formatRevenue(c.revenue)}
                                      </p>
                                    </>,
                                  ),
                                )
                              }
                              onMouseLeave={() => setTooltipContent(null)}
                            >
                              <g>
                                <circle r={4} fill="#ec4899" stroke="#fff" strokeWidth={1.5} />
                                <text
                                  y={-8}
                                  textAnchor="middle"
                                  className="pointer-events-none fill-gray-800"
                                  style={{ fontSize: 9, fontWeight: 600 }}
                                >
                                  {c.city}
                                </text>
                              </g>
                            </Marker>
                          ))}
                      </>
                    )}
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
              <MapZoomControls mapZoom={mapZoom} setMapZoom={setMapZoom} />
              {tooltipContent && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
                  {tooltipContent}
                </div>
              )}
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
                Top cities · Orders & revenue
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {cityData.map((c) => (
                  <div
                    key={`${c.city}-${c.state}`}
                    className="rounded-lg bg-white border border-gray-100 px-3 py-2"
                  >
                    <p className="text-sm font-medium text-gray-900 truncate">{c.city}</p>
                    <p className="text-[11px] text-gray-500 truncate">{c.state}</p>
                    <p className="text-xs font-semibold text-pink-600 mt-0.5">
                      {c.orders.toLocaleString("en-IN")} orders · {formatRevenue(c.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] sm:text-xs text-gray-400">
        <span>Drag to pan · Scroll or use +/− to zoom · Labels show by zoom level</span>
      </div>
    </div>
  );
}
