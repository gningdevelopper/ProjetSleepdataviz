import { RangeSlider } from '../utils/data-driven-range-slider.js';
import * as d3 from "https://cdn.skypack.dev/d3@5";

import { drawChart } from "./line_chart_area.js";

console.log(d3.version)

d3.csv("https://raw.githubusercontent.com/gningdevelopper/ProjetSleepdataviz/main/data/clean_sleep_data.csv").then(data => {

    drawChart(data);

    rangeSlider = new RangeSlider()
        .container("#range-slider")
        .data(data)
        .accessor(d => {
            let date = d.From.replaceAll(".", "").split(" ")
            date = new Date(date[2], date[1], date[0], date[3].split(":")[0], date[3].split(":")[1])
            return date
        })
        // .aggregator(group => group.values.length)
        .onBrush(d => {
            d3.select('.line_chart_area_title')
                .html(
                    `Qualité du sommeil dans le temps entre le 
                    ${d.range[0].toLocaleDateString("fr-FR", { year: 'numeric', month: 'long', day: 'numeric' })} et le
                    ${d.range[1].toLocaleDateString("fr-FR", { year: 'numeric', month: 'long', day: 'numeric' })}`)
            console.log(d)

            drawChart(d.data)

            console.log(rangeSlider.getChartState())
        })
        .svgWidth(900)
        .svgHeight(100)

    rangeSlider.render()

    // console.log(newData)
})