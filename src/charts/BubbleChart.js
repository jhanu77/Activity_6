import React, { useEffect } from "react";
import * as d3 from "d3";
import './BubbleChart.css'; // Add custom styles if needed

const BubbleChart = () => {
  useEffect(() => {
    // Set the dimensions and margins of the graph
    const bc_margin = { top: 50, right: 400, bottom: 45, left: 75 },
      bc_width = 945 - bc_margin.left - bc_margin.right,
      bc_height = 472 - bc_margin.top - bc_margin.bottom;

    // Append the svg object to the body of the page
    const bc_svg = d3
      .select("#bubble_chart")
      .append("svg")
      .attr("width", bc_width + bc_margin.left + bc_margin.right)
      .attr("height", bc_height + bc_margin.top + bc_margin.bottom)
      .append("g")
      .attr("transform", `translate(${bc_margin.left},${bc_margin.top})`);

    // Fetch the data
    d3.csv(process.env.PUBLIC_URL + "/data/bubblechart.csv").then((data) => {
      // Add chart title
      bc_svg
        .append("text")
        .attr("x", bc_width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .text("Correlation Between Torque, Horsepower, and MPG");

      // Add X axis
      const x = d3.scaleLinear().domain([100, 700]).range([0, bc_width]);
      bc_svg
        .append("g")
        .attr("transform", `translate(0, ${bc_height})`)
        .call(d3.axisBottom(x));

      // Add X axis label
      bc_svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", bc_width / 2)
        .attr("y", bc_height + 40)
        .text("Avg. Horsepower");

      // Add Y axis
      const y = d3.scaleLinear().domain([0, 800]).range([bc_height, 0]);
      bc_svg.append("g").call(d3.axisLeft(y));

      // Add Y axis label
      bc_svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", -bc_height / 2)
        .attr("y", -50)
        .text("Avg. Torque")
        .attr("transform", "rotate(-90)");

      // Add a scale for bubble size
      const z = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => +d.highway_mpg)])
        .range([1, 40]);

      // Add a scale for bubble color
      const makes = Array.from(data, (d) => d.make);
      const makeColors = makes.map((el, i, arr) =>
        d3.interpolateTurbo(i / arr.length)
      );
      const myColor = d3.scaleOrdinal().domain(makes).range(makeColors);

      // Tooltip creation
      const tooltip = d3
        .select("#bubble_chart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")
        .style("font-family", "sans-serif");

      // Tooltip functions
      const showTooltip = (event, d) => {
        tooltip.transition().duration(200);
        tooltip
          .style("opacity", 1)
          .html("Make: " + d.make)
          .style("left", event.x + 25 + "px")
          .style("top", event.y + 25 + "px");
      };
      const moveTooltip = (event, d) => {
        tooltip
          .style("left", event.x + 25 + "px")
          .style("top", event.y + 25 + "px");
      };
      const hideTooltip = (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0);
      };

      // Add the circles (bubbles)
      bc_svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("class", "bubbles")
        .attr("cx", (d) => x(d.horsepower))
        .attr("cy", (d) => y(d.torque))
        .attr("r", (d) => z(d.highway_mpg))
        .style("fill", (d) => myColor(d.make))
        .attr("stroke", "black")
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip);

      // Add legend for bubbles size (MPG)
      const valuesToShow = [20, 40];
      const xCircle = 745;
      const xLabel = 810;
      bc_svg
        .selectAll("legend")
        .data(valuesToShow)
        .join("circle")
        .attr("cx", xCircle)
        .attr("cy", (d) => bc_height - 100 - z(d))
        .attr("r", (d) => z(d))
        .style("fill", "none")
        .attr("stroke", "black");

      // Add legend lines and labels for MPG
      bc_svg
        .selectAll("legend")
        .data(valuesToShow)
        .join("line")
        .attr("x1", (d) => xCircle + z(d))
        .attr("x2", xLabel)
        .attr("y1", (d) => bc_height - 100 - z(d))
        .attr("y2", (d) => bc_height - 100 - z(d))
        .attr("stroke", "black")
        .style("stroke-dasharray", "2,2");

      // Labels for the legend
      bc_svg
        .selectAll("legend")
        .data(valuesToShow)
        .join("text")
        .attr("x", xLabel)
        .attr("y", (d) => bc_height - 100 - z(d))
        .text((d) => d)
        .style("font-size", "14px")
        .attr("alignment-baseline", "middle");

      // Add title for the legend
      bc_svg
        .append("text")
        .attr("x", xCircle)
        .attr("y", bc_height - 100 + 30)
        .text("Highway MPG")
        .attr("text-anchor", "middle");

      // Add legend items for car makes
      const size = 5;
      const allgroups = makes;
      bc_svg
        .selectAll("myrect")
        .data(allgroups)
        .join("circle")
        .attr("cx", 550)
        .attr("cy", (d, i) => 6 + i * (size + 7))
        .attr("r", 3)
        .style("fill", (d) => myColor(d));

      // Add labels beside the legend dots
      bc_svg
        .selectAll("mylabels")
        .data(allgroups)
        .enter()
        .append("text")
        .attr("x", 550 + size * 2)
        .attr("y", (d, i) => 10 + i * (size + 7))
        .style("fill", (d) => myColor(d))
        .text((d) => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "13px");
    });
  }, []);

  return <div id="bubble_chart"></div>;
};

export default BubbleChart;
