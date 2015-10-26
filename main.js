// This is the JavaScript challenge.  In this challenge, you will pull website
// performance data from the Compete.com API and use it to display a
// graph.

// Your finished product will be a page where the user can enter a
// domain, specify a metric from the drop down, and optionally specify
// a date range or the last x months from which to gather data.  When
// they click the GO button, a chart should appear.  Additionally, the
// user should be able to change these inputs and load a different
// chart WITHOUT refreshing the page.

// This is the only file you may edit. index.html is pre set up enough
// that you can complete the challenge without changing it.  You will of
// course need to review index.html throughout the challenge as it contains
// the dom elements you will need to either manipulate or read values
// from.  You are allowed to append script tags, but the script tags
// may not point to third party JS libraries like jQuery

// The documentation for Compete.com is located here: https://developer.compete.com/documentation/

// IMPORTANT: YOU WILL BE REQUESTING THE DATA WITH JSONP, NOT "TRADITIONAL" AJAX.
// The bottom of the Compete documentation has a little blurb about JSONP.
// Here is a wikipedia article about JSONP: https://en.wikipedia.org/wiki/JSONP

// You can use this API Key for Compete: 82111ef10ef31de9926eb2df16b9f657
// But it is preferable that you create your own key.

// Feel free to e-mail lots of questions.

//onClick event on buildURL()
document.getElementById('go').addEventListener('click', function(){
    buildURL();
    console.log(buildURL());
    appendScript();
});


// Create URL
function buildURL (data) {
            var url = "https://apps.compete.com/sites/";
                // console.log(url);
            var domain = document.getElementById("domain").value;
                // console.log(domain);
            var e = document.getElementById("metric");
            var metric = e.options[e.selectedIndex].value;
                // console.log(metric);
            var sd = document.getElementsByName("start_date")[0].value;
            var start_date = sd.replace(/-/g,"");
                // console.log(start_date);
            var ed = document.getElementsByName("end_date")[0].value;
            var end_date = ed.replace(/-/g,"");
                // console.log(end_date);
            var apiKey = "d52368aed29abbf531b8b944c5a48092";
            var latest = document.getElementsByName("latest")[0].value;
            // console.log(latest);
                if(start_date === '' || end_date === ''){
                    return url + domain + '/' + 'trended/' + metric + '/?apikey=' + apiKey + '&latest=' + latest + '&jsonp=makeChart';
                } else{
                return url + domain + '/' + 'trended/' + metric + '/?apikey=' + apiKey + '&start_date=' + start_date + '&end_date=' + end_date + '&jsonp=makeChart';
                    }

            };




function appendScript(s, h){
var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = buildURL();
        s.id = 'jsonp';
    var h = document.getElementsByTagName('script')[0];
        h.parentNode.insertBefore(s, h);

}

// //Callback Function
// function callback (data) {
//     console.log(data);
// }

//Render Graph Function --
function makeChart (data, metricName, metricCode, domain) {

    console.log(data);


    // `metricName` - a name from the Metric drop down.
    // `metricCode` - the corresponding value denoted in each metricName <option>
    // `domain`  -  the domain of interest.

    // This function is used to create the Highcharts graph with the
    // data you retrieve from Compete.

    // Don't try to understand this function.  Just give it the right
    // inputs and it will create the chart and render it into the page
    // for you.


    function getUTC(datestring){
        return Date.UTC(datestring.substring(0,4), datestring.substring(4)-1);
    }
    var met = data.data.trends[metricCode];
    console.log(met);
    var firstdate = met[0].date;
    var year = parseInt(firstdate.substring(0,4));
    var month = parseInt(firstdate.substring(4));
    new Highcharts.Chart({
        chart:{
            renderTo:'container',
            type:'area',
            zoomType:'x',
            resetZoomButton: {
                position: {
                    x: 0,
                    y: -24
                }
            },
            borderRadius: 0,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            spacingTop: 10,
            spacingBottom: 5,
            spacingRight: 5,
            spacingLeft: 5
        },
        title:{
            text:metricName + ' at ' + domain,
            style: {
                color: 'rgba(2, 50, 71, .9)',
                fontSize: '24px',
                fontFamily: '\'Montserrat\''
            }
        },
        legend: {
            verticalAlign:"top",
            y:30,
            backgroundColor: 'rgba(196, 195, 195, .03)',
            borderColor: 'rgba(249, 174, 57, .3)'
        },
        tooltip: {
            shared: true,
            crosshairs: true,
        },
        credits: {
            enabled: false
        },
        xAxis:{
            type:'datetime',
            minRange:14*24*3600000,
            lineWidth: 1,
            labels: {
                style: {
                    color: 'rgba(2, 50, 71, .85)',
                    fontSize: '11px',
                    fontFamily: 'Montserrat'
                }
            }
        },
        yAxis:{
            title:{
                text:metricName
            }
        },
        plotOptions: {
            area: {
                marker: {
                    enabled: false
                },
                lineWidth: 1,
                lineColor: 'rgba(2, 50, 71, .75)',
                shadow: false,
                states: {
                    hover: {
                        enabled: false
                    }
                },
                stacking:'normal'
            },
            spline: {
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                            lineWidth: 5
                        }
                    }
                },
                lineWidth: 2,
                states: {
                    hover: {
                        enabled: false
                    }
                }
            }
        },
        series:[{
            type:'area',
            name:metricName,
            pointInterval:30*24*3600*1000,
            pointStart: Date.UTC(year, month-1),
            data:met.map(function(e){return [getUTC(e.date), parseFloat(e.value)];})
        }]
    });
}
