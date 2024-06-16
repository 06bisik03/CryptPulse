import React, { useEffect, useRef } from "react";

const CryptoChart = ({ data, displacement, size }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && data) {
      const svg = svgRef.current;
      const minY = Math.min(...data);
      const maxY = Math.max(...data);
      const height = size.heightS;
      const totalWidth = size.widthS;
      const scaleX = totalWidth / (data.length - 1);
      const scaleY = height / (maxY - minY);

      const points = data
        .map((y, index) => `${index * scaleX},${height - (y - minY) * scaleY}`)
        .join(" ");

      const polyline = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
      );
      polyline.setAttribute("points", points);
      polyline.setAttribute("fill", "none");
      polyline.setAttribute(
        "stroke",
        `${
          displacement === true
            ? "red"
            : displacement === false
            ? "green"
            : "blue"
        }`
      );
      polyline.setAttribute("stroke-width", "8");
      svg.appendChild(polyline);
    }
  }, [data,displacement,size.heightS,size.widthS]);

  const widthT = size.widthT;
  const heightT = size.heightT;
  return (
    <div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${size.widthS} ${size.heightS}`}
        width={widthT}
        height={heightT}
      />
    </div>
  );
};

export default CryptoChart;
//This component is responsible for displaying the graph of the prices of the coin in the last 7 days in a plotless graph to provide better user experience.