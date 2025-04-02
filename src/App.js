import React from "react";
import BarChart from "./charts/BarChart";
import StackedBarChart from "./charts/StackedBarChart";
import StackedBarChartQuestion from "./charts/StackedBarChartQuestion";
import ScatterPlotTutorial3_1 from "./charts/ScatterPlotTutorial3_1";
import ScatterPlotTutorial3_2 from "./charts/ScatterPlotTutorial3_2";
import ScatterPlotQuestion from "./charts/ScatterPlotQuestion";
import BubbleChart from "./charts/BubbleChart";
import BubbleChartQuestion from "./charts/BubbleChartQuestion";

const App = () => {
  return (
    <div>
      <h1>Data Visualization - Population Trends</h1>

      <div style={{ margin: "20px", textAlign: "center" }}>
        <h2>Top 30 Countries by Population in 2020</h2>
        <BarChart year="2020" />

        <h2>Top 10 Countries by Population in 2000</h2>
        <BarChart year="2000" />

        <h2>Top 20 Countries by Population in 2010</h2>
        <BarChart year="2010" />
      </div>
      <h1>IMDb Movie Ratings</h1>
      <StackedBarChart dataUrl="/data/data.csv" />
      <StackedBarChartQuestion />
      <ScatterPlotTutorial3_1 />
      <ScatterPlotTutorial3_2 />
      <ScatterPlotQuestion />
      <BubbleChart />
      <BubbleChartQuestion />
    </div>
  );
};

export default App;
