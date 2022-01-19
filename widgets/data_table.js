import * as d3 from "https://cdn.skypack.dev/d3@6";
import { drawChart } from "./line_chart_area";

d3.csv("https://raw.githubusercontent.com/gningdevelopper/ProjetSleepdataviz/main/data/clean_sleep_data.csv")
    .then(data => {
        d3.select("#data-table").on("click", (e) => {
            console.log(e)
            d3.selectAll(".hovered-line").classed("hovered-line", false)
            d3.select(e.target.parentElement).classed("hovered-line", d3.select(e.target.parentElement).classed("hovered-line") ? false : true)
            console.log(d3.timeParse("%d/%m/%Y")(e.target.parentElement.children[0].innerText))
            console.log(d3.timeParse("%d/%m/%Y")(e.target.parentElement.children[1].innerText))

            let startDate = d3.timeParse("%d/%m/%Y")(e.target.parentElement.children[0].innerText)
            let endDate = d3.timeParse("%d/%m/%Y")(e.target.parentElement.children[1].innerText)

            let newData = data.filter(d => formatDate(d.From) >= startDate && formatDate(d.From) <= endDate)

            drawChart(newData)

        })
    })

