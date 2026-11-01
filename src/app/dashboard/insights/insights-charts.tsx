"use client";

import { useState } from "react";
import { formatPrice } from "@/config/site";

const chartWidth = 680;
const chartHeight = 250;
const plot = { left: 58, right: 664, top: 18, bottom: 194 };
const bucketCount = 7;
const orderStatuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"] as const;
const successfulStatuses = new Set(["paid", "processing", "shipped", "delivered"]);
const statusColors: Record<(typeof orderStatuses)[number], string> = {
  pending: "#d7b76f",
  paid: "#a65b4e",
  processing: "#d98a70",
  shipped: "#728b78",
  delivered: "#9b8aab",
  cancelled: "#c5c0ba",
};

type InsightOrder = {
  status: string;
  total: number;
  createdAt: string;
};

type ChartRange = 7 | 30;

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    notation: "compact",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatChartDate(date: Date) {
  return new Intl.DateTimeFormat("en-GH", {
    day: "numeric",
    month: "short",
    timeZone: "Africa/Accra",
  }).format(date);
}

function RevenueChart({ rows, periodEnd, range, onRangeChange }: { rows: InsightOrder[]; periodEnd: Date; range: ChartRange; onRangeChange: (range: ChartRange) => void }) {
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const periodStart = new Date(periodEnd.getTime() - range * 86_400_000);
  const duration = periodEnd.getTime() - periodStart.getTime();
  const values = Array.from({ length: bucketCount }, () => 0);

  for (const { status, total, createdAt } of rows) {
    const timestamp = new Date(createdAt).getTime();
    if (!successfulStatuses.has(status) || timestamp < periodStart.getTime() || timestamp > periodEnd.getTime()) continue;
    const index = Math.min(bucketCount - 1, Math.floor(((timestamp - periodStart.getTime()) / duration) * bucketCount));
    values[index] += total;
  }

  const labels = values.map((_, index) => formatChartDate(new Date(periodStart.getTime() + (duration * index) / bucketCount)));
  const maxValue = Math.max(...values, 1);
  const points = values.map((value, index) => ({
    x: plot.left + (index / Math.max(values.length - 1, 1)) * (plot.right - plot.left),
    y: plot.bottom - (value / maxValue) * (plot.bottom - plot.top),
  }));
  const linePath = points.map(({ x, y }, index) => `${index ? "L" : "M"} ${x} ${y}`).join(" ");
  const areaPath = `${linePath} L ${plot.right} ${plot.bottom} L ${plot.left} ${plot.bottom} Z`;
  const gridValues = [maxValue, maxValue / 2, 0];
  const selectedPoint = activePoint === null ? null : points[activePoint];
  const tooltipX = selectedPoint ? Math.max(plot.left, Math.min(selectedPoint.x - 62, plot.right - 126)) : 0;
  const tooltipY = selectedPoint ? Math.max(plot.top, selectedPoint.y - 42) : 0;

  return <article className="panel insights-revenue-panel">
    <div className="panel-heading">
      <div><h2>Revenue over time</h2><p>Completed orders across the selected period.</p></div>
      <div className="analytics-filter" role="group" aria-label="Filter chart period">
        {([7, 30] as const).map((days) => <button
          key={days}
          type="button"
          className="analytics-filter-button"
          aria-pressed={range === days}
          onClick={() => onRangeChange(days)}
        >{days} days</button>)}
      </div>
    </div>
    <div className="revenue-chart-summary" aria-live="polite">
      <strong>{formatPrice(values.reduce((total, value) => total + value, 0))}</strong>
      <span>Revenue · last {range} days</span>
    </div>
    <div className="revenue-chart-wrap">
      <div className="revenue-chart-y-labels" aria-hidden="true">{gridValues.map((value, index) => <span key={index}>{formatCompactCurrency(value)}</span>)}</div>
      <svg className="revenue-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="group" aria-labelledby="revenue-chart-title revenue-chart-description" preserveAspectRatio="none">
        <title id="revenue-chart-title">Revenue over the last {range} days</title>
        <desc id="revenue-chart-description">{values.map((value, index) => `${labels[index]}: ${formatPrice(value)}`).join(". ")}</desc>
        {gridValues.map((_, index) => {
          const y = plot.top + (index / (gridValues.length - 1)) * (plot.bottom - plot.top);
          return <line key={index} x1={plot.left} x2={plot.right} y1={y} y2={y} className="revenue-chart-gridline" />;
        })}
        <path d={areaPath} className="revenue-chart-area" />
        <path d={linePath} className="revenue-chart-line" />
        {points.map(({ x, y }, index) => <circle
          key={`${range}-${index}`}
          cx={x}
          cy={y}
          r={activePoint === index ? "6" : "4"}
          className="revenue-chart-point"
          tabIndex={0}
          role="img"
          aria-label={`${labels[index]}: ${formatPrice(values[index])}`}
          onPointerEnter={() => setActivePoint(index)}
          onPointerLeave={() => setActivePoint(null)}
          onFocus={() => setActivePoint(index)}
          onBlur={() => setActivePoint(null)}
        >
          <title>{labels[index]}: {formatPrice(values[index])}</title>
        </circle>)}
        {selectedPoint && activePoint !== null && <g className="revenue-chart-tooltip" pointerEvents="none">
          <rect x={tooltipX} y={tooltipY} width="126" height="32" rx="4" />
          <text x={tooltipX + 8} y={tooltipY + 13}>{labels[activePoint]}</text>
          <text x={tooltipX + 8} y={tooltipY + 25}>{formatPrice(values[activePoint])}</text>
        </g>}
      </svg>
      <div className="revenue-chart-x-labels" aria-hidden="true">{labels.map((label, index) => <span key={`${range}-${index}`}>{label}</span>)}</div>
    </div>
  </article>;
}

function OrderStatusChart({ rows, periodEnd, range }: { rows: InsightOrder[]; periodEnd: Date; range: ChartRange }) {
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const periodStart = periodEnd.getTime() - range * 86_400_000;
  const counts = new Map<string, number>();
  for (const { status, createdAt } of rows) {
    const timestamp = new Date(createdAt).getTime();
    if (timestamp >= periodStart && timestamp <= periodEnd.getTime()) {
      counts.set(status, (counts.get(status) ?? 0) + 1);
    }
  }
  const segments = orderStatuses.flatMap((status) => {
    const count = counts.get(status) ?? 0;
    return count ? [{ status, count, color: statusColors[status] }] : [];
  });
  const total = segments.reduce((sum, segment) => sum + segment.count, 0);
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const segmentsWithOffsets = segments.map((segment, index) => ({
    ...segment,
    offset: segments.slice(0, index).reduce((sum, previous) => sum + (previous.count / total) * circumference, 0),
  }));
  const activeSegment = segments.find(({ status }) => status === activeStatus);

  return <article className="panel order-status-panel">
    <div className="panel-heading"><div><h2>Order status</h2><p>Orders received in the last {range} days.</p></div></div>
    {total ? <div className="order-status-content">
      <svg className="order-status-chart" viewBox="0 0 120 120" role="group" aria-label={`Order status breakdown for ${total} orders`}>
        <circle cx="60" cy="60" r={radius} className="order-status-track" />
        {segmentsWithOffsets.map(({ status, count, color, offset }) => {
          const length = (count / total) * circumference;
          return <circle
            key={status}
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="13"
            strokeDasharray={`${length} ${circumference - length}`}
            strokeDashoffset={-offset}
            className={`order-status-segment${activeStatus === status ? " is-active" : ""}`}
            tabIndex={0}
            role="img"
            aria-label={`${status}: ${count} orders`}
            onPointerEnter={() => setActiveStatus(status)}
            onPointerLeave={() => setActiveStatus(null)}
            onFocus={() => setActiveStatus(status)}
            onBlur={() => setActiveStatus(null)}
          >
            <title>{status}: {count}</title>
          </circle>;
        })}
        <text x="60" y="58" className="order-status-total">{activeSegment?.count ?? total}</text>
        <text x="60" y="73" className="order-status-caption">{activeSegment?.status ?? "orders"}</text>
      </svg>
      <ul className="order-status-legend">{segments.map(({ status, count, color }) => <li key={status} onMouseEnter={() => setActiveStatus(status)} onMouseLeave={() => setActiveStatus(null)}>
        <span className="order-status-key" style={{ backgroundColor: color }} />
        <span>{status[0].toUpperCase() + status.slice(1)}</span>
        <b>{count}</b>
      </li>)}</ul>
    </div> : <div className="dashboard-inline-empty">No orders recorded in this period yet.</div>}
  </article>;
}

export default function InsightsCharts({ rows, periodEnd: periodEndValue }: { rows: InsightOrder[]; periodEnd: string }) {
  const [range, setRange] = useState<ChartRange>(7);
  const periodEnd = new Date(periodEndValue);

  return <section className="dashboard-panels insights-revenue-grid" aria-label="Sales analytics charts">
    <RevenueChart rows={rows} periodEnd={periodEnd} range={range} onRangeChange={setRange} />
    <OrderStatusChart rows={rows} periodEnd={periodEnd} range={range} />
  </section>;
}
