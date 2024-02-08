let abFilter = 0
const width = window.innerWidth;
const height = window.innerHeight;

let scatterLeft = 0, scatterTop = 0;
let scatterMargin = {top: 10, right: 30, bottom: 30, left: 60},
    scatterWidth = 400 - scatterMargin.left - scatterMargin.right,
    scatterHeight = 350 - scatterMargin.top - scatterMargin.bottom;

let distrLeft = 400, distrTop = 0;
let distrMargin = {top: 20, right: 30, bottom: 10, left: 60},
    distrWidth = 400 - distrMargin.left - distrMargin.right,
    distrHeight = 350 - distrMargin.top - distrMargin.bottom;

let jobsLeft = 0, jobsTop = 400;
let jobsMargin = {top: 10, right: 30, bottom: 40, left: 60},
    jobsWidth = width - jobsMargin.left - jobsMargin.right,
    jobsHeight = height-450 - jobsMargin.top - jobsMargin.bottom;


d3.csv("ds_salaries.csv").then(rawData =>{
    console.log("rawData", rawData);
    
    rawData.forEach(function(d){
        d.AB = Number(d.AB);
        d.H = Number(d.H);
        d.salary_in_usd = Number(d.salary_in_usd);
        d.SO = Number(d.SO);
        d.remote_ratio = Number(d.remote_ratio);
    });
    

    //rawData = rawData.filter(d=>d.AB>abFilter);
    rawData = rawData.map(d=>{
                          return {
                              "salary_in_usd":d.salary_in_usd,
                              "SO_AB":d.SO/d.AB,
                              "job_title":d.job_title,
                              "remote_ratio":d.remote_ratio
                          };
    });
    console.log(rawData);
    
//plot 1
    const svg = d3.select("svg")

    const g1 = svg.append("g")
                .attr("width", scatterWidth + scatterMargin.left + scatterMargin.right)
                .attr("height", scatterHeight + scatterMargin.top + scatterMargin.bottom)
                .attr("transform", `translate(${scatterMargin.left}, ${scatterMargin.top})`)

    // X label
    g1.append("text")
    .attr("x", scatterWidth / 2)
    .attr("y", scatterHeight + 50)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("H/AB")
    

    // Y label
    g1.append("text")
    .attr("x", -(scatterHeight / 2))
    .attr("y", -40)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("SO/AB")

    // X ticks
    const x1 = d3.scaleLinear()
    .domain([0, d3.max(rawData, d => d.salary_in_usd)])
    .range([0, scatterWidth])

    const xAxisCall = d3.axisBottom(x1)
                        .ticks(7)
    g1.append("g")
    .attr("transform", `translate(0, ${scatterHeight})`)
    .call(xAxisCall)
    .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)")

    // Y ticks
    const y1 = d3.scaleLinear()
    .domain([0, d3.max(rawData, d => d.remote_ratio)])
    .range([scatterHeight, 0])

    const yAxisCall = d3.axisLeft(y1)
                        .ticks(13)
    g1.append("g").call(yAxisCall)

    const rects = g1.selectAll("circle").data(rawData)

    rects.enter().append("circle")
         .attr("cx", function(d){
             return x1(d.salary_in_usd);
         })
         .attr("cy", function(d){
             return y1(d.remote_ratio);
         })
         .attr("r", 3)
         .attr("fill", "#69b3a2")

//space
    const g2 = svg.append("g")
                .attr("width", distrWidth + distrMargin.left + distrMargin.right)
                .attr("height", distrHeight + distrMargin.top + distrMargin.bottom)
                .attr("transform", `translate(${distrLeft}, ${distrTop})`)

//plot 2
    
    q = rawData.reduce((s, { job_title }) => (s[job_title] = (s[job_title] || 0) + 1, s), {});
    r = Object.keys(q).map((key) => ({ job_title: key, count: q[key] }));
    r = r.filter(d=> d.count>35);
    console.log(r);

           
    const g3 = svg.append("g")
                .attr("width", jobsWidth + jobsMargin.left + jobsMargin.right)
                .attr("height", jobsHeight + jobsMargin.top + jobsMargin.bottom)
                .attr("transform", `translate(${jobsMargin.left}, ${jobsTop})`)

    // X label
    /*
    g3.append("text")
    .attr("x", jobsWidth / 2)
    .attr("y", jobsHeight + 50)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Job Title")
    */

    // Y label
    g3.append("text")
    .attr("x", -(jobsHeight / 2))
    .attr("y", -40)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Number of Employees")

    // X ticks
    const x2 = d3.scaleBand()
    .domain(r.map(d => d.job_title))
    .range([0, jobsWidth])
    .paddingInner(0.3)
    .paddingOuter(0.2)

    const xAxisCall2 = d3.axisBottom(x2)
    g3.append("g")
    .attr("transform", `translate(0, ${jobsHeight})`)
    .call(xAxisCall2)
    .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)")

    // Y ticks
    const y2 = d3.scaleLinear()
    .domain([0, d3.max(r, d => d.count)])
    .range([jobsHeight, 0])

    const yAxisCall2 = d3.axisLeft(y2)
                        .ticks(6)
    g3.append("g").call(yAxisCall2)

    const rects2 = g3.selectAll("rect").data(r)

    rects2.enter().append("rect")
    .attr("y", d => y2(d.count))
    .attr("x", (d) => x2(d.job_title))
    .attr("width", x2.bandwidth)
    .attr("height", d => jobsHeight - y2(d.count))
    .attr("fill", "grey")






























}).catch(function(error){
    console.log(error);
});


