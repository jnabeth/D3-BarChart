document.addEventListener('DOMContentLoaded',function(){
    req=new XMLHttpRequest();
    req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',true);
    req.send();
    req.onload=function(){
      json=JSON.parse(req.responseText);
      rawDataset = json.data;

      dataset = rawDataset.map(d => [d[0], d[1]]);

      var parseDate = d3.timeFormat("%Y-%m");
      var formatCurrency = d3.format("$,");

      const minX = d3.min(dataset, (d) => d[0]);
      const maxX = d3.max(dataset, (d) => d[0]);
      const minY = d3.min(dataset, (d) => d[1]);
      const maxY = d3.max(dataset, (d) => d[1]);
      var margin = {top: 30, right: 20, bottom: 20, left: 100},
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

      const xScale = d3.scaleBand()
                       .range([0, width])
                       .domain(dataset.map((d)=> d[0]))
                       .padding(0.1)


      const yScale = d3.scaleLinear()
                       .domain([minY, maxY])
                       .range([height, 0]);

      const xAxis = d3.axisBottom(xScale)
                      .tickValues(xScale.domain().filter(function(d,i){ return !(i%40)}))
                      .tickFormat(d => d.substring(0,4))

      const yAxis = d3.axisLeft(yScale)

      var parseDate2 = d3.timeParse("%Y");

      var div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .attr("id", "tooltip")
          .style("opacity", 0);

      const svg = d3.select("body")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                          "translate(" + margin.left + "," + margin.top + ")");

      svg.selectAll("rect")
         .data(dataset)
         .enter()
         .append("rect")
         .attr("data-date", (d,i)=>d[0])
         .attr("data-gdp", (d,i)=>d[1])
         .attr("x", (d,i) =>  xScale(d[0]))
         .attr("y", (d,i) => yScale(d[1]))
         .attr("width", xScale.bandwidth()+1)
         .attr("height", (d,i) => height-yScale(d[1]))
         .attr("fill", "#619ff7")
         .attr("class", "bar")
         .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d[0].substring(0,7) + "<br/>" + formatCurrency(d[1]) + " Billions")
                .style("left", d3.mouse(this)[0]+width/2.2+ "px")
                .style("top", height + "px")
                .attr("data-date", d[0])
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

      svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top/5))
        .attr("text-anchor", "middle")
        .attr("id","title")
        .style("font-size", "26px")
        .text("United States GDP");

      svg.append("g")
         .attr("id", "x-axis")
         .attr("transform", "translate(0, " + height + ")")
         .call(xAxis);

      svg.append("g")
       .attr("id", "y-axis")
       .attr("class", "y axis")
       .call(yAxis);

       svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - margin.left)
       .attr("x",0 - (height / 2))
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .text("Gross Domestic Product ($ Billions)");
  };
});
