function login() {
    var us = document.getElementById("usr").value
    var pw = document.getElementById("pwd").value
    options = {
        /* url: "https://apitestererer.azurewebsites.net/api/BoxControl?user=" + us + "&password=" + pw*/
        url: "https://roilapi.azurewebsites.net/api/BoxControl?user=" + us + "&password=" + pw
        , type: "GET"
    , }
    $.ajax(options).success(function (response) {
        var tempO = JSON.parse(response);
        wells.wells = tempO[1]
        wells.username = us
        generateTable(wells)
    });
};
var wells = {}

function generateTable(o) {
    var html = ''
    html += '<h2>' + o.username + ' Box Admin Console</h2>\
    <table class="table table-striped">\
           <thead>\
            <tr>'
    html += '<th>' + 'Box ID' + '</th>'
    html += '<th>' + 'Well' + '</th>'
    html += '<th>' + 'Start Date' + '</th>'
    html += '<th>' + 'End Date' + '</th>'
    html += '<th>' + 'Wits Settings' + '</th>'
    html += '<th>' + 'Status' + '</th>'
    html += '<th>' + 'Start/Stop' + '</th>'
    html += '<th>' + 'Well Data' + '</th>'
    html += '<th>' + 'Box Log' + '</th>'
    html += '<th>' + 'Wits Settings' + '</th>'
    html += '</tr>\
        </thead>\
        <tbody>'
    o.wells.forEach(function (row) {
        html += '<tr>'
        html += '<th>' + row.Box_ID + '</th>'
        html += '<th>' + row.Well + '</th>'
        html += '<th>' + row.StartDate + '</th>'
        html += '<th>' + row.EndDate + '</th>'
        html += '<th>' + row.WitsSettings + '</th>'
        html += '<th>' + row.Status + '</th>'
        html += '<th>' + '<button type="button" class="btn btn-default" onclick(handleStartStop(' + "'" + row.Box_ID + "'" + '))>Start/Stop</button>' + '</th>'
        html += '<th>' + '<button type="button" class="btn btn-default">' + 'Well Data</button>' + '</th>'
        html += '<th>' + '<button type="button" class="btn btn-default">' + 'Box Log</button>' + '</th>'
        html += '<th>' + '<button type="button" class="btn btn-default">' + 'Wits Settings</button>' + '</th>'
        html += '</tr>'
    })
    html += '<tr>'
    $('#tableContainer').html(html)
}

function handleStartStop(boxID) {}