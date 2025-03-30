const margin = { top: 80, right: 60, bottom: 60, left: 100 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;
let allData = [];
let xVar1,
  yVar1,
  sizeVar1,
  xVar2,
  yVar2,
  sizeVar2,
  targetYear = 2017;

const options = [
  "average_value_Adjusted net enrollment rate, primary, female (% of primary school age children)",
  "average_value_Adjusted net enrollment rate, primary, male (% of primary school age children)",
  "average_value_Adolescent fertility rate (births per 1,000 women ages 15-19)",
  "average_value_Births attended by skilled health staff (% of total)",
  "average_value_Children out of school, primary, female",
  "average_value_Children out of school, primary, male",
  "average_value_Educational attainment, at least Bachelor's or equivalent, population 25+, female (%) (cumulative)",
  "average_value_Educational attainment, at least Bachelor's or equivalent, population 25+, male (%) (cumulative)",
  "average_value_Fertility rate, total (births per woman)",
  "average_value_Life expectancy at birth, female (years)",
  "average_value_Life expectancy at birth, male (years)",
  "average_value_Primary education, teachers (% female)",
  "average_value_School enrollment, secondary, female (% net)",
  "average_value_School enrollment, secondary, male (% net)",
  "average_value_School enrollment, tertiary, female (% gross)",
  "average_value_School enrollment, tertiary, male (% gross)",
];

// Set default x, y, and size variables for both graphs
xVar1 = options[0];
yVar1 = options[9];
sizeVar1 = options[4];
xVar2 = options[1];
yVar2 = options[10];
sizeVar2 = options[5];

const svg1 = d3
  .select("#vis1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const svg2 = d3
  .select("#vis2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

function init() {
  d3.csv("./data/gender.csv")
    .then((data) => {
      console.log("Loaded Data:", data);

      // Convert necessary fields to numbers
      data.forEach((d) => {
        options.forEach((attr) => {
          d[attr] = +d[attr] || 0;
        });
        d.Year = +d.Year;
      });

      allData = data.filter((d) => d.Year === targetYear);

      setupSelectors();
      updateAxes(svg1, xVar1, yVar1, sizeVar1);
      updateAxes(svg2, xVar2, yVar2, sizeVar2);
      updateVis(svg1, xVar1, yVar1, sizeVar1);
      updateVis(svg2, xVar2, yVar2, sizeVar2);
    })
    .catch((error) => {
      console.error("Error loading the CSV file:", error);
    });
}

window.addEventListener("load", init);

function setupSelectors() {
  d3.selectAll(".variable")
    .each(function () {
      d3.select(this)
        .selectAll("option")
        .data(options)
        .enter()
        .append("option")
        .text((d) => d)
        .attr("value", (d) => d);
    })
    .on("change", function (event) {
      const dropdownId = d3.select(this).property("id");
      const selectedValue = d3.select(this).property("value");

      if (dropdownId === "xVariable1") xVar1 = selectedValue;
      else if (dropdownId === "yVariable1") yVar1 = selectedValue;
      else if (dropdownId === "sizeVariable1") sizeVar1 = selectedValue;
      else if (dropdownId === "xVariable2") xVar2 = selectedValue;
      else if (dropdownId === "yVariable2") yVar2 = selectedValue;
      else if (dropdownId === "sizeVariable2") sizeVar2 = selectedValue;

      updateAxes(svg1, xVar1, yVar1, sizeVar1);
      updateAxes(svg2, xVar2, yVar2, sizeVar2);
      updateVis(svg1, xVar1, yVar1, sizeVar1);
      updateVis(svg2, xVar2, yVar2, sizeVar2);
    });
}

function updateAxes(svg, xVar, yVar, sizeVar) {
  svg.selectAll(".axis").remove();

  let xScale = d3
    .scaleLinear()
    .domain([d3.min(allData, (d) => d[xVar]), d3.max(allData, (d) => d[xVar])])
    .range([0, width]);

  let yScale = d3
    .scaleLinear()
    .domain([0, d3.max(allData, (d) => d[yVar])])
    .range([height, 0]);

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));
  svg.append("g").attr("class", "axis").call(d3.axisLeft(yScale));
}

function updateVis(svg, xVar, yVar, sizeVar) {
  let xScale = d3
    .scaleLinear()
    .domain([d3.min(allData, (d) => d[xVar]), d3.max(allData, (d) => d[xVar])])
    .range([0, width]);
  let yScale = d3
    .scaleLinear()
    .domain([0, d3.max(allData, (d) => d[yVar])])
    .range([height, 0]);
  let sizeScale = d3
    .scaleSqrt()
    .domain([0, d3.max(allData, (d) => d[sizeVar])])
    .range([5, 20]);

  let circles = svg.selectAll("circle").data(allData);
  circles
    .enter()
    .append("circle")
    .merge(circles)
    .transition()
    .duration(1000)
    .attr("cx", (d) => xScale(d[xVar]))
    .attr("cy", (d) => yScale(d[yVar]))
    .attr("r", (d) => sizeScale(d[sizeVar]))
    .style("fill", "steelblue")
    .style("opacity", 0.7);
  circles.exit().remove();
}

function addLegend() {
  let size = 10; // Size of the legend squares

  // Draw a set of rectangles using D3 for states
  svg
    .selectAll("stateSquare")
    .data(states) // Bind the data to the legend squares
    .enter()
    .append("rect") // Create a 'rect' element for each state
    .attr("class", "stateSquare") // Add a class for styling (optional)
    .attr("x", (d, i) => i * (size + 20) + 100) // Position the squares horizontally with spacing
    .attr("y", -margin.top / 2) // Position the squares vertically with respect to the margin
    .attr("width", size) // Set the width of each square
    .attr("height", size) // Set the height of each square
    .style("fill", "steelblue"); // Set a default color for the squares

  svg
    .selectAll("stateName")
    .data(states)
    .enter()
    .append("text")
    .attr("y", -margin.top / 2 + size) // Align vertically with the square
    .attr("x", (d, i) => i * (size + 20) + 120)
    .style("fill", "black") // Match text color to the square
    .text((d) => d) // The actual state name
    .attr("text-anchor", "left")
    .style("font-size", "10px");
}
