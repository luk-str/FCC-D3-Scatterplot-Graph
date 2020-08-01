fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((response) => response.json())
  .then(function (data) {
    // Define measurements

    const margin = { top: 30, right: 50, bottom: 30, left: 60 };
    const w = 1000 - margin.left - margin.right;
    const h = 600 - margin.top - margin.bottom;
    const dotRadius = 10;
    const colorDoping = "rgba(250, 30, 120, 0.5)";
    const colorNotDoping = "rgba(0, 0, 255, 0.5)";

    // Add main svg

    const svg = d3
      .select(".chart")
      .append("svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add scales

    const parseYear = d3.timeParse("%Y");
    const timeFormat = d3.timeFormat("%M:%S");

    data.forEach((d) => {
      const parseTime = d.Time.split(":");
      d.Time = new Date(1970, 0, 1, 0, parseTime[0], parseTime[1]);
    });

    const xScale = d3
      .scaleTime()
      .domain([
        parseYear(d3.min(data, (d) => d.Year - 1)),
        parseYear(d3.max(data, (d) => d.Year + 1)),
      ])
      .range([0, w]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.Time))
      .range([0, h])
      .nice();

    // Add axes

    svg
      .append("g")
      .attr("transform", `translate(0, ${h})`)
      .attr("class", "axis")
      .attr("id", "x-axis")
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("transform", `translate(0, 0)`)
      .attr("class", "axis")
      .attr("id", "y-axis")
      .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S")));

    // Add dots

    svg
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(parseYear(d.Year)))
      .attr("cy", (d) => yScale(d.Time))
      .attr("r", dotRadius)
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => d.Time)
      .attr("fill", (d) => {
        return d.Doping === "" ? colorNotDoping : colorDoping;
      })

      // Add tooltip display functions

      .on("mouseover", function (d) {
        // Tooltip fade-in

        tooltip.transition().style("opacity", "1");

        // Dot zoom-in

        d3.select(this)
          .transition()
          .attr("r", dotRadius * 1.5);
      })
      .on("mouseout", function () {
        // Tooltip fade-out

        tooltip.style("opacity", "0");

        // Dot zoom-out

        d3.select(this).transition().duration(500).attr("r", dotRadius);
      })
      .on("mousemove", function (d) {
        // Tooltip position following mouse movement

        tooltip
          .style("left", d3.mouse(this)[0] + 80 + "px")
          .style("top", d3.mouse(this)[1] + 80 + "px")

          // Tooltip text

          .html(
            `Name: ${d.Name}<br>Country: ${
              d.Nationality
            }<br><br>Time: ${timeFormat(d.Time)}<br>Year: ${d.Year}${
              d.Doping !== "" ? `<br>Doping: ${d.Doping}` : ""
            }`
          );
      });

    // Add tooltip element

    const tooltip = d3
      .select(".chart")
      .append("g")
      .style("opacity", "0")
      .attr("id", "tooltip")
      .attr("class", "tooltip");

    // Add Legend element

    const legendWidth = 40;
    const legendHeight = 20;
    const legendData = [
      { color: colorDoping, text: "With doping" },
      { color: colorNotDoping, text: "Without doping" },
    ];

    const legend = svg.append("g").attr("class", "legend").attr("id", "legend");

    // Add legend colors

    legend
      .selectAll("rect")
      .data(legendData)
      .enter()
      .append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("x", w - margin.right - legendWidth - 50)
      .attr("y", (d, i) => 20 + i * 25)
      .attr("fill", (d) => d.color);

    // Add legend text labels

    legend
      .selectAll("text")
      .data(legendData)
      .enter()
      .append("text")
      .text((d) => d.text)
      .attr("x", w - margin.right - legendWidth)
      .attr("y", (d, i) => 20 + (i + 0.6) * 25);
  });
