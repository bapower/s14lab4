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
    margin = {top: 40, right: 40, bottom: 40, left: 40}
    width = 360 - this.margin.left - this.margin.right;
    height = 360 - this.margin.top - this.margin.bottom;
    dataVis = [];
    pie = d3.pie()
        .value(function(d) {return d.value; });
    x;
    y;
    z;

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
        this.wrangle();
        this.x = d3.scaleLinear()
            .domain([-1, d3.max(this.dataVis, function(d) { return d[0]; })])
            .range([ 0, this.width ]);

        this.y = d3.scaleLinear()
            .domain([0, d3.max(this.dataVis, function(d) { return d[1]; })])
            .range([ this.height, 0 ]);

        this.z = d3.scaleSqrt()
            .domain([1, d3.max(this.dataVis, function(d) { return d[2]; })])
            .range([1, 6]);

        this.svg = d3.select('#vis3')
            .append('svg:svg')
            .attr('width', this.width + this.margin.right + this.margin.left)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'chart')
        this.render()
    }

    /** @function wrangle()
     * Preps data for vis
     *
     * @returns void
     */
    wrangle() {
        for(let item of this.data) {
            this.dataVis.push([
                item.experience_yr,
                item.hw1_hrs,
                item.age
            ])
        }
    }

    /** @function render()
     * Builds, updates, removes elements in vis
     *
     * @returns void
     */
    render() {
        const vis = this;
        var main = this.svg.append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('class', 'main')

        // draw the x axis
        var xAxis = d3.axisBottom(this.x);

        main.append('g')
            .attr('transform', 'translate(0,' + this.height + ')')
            .attr('class', 'main axis date')
            .call(xAxis);

        this.svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", this.width-40)
            .attr("y", this.height+75 )
            .text("Years of experience");

        // draw the y axis
        var yAxis = d3.axisLeft(this.y)

        main.append('g')
            .attr('transform', 'translate(0,0)')
            .attr('class', 'main axis date')
            .call(yAxis);

        this.svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", this.width-420)
            .attr("y", this.height-265)
            .attr("transform", "rotate(-90)")
            .text("Homework Hours")

        let g = main.append("svg:g");

        g.selectAll("scatter-dots")
            .data(this.dataVis)
            .enter().append("svg:circle")
            .attr("cx", function (d) { return vis.x(d[0]); } )
            .attr("cy", function (d) { return vis.y(d[1]); } )
            .attr("r", function (d) { return vis.z(d[2]); } );
    }
}