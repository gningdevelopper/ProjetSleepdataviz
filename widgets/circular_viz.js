var radius = Math.min(width, height) / 1.9,
    spacing = .09;

var color = d3.scaleLinear()
    .range(["hsl(-180,60%,50%)", "hsl(180,60%,50%)"])
    .interpolate(function(a, b) { var i = d3.interpolateString(a, b); return function(t) { return d3.hsl(i(t)); }; });

var arcBody = d3.arc()
    .startAngle(0)
    .endAngle(function(d) { return d.value * 2 * Math.PI; })
    .innerRadius(function(d) { return d.index * radius; })
    .outerRadius(function(d) { return (d.index + spacing) * radius; })
    .cornerRadius(6);

var arcCenter = d3.arc()
    .startAngle(0)
    .endAngle(function(d) { return d.value * 2 * Math.PI; })
    .innerRadius(function(d) { return (d.index + spacing / 2) * radius; })
    .outerRadius(function(d) { return (d.index + spacing / 2) * radius; });

var svg1 = d3.select("#circular_viz").append("svg")
    .attr("width", width)
    .attr("height", height)
.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

fields()

d3.select(self.frameElement).style("height", height + "px");

function fieldTransition() {
var field = d3.select(this).transition();

field.select(".arc-body")
    .attrTween("d", arcTween(arcBody))
    .style("fill", function(d) { return color(d.value); });

field.select(".arc-center")
    .attrTween("d", arcTween(arcCenter));

field.select(".arc-text")
    .text(function(d) { return d.text; });
}

function arcTween(arc) {
return function(d) {
    var i = d3.interpolateNumber(d.previousValue, d.value);
    return function(t) {
    d.value = i(t);
    return arc(d);
    };
};
}

function convertDate(datestring){
    dateiso=datestring.replaceAll(". ","-")

    dateiso=dateiso.replace(" ","T")
    date1=dateiso.split('T')[0]

    date1=dateiso.split('T')[0]
    heure=dateiso.split('T')[1]
    if (heure.split(":")[0].length==1){
        heure="0"+heure
    }
    var newdate = date1.split("-").reverse().join("-");
    var dateconvert=newdate + "T"+ heure + ":00"

    const dat = new Date(dateconvert);

    return dat;

}

function getMonth(month){
    switch (month){
        case 1: return "Janvier"
        case 2: return "Février"
        case 3: return "Mars"
        case 4: return "Avril"
        case 5: return "Mai"
        case 6: return "Juin"
        case 7: return "Juillet"
        case 8: return "Aout"
        case 9: return "Septembre"
        case 10: return "Octobre"
        case 11: return "Novembre"
        case 12: return "Decembre"
    }
}

function getWeekNumber(date){
    var oneJan = new Date(date.getFullYear(),0,1);
    var numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
    var result = Math.ceil(( date.getDay() + 1 + numberOfDays) / 7);

    return result
}

function getDureeSommeil(debut, fin){
    var difference = fin.getTime()-debut.getTime();
    heure=1000*60*60
    duree=difference/heure
    return duree
}

function getNbSleepByWeek(data,year){
    var weekHours={}
    weeksReturn=[]
    var cleanData = data.filter((d) => convertDate(d.From).getFullYear() == year);
    for (var i = 0; i < cleanData.length; i++) {
        date=convertDate(cleanData[i].From)

        var oneJan = new Date(date.getFullYear(),0,1);
        var numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
        week=Math.ceil(( date.getDay() + 1 + numberOfDays) / 7);
        duree=getDureeSommeil(convertDate(cleanData[i].From), convertDate(cleanData[i].To))

        if(weekHours[week]!=undefined){
            weekHours[week] = weekHours[week] + duree
        }else{
            weekHours[week] = duree
        }
    }

    let index=.1
    for (const [key, valeur] of Object.entries(weekHours)) {
        weeksReturn.push({index: index, text: "semaine "+ key,  value: valeur/168})
        index=index+.1
    }

    var frontiere=(weeksReturn.length + 1) * .1
    weeksReturn.push({index: frontiere, text: "",  value: 1})

    return weeksReturn;
}

function getQuarter(d) {
    d = d || new Date();
    var m = Math.floor(d.getMonth()/3) + 2;
    return m > 4? m - 4 : m;
}

function getNbSleepByMonth(data,year){
    var monthHours={}
    monthReturn=[]
    var cleanData = data.filter((d) => convertDate(d.From).getFullYear() == year);
    for (var i = 0; i < cleanData.length; i++) {
        date=convertDate(cleanData[i].From)

        month=date.getMonth()
        duree=getDureeSommeil(convertDate(cleanData[i].From), convertDate(cleanData[i].To))

        if(monthHours[month]!=undefined){
            monthHours[month] = monthHours[month] + duree
        }else{
            monthHours[month] = duree
        }
    }

    let index=.1
    for (const [key, valeur] of Object.entries(monthHours)) {
        monthReturn.push({index: index, text:  getMonth(parseInt(key) + 1) ,  value: valeur/720})
        index=index+.1
    }

    var frontiere=(monthReturn.length + 1) * .1
    monthReturn.push({index: frontiere, text: "",  value: 1})

    return monthReturn;
}

function getNbSleepByTrimester(data,year){
    var trimesterHours={}
    trimesterReturn=[]
    var cleanData = data.filter((d) => convertDate(d.From).getFullYear() == year);
    for (var i = 0; i < cleanData.length; i++) {
        date=convertDate(cleanData[i].From)
        trimester=getQuarter(date);
        duree=getDureeSommeil(convertDate(cleanData[i].From), convertDate(cleanData[i].To))

        if(trimesterHours[trimester]!=undefined){
            trimesterHours[trimester] = trimesterHours[trimester] + duree
        }else{
            trimesterHours[trimester] = duree
        }
    }

    let index=.1
    for (const [key, valeur] of Object.entries(trimesterHours)) {
        trimesterReturn.push({index: index, text: " trimestre:  "+ key,  value: valeur/2700})
        index=index+.1
    }
    var frontiere=(trimesterReturn.length + 1) * .1
    trimesterReturn.push({index: frontiere, text: "",  value: 1})
    return trimesterReturn;

}

d3.select("#mySelect").on("change", function() {
    fields(this.value)
});

function fields() {
    //console.log(year, period)
    weeksReturn=[]
    d3.csv("https://raw.githubusercontent.com/gningdevelopper/ProjetSleepdataviz/main/data/clean_sleep_data.csv").then(function(data) {
        weeksReturn=getNbSleepByTrimester(data, "2019");

        for (i=0; i<weeksReturn.length; i++) {
            var field = svg1.selectAll("g")
                .data(weeksReturn)
            .enter().append("g");

            field.append("path")
                .attr("class", "arc-body");

            field.append("path")
                .attr("id", function(d, i) { return "arc-center-" + i; })
                .attr("class", "arc-center");

            field.append("text")
                .attr("dy", ".25em")
                .attr("dx", ".55em")
                .style("text-anchor", "start")
            .append("textPath")
                .attr("startOffset", "50%")
                .attr("class", "arc-text")
                .attr("xlink:href", function(d, i) { return "#arc-center-" + i; });

            tick()
        }

        function tick() {
            if (!document.hidden) field
            .each(function(d) { 
                //console.log(d); 
                this._value = d.value; })
            .data(weeksReturn)
            .each(function(d) { d.previousValue = this._value; })
            .transition()
            .ease(d3.easeElastic)
            .duration(500)
            .each(fieldTransition);

        }

        function update(year, period) {
            weeksReturn=[]
            if (period==="trimester"){
                radius = Math.min(width, height) / 1.9
                arcCenter
                .innerRadius(function(d) { return (d.index + spacing / 2) * radius; })
                .outerRadius(function(d) { return (d.index + spacing / 2) * radius; });
                weeksReturn=getNbSleepByTrimester(data, year);

            }else if (period=="month"){
                radius = Math.min(width, height) / 6
                arcCenter
                .innerRadius(function(d) { return (d.index + spacing / 2) * radius; })
                .outerRadius(function(d) { return (d.index + spacing / 2) * radius; });
                weeksReturn=getNbSleepByMonth(data, year)
            }else{
                radius = Math.min(width, height) / 11
                arcCenter
                .innerRadius(function(d) { return (d.index + spacing / 2) * radius; })
                .outerRadius(function(d) { return (d.index + spacing / 2) * radius; });
                weeksReturn=getNbSleepByWeek(data, year)
            }
            svg1.selectAll("g").remove();
                field = svg1.selectAll("g")
                    .remove()
                    .data(weeksReturn)
                    .enter().append("g");
                field.append("path")
                    .attr("class", "arc-body");

                field.append("path")
                    .attr("id", function(d, i) { return "arc-center-" + i; })
                    .attr("class", "arc-center");
                field.append("text")
                    .attr("dy", ".25em")
                    .attr("dx", ".55em")
                    .style("text-anchor", "start")
                .append("textPath")
                    .attr("startOffset", "50%")
                    .attr("class", "arc-text")
                    .attr("xlink:href", function(d, i) { return "#arc-center-" + i; });

            tick()
        }

        d3.select("#year").on("change", function() {
            period=d3.select("#period").property("value")
            update(this.value,period)
        });

        d3.select("#period").on("change", function() {
            year=d3.select("#year").property("value")
            update(year,this.value)
        });
    })
}
