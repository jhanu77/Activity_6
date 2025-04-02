import React from 'react';
import { scaleBand, scaleLinear } from 'd3';
import { AxisBottom } from '../components/AxisBottom';
import { AxisLeft } from '../components/AxisLeft';
import { Marks } from '../components/Marks';
import { useData } from '../data/useData';

const width = 960;
const height = 500;
const margin = { top: 20, right: 30, bottom: 65, left: 220 };

const BarChart = ({ year }) => {
  const data = useData(year);
  if (!data) {
    return <pre>Loading...</pre>;
  }

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const yValue = (d) => d.Country;
  const xValue = (d) => d.Population;

  const xScale = scaleLinear()
    .domain([0, Math.max(...data.map(xValue))])
    .range([0, innerWidth]);

  const yScale = scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .paddingInner(0.1);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <AxisBottom
          xScale={xScale}
          innerHeight={innerHeight}
          tickFormat={(tickValue) => tickValue.toLocaleString()}
        />
        <AxisLeft yScale={yScale} />
        <Marks
          data={data}
          xScale={xScale}
          yScale={yScale}
          xValue={xValue}
          yValue={yValue}
          tooltipFormat={(x) => x.toLocaleString()}
        />
        <text
          className="axis-label"
          x={innerWidth / 2}
          y={innerHeight + 50}
          textAnchor="middle"
        >
          POPULATION – {year}
        </text>
      </g>
    </svg>
  );
};

export default BarChart;
