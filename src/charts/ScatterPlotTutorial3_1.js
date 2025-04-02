import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const ScatterPlotTutorial3_1 = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv(process.env.PUBLIC_URL + "/data/iris.csv").then((data) => {
      data.forEach((d) => {
        d.sepal_length = +d.sepal_length;
        d.petal_length = +d.petal_length;
      });
      setData(data);
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 800;
    const height = 500;
    const margin = { top: 50, right: 50, bottom: 50, left: 70 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.sepal_length))
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.petal_length))
      .range([height - margin.bottom, margin.top]);

    const colorScale = d3
      .scaleOrdinal()
      .domain(["setosa", "versicolor", "virginica"])
      .range(["skyblue", "lightgreen", "orange"]);

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
      .text("Sepal Length");

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
      .text("Petal Length");

    // Scatter plot points
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.sepal_length))
      .attr("cy", (d) => yScale(d.petal_length))
      .attr("r", 5)
      .attr("fill", (d) => colorScale(d.species))
      .attr("opacity", 0.7);

    // Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("fill", "red")
      .text("Scatter Plot for the Iris Dataset");
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default ScatterPlotTutorial3_1;
