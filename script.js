//(function () {
    var reqURL = 'https://lmm1ng.github.io/ChartsJS/data.json';
    var request = new XMLHttpRequest();
    request.open('GET', reqURL);
    request.responseType = 'json';
    request.send();
    request.onload = function () {
        var data = request.response;
        var dataset = data['Country estimates']
        //alert(dataset[1]["Country Name"]);


        var button = document.getElementById('submit_country');
        var input = document.getElementById('country_input');

        function isCountryValid(country) {
            var isFinded = false;
            for (var i = 0; i < dataset.length; i++) {
                if (dataset[i]["Country Name"] == country) {
                    isFinded = true;
                }
            }
            if (isFinded) {
                return true;
            } else {
                return false;
            }
        }
        function plot (data) {
            var dataset = anychart.data.set(data);
            var lower_data = dataset.mapAs({'x': 1, value : 2});
            var median_data = dataset.mapAs({'x': 1, value : 3});
            var upper_data = dataset.mapAs({'x': 1, value : 4});
            var chart = anychart.line();
            chart.animation(true);
            chart.crosshair().enabled;
            chart.tooltip().positionMode('point');
            chart.title('Mortality rate of ' + data[0][0]);
            chart.xAxis().title('Years');
            var lower = chart.line(lower_data);
            var median = chart.line(median_data);
            var upper = chart.line(upper_data);
            lower.name('Lower bound');
            lower.color('#0000ff');
            median.name('Median bound');
            median.color('#8b00ff')
            upper.name('Upper bound');
            upper.color('#ff0000')
            chart.container('container');
            chart.legend().enabled(true);
            chart.draw();
        }
        function findCountry() {
            if (document.getElementById('container')) {
                document.getElementById('container').remove();
            }
            var plotter = document.getElementById('plot_for_each_country');
            var container = document.createElement('div');
            plotter.append(container);
            container.id = 'container';
            if (!isCountryValid(input.value)) {
                alert('Такой страны нет в базе!');
                return;
            } else {
                var result = [[],[],[],[],[],[],[],[]];
                var years = ["2010", "2011", "2012", "2013","2014","2015","2016","2017"];
                for (var i = 0; i < dataset.length; i++) {
                        if (dataset[i]["Country Name"] == input.value) {
                                if (dataset[i]["Uncertainty bounds*"] == "Lower") {
                                    for (var j = 0; j < years.length; j++) {
                                        result[j][0] = dataset[i]["Country Name"];
                                        result[j][2] = dataset[i][years[j]];
                                    }
                                }
                                if (dataset[i]["Uncertainty bounds*"] == "Median") {
                                    for (var j = 0; j < years.length; j++) {
                                        result[j][0] = dataset[i]["Country Name"];
                                        result[j][3] = dataset[i][years[j]];
                                    }
                                }
                                if (dataset[i]["Uncertainty bounds*"] == "Upper") {
                                    for (var j = 0; j < years.length; j++) {
                                        result[j][0] = dataset[i]["Country Name"];
                                        result[j][4] = dataset[i][years[j]];
                                    }
                                }
                            }
                        }
                for (var i = 0; i < years.length; i++) {
                    result[i][1] = years[i];
                }
                plot(result);   
                    }
            }
        document.querySelector('input').addEventListener('keydown', function(event) {
            if (event.keyCode === 13) {
                 findCountry();
            }
        button.onclick = findCountry;
        
        })
    };