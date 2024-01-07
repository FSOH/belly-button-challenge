// Use the D3 library to read in samples.json from the URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json.

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

d3.json(url).then(function(data) {
  console.log(data);
});

//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.

//Use sample_values as the values for the bar chart.

//Use otu_ids as the labels for the bar chart.

//Use otu_labels as the hovertext for the chart.

// Initialize the dashboard at start up 
function init() {

    // dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // get sample names for the drop-down menu
    d3.json(url).then((data) => {
        
        // Set a variable for the sample names
        let names = data.names;

        // Add  samples to dropdown menu
        names.forEach((id) => {

            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        let sample_1 = names[0];

        console.log(sample_1);

        // Build the initial plots
        Metadata(sample_1);
        BarChart(sample_1);
        BubbleChart(sample_1);
    });
};

// Function that populates metadata info
function Metadata(sample) {

    // retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter by value of the sample
        let value = metadata.filter(result => result.id == sample);

        // Log the array of metadata objects after the have been filtered
        console.log(value)

        // Get the first index from the array
        let valueData = value[0];

        d3.select("#sample-metadata").html("");

        // !!!!!!! Use Object.entries to add each key/value pair to the panel !!!
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Function that builds the bar chart
function BarChart(sample) {

    //  retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter by value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;


        console.log(otu_ids,otu_labels,sample_values);

        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup the layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Function that builds the bubble chart
function BubbleChart(sample) {

    //  Retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

    
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Create the layout
        let layout = {
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Sample change
function optionChanged(value) { 

    
    console.log(value); 

    // Call all functions 
    Metadata(value);
    BarChart(value);
    BubbleChart(value);
};

// Call the initialize function
init();