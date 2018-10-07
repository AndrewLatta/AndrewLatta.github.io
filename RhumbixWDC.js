(function() {
	
//1:-------------------------------------------------------------------------------------------
// Create the connector object
var myConnector = tableau.makeConnector();
	
errorMethod = function(response) {
		tableau.abortWithError(JSON.stringify(response));
    };
	
	if (!Object.assign) {
	  Object.defineProperty(Object, 'assign', {
		enumerable: false,
		configurable: true,
		writable: true,
		value: function(target) {
		  'use strict';
		  if (target === undefined || target === null) {
			throw new TypeError('Cannot convert first argument to object');
		  }

		  var to = Object(target);
		  for (var i = 1; i < arguments.length; i++) {
			var nextSource = arguments[i];
			if (nextSource === undefined || nextSource === null) {
			  continue;
			}
			nextSource = Object(nextSource);

			var keysArray = Object.keys(Object(nextSource));
			for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
			  var nextKey = keysArray[nextIndex];
			  var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
			  if (desc !== undefined && desc.enumerable) {
				to[nextKey] = nextSource[nextKey];
			  }
			}
		  }
		  return to;
		}
	  });
	};

var options = new Object();

//2:-------------------------------------------------------------------------------------------
// Define the schema
myConnector.getSchema = function (schemaCallback) {
	var schema = [];
	
	var timekeepingEntries_cols = [{
		id: "status",
		dataType: tableau.dataTypeEnum.string
	}, {
		id: "foreman",
		dataType: tableau.dataTypeEnum.string
	}, {
		id: "is_approved",
		dataType: tableau.dataTypeEnum.boolean
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
	
	schema.push(timekeepingEntriesTable);
	
	schemaCallback([schema]);
};

//3:-------------------------------------------------------------------------------------------
// Fetch and download the data
myConnector.getData = function (table, doneCallback) {
	var dataToReturn = [];
	var hasMoreData = false;
	
	var accessToken = tableau.password;
	//var connectionUri = getRhumbixURI(accessToken);
	
	var settings = {
			"async": "true",
			"crossDomain": "true",
			"url": "https://prod.rhumbix.com/public_api/v2/timekeeping_entries/?page_size=1000&page=1",
			"method": "GET",
			"headers": {
					"Accept": "application/json, application/json",
    				"Content-Type": "application/json",
    				"x-api-key": "UVTRjPcDWO5fpeHI7DMpl1XgGjXMBCfF9hfsNVkB",
    				"Cache-Control": "no-cache",
    				"Postman-Token": "f90b9c6b-67d5-4ab6-af04-05651294a558"
						}
					}
	
	$.ajax(settings).done(function (response) {
		$.getJSON("https://platform.rhumbix.com/public_api/v2/timekeeping_entries/", function(response) {
        	var feat = response.results;
        	var tableData = [];
	});
	});
	
	
			
//Iterate the JSON object
	var i = 0;
		
	if (table.tableInfo.id == "timekeepingEntriesTable") {
		for ( i = 0, len = feat.length; i < len; i++) {
			tableData.push({
				"status": feat[i].status,
				"foreman": feat[i].foreman,
				"is_approved": feat[i].is_approved,
				"end_time": feat[i].end_time,
				"start_time": feat[i].start_time,
				"employee": feat[i].employee,
				"job_number": feat[i].job_number
				});
			}	
		}
		
		table.appendRows(tableData);
		doneCallback(myConnector);
	};
		

myConnector.init = function(initCallback) {  
	tableau.authType = tableau.authTypeEnum.custom;
	tableau.connectionName = "Rhumbix WDC";
	
	tableau.log("phase: " + tableau.phase);
		
	initCallback();
	
	if (tableau.phase == tableau.phaseEnum.authPhase || tableau.phase == tableau.phaseEnum.interactivePhase) {
            var accessToken = tableau.password;
            if (accessToken && (accessToken.length > 0)) {
                // If we have an access token, we are done with auth.
                tableau.log("have access token; calling submit()");
                tableau.submit(myConnector);
            } else {
                // If we have this cookie, then we are being called back after
                // the sign-in page and we need to exchange a request
                // token for an access token.
                tableau.log("no access token");
                var oauthTokenSecret = Cookies.get("oauth_token_secret");
                if (oauthTokenSecret && (oauthTokenSecret.length > 0)) {
                    // If redirected here from the oauth sign-in page, there will be an
                    // oauth_token query param on our URL.
                    tableau.log("found cookie; calling getAccessToken()");
                    var params = parseQueryParams(window.location.href);
                    var accessToken = getAccessToken(params);
                    var token = {
                        public: accessToken.oauth_token,
                        secret: accessToken.oauth_token_secret,
                    };

                    tableau.username = decodeURIComponent(accessToken.user_nsid);
                    tableau.password = JSON.stringify(token);
                    tableau.submit();
                } else {
                    // We don't have an access token and we aren't being called
                    // back from sign-in page, we need to navigate to the
                    // sign-in page.
                    tableau.log("did not find cookie; redirecting to sign-in page");
                    var oauthUrl = getOauthUrl();
                    window.location.href = oauthUrl;
				}
			}
		}
	};
		

//4:-------------------------------------------------------------------------------------------
	tableau.registerConnector(myConnector);
	window._tableau.triggerInitialization();


//5:-------------------------------------------------------------------------------------------
// Create event listeners for when the user submits the form
	$(document).ready(function () {
	$("#submitButton").click(function() {
			tableau.connectionData = JSON.stringify();
			tableau.connectionName = "Rhumbix WDC"; //This will be the data source name in Tableau
			tableau.submit(); //This sends the connector object to Tableau
			});
		});
	});
	// $(document).ready(function(){
		// $("#submitButton").click(function(){
			
			// var settings = {
				// "async": true,
				// "Accept": JSON,
				// "Access-Control-Allow-Origin": "*",
				// "Access-Control-Allow-Headers": true,
				// "crossDomain": true,
				// "url": "https://crossorigin.me/https://platform.rhumbix.com/public_api/v2/timekeeping_entries/",
				// "method": "GET",
				// "headers": {
					// "x-api-key": "UVTRjPcDWO5fpeHI7DMpl1XgGjXMBCfF9hfsNVkB",
					// "Cache-Control": "no-cache",
					// "Postman-Token": "f50d85c4-2932-4e95-9f5f-4a34b05dd7bf"
					// }
					// };
	
	// $.ajax(settings).done(function (response) {
		// console.log(response);
		// });
	// });
// });
