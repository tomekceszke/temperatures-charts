google.charts.load('current', {
    'packages': ['corechart'],
    'language': 'pl' //, 'gauge']
});



function drawOutChart() {
    $('#' + config.divIdOut).html("Loading...");
    google.charts.setOnLoadCallback(loadAndDrawOutChart);
}

function drawInChart() {
    $('#' + config.divIdIn).html("Loading...");
    google.charts.setOnLoadCallback(loadAndDrawInChart);
}

function drawPowerChart() {
    $('#' + config.divIdPower).html("Loading...");
    google.charts.setOnLoadCallback(loadAndDrawPowerChart);
}


function loadAndDrawOutChart() {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('datetime', 'Time');
    dataTable.addColumn('number', 'Out');
    $.ajax({
        url: 'https://api.thingspeak.com/channels/' + config.channelId + '/feeds.json',
        data: {
            'days': 7,
            'average': 60,
            'round': 0,
        }
    }).done(function (data) {
        if (data) {
            $.each(data.feeds, function (i, row) {
                dataTable.addRow([new Date(row.created_at),
                                          parseFloat(row.field2),
                                         ]);
            });
            var options = {
                title: 'Outdoor - last 7 days',
                curveType: 'function',
                explorer: {
                    actions: ['dragToZoom', 'rightClickToReset'],
                    axis: 'horizontal'
                },
                legend: {
                    position: 'none'
                }
            };
            var chart = new google.visualization.LineChart(document.getElementById(config.divIdOut));
            chart.draw(dataTable, options);
        }
    });
}


function loadAndDrawInChart() {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('datetime', 'Time');
    dataTable.addColumn('number', 'Living');
    dataTable.addColumn('number', 'Bedroom');
    $.ajax({
        url: 'https://api.thingspeak.com/channels/' + config.channelId + '/feeds.json',
        data: {
            'days': 1,
            'average': 30,
            'round': 1,
        }
    }).done(function (data) {
        if (data) {
            $.each(data.feeds, function (i, row) {
                dataTable.addRow([new Date(row.created_at),
                                          parseFloat(row.field1),
                                          parseFloat(row.field4),
                                         ]);
            });
            var options = {
                title: 'Indoor - last 24 hours',
                curveType: 'function',
                explorer: {
                    actions: ['dragToZoom', 'rightClickToReset'],
                    axis: 'horizontal'
                },
                legend: {
                    position: 'bottom'
                }
            };
            var chart = new google.visualization.LineChart(document.getElementById(config.divIdIn));
            chart.draw(dataTable, options);
        }
    });
}



function loadAndDrawPowerChart() {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('datetime', 'Time');
    dataTable.addColumn('number', 'Power');
    $.ajax({
        url: 'https://api.thingspeak.com/channels/' + config.channelId + '/feeds.json',
        data: {
            'days': 1,
            'round': 1,
        }
    }).done(function (data) {
        if (data) {
            $.each(data.feeds, function (i, row) {
                dataTable.addRow([new Date(row.created_at),
                                          parseFloat(row.field3),
                                         ]);
            });
            var options = {
                title: 'Heating - last 24h',
                curveType: 'function',
                explorer: {
                    actions: ['dragToZoom', 'rightClickToReset'],
                    axis: 'horizontal'
                },
                legend: {
                    position: 'none'
                }
            };
            var chart = new google.visualization.LineChart(document.getElementById(config.divIdPower));
            chart.draw(dataTable, options);
        }
    });
}

$(window).resize(function () {
    drawOutChart();
    drawInChart();
    drawPowerChart();
});
