import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const StackedBarChart = ({ dataUrl }) => {
  const svgRef = useRef();
  const [data, setData] = useState(null);

  useEffect(() => {
    d3.csv(process.env.PUBLIC_URL + dataUrl).then((csvData) => {
      setData(csvData);
    });
  }, [dataUrl]);

  useEffect(() => {
    if (!data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = 960;
    const height = 500;
    const margin = { top: 50, right: 200, bottom: 77, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const percentageKeys = data.columns.slice(1);
    const genres = data.map((d) => d.genre);

    const stackedData = d3.stack().keys(percentageKeys)(data);

    const colorScale = ["#7fc97f", "#fdc086", "#386cb0", "#f0027f", "#666666"];
    const color = d3.scaleOrdinal().domain(percentageKeys).range(colorScale);

    const xScale = d3.scaleLinear().domain([0, 1]).range([0, innerWidth]);

    const yScale = d3.scaleBand().domain(genres).range([0, innerHeight]).padding(0.1);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // X-Axis
    const xAxis = d3.axisBottom(xScale).tickSize(-innerHeight);
    const xAxisG = g.append("g").call(xAxis).attr("transform", `translate(0,${innerHeight})`);
    xAxisG.select(".domain").remove();
    xAxisG.append("text")
      .attr("class", "axis-label")
      .attr("y", 65)
      .attr("x", innerWidth / 2)
      .attr("fill", "black")
      .text("Percentage");

    // Y-Axis
    g.append("g").call(d3.axisLeft(yScale)).selectAll(".domain, .tick line").remove();

    // Tooltip
    const tooltip = d3.select("body").append("div").attr("class", "toolTip").style("display", "none");

    // Bars
    g.append("g")
      .selectAll("g")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("fill", (d) => color(d.key))
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("y", (d) => yScale(d.data.genre))
      .attr("x", (d) => xScale(d[0]))
      .attr("width", (d) => xScale(d[1]) - xScale(d[0]))
      .attr("height", yScale.bandwidth())
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.5);
        tooltip.style("display", "inline-block");
      })
      .on("mousemove", function (event, d) {
        const movieType = d3.select(this.parentNode).datum().key;
        const percentCount = d.data[movieType];
        tooltip
          .style("left", event.pageX - 50 + "px")
          .style("top", event.pageY - 70 + "px")
          .html(`Rating ${movieType} percentage: ${d3.format(".2f")(percentCount * 100)}%`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        tooltip.style("display", "none");
      });

    // Title
    g.append("text").attr("class", "title").attr("y", -10).text("Rating according to genres");

    // Legend
    g.append("text")
      .attr("x", 670)
      .attr("y", 100)
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .text("Rating");

    g.selectAll("legend")
      .data(percentageKeys)
      .enter()
      .append("rect")
      .attr("x", 660)
      .attr("y", (d, i) => 110 + i * 26)
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", (d) => color(d));

    g.selectAll("legendLabels")
      .data(percentageKeys)
      .enter()
      .append("text")
      .attr("x", 700)
      .attr("y", (d, i) => 118 + i * 26)
      .style("fill", (d) => color(d))
      .text((d) => d)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold");
  }, [data]);

  return <svg ref={svgRef} width="960" height="500"></svg>;
};

export default StackedBarChart;
