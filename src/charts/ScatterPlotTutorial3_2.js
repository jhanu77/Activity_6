import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const ScatterPlotTutorial3_2 = () => {
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

    const shapeScale = d3
      .scaleOrdinal()
      .domain(["setosa", "versicolor", "virginica"])
      .range([d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle]);

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

    // Scatter plot points with different shapes
    svg
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", (d) => symbols.type(shapeScale(d.species))())
      .attr("transform", (d) => `translate(${xScale(d.sepal_length)}, ${yScale(d.petal_length)})`)
      .attr("fill", "black")
      .attr("stroke", "black");

    // Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("fill", "red")
      .text("Scatter Plot for the Iris Dataset (Different Shapes)");

    // Legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 150},${margin.top})`);

    const species = ["setosa", "versicolor", "virginica"];
    const shapeTypes = [d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle];

    species.forEach((species, i) => {
      legend
        .append("path")
        .attr("d", symbols.type(shapeTypes[i])())
        .attr("transform", `translate(10, ${i * 30})`)
        .attr("fill", "black")
        .attr("stroke", "black");

      legend
        .append("text")
        .attr("x", 30)
        .attr("y", i * 30 + 5)
        .attr("text-anchor", "start")
        .style("font-size", "14px")
        .text(species);
    });
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default ScatterPlotTutorial3_2;
