// Получаем данные из JSON файлов, расположенных на Github.com
let countriesDataURL = 'https://lmm1ng.github.io/ChartsJS/countries.json';
let countriesData = new XMLHttpRequest();
countriesData.open('GET', countriesDataURL);
countriesData.responseType = 'json';
countriesData.send();
let mainDataURL = 'https://lmm1ng.github.io/ChartsJS/data.json';
let mainData = new XMLHttpRequest();
mainData.open('GET', mainDataURL);
mainData.responseType = 'json';
mainData.send();

// После загрузки файлов выполняем скрипт:
countriesData.onload = function () { 
    mainData.onload = function () {
// Присваиваем данные переменным
        let countrData = countriesData.response;
        let data = mainData.response;
        let dataset = data['Country estimates'];
        let countriesDataset = countrData['Countries'][0];
// Функция setMap выполняет построения информативной карты
        function setMap() {
            let toMap = [];
// Заполняем массив нужным образом для дальнейшей работы с AnyChart
            for (let i = 0; i < dataset.length; i++) {
                if (dataset[i]["Uncertainty bounds*"] == "Median") {
                    let arr = [];
                    arr.push(dataset[i]['Country Name']);
                    arr.push(countriesDataset[dataset[i]['Country Name']]);
                    arr.push(dataset[i]["2017"])
                    toMap.push(arr);
                }
            }
            let map = anychart.map();
            map.geoData('anychart.maps.world');
            map.interactivity().selectionMode('none');
            let countriesSet = anychart.data.set(toMap);
            let mortalityData = countriesSet.mapAs({id : 1, value : 2});
            let series = map.choropleth(mortalityData);
            //series.colorScale(anychart.scales.linearColor('#ffc7c7', '#ff0000'));
            var scale = anychart.scales.ordinalColor([
                {from: 0, to: 5},
                {from: 5, to: 10},
                {from: 10, to: 15},
                {from: 15, to: 20},
                {from: 20, to: 25},
                {from: 25, to: 30},
                {from: 30, to: 40},
                {from: 40, to: 50},
                {from: 50, to: 60},
                {from: 60, to: 70},
                {from: 70, to: 80},
                {from: 80, to: 90},
                {from: 90, to: 100},
                {greater: 100}])
            scale.colors(['#008000', '#00b300','#00e600', '#80ff80','#b2ec5d', '#ffc966', '#ffb833', '#ffa600','#ff9999','#ff3333','#ff0000','#cc0000','#660000','#000000'])
            series.colorScale(scale);
            let colors = map.colorRange();
            colors.enabled(true) 
            map.container('map');
            map.draw()
        }
//'#ff9999'
        let button = document.getElementById('submit_country');
        let input = document.getElementById('country_input');

        function isCountryValid(country) {
            let isFinded = false;
            for (let i = 0; i < dataset.length; i++) {
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

        function oneCountryPlot (data) {
            let dataset = anychart.data.set(data);
            let lower_data = dataset.mapAs({'x': 1, value : 2});
            let median_data = dataset.mapAs({'x': 1, value : 3});
            let upper_data = dataset.mapAs({'x': 1, value : 4});
            let chart = anychart.line();
            chart.animation(true);
            chart.crosshair().enabled;
            chart.tooltip().positionMode('point');
            chart.title('Mortality rate of ' + data[0][0]);
            chart.xAxis().title('Years');
            let lower = chart.line(lower_data);
            let median = chart.line(median_data);
            let upper = chart.line(upper_data);
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
                document.getElementById('container').remove();}

            let plotter = document.getElementById('plot_for_each_country');
            let container = document.createElement('div');
            plotter.append(container);
            container.id = 'container';
            if (!isCountryValid(input.value)) {
                alert('Такой страны нет в базе!');
                return;
            } else {
                let result = [[],[],[],[],[],[],[],[]];
                let years = ["2010", "2011", "2012", "2013","2014","2015","2016","2017"];
                for (let i = 0; i < dataset.length; i++) {
                        if (dataset[i]["Country Name"] == input.value) {
                                if (dataset[i]["Uncertainty bounds*"] == "Lower") {
                                    for (let j = 0; j < years.length; j++) {
                                        result[j][0] = dataset[i]["Country Name"];
                                        result[j][2] = dataset[i][years[j]];
                                    }
                                }
                                if (dataset[i]["Uncertainty bounds*"] == "Median") {
                                    for (let j = 0; j < years.length; j++) {
                                        result[j][0] = dataset[i]["Country Name"];
                                        result[j][3] = dataset[i][years[j]];
                                    }
                                }
                                if (dataset[i]["Uncertainty bounds*"] == "Upper") {
                                    for (let j = 0; j < years.length; j++) {
                                        result[j][0] = dataset[i]["Country Name"];
                                        result[j][4] = dataset[i][years[j]];
                                    }
                                }
                            }
                        }
                for (let i = 0; i < years.length; i++) {
                    result[i][1] = years[i];
                }
                oneCountryPlot(result);   
                    }
        }
        setMap();
        document.querySelector('input').addEventListener('keydown', function(event) {
            if (event.keyCode === 13) {
                findCountry();
            }
        button.onclick = findCountry;
        }
)}};