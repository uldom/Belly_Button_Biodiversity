// D3 json promise
d3.json('samples.json')
    .then(function (data) {
        init(data)
    });

// Json organization
function init(data) {
    console.log(data.names);
    console.log(data.metadata);
    console.log(data.samples);
    load_dropdown_list(data.names);
    build_chart('940')
};

// Dropdown list
function load_dropdown_list(names) {
    let dropdown = document.getElementById('selDataset');
    names.forEach(function (name) {
        let options = document.createElement('option');
        let attributes = document.createAttribute('value');
        attributes.value = name;
        options.setAttributeNode(attributes);
        options.text = name;
        dropdown.appendChild(options);
    })
};

// Link of optionChanged with chart
function optionChanged(id) {
    build_chart(id);
}

// Build a chart for a single sample
function build_chart(id) {
    console.log('Chart for id:' + id);
    d3.json('samples.json')
        .then(function (data) {
            let names = data.names;
            let metadata = data.metadata;
            let samples = data.samples;

            // Filter name and other arrays for id
            metadata = metadata.filter(participant => participant.id == id)[0];
            samples = samples.filter(participant => participant.id == id)[0];

            // Creating variables for arrays
            otu_id = samples.otu_ids;
            otu_lbl = samples.otu_labels;
            sample_values = samples.sample_values;

            // Verifying filter and variables
            console.log(samples);
            console.log(metadata);
            console.log(otu_id);
            console.log(otu_lbl);
            console.log(sample_values);

            // Build metaPanel for id sample-metadata
            let metaPanel = d3.select('#sample-metadata');
            metaPanel.html('');

            // Loop for each id and information in the #sample-metadata box
            Object.entries(metadata).forEach(([key, value]) => {
                metaPanel.append('h6').text(`${key.toUpperCase()}: ${value}`);
            });

            // Creating top 10 arrays
            let topotu_id = otu_id.slice(0, 10).reverse();
            let topotu_lbls = otu_lbl.slice(0, 10).reverse();
            let topsample_values = sample_values.slice(0, 10).reverse();

            // Map function to store the Ids adding OTU for labeling
            let topotu_id_lbls = topotu_id.map(otu_id => 'OTU ' + otu_id)
            console.log(topotu_id_lbls)

            // Verifying top 10 arrays
            console.log(topotu_id)
            console.log(topotu_lbls)
            console.log(topsample_values)

            // Creating a trace
            var traceBar = {
                x: topsample_values,
                y: topotu_id_lbls,
                type: 'bar',
                orientation: 'h',
                marker: {
                    color: '#86213D'
                }
            }

            // Layout for bar chart
            let layout = {
                title: {
                    text: `<b>Top 10 OTU for ID: ${(id)}</b>`,
                    font: {
                        size: 14,
                    },
                    height: 500,
                    width: 600
                }
            };

            // traceBar
            var traceBar = [traceBar];

            // Plot the chart
            Plotly.newPlot('bar', traceBar, layout);

            // Bubble chart
            var traceBubble = {
                x: otu_id,
                y: sample_values,
                text: otu_lbl,
                mode: 'markers',
                marker: {
                    size: sample_values,
                    color: otu_id,
                    colorscale: 'YlOrRd'
                }
            };

            // Layout for bubble chart
            let bblayout = {
                title: {
                    text: `<b> Samples for ID: ${(id)}</b>`,
                    font: {
                        size: 14,
                    },
                    height: 500,
                    width: 600
                },
                xaxis: {
                    title: {
                        text: "<b> OTU ids </b>",
                        font: {
                            size: 14,
                        },
                        height: 500,
                        width: 600
                    },
                },
                yaxis: {
                    title: {
                        text: "<b> Sample Values </b>",
                        font: {
                            size: 14,
                        },
                        height: 500,
                        width: 600
                    },
                }
            };

            // traceBar
            var traceBubble = [traceBubble];

            // Plot the chart
            Plotly.newPlot('bubble', traceBubble, bblayout);

            //Gauge chart 
            let traceGauge = [
                {
                    domain: { x: [0, 1], y: [0, 1] },
                    value: metadata.wfreq,
                    title: {
                        text: `<b> Belly Button Washing Frequency for ID: ${(id)} <br> Scrubs per Week <b><br><br> `,
                        font: {
                            size: 14,
                        },
                        height: 500,
                        width: 600
                    },
                    type: "indicator",
                    mode: "gauge+number",
                    gauge: {
                        axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },
                        bar: { color: 'grey' },
                        steps: [
                            { range: [0, 1], color: '#ffffcc' },
                            { range: [1, 2], color: '#ffeda0' },
                            { range: [2, 3], color: '#fed976' },
                            { range: [3, 4], color: '#feb24c' },
                            { range: [4, 5], color: '#fd8d3c' },
                            { range: [5, 6], color: '#fc4e2a' },
                            { range: [6, 7], color: '#e31a1c' },
                            { range: [7, 8], color: '#bd0026' },
                            { range: [8, 9], color: '#b00026' }
                        ],
                    }
                }
            ];
            
            var layout_gauge = { 
                width: 600, 
                height: 500, 
                margin: { t: 0, b: 0 }
             };
            
             Plotly.newPlot('gauge', traceGauge, layout_gauge);
        });
};





