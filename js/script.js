const margin = { top: 80, right: 60, bottom: 60, left: 100 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;
let allData = [];
let targetYear = 2017;

const options = [
  { label: "Primary Enrollment (Female)", value: "average_value_Adjusted net enrollment rate, primary, female (% of primary school age children)" },
  { label: "Primary Enrollment (Male)", value: "average_value_Adjusted net enrollment rate, primary, male (% of primary school age children)" },
  { label: "Adolescent Fertility Rate", value: "average_value_Adolescent fertility rate (births per 1,000 women ages 15-19)" },
  { label: "Births Attended by Skilled Staff", value: "average_value_Births attended by skilled health staff (% of total)" },
  { label: "Children Out of School (Female)", value: "average_value_Children out of school, primary, female" },
  { label: "Children Out of School (Male)", value: "average_value_Children out of school, primary, male" },
  { label: "Bachelor's or Higher (Female)", value: "average_value_Educational attainment, at least Bachelor's or equivalent, population 25+, female (%) (cumulative)" },
  { label: "Bachelor's or Higher (Male)", value: "average_value_Educational attainment, at least Bachelor's or equivalent, population 25+, male (%) (cumulative)" },
  { label: "Fertility Rate", value: "average_value_Fertility rate, total (births per woman)" },
  { label: "Life Expectancy (Female)", value: "average_value_Life expectancy at birth, female (years)" },
  { label: "Life Expectancy (Male)", value: "average_value_Life expectancy at birth, male (years)" },
  { label: "Primary Teachers (% Female)", value: "average_value_Primary education, teachers (% female)" },
  { label: "Secondary Enrollment (Female)", value: "average_value_School enrollment, secondary, female (% net)" },
  { label: "Secondary Enrollment (Male)", value: "average_value_School enrollment, secondary, male (% net)" },
  { label: "Tertiary Enrollment (Female)", value: "average_value_School enrollment, tertiary, female (% gross)" },
  { label: "Tertiary Enrollment (Male)", value: "average_value_School enrollment, tertiary, male (% gross)" }
];

let xVar1 = options[0].value;
let yVar1 = options[9].value;
let sizeVar1 = options[4].value;
const svg1 = d3.select("#vis1").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

let xVar2 = options[1].value;
let yVar2 = options[10].value;
let sizeVar2 = options[5].value;
const svg2 = d3.select("#vis2").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);


function init() {
  d3.csv("./data/gender.csv").then(data => {
    data.forEach(d => d.Year = +d.Year);
    allData = data.filter(d => d.Year === targetYear);
    allData = data.filter(d =>
      d.Year === targetYear &&
      !["World", "Low and middle income", "Post-demographic dividend", "Late-demographic dividend","Pre Demographic Dividend", "Euro area", "Sub-Saharan Africa", "OECD members", "IDA & IBRD total", "IBRD only", "Upper middle income"]
        .includes(d["Country Name"])
    );
    
    parseSelectedVariables(allData, [xVar1, yVar1, sizeVar1, xVar2, yVar2, sizeVar2]);

    setupSelectors();
    updateVis1();
    updateVis2();
  });
}

function parseSelectedVariables(data, variables) {
  data.forEach(d => {
    variables.forEach(v => {
      d[v] = d[v] !== "" ? +d[v] : null;
    });
  });
}

function getLabel(value) {
  const found = options.find(opt => opt.value === value);
  return found ? found.label : value;
}

function updateVis1() {
  updateAxes(svg1, xVar1, yVar1);
  drawVis1(svg1);
}

function updateVis2() {
  updateAxes(svg2, xVar2, yVar2);
  drawVis2(svg2);
}

function updateAxes(svg, xVar, yVar) {
  svg.selectAll(".axis").remove();
  svg.selectAll(".axis-label").remove();

  const xScale = d3.scaleLinear()
    .domain([d3.min(allData, d => d[xVar]), d3.max(allData, d => d[xVar])])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(allData, d => d[yVar])])
    .range([height, 0]);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  svg.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(yScale));

  const xLabel = getLabelParts(xVar);
  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .html(null)
    .append("tspan")
    .text(xLabel.label)
    .append("tspan")
    .text(` ${xLabel.unit}`)
    .style("font-size", "10px")
    .style("font-style", "italic")
    .style("fill", "gray");

  const yLabel = getLabelParts(yVar);
  svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -60)
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .html(null)
    .append("tspan")
    .text(yLabel.label)
    .append("tspan")
    .text(` ${yLabel.unit}`)
    .style("font-size", "10px")
    .style("font-style", "italic")
    .style("fill", "gray");

}

// White Hat
function drawVis1(svg) {
  const xScale = d3.scaleLinear()
    .domain([d3.min(allData, d => d[xVar1]), d3.max(allData, d => d[xVar1])])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(allData, d => d[yVar1])])
    .range([height, 0]);

  const sizeScale = d3.scaleSqrt()
    .domain([0, d3.max(allData, d => d[sizeVar1])])
    .range([5, 20]);

  const validData = allData.filter(d =>
    d[xVar1] != null && d[yVar1] != null && d[sizeVar1] != null
  );

  const circles = svg.selectAll("circle").data(validData);

  circles.enter()
    .append("circle")
    .merge(circles)
    .transition()
    .duration(1000)
    .attr("cx", d => xScale(d[xVar1]))
    .attr("cy", d => yScale(d[yVar1]))
    .attr("r", d => sizeScale(d[sizeVar1]))
    .style("fill", "steelblue")
    .style("opacity", 0.7);

  circles.exit().remove();
}

function drawVis2(svg) {
  const tooltip = d3.select("#tooltip");

  const xScale = d3.scaleLinear()
    .domain([d3.min(allData, d => d[xVar2]), d3.max(allData, d => d[xVar2])])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(allData, d => d[yVar2])])
    .range([height, 0]);

  const sizeScale = d3.scaleSqrt()
    .domain([0, d3.max(allData, d => d[sizeVar2])])
    .range([5, 20]);

  const validData = allData.filter(d =>
    d[xVar2] != null && d[yVar2] != null && d[sizeVar2] != null
  );

  const circles = svg.selectAll("circle").data(validData);

  circles.enter()
    .append("circle")
    .merge(circles)
    .transition()
    .duration(1000)
    .attr("cx", d => xScale(d[xVar2]))
    .attr("cy", d => yScale(d[yVar2]))
    .attr("r", d => {
      const femaleEdu = d["average_value_Educational attainment, at least Bachelor's or equivalent, population 25+, female (%) (cumulative)"];
      const lifeExpectancy = d["average_value_Life expectancy at birth, female (years)"];
    
      if (femaleEdu < 10 && lifeExpectancy > 75) {
        return 7 + Math.random() * 10;
      } else {
        return 4 + Math.random();
      }
    })
    .style("fill", d => {
      const femaleEdu = d["average_value_Educational attainment, at least Bachelor's or equivalent, population 25+, female (%) (cumulative)"];
      const lifeExpectancy = d["average_value_Life expectancy at birth, female (years)"];
      
      if (femaleEdu < 10 && lifeExpectancy > 75) {
        return "#990000";
      } else {
        return "rgba(300, 20, 1, 0.2)";
      }
    })
    
    .style("opacity", 0.7);

  svg.selectAll("circle")
    .on("mouseover", function (event, d) {
      d3.select(this)
        .style("stroke", "black")
        .style("stroke-width", "2px");

      tooltip
        .style("display", "block")
        .html(`
          <strong>Country:</strong> ${d["Country Name"] || "Unknown"}<br>
          <strong>${getLabel(xVar2)}:</strong> ${d[xVar2]}<br>
          <strong>${getLabel(yVar2)}:</strong> ${d[yVar2]}<br>
        `)

        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function () {
      d3.select(this)
        .style("stroke", "none");

      tooltip.style("display", "none");
    });

  circles.exit().remove();
}

function setupSelectors() {
  d3.selectAll(".variable")
    .each(function () {
      const dropdown = d3.select(this);
      dropdown.selectAll("option")
        .data(options)
        .enter()
        .append("option")
        .text(d => d.label)
        .attr("value", d => d.value);
    });

  d3.select("#xVariable2").property("value", "average_value_Educational attainment, at least Bachelor's or equivalent, population 25+, female (%) (cumulative)");
  d3.select("#yVariable2").property("value", "average_value_Life expectancy at birth, female (years)");

  d3.select("#sizeVariable2").style("display", "none");

  d3.selectAll(".variable").on("change", function () {
    const dropdownId = d3.select(this).property("id");
    const selectedValue = d3.select(this).property("value");

    if (dropdownId === "xVariable") xVar1 = selectedValue;
    else if (dropdownId === "yVariable") yVar1 = selectedValue;
    else if (dropdownId === "sizeVariable") sizeVar1 = selectedValue;
    else if (dropdownId === "xVariable2") xVar2 = selectedValue;
    else if (dropdownId === "yVariable2") yVar2 = selectedValue;
    else if (dropdownId === "sizeVariable2") sizeVar2 = selectedValue;

    parseSelectedVariables(allData, [xVar1, yVar1, sizeVar1, xVar2, yVar2, sizeVar2]);
    updateVis1();
    updateVis2();
  });
}

function getLabel(value) {
  const found = options.find(opt => opt.value === value);
  if (!found) return value;

  const match = found.value.match(/\((.*?)\)$/);
  const unit = match ? ` [${match[1]}]` : "";

  return found.label + unit;
}

function getLabelParts(value) {
  const found = options.find(opt => opt.value === value);
  if (!found) return { label: value, unit: "" };

  const match = found.value.match(/\(([^)]+)\)$/);
  const unit = match ? `(${match[1]})` : "";
  return {
    label: found.label,
    unit: unit
  };
}

window.addEventListener("load", init);
