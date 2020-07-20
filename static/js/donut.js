/**
 * @class Donut
 */
class Donut {

    // Elements
    svg = null;
    g = null;

    // Configs
    width = 360;
    height = 360;
    margin = 40;
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

        // append the svg object to the div called 'my_dataviz'
        this.svg = d3.select("#vis2")
            .append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .append("g")
            .attr("transform", "translate(" + vis.width / 2 + "," + vis.height / 2 + ")")

        // // Now wrangle
        this.wrangle();
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