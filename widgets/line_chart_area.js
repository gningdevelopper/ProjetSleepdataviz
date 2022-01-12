// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 960 - margin.left - margin.right,
  height = 900 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#line_chart_area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// d3.csv("/data/clean_sleep_data.csv", d => {
//   let date = d.From.replaceAll(".", "").split(" ")
//   date = new Date(date[2], date[1], date[0], date[3].split(":")[0], date[3].split(":")[1])
//   let value = d.Hours
//   console.log(date)

//   // console.log(d3.timeParse("%d %m %Y %h:%mm")(d.date))

// })

//Read the data
// d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",
d3.csv("https://raw.githubusercontent.com/gningdevelopper/ProjetSleepdataviz/main/data/clean_sleep_data.csv",

  // When reading the csv, I must format variables:
  d => {
    // console.log(d3.timeParse("%Y-%m-%d")(d.date))

    let date = d.From.replaceAll(".", "").split(" ")
    date = new Date(date[2], date[1], date[0], date[3].split(":")[0], date[3].split(":")[1])
    let value = d.Hours
    //console.log(date)

    return { date, value }
    // return { date: d3.timeParse("%Y-%m-%d")(d.date), value: d.value }
  }).then(

    // Now I can use this dataset:
    function (data) {

      // Add X axis --> it is a date format
      const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);
      xAxis = svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      // Add Y axis
      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.value)])
        .range([height, 0]);
      yAxis = svg.append("g")
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
        extent = event.selection

        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if (!extent) {
          if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
          x.domain([4, 8])
        } else {
          x.domain([x.invert(extent[0]), x.invert(extent[1])])
          area.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        }

        // Update axis and area position
        xAxis.transition().duration(1000).call(d3.axisBottom(x))
        area
          .select('.myArea')
          .transition()
          .duration(1000)
          .attr("d", areaGenerator)
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

    })
