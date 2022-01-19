import * as d3 from "https://cdn.skypack.dev/d3@6";
import { drawChart } from "./line_chart_area.js";

const tbody = d3.select("tbody");

console.log(tbody.html())

d3.dsv(
    ";",
    "https://raw.githubusercontent.com/gningdevelopper/ProjetSleepdataviz/main/data/Events.csv",
    data => {
        tbody.html(
            `
            ${tbody.html()}
            <tr>
                <td>${data.DateDebut}</td>
                <td>${data.DateFin}</td>
                <td>${data.Titre}</td>
                <td>${data.Categorie}</td>
            </tr>
            `
        )
    }
)


d3.select("#data-table").on("click", (e) => {
    console.log(e)

    d3.selectAll(".hovered-line").classed("hovered-line", false)
    d3.select(e.target.parentElement).classed("hovered-line", d3.select(e.target.parentElement).classed("hovered-line") ? false : true)

    let startDate = d3.timeParse("%d/%m/%Y")(e.target.parentElement.children[0].innerText)
    let endDate = d3.timeParse("%d/%m/%Y")(e.target.parentElement.children[1].innerText)

    d3.select('.line_chart_area_title')
        .html(
            `Qualité du sommeil dans le temps pendant
                    ${e.target.parentElement.children[2].innerText}
                    (du ${startDate.toLocaleDateString("fr-FR", { year: 'numeric', month: 'long', day: 'numeric' })} au
                    ${endDate.toLocaleDateString("fr-FR", { year: 'numeric', month: 'long', day: 'numeric' })})`)


    let newData = initialData.filter(d => formatDate(d.From) >= startDate && formatDate(d.From) <= endDate)

    drawChart(newData)
})

