/**
 * @class Scatter
 */
class Scatter {

    // Vars
    data_bins = [];

    // Elements
    svg = null;
    g = null;

    // Configs
    width = 360;
    height = 360;
    margin = {top: 40, right: 40, bottom: 40, left: 40};
    radius = Math.min(this.width, this.height) / 2 - this.margin;
    dataBins = {};
    dataBinsWithLabels = {}
    color = d3.scaleOrdinal()
        .domain(this.dataBins)
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#a05d88"]);
    pie = d3.pie()
        .value(function(d) {return d.value; });

    /*
    Constructor
     */
    constructor(_data, _target) {
        // Assign parameters as object fields
        this.data = _data;
        this.target = _target;

        // Now init
        this.init();
    }

    /** @function init()
     * Perform one-time setup function
     *
     * @returns void
     */
    init() {
        const vis = this;

        var dummy_data = [[5,3], [10,17], [15,4], [2,8]];

        var margin = {top: 40, right: 40, bottom: 40, left: 40}
            , width = 360 - margin.left - margin.right
            , height = 360 - margin.top - margin.bottom;

        var x = d3.scaleLinear()
            .domain([0, d3.max(dummy_data, function(d) { return d[0]; })])
            .range([ 0, width ]);

        var y = d3.scaleLinear()
            .domain([0, d3.max(dummy_data, function(d) { return d[1]; })])
            .range([ height, 0 ]);

        var chart = d3.select('#vis3')
            .append('svg:svg')
            .attr('width', width + this.margin.right + this.margin.left)
            .attr('height', height + this.margin.top + this.margin.bottom)
            .attr('class', 'chart')

        var main = chart.append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'main')

        // draw the x axis
        var xAxis = d3.axisBottom(x);

        main.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .attr('class', 'main axis date')
            .call(xAxis);

        // draw the y axis
        var yAxis = d3.axisLeft(y)

        main.append('g')
            .attr('transform', 'translate(0,0)')
            .attr('class', 'main axis date')
            .call(yAxis);

        var g = main.append("svg:g");

        g.selectAll("scatter-dots")
            .data(dummy_data)
            .enter().append("svg:circle")
            .attr("cx", function (d,i) { return x(d[0]); } )
            .attr("cy", function (d) { return y(d[1]); } )
            .attr("r", 8);

        // // Now wrangle
        //this.wrangle();
    }

    /** @function wrangle()
     * Preps data for vis
     *
     * @returns void
     */
    wrangle() {
        // Define this vis
        const vis = this;

        const data = vis.data.map(d => d.prog_lang);


        for(let item of data) {
            if(item in this.dataBins) {
                this.dataBins[item]++;
            }else {
                this.dataBins[item] = 1;
            }

            if(item in this.dataBinsWithLabels) {
                this.dataBinsWithLabels[item]["label"] = item;
                this.dataBinsWithLabels[item]["value"]++;
            }else {
                this.dataBinsWithLabels[item] = {
                    "label": item,
                    "value": 1
                }
            }
        }

        // Now render
        this.render();
    }

    /** @function render()
     * Builds, updates, removes elements in vis
     *
     * @returns void
     */
    render() {
        // Define this vis
        const vis = this;

        let data_ready = this.pie(d3.entries(this.dataBins));
        //let data_ready = this.pie(d3.entries(this.dataBinsWithLabels.map(x => x.value)));
        console.log(this.dataBins);

        this.svg.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Programming Languages");

        this.svg.selectAll('path')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', d3.arc()
                .innerRadius(85)
                .outerRadius(vis.radius)
            )
            .attr('fill', function(d){ return(vis.color(d.data.key)) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7);
    }
}