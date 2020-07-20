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
    margin = 60;
    dataBins = {};
    color = d3.scaleOrdinal()
        .domain(Object.keys(this.dataBins))
        .range(d3.schemeDark2);
    pie = d3.pie()
        .value(function(d) {return d.value; })

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
        this.svg = d3.select(`#${this.target}`)
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .append("g")
            .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

        this.wrangle();
    }

    /** @function wrangle()
     * Preps data for vis
     *
     * @returns void
     */
    wrangle() {
        const data = this.data.map(d => d.prog_lang);

        for(let item of data) {
            if(item in this.dataBins) {
                this.dataBins[item]++;
            }else {
                this.dataBins[item] = 1;
            }
        }

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

        var data_ready = this.pie(d3.entries(this.dataBins))
        var radius = Math.min(this.width, this.height) / 2 - this.margin

        var arc = d3.arc()
            .innerRadius(radius * 0.5)
            .outerRadius(radius * 0.8)

        var outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9)

        this.svg
            .selectAll('allSlices')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function (d) {
                return (vis.color(d.data.key))
            })
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

        this.svg
            .selectAll('allPolylines')
            .data(data_ready)
            .enter()
            .append('polyline')
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function (d) {
                var posA = arc.centroid(d)
                var posB = outerArc.centroid(d)
                var posC = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
                return [posA, posB, posC]
            })

        this.svg
            .selectAll('allLabels')
            .data(data_ready)
            .enter()
            .append('text')
            .text(function (d) {
                return d.data.key + ": " + d.data.value
            })
            .attr('transform', function (d) {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function (d) {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })
    }
}