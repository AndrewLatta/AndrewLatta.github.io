(function() {
	
//1:-------------------------------------------------------------------------------------------
// Create the connector object
var myConnector = tableau.makeConnector();


//2:-------------------------------------------------------------------------------------------
// Define the schema
myConnector.getSchema = function (schemaCallback) {
	
	var timekeepingEntries_cols = [{
		id: "status",
		dataType: tableau.dataTypeEnum.string
	}, {
		id: "foreman",
		dataType: tableau.dataTypeEnum.string
	}, {
		id: "is_approved",
		dataType: tableau.dataTypeEnum.bool
	}, {
		id: "end_time",
		dataType: tableau.dataTypeEnum.string
	}, {
		id: "start_time",
		dataType: tableau.dataTypeEnum.string
	}, {
		id: "employee",
		dataType: tableau.dataTypeEnum.string
	}, {
		id: "job_number",
		dataType: tableau.dataTypeEnum.int
	}, {
		id: "cost_code",
		dataType: tableau.dataTypeEnum.int
	}];
	var timekeepingEntriesTable = {
		id: "Timekeeping",
		alias: "Timekeeping Entries",
		columns: timekeepingEntries_cols
	};
	
	schemaCallback([timekeepingEntriesTable]);
};

//3:-------------------------------------------------------------------------------------------
// Fetch and download the data
myConnector.getData = function (table, doneCallback) {
	
	var settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://cors-anywhere.herokuapp.com/https://prod.rhumbix.com/public_api/v2/timekeeping_entries/",
			"method": "GET",
			"headers": {
					"Accept": "application/json, application/json",
    					"Content-Type": "application/json",
    					"X-Api-Key": "UVTRjPcDWO5fpeHI7DMpl1XgGjXMBCfF9hfsNVkB",
    					"Cache-Control": "no-cache",
    					"Postman-Token": "f90b9c6b-67d5-4ab6-af04-05651294a558"
					}
			}
	
	$.ajax(settings, {
		jsonp: 'callback',
		dataType: 'jsonp',
		}).then(function(response) {
			var resp = response.results,
        			tableData = [];
			
			//Iterate the JSON object
			for ( i = 0, len = resp.length; i < len; i++) {
				tableData.push({
					"status": resp[i].status,
					"foreman": resp[i].foreman,
					"is_approved": resp[i].is_approved,
					"end_time": resp[i].end_time,
					"start_time": resp[i].start_time,
					"employee": resp[i].employee,
					"job_number": resp[i].job_number
						});
					}
		
			table.appendRows(tableData);
			doneCallback();
		
		});
};	

//4:-------------------------------------------------------------------------------------------
	tableau.registerConnector(myConnector);
	
	if (!!window.tableauVersionBootstrap) {
  		window._tableau.triggerInitialization();
		}
	if (!window.tableauVersionBootstrap) {
  		var DOMContentLoaded_event = window.document.createEvent("Event")
            	DOMContentLoaded_event.initEvent("DOMContentLoaded", true, true)
            	window.document.dispatchEvent(DOMContentLoaded_event)
		}
	// window._tableau.triggerInitialization();


//5:-------------------------------------------------------------------------------------------
// Create event listeners for when the user submits the form
	$(document).ready(function () {
	$("#submitButton").click(function() {
			tableau.connectionName = "Rhumbix WDC"; //This will be the data source name in Tableau
			tableau.submit(); //This sends the connector object to Tableau
			});
		});
	})();
