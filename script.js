'use strict'

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

// Функция mapPlotter выполняет построения по полученным данным

function mapPlotter(mapData) {
    let map = anychart.map();
    map.geoData('anychart.maps.world');
    map.interactivity().selectionMode('none');
    let countriesSet = anychart.data.set(mapData);
    let mortalityData = countriesSet.mapAs({id : 1, value : 2});
    let series = map.choropleth(mortalityData);
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
        {from: 80, to: 85},
        {greater: 85}])
    scale.colors(['#008000', '#00b300','#00e600', '#80ff80','#b2ec5d', '#ffc966', '#ffb833', '#ffa600','#ff9999','#ff3333','#ff0000','#cc0000','#000000']);
    series.colorScale(scale);
    let colors = map.colorRange();
    colors.enabled(true);
    map.container('map');
    map.draw();
};

// Функция setMap преобразует данные в удобный вид 
// и передаёт их в функцию mapPlotter для построения карты

function setMap(data, countries) {
    let toMap = [];
// Заполняем массив нужным образом для дальнейшей работы с AnyChart
    for (let i = 0; i < data.length; i++) {
        if (data[i]["Uncertainty bounds*"] == "Median") {
            let arr = [];
            arr.push(data[i]["Country Name"]);
            arr.push(countries[data[i]["Country Name"]]);
            arr.push(data[i]["2017"])
            toMap.push(arr);
        };
    };
    mapPlotter(toMap);
};

// Функция isCountryValid проверяет валидность пользовательского ввода.

function isCountryValid(data, country) {
    let isFinded = false;
    for (let i = 0; i < data.length; i++) {
        if (data[i]["Country Name"] == country) {
            isFinded = true;
        };
    };
    if (isFinded) {
        return true;
    } else {
        return false;
    };
};

// Функция oneCountryPlot выполняет построения графика зависимости смертности от года

function oneCountryPlot (countryData) {
    let aboutCountry = anychart.data.set(countryData);
    let lower_data = aboutCountry.mapAs({'x': 1, value : 2});
    let median_data = aboutCountry.mapAs({'x': 1, value : 3});
    let upper_data = aboutCountry.mapAs({'x': 1, value : 4});
    let chart = anychart.line();
    chart.animation(true);
    chart.crosshair().enabled;
    chart.tooltip().positionMode('point');
    chart.title('IMR of ' + countryData[0][0]);
    chart.xAxis().title('Years');
    chart.yAxis().title('Number of deaths of children under one year of age per 1000 live births');
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
};

// Функция findCountry преобразует данные в удобный вид
// и передаёт их в функцию oneCountryPlot для построения графика

function findCountry(data, country) {
    if (document.getElementById('container')) {
        document.getElementById('container').remove();}
    let plotter = document.getElementById('plot_for_each_country');
    let container = document.createElement('div');
    plotter.append(container);
    container.id = 'container';
    if (!isCountryValid(data ,country)) {
        alert('Such a country is not in the database!');
        return;
    } else {
        let result = [[],[],[],[],[],[],[],[]];
        let years = ["2010", "2011", "2012", "2013","2014","2015","2016","2017"];
        // Заполняем массив нужным образом для дальнейшей работы с AnyChart
        for (let i = 0; i < data.length; i++) {
                if (data[i]["Country Name"] == country) {
                        if (data[i]["Uncertainty bounds*"] == "Lower") {
                            for (let j = 0; j < years.length; j++) {
                                result[j][0] = data[i]["Country Name"];
                                result[j][2] = data[i][years[j]];
                            }
                        }
                        if (data[i]["Uncertainty bounds*"] == "Median") {
                            for (let j = 0; j < years.length; j++) {
                                result[j][0] = data[i]["Country Name"];
                                result[j][3] = data[i][years[j]];
                            }
                        }
                        if (data[i]["Uncertainty bounds*"] == "Upper") {
                            for (let j = 0; j < years.length; j++) {
                                result[j][0] = data[i]["Country Name"];
                                result[j][4] = data[i][years[j]];
                            };
                        };
                    };
                };
        for (let i = 0; i < years.length; i++) {
            result[i][1] = years[i];
        };
        oneCountryPlot(result);   
            };
};

// После загрузки файлов выполняем скрипт:

countriesData.onload = function () { 
    mainData.onload = function () {

// Инициализируем данные

        let countrData = countriesData.response;
        let data = mainData.response;
        let dataset = data["Country estimates"];
        let countriesDataset = countrData['Countries'][0];
        let input = document.getElementById('country_input');

// Выполняем построения

        setMap(dataset, countriesDataset);
        document.querySelector('input').addEventListener('keydown', function(event) {
            if (event.keyCode === 13) {
                findCountry(dataset, input.value);
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth"
                });
            }});
        document.querySelector('#submit_country').addEventListener('click', function(event) {
            event.preventDefault();
            findCountry(dataset, input.value);
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth"
            });
        });
    };
};