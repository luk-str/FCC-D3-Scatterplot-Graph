fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((response) => response.json())
  .then(function (data) {
    // Define measurements
    const margin = { top: 30, right: 50, bottom: 30, left: 60 };
    const w = 1000 - margin.left - margin.right;
    const h = 600 - margin.top - margin.bottom;

    // Add main svg
    const svg = d3
      .select(".chart")
      .append("svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Declare scales
    const xScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.Year) - 1,
        d3.max(data, (d) => d.Year) + 1,
      ])
      .range([0, w]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.Seconds) - 10,
        d3.max(data, (d) => d.Seconds) + 10,
      ])
      .range([0, h]);

    // Add axes
    svg
      .append("g")
      .attr("transform", `translate(0, ${h})`)
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("transform", `translate(0, 0)`)
      .call(d3.axisLeft(yScale));

    // Add dots
    svg
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(d.Seconds))
      .attr("r", 10)
      .attr("fill", (d) => {
        return d.Doping === ""
          ? "rgba(0, 0, 255, 0.5)"
          : "rgba(250, 30, 120, 0.5)";
      });
  });
