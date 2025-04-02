// src/StackedBarChart.js

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const StackedBarChartQuestion = () => {
  const svgRef = useRef();

  useEffect(() => {
    d3.csv("/data/sales_data.csv").then((data) => {
      data.forEach((d) => {
        d.productA = +d.productA;
        d.productB = +d.productB;
        d.productC = +d.productC;
        d.productD = +d.productD;
      });

      const margin = { top: 40, right: 150, bottom: 80, left: 120 };
      const width = 960 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      const svg = d3
        .select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const stack = d3
        .stack()
        .keys(["productA", "productB", "productC", "productD"]);
      const stackedData = stack(data);

      const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d.month))
        .range([0, width])
        .padding(0.1);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(stackedData[stackedData.length - 1], (d) => d[1])])
        .nice()
        .range([height, 0]);

      const color = d3
        .scaleOrdinal()
        .domain(["productA", "productB", "productC", "productD"])
        .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]);

      // Create X axis
      svg
        .append("g")
        .selectAll(".month")
        .data(data)
        .enter()
        .append("text")
        .attr("x", (d) => xScale(d.month) + xScale.bandwidth() / 2)
        .attr("y", height + 20)
        .attr("text-anchor", "middle")
        .text((d) => d.month)
        .style("font-size", "12px");

      // Create Y axis
      svg
        .append("g")
        .call(d3.axisLeft(yScale).ticks(5))
        .selectAll(".domain")
        .remove();

      // Add bars to the chart
      svg
        .selectAll(".layer")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("class", "layer")
        .attr("fill", (d) => color(d.key))
        .selectAll("rect")
        .data((d) => d)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.data.month))
        .attr("y", (d) => yScale(d[1]))
        .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .on("mouseover", function () {
          d3.select(this).style("opacity", 0.7);
        })
        .on("mouseout", function () {
          d3.select(this).style("opacity", 1);
        });

      // Add legend
      const legend = svg
        .append("g")
        .attr("transform", `translate(${width + 20}, 20)`);

      legend
        .selectAll(".legend")
        .data(color.domain())
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 25)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", color);

      legend
        .selectAll(".legend")
        .data(color.domain())
        .enter()
        .append("text")
        .attr("x", 30)
        .attr("y", (d, i) => i * 25 + 15)
        .style("fill", color)
        .style("font-size", "12px")
        .text((d) => d);
    });
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default StackedBarChartQuestion;
