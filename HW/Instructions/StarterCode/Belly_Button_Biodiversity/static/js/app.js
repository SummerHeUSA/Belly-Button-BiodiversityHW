function buildMetadata(sample) {

  d3.json(`metadata/${sample}`).then(function (data) {
    console.log(data)
    d3.select('#sample-metadata').html('')
    let myHTML = d3.select('#sample-metadata');
    Object.keys(data).forEach(key => {
      myHTML.append('p').text(key + " " + data[key])
    })
  })
}



function buildCharts(sample) {
  console.log(sample)
  let url = `samples/${sample}`
  d3.json(url).then(function (data) {
    

    let myValues = data.sample_values.slice(0, 10);
    let myLables = data.otu_ids.slice(0, 10);
    let bubble_x_value = data.otu_ids;
    let bubble_y_value = data.sample_values;
    let bubble_text_value = data.otu_labels;

    var staticData = [{
      values: myValues,
      labels: myLables,
      type: 'pie'
    }];
    var layout = {
      height: 400,
      width: 500
    };

    var trace1 = {
      x: bubble_x_value,
      y: bubble_y_value,
      text: bubble_text_value,
      mode: 'markers',
      marker: {
        color: bubble_x_value,
        opacity: [1, 0.8, 0.6, 0.4],
        size: bubble_y_value
      }
    };

    var data = [trace1];

    var layout_bubble = {
      showlegend: false,
      height: 600,
      width: 1500
    };

    Plotly.newPlot('bubble', data, layout_bubble);
    Plotly.newPlot('pie', staticData, layout);

  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // add id numbers to html 

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    // when this.value change, receive the ID of the person who gave the sample
    // fetch new data each time a new sample is selected 
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
