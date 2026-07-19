import { useId } from "react";

const getChartPoints = (data, width, height, padding) => {
  const values = Array.isArray(data)
    ? data.map(Number).filter(Number.isFinite)
    : [];

  if (values.length < 2) {
    return [];
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;

  return values.map((value, index) => ({
    x: padding + (index / (values.length - 1)) * availableWidth,
    y: padding + ((max - value) / range) * availableHeight,
  }));
};

const smoothPath = (points) => {
  if (!points.length) return "";
  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const centerX = (previous.x + point.x) / 2;
    return `${path} C ${centerX} ${previous.y}, ${centerX} ${point.y}, ${point.x} ${point.y}`;
  }, "");
};

const CryptoChart = ({
  data,
  displacement = false,
  size = {},
  color,
  area = true,
  strokeWidth,
  className,
}) => {
  const rawId = useId();
  const gradientId = `chart-${rawId.replace(/:/g, "")}`;
  const width = Number(size.widthS) || 800;
  const height = Number(size.heightS) || 240;
  const points = getChartPoints(data, width, height, Math.max(height * 0.08, 8));
  const linePath = smoothPath(points);
  const chartColor = color || (displacement ? "#ff6685" : "#64fbd2");
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`
    : "";

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      width={size.widthT || "100%"}
      height={size.heightT || "100%"}
      preserveAspectRatio="none"
      role="img"
      aria-label="Price movement line chart"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={chartColor} stopOpacity="0.28" />
          <stop offset="1" stopColor={chartColor} stopOpacity="0" />
        </linearGradient>
        <filter id={`${gradientId}-glow`} x="-20%" y="-100%" width="140%" height="300%">
          <feGaussianBlur stdDeviation={height > 300 ? 4 : 2.5} result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {area && areaPath && <path d={areaPath} fill={`url(#${gradientId})`} />}
      {linePath && (
        <path
          d={linePath}
          fill="none"
          stroke={chartColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth || (height > 300 ? 3 : 2)}
          vectorEffect="non-scaling-stroke"
          filter={`url(#${gradientId}-glow)`}
        />
      )}
    </svg>
  );
};

export default CryptoChart;
