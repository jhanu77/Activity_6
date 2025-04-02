import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ScatterPlotQuestion = () => {
  const svgRef = useRef();

  useEffect(() => {
    // Generate random dataset with categories
    const categories = ["A", "B", "C"];
    const dataset = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      category: categories[Math.floor(Math.random() * categories.length)],
    }));

    const width = 800;
    const height = 500;
    const margin = { top: 50, right: 50, bottom: 50, left: 70 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    // Scales
    const xScale = d3.scaleLinear().domain([0, 100]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([0, 100]).range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleOrdinal().domain(categories).range(["red", "blue", "green"]);

    const shapeScale = d3.scaleOrdinal().domain(categories).range([d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle]);

    const symbols = d3.symbol();

    // X-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("fill", "black")
      .style("font-size", "16px")
      .style("text-anchor", "middle")
      .text("X Values");

    // Y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -50)
      .attr("fill", "black")
      .style("font-size", "16px")
      .style("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Y Values");

    // Scatter plot points with different shapes
    svg
      .selectAll("path")
      .data(dataset)
      .enter()
      .append("path")
      .attr("d", (d) => symbols.type(shapeScale(d.category))())
      .attr("transform", (d) => `translate(${xScale(d.x)}, ${yScale(d.y)})`)
      .attr("fill", (d) => colorScale(d.category))
      .attr("stroke", "black");

    // Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("fill", "black")
      .text("Scatter Plot with Different Colors & Shapes");

    // Legend
    const legend = svg.append("g").attr("transform", `translate(${width - 150},${margin.top})`);

    categories.forEach((category, i) => {
      legend
        .append("path")
        .attr("d", symbols.type(shapeScale(category))())
        .attr("transform", `translate(10, ${i * 30})`)
        .attr("fill", colorScale(category))
        .attr("stroke", "black");

      legend
        .append("text")
        .attr("x", 30)
        .attr("y", i * 30 + 5)
        .attr("text-anchor", "start")
        .style("font-size", "14px")
        .text(category);
    });
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default ScatterPlotQuestion;
