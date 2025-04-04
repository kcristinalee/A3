const margin = { top: 80, right: 100, bottom: 60, left: 100 };
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
const educationVars = [
  "average_value_Adjusted net enrollment rate, primary, female (% of primary school age children)",
  "average_value_School enrollment, secondary, female (% net)",
  "average_value_School enrollment, tertiary, female (% gross)"
];

let xVar1 = options[0].value;
let yVar1 = options[9].value;
let sizeVar1 = "average_value_Births attended by skilled health staff (% of total)";
const svg1 = d3.select("#vis1").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

let xVar2 = options[0].value;
let yVar2 = options[9].value;
let sizeVar2 = options[5].value;
const svg2 = d3.select("#vis2").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("background", "#fff")
  .style("padding", "5px")
  .style("border", "1px solid #ccc")
  .style("border-radius", "5px")
  .style("display", "none")
  .style("pointer-events", "none");

function init() {
  d3.csv("./data/gender.csv").then(data => {
    data.forEach(d => d.Year = +d.Year);
    allData = data.filter(d => d.Year === targetYear);
    allData = data.filter(d =>
      d.Year === targetYear &&
      !["World", "Low and middle income", "Post-demographic dividend", "Late-demographic dividend", "Pre Demographic Dividend", "Euro area", "Sub-Saharan Africa", "OECD members", "IDA & IBRD total", "IBRD only", "Upper middle income"]
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
  const fertilityMin = d3.min(allData, d => d["average_value_Fertility rate, total (births per woman)"]);
  const fertilityMax = d3.max(allData, d => d["average_value_Fertility rate, total (births per woman)"]);


  fertilityColor = d3.scaleSequential(d3.interpolatePlasma)
    .domain([fertilityMax, fertilityMin]);


  const xScale = d3.scaleLinear()
    .domain([d3.min(allData, d => d[xVar1]), d3.max(allData, d => d[xVar1])])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(allData, d => d[yVar1])])
    .range([height, 0]);

  const sizeScale = d3.scaleSqrt()
    .domain([d3.min(allData, d => d[sizeVar1]), d3.max(allData, d => d[sizeVar1])])
    .range([5, 20]);

  const circles = svg.selectAll("circle").data(allData);

  circles.enter()
    .append("circle")
    .merge(circles)
    .attr("cx", d => xScale(d[xVar1]))
    .attr("cy", d => yScale(d[yVar1]))
    .attr("r", d => sizeScale(d[sizeVar1]))
    .attr("fill", d => fertilityColor(d["average_value_Fertility rate, total (births per woman)"]))
    .attr("stroke", "#333")
    .attr("opacity", 0.7)
    .on("mouseover", (event, d) => {
      tooltip.style("display", "block")
        .html(`<strong>Country:</strong> ${d["Country Name"]}<br>
               <strong>${getLabel(xVar1)}:</strong> ${d[xVar1]}<br>
               <strong>${getLabel(yVar1)}:</strong> ${d[yVar1]}<br>
               <strong>Fertility Rate:</strong> ${d["average_value_Fertility rate, total (births per woman)"]}<br>
               <strong>${getLabel(sizeVar1)}:</strong> ${d[sizeVar1]}`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 20}px`);
    })
    .on("mousemove", event => {
      tooltip.style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 20}px`);
    })
    .on("mouseout", () => {
      tooltip.style("display", "none");
    });

  circles.exit().remove();

  const legendWidth = 20;
  const legendHeight = height;

  const legendScale = d3.scaleLinear()
    .domain([fertilityMin, fertilityMax])
    .range([legendHeight, 0]);

  const legendAxis = d3.axisRight(legendScale)
    .ticks(5)
    .tickFormat(d3.format(".1f"));

  const legend = svg1.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width + 40}, 0)`);

  legend.append("text")
    .attr("x", legendWidth / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Fertility Rate");

  const defs = svg1.append("defs");
  const linearGradient = defs.append("linearGradient")
    .attr("id", "legend-gradient")
    .attr("x1", "0%").attr("y1", "100%")
    .attr("x2", "0%").attr("y2", "0%");

  linearGradient.selectAll("stop")
    .data(d3.range(0, 1.1, 0.1))
    .join("stop")
    .attr("offset", d => `${d * 100}%`)
    .attr("stop-color", d => fertilityColor(fertilityMin + d * (fertilityMax - fertilityMin)));

  legend.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#legend-gradient)");

  legend.append("g")
    .attr("transform", `translate(${legendWidth}, 0)`)
    .call(legendAxis);

}

function getTopEducatedCountries(data, xVar, yVar, limit = 5) {
  const filtered = data.filter(d =>
    d[xVar] != null &&
    d[yVar] != null &&
    d[yVar] > 71 &&
    d[xVar] >= 50 && d[xVar] <= 85
  );

  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }

  return filtered.slice(0, limit).map(d => d["Country Name"] + d.Year);
}



// Black Hat
function drawVis2(svg) {
  svg.selectAll(".circles-group").remove();
  svg.selectAll(".legend2").remove();

  const circlesGroup = svg.append("g").attr("class", "circles-group");
  const legend2 = svg.append("g").attr("class", "legend2").attr("transform", `translate(${width - 250}, 300)`);

  const xScale = d3.scaleLinear()
    .domain([d3.min(allData, d => d[xVar2]), d3.max(allData, d => d[xVar2])])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(allData, d => d[yVar2])])
    .range([height, 0]);

  const sizeScale = d3.scaleSqrt()
    .domain([0, d3.max(allData, d => d[sizeVar2])])
    .range([5, 20]);

  const topCountries = getTopEducatedCountries(allData, xVar2, yVar2, 5);

  const validData = allData.filter(d => {
    const isHighEdu = d[xVar2] > 50;
    const isHighLife = d[yVar2] > 71;
    const isException = topCountries.includes(d["Country Name"] + d.Year);

    return (
      d[xVar2] != null &&
      d[yVar2] != null &&
      d[sizeVar2] != null &&
      (isException || !(isHighEdu && isHighLife))
    );
  });

  const circles = circlesGroup.selectAll("circle").data(validData);

  circles.exit().remove();

  circles.enter()
    .append("circle")
    .merge(circles)
    .attr("cx", d => xScale(d[xVar2]))
    .attr("cy", d => yScale(d[yVar2]))
    .attr("r", d => {
      const highEdu = d[xVar2] < 50;
      const highLifeExp = d[yVar2] > 70;

      return (highEdu && highLifeExp)
        ? 8 + Math.random() * 4
        : 4 + Math.random() * 1;
    })
    .style("fill", d => {
      const highEdu = d[xVar2] < 50;
      const highLifeExp = d[yVar2] > 70;

      return (highEdu && highLifeExp)
        ? "#990000"
        // : "rgba(300, 20, 1, 0.2)";
        : "#f7b6b6";
    })

    .style("opacity", 0.7)
    .style("stroke", "black")
    .style("stroke-width", "0.5px")
    .on("mouseover", (event, d) => {
      d3.select(event.currentTarget)
        .style("stroke", "black")
        .style("stroke-width", "3.5px");

      tooltip.style("display", "block")
        .html(`
          <strong>Country:</strong> ${d["Country Name"] || "Unknown"}<br>
          <strong>${getLabel(xVar2)}:</strong> ${d[xVar2]}<br>
          <strong>${getLabel(yVar2)}:</strong> ${d[yVar2]}<br>
        `)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 20}px`);
    })
    .on("mousemove", event => {
      tooltip.style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 20}px`);
    })
    .on("mouseout", event => {
      d3.select(event.currentTarget)
        .style("stroke", "black")
        .style("stroke-width", "0.5px");

      tooltip.style("display", "none");
    });

  legend2.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("font-weight", "bold")
    .style("font-size", "13px")

  legend2.append("circle")
    .attr("cx", 10)
    .attr("cy", 20)
    .attr("r", 10)
    .attr("fill", "#990000")
    .style("opacity", 0.8)
    .style("stroke", "black")
    .style("stroke-width", "0.5px");

  legend2.append("text")
    .attr("x", 25)
    .attr("y", 25)
    .style("font-size", "11px")
    // .text("High life expectancy, low female education countries");
    .text("⬆︎ Life Expectancy, ⬇︎ Female Education Countries");

  legend2.append("circle")
    .attr("cx", 10)
    .attr("cy", 50)
    .attr("r", 5)
    .attr("fill", "#f7b6b6")
    .style("stroke", "black")
    .style("stroke-width", "0.5px");

  legend2.append("text")
    .attr("x", 25)
    .attr("y", 55)
    .style("font-size", "11px")
    .text("All Other Countries");

  legend2.append("text")
    .attr("x", 0)
    .attr("y", 90)
    .style("font-size", "11px")
    .style("font-style", "italic")
    .style("fill", "#444")

  legend2.append("text")
    .attr("x", 0)
    .attr("y", 105)
    .style("font-size", "11px")
    .style("font-style", "italic")
    .style("fill", "#444")

}

function setupSelectors() {
  d3.selectAll(".variable").each(function () {
    const dropdown = d3.select(this);
    const dropdownId = dropdown.attr("id");

    let filteredOptions = options;

    if (dropdownId === "xVariable") {
      filteredOptions = options.filter(opt => ![
        "Adolescent Fertility Rate",
        "Births Attended by Skilled Staff",
        "Fertility Rate", "Life Expectancy (Female)",
        "Life Expectancy (Male)",
        "Primary Teachers (% Female)"
      ].includes(opt.label));
    }
    else if (dropdownId === "yVariable") {
      filteredOptions = options.filter(opt => ![
        "Primary Enrollment (Female)",
        "Primary Enrollment (Male)",
        "Adolescent Fertility Rate",
        "Births Attended by Skilled Staff",
        "Children Out of School (Female)",
        "Children Out of School (Male)",
        "Bachelor's or Higher (Female)",
        "Bachelor's or Higher (Male)",
        "Fertility Rate",
        "Primary Teachers (% Female)",
        "Secondary Enrollment (Female)",
        "Secondary Enrollment (Male)",
        "Tertiary Enrollment (Female)",
        "Tertiary Enrollment (Male)"
      ].includes(opt.label));
    }
    else if (dropdownId === "xVariable2") {
      filteredOptions = options.filter(opt =>
        opt.label.includes("Female") &&
        (
          opt.label.includes("Enrollment") ||
          opt.label.includes("Educational attainment")
        )
      );
    }
    else if (dropdownId === "yVariable2") {
      filteredOptions = options.filter(opt =>
        opt.label === "Life Expectancy (Female)"
      );
    }

    d3.select("#yVariable2")
      .property("value", "average_value_Life expectancy at birth, female (years)")
      .attr("disabled", true);

    d3.select("#xVariable2")
      .property("value", "average_value_Adjusted net enrollment rate, primary, female (% of primary school age children)")
      .dispatch("change");
    dropdown.selectAll("option").remove();

    dropdown
      .append("option")
      .attr("disabled", true)
      .attr("selected", true)
      .text("-- Select a Variable --");

    dropdown.selectAll("option.option-item")
      .data(filteredOptions)
      .enter()
      .append("option")
      .attr("class", "option-item")
      .text(d => d.label)
      .attr("value", d => d.value);
  });

  d3.select("#yVariable2")
    .property("value", "average_value_Life expectancy at birth, female (years)")
    .attr("disabled", true);

  d3.select("#xVariable2")
    .property("value", "average_value_Adjusted net enrollment rate, primary, female (% of primary school age children)");

  d3.selectAll(".variable").on("change", function () {
    const dropdownId = d3.select(this).property("id");
    const selectedValue = d3.select(this).property("value");

    if (dropdownId === "xVariable") {
      xVar1 = selectedValue;
    } else if (dropdownId === "yVariable") {
      yVar1 = selectedValue;
    } else if (dropdownId === "xVariable2") {
      xVar2 = selectedValue;
    }

    parseSelectedVariables(allData, [xVar1, yVar1, sizeVar1, xVar2, yVar2, sizeVar2]);

    if (dropdownId === "xVariable" || dropdownId === "yVariable") {
      updateVis1();
    } else if (dropdownId === "xVariable2") {
      updateVis2();
    }
  });
  xVar2 = d3.select("#xVariable2").property("value");
  parseSelectedVariables(allData, [xVar1, yVar1, sizeVar1, xVar2, yVar2, sizeVar2]);
  parseSelectedVariables(allData, educationVars);
  updateVis2();
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