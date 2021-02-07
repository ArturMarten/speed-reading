import React, { useRef, useEffect, useState, useMemo, Fragment } from 'react';
import { scaleLinear } from 'd3-scale';
import { bin, min, max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { format } from 'd3-format';

const margin = {
  top: 30,
  right: 5,
  bottom: 40,
  left: 40,
};

function Histogram({ width, height, fill, title, yLabel, xLabel, data, onSelect, ticks, translate }) {
  const yAxisRef = useRef();
  const xAxisRef = useRef();
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const [bins, setBins] = useState([]);
  const widthScale = useMemo(() => {
    if (data.length > 0) {
      return scaleLinear()
        .range([0, graphWidth])
        .domain([min(data, (d) => d.value) - 1, max(data, (d) => d.value) + 2]);
    } else {
      return scaleLinear().range([0, graphWidth]).domain([0, 0]);
    }
  }, [graphWidth, data]);
  const heightScale = useMemo(
    () =>
      scaleLinear()
        .range([0, graphHeight])
        .domain([max(bins, (d) => d.length), 0]),
    [graphHeight, bins],
  );

  useEffect(() => {
    const yAxisTicks = heightScale.ticks().filter(Number.isInteger);
    select(yAxisRef.current).call(axisLeft(heightScale).tickValues(yAxisTicks).tickFormat(format('d')));
    const xAxisTicks = widthScale.ticks(Math.min(ticks, 30)).filter(Number.isInteger);
    select(xAxisRef.current).call(axisBottom(widthScale).tickValues(xAxisTicks).tickFormat(format('d')));
  }, [heightScale, widthScale, ticks]);

  useEffect(() => {
    const histogram = bin()
      .value((d) => d.value)
      .domain(widthScale.domain())
      .thresholds(widthScale.ticks(ticks));
    let bins = [];
    if (data.length > 0) {
      bins = histogram(data);
    }
    setBins(bins);
  }, [data, widthScale, ticks]);

  return (
    <svg width={width} height={height}>
      <text y="15" fontWeight="bold">
        {title}
      </text>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g ref={yAxisRef} />
        <text transform="rotate(-90)" x={-graphHeight / 2} y="-30" textAnchor="middle">
          {yLabel}
        </text>
        <g ref={xAxisRef} transform={`translate(0, ${graphHeight})`} />
        <text x={width / 2} y={graphHeight + 35} textAnchor="middle">
          {xLabel}
        </text>
        {bins.length === 0 ? (
          <text
            x={margin.left + graphWidth / 2}
            y={margin.top + graphHeight / 2}
            dy="-.7em"
            textAnchor="middle"
            style={{ userSelect: 'none' }}
          >
            {translate('distribution.no-data')}
          </text>
        ) : null}
        {bins.map((d) => (
          <Fragment key={d.x0}>
            <rect
              fill="transparent"
              onClick={() => onSelect(d)}
              x={widthScale(d.x0) + 1}
              y={0}
              width={Math.max(widthScale(d.x1) - widthScale(d.x0) - 1, 0)}
              height={heightScale(d.length)}
            />
            <rect
              fill={typeof fill === 'function' ? fill(d) : fill || 'black'}
              onClick={() => onSelect(d)}
              x={widthScale(d.x0) + 1}
              y={heightScale(d.length)}
              width={Math.max(widthScale(d.x1) - widthScale(d.x0) - 1, 0)}
              height={graphHeight - heightScale(d.length)}
            />
          </Fragment>
        ))}
      </g>
    </svg>
  );
}

export default Histogram;
