import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const BubbleChartQuestion = () => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Load CSV file from the public folder
    d3.csv('/data/sample_bubble.csv').then((csvData) => {
      // Convert string values to numbers
      const parsedData = csvData.map(d => ({
        name: d.name,
        x: +d.x,
        y: +d.y,
        radius: +d.radius
      }));
      setData(parsedData);
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Select and clear SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.x) + 50])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y) + 50])
      .range([height, 0]);

    // Create and append the x axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Create and append the y axis
    svg.append('g')
      .call(d3.axisLeft(y));

    // Add x axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .text('X-Axis Label');

    // Add y axis label
    svg.append('text')
      .attr('x', -height / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Y-Axis Label');

    // Create the bubbles
    const bubbles = svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .attr('r', d => d.radius)
      .style('fill', 'steelblue')
      .style('opacity', 0.7);

    // Tooltip functionality
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background-color', 'black')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '5px')
      .style('opacity', 0);

    // Tooltip events
    bubbles.on('mouseover', function (event, d) {
      tooltip.transition().duration(200).style('opacity', 1);
      tooltip.html(`${d.name}: (${d.x}, ${d.y})`)
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 10}px`);
    })
    .on('mousemove', function (event) {
      tooltip.style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 10}px`);
    })
    .on('mouseout', function () {
      tooltip.transition().duration(200).style('opacity', 0);
    });

  }, [data]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BubbleChartQuestion;
