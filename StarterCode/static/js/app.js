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
                    color: 'red'
                }
            }

            // Layout for chart
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
                x: topotu_id,
                y: topsample_values,
                text: topotu_id_lbls,
                mode: 'markers',
                marker: {
                    size: topsample_values,
                    color: topotu_id,
                    colorscale: 'amp'
                }
            };

            // traceBar
            var traceBubble = [traceBubble];

            // Plot the chart
            Plotly.newPlot('bubble', traceBubble);

        });
};

