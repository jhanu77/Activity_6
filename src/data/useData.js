import React, { useState, useEffect } from "react";
import { csv } from "d3";

const csvUrl =
  "https://raw.githubusercontent.com/jhanu77/Activity6/refs/heads/main/Activity6_Population.csv"; // Update with your CSV URL

export const useData = (year) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const row = (d) => {
      d.Population = +d[year]; // Use the year parameter to filter population data
      return d;
    };
    csv(csvUrl, row).then((data) => {
      let countryCount = 10; // Default for 2000
      if (year === "2010") countryCount = 20;
      else if (year === "2020") countryCount = 30;
      setData(data.slice(0, countryCount)); // Load appropriate number of countries
    });
  }, [year]);

  return data;
};
