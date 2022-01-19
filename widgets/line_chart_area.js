// import { formatDate } from "../utils/utils.js";

// set the dimensions and margins of the graph

import * as d3 from "https://cdn.skypack.dev/d3@6";

console.log(d3.csv)

// const margin = { top: 10, right: 30, bottom: 30, left: 60 },
//   width = 960 - margin.left - margin.right,
//   height = 900 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#line_chart_area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// svg.transition()
//   .duration(1000)

export const drawChart = (d) => {

  svg.selectAll("*").remove()

  //Read the data

  // return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }

  console.log(d)

  var data = d.sort((d1, d2) => {
    let date1 = formatDate(d1.From)
    let date2 = formatDate(d2.From)

    return date1 - date2
  })
    .map(({ From, Hours }) => {
      let date = formatDate(From)
      let value = Hours
      //console.log(date)

      return { date, value }
    })

  // Add X axis --> it is a date format
  const x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([0, width]);


  var xAxis = svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => +d.value)])
    .range([height, 0]);
  var yAxis = svg.append("g")
    .call(d3.axisLeft(y));

  // Add a clipPath: everything out of this area won't be drawn.
  const clip = svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);

  // Add brushing
  const brush = d3.brushX()                   // Add the brush feature using the d3.brush function
    .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

  // Create the area variable: where both the area and the brush take place
  const area = svg.append('g')
    .attr("clip-path", "url(#clip)")

  // Create an area generator
  const areaGenerator = d3.area()
    .x(d => x(d.date))
    .y0(y(0))
    .y1(d => y(d.value))

  // Add the area
  area.append("path")
    .datum(data)
    .attr("class", "myArea")  // I add the class myArea to be able to modify it later on.
    .attr("fill", "#69b3a2")
    .attr("fill-opacity", .3)
    .attr("stroke", "white")
    .attr("stroke-width", 1)
    .attr("d", areaGenerator)

  // Add the brushing
  area
    .append("g")
    .attr("class", "brush")
    .call(brush);

  // A function that set idleTimeOut to null
  let idleTimeout
  function idled() { idleTimeout = null; }

  // A function that update the chart for given boundaries
  function updateChart(event) {

    // What are the selected boundaries?
    var extent = event.selection

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if (!extent) {
      if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
      x.domain([4, 8])
    } else {
      x.domain([x.invert(extent[0]), x.invert(extent[1])])
      area.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      console.log([x.invert(extent[0]), x.invert(extent[1])])

      d3.select('.line_chart_area_title')
      .html(
          `Qualité du sommeil dans le temps entre le 
          ${x.invert(extent[0]).toLocaleDateString("fr-FR", { year: 'numeric', month: 'long', day: 'numeric' })} et le
          ${x.invert(extent[1]).toLocaleDateString("fr-FR", { year: 'numeric', month: 'long', day: 'numeric' })}`)

      // newData = data.filter(d => d.date >= x.invert(extent[0] && d.date <= x.invert(extent[1])))
      // rangeSlider.data(newData)

    }

    // Update axis and area position
    xAxis.transition().duration(1000).call(d3.axisBottom(x))
    area
      .select('.myArea')
      .transition()
      .duration(1000)
      .attr("d", areaGenerator)

    // console.log(xAxis)
    // console.log(x.domain)
    // console.log(diaf)
  }

  // If user double click, reinitialize the chart
  svg.on("dblclick", function () {
    x.domain(d3.extent(data, d => d.date))
    xAxis.transition().call(d3.axisBottom(x))
    area
      .select('.myArea')
      .transition()
      .attr("d", areaGenerator)
  });

  // text label for the x axis
  svg.append("text")
    .attr("transform",
      "translate(" + (width / 2) + " ," +
      (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .style("fill", "white")
    .text("Date");

  // Add the y Axis
  svg.append("g")
    .call(d3.axisLeft(y));

  // text label for the y axis
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", "white")
    .text("Temps de sommeil");

}

