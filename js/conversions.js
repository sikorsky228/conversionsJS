(function ($) {

    $.fn.conversions = function(options) {
            //add canvas block
            this.append(`<canvas id="myChart" width="400" height="100"></canvas>`);
            //add datepicker block
            this.append(`
                        <div class="datepicker">
                            <input type="text" class="datefield start-date" name="start">
                            <input type="text" class="datefield end-date" name="end">
                        </div>`);

            //add table
            this.append(`
                        <div class="table-block-container">
                        <table id="tableSortData" width="100%">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Conversions</th>
                                    <th>Impressions</th>
                                    <th>Clicks</th>
                                    <th>Turnover</th>
                                    <th>Costs</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                       </table>
                       </div>
            `);


            /*variables*/
            var dateObject;
            var myChart;
            var conversionsObj = [];
            var impressionsObj = [];
            var clicksObj = [];
            var turnoverObj = [];
            var costsObj = [];
            var dataObj = [];


            /*Get date values*/
            var currentDate = new Date();
            var currentMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
            var currentYear = currentDate.getFullYear();
            var currentDay = ("0" + currentDate.getDate()).slice(-2);
            var ctx = $("#myChart");

            var startDate = currentYear + "-" + currentMonth + "-" + "01";
            var endDate = currentYear + "-" + currentMonth + "-" + currentDay;


            /*Set default date*/
            $(".datepicker .start-date").val(startDate);
            $(".datepicker .end-date").val(endDate);
        
            /*Load data*/
			getData(startDate, endDate, options.apikey);
			
		    function getData(startDate, endDate, apiKey) {
                getUrl = "http://api.hyj.mobi/stats?apikey=" + apiKey + "&startdate=" + startDate + "&enddate=" + endDate;
                $('#tableSortData').tablesorter();
                $.ajax({
                    url: getUrl,
                    type: 'GET',
                    crossDomain: true,
                    dataType: 'json',
                    success: function (data) {
                        //get data test
                        dateObject = data;
                        appendData();
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            }
            
            function appendData() {
                /*Append data to tables*/
                var objectLength = dateObject.query_result.data.rows.length;
                $('#tableSortData tbody').empty();
                //clear objects
                conversionsObj, impressionsObj, clicksObj, turnoverObj, costsObj, dataObj = [];
                for (var i = 0; i < objectLength; i++) {
                    $('#tableSortData tbody').append("<tr>" +
                        "<th>" + dateObject.query_result.data.rows[i].dd + "</th>" + "" +
                        "<th>" + dateObject.query_result.data.rows[i].conversions + "</th>" + "" +
                        "<th>" + dateObject.query_result.data.rows[i].impressions + "</th>" + "" +
                        "<th>" + dateObject.query_result.data.rows[i].clicks + "</th>" + "" +
                        "<th>" + dateObject.query_result.data.rows[i].turnover + "</th>" + "" +
                        "<th>" + dateObject.query_result.data.rows[i].costs + "</th>" + "" +
                        "</tr>");
                conversionsObj.push(dateObject.query_result.data.rows[i].conversions);
                dataObj.push(dateObject.query_result.data.rows[i].dd);
                impressionsObj.push(dateObject.query_result.data.rows[i].impressions);
                clicksObj.push(dateObject.query_result.data.rows[i].clicks);
                turnoverObj.push(dateObject.query_result.data.rows[i].turnover);
                costsObj.push(dateObject.query_result.data.rows[i].costs);
                }

                //reinit table sort
                $("#tableSortData").trigger("update");
                //chart render
                myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: dataObj,
                        datasets: [
                            {
                                label: 'clicks',
                                data: clicksObj,
                                backgroundColor: "#00cc85",
                                borderColor: '#000',
                                borderWidth: 1
                            },
                            {
                                label: 'turnover',
                                data: turnoverObj,
                                backgroundColor: "#cc0049",
                                borderColor: '#000',
                                borderWidth: 1
                            },
                            {
                                label: 'costs',
                                data: costsObj,
                                backgroundColor: "#cc00aa",
                                borderColor: '#000',
                                borderWidth: 1
                            },
                            {
                                label: 'conversions',
                                data: conversionsObj,
                                backgroundColor: '#0085cc',
                                borderColor: '#000',
                                borderWidth: 1
                            },
                            {
                                label: 'impressions',
                                data: impressionsObj,
                                backgroundColor: "#cc3c00",
                                borderColor: '#000',
                                borderWidth: 1
                            }
                        ]
                    },
                    options: {
                        elements: {
                                line: {
                                tension: 0
                            }
                        },
                        responsive: true,
                        title: {
                            display: true,
                            text: 'Graph data'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        }
                    }
                });
            }

            /*Init datepicker*/
            $(".datepicker .datefield").datepicker({
                "dateFormat": "yy-mm-dd",
                "minDate": "2017-01-01",
                "maxDate": currentYear + "-" + currentMonth + "-" + currentDay
            });

            /*Data change*/
            $(".datepicker .start-date").on("change", function () {
                startDate = this.value;
                endDate = $(".datepicker .end-date").val();
                myChart.destroy();
                getData(startDate, endDate, options.apikey);

            });
            $(".datepicker .end-date").on("change", function () {
                startDate = $(".datepicker .start-date").val();
                endDate = this.value;
                myChart.destroy();
                getData(startDate, endDate, options.apikey);
            });

    }
})(jQuery);