'use strict';

/**
 * @ngdoc function
 * @name revxApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the revxApp
 */
angular.module('revxApp').controller('MainCtrl', ['$scope','loadSchedules',function (a,loadSchedules) {

	var KILLED 		= 	"KILLED";
	var SUSPENDED	=	"SUSPENDED";
	var DONE		=	"DONE";
	var killed_schedules		=	[];
	var suspended_schedules	=	[];
	var done_schedules		=	[];

    a.name = 'Rakesh G';
    // a.jobs = loadSchedules.query();
    
    a.jobs = data.schedules;
    
    var sort_jobs = function(jobs){
    	
    	angular.forEach(jobs,function(job,idx){
    		switch(job.status){
    			case KILLED:
    				killed_schedules.push(job)
    				break;
				case SUSPENDED:
    				suspended_schedules.push(job);
    				break;
				case DONE:
    				done_schedules.push(job);
    				break;
    		}
    	});

    	var sorted_jobs = [{"status":KILLED,"count":killed_schedules.length},{"status":SUSPENDED ,"count": suspended_schedules.length},{"status":DONE ,"count":done_schedules.length}]
    	
    	a.sorted_jobs_grid = {
			rowTemplate: 'views/row_template.html',
    		enableSorting 	: true,
    		data 			: sorted_jobs,
    		columnDefs: [
		      { field: 'status', name:'Status' },
		      { field: 'count', name:'Count',   }
		    ]
    	}
	}
	var current_job_list = [];

	a.labeled_jobs = function(job_label){
		
		a.current_job_label = job_label;	
		switch(job_label){
			case KILLED:
				current_job_list = killed_schedules;
				break;
			case SUSPENDED:
				current_job_list = suspended_schedules;
				break;
			case DONE:
				current_job_list = done_schedules;
				break;
		}
		
		a.labeled_jobs_grid = {
			
    		enableSorting 	: true,
    		data 			: current_job_list,
    		columnDefs: [
		      { field: 'id', name:'Schedule ID', cellTemplate:'views/cell_template.html' },
		      { field:'name',name:'Name'},
		      { field: 'command_type', name:'Command',   },
		      
		    ]
    	}	
    	a.show_labeled_jobs = true;
	}
	
	a.close_labeled_jobs = function(){
		a.show_labeled_jobs = false;
		a.close_job();
	}


    sort_jobs(a.jobs);
	
	//INITIALISING EMPTY GRID FOR SELECTED JOB LABEL
	a.show_labeled_jobs = false;
	a.labeled_jobs_grid = {
		data : []
	}

	a.show_job = function(idx){
		a.show_job_flag = true;
		a.current_job = current_job_list[idx];
	}
	a.close_job = function(){
		a.show_job_flag = false;
		a.current_job = [];
	}
	
  }]);

var data = {
    "paging_info": {
        "next_page": 2,
        "previous_page": null,
        "per_page": 10
    },
    "schedules": [
        {
            "id": 3871,
            "name": "UDS-TrackerDataLoad_Manual",
            "status": "KILLED",
            "concurrency": 5,
            "frequency": 30,
            "time_unit": "minutes",
            "no_catch_up": false,
            "cron_expression": "",
            "user_id": 507,
            "start_time": "2015-07-09 08:00",
            "end_time": "2018-07-09 23:30",
            "time_zone": "UTC",
            "next_materialized_time": "2015-07-10 09:00",
            "command": {
                "query": "drop table if exists loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$;\ncreate external table if not exists loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$ (is_rtb int, timestamp int, user_id string, proto string) \nROW FORMAT DELIMITED FIELDS TERMINATED by '\\t' LINES TERMINATED BY '\\n'\nLOCATION 's3n://komliudslogs/tracker/$year$/$month$/$day$/$hour$/$minute$/';\nset hive.optimize.s3.query=true;\nadd jar s3://komliudsdev/jars/logp-common-2.0.jar;\nadd jar s3://komliudsdev/jars/hiveUdfs-1.0.jar;\nCREATE temporary function protoread AS 'com.komli.hive.udfs.TrackerProtoDeserializer';\n\nINSERT OVERWRITE TABLE udsprod.trackerevent PARTITION(ts_date='$year$-$month$-$day$', ts_hour='$hour$', ts_minute='$minute$')\nSELECT tr.timestamp, tr.isLearning, tr.edgeServerId, tr.sourceComponent, tr.aggregatorId,\n        tr.requestUri, tr.userCookie, tr.userIp, tr.countryId, tr.regionId, tr.cityId, tr.metroId, \n        tr.dma, tr.timeZone, tr.userAgent, tr.publisherId, tr.siteId, tr.foldPosition, tr.refererUrl, \n        tr.uniqueResponseId, tr.uniqueRowId, tr.trackerServerId, tr.dataVersion, tr.totalProcessingTime, \n        tr.intializationTime, tr.requestParsingTime, tr.requestProcessingTime, tr.advertiserId, tr.advertiserIoId,\n        tr.advertiserLiId, tr.creativeId, tr.inventroySourceId, tr.bidStrategyTypeId, tr.pixelId,\n        tr.contentCategoryId, tr.userSegmentId, tr.creativeWidth, tr.creativeHeight, tr.creativeBucketizedHeight,\n        tr.creativeBucketizedWidth, tr.bucketizeAdvertiserLineItemFrequency, tr.trackingType, tr.winningBid,\n        tr.impressions, tr.conversions, tr.clicks, tr.creativeOfferType, tr.statusCode,\n        tr.impressionClickValidationStatusCode, tr.conversionType, tr.advertiserTargetingExpression,\n        tr.userSegments, tr.creativeViewFrequency, tr.creativeClickFrequency, tr.advIOViewFrequency, \n        tr.advIOClickFrequency, tr.impressionPiggybackPixelIds, tr.creativeViewFrequencyOld, tr.dataCenterId, \n        tr.adSpotId, tr.pageType, tr.numSlots, tr.slotPosition, tr.debugStatusCode, tr.targetedSegmentIds,\n        tr.blockedSegmentIds, tr.revenue, tr.budgetSpent, tr.conversionInfo, tr.impressionTime, tr.clickTime,\n        tr.userSignals, tr.sourceType, tr.osId, tr.deviceBrand, tr.deviceModel, tr.deviceType, tr.browser,\n        tr.cost, tr.moneySpent, tr.attributionRatio\nFROM (SELECT rt.timestamp, rt.isLearning, rt.edgeServerId, rt.sourceComponent, rt.aggregatorId,\n\t\trt.requestUri,\n\t\tCASE WHEN (rt.userCookie is null ) THEN null ELSE get_json_object(rt.userCookie, '$.userId') END AS userCookie,\n\t\trt.userIp, rt.countryId, rt.regionId, rt.cityId, rt.metroId, rt.dma, rt.timeZone,\n\t\trt.userAgent, rt.publisherId, rt.siteId, rt.foldPosition, rt.refererUrl, rt.uniqueResponseId,\n\t\trt.uniqueRowId, rt.trackerServerId, rt.dataVersion, rt.totalProcessingTime, rt.intializationTime,\n\t\trt.requestParsingTime, rt.requestProcessingTime, rt.advertiserId, rt.advertiserIoId,\n\t\trt.advertiserLiId, rt.creativeId, rt.inventroySourceId, rt.bidStrategyTypeId, rt.pixelId,\n\t\trt.contentCategoryId, rt.userSegmentId, rt.creativeWidth, rt.creativeHeight, rt.creativeBucketizedHeight,\n\t\trt.creativeBucketizedWidth, rt.bucketizeAdvertiserLineItemFrequency, rt.trackingType, rt.winningBid,\n\t\trt.impressions, rt.conversions, rt.clicks, rt.creativeOfferType, rt.statusCode,\n\t\trt.impressionClickValidationStatusCode, rt.conversionType, rt.advertiserTargetingExpression,\n\t\tCASE WHEN (rt.userSegments is null) THEN null ELSE SPLIT(regexp_replace(get_json_object(concat('{\\\"userSegments\\\":',rt.userSegments,'}'), '$.userSegments.segmentId'), '\\\\[|\\\\]',''),',') END as userSegments,\n\t\trt.creativeViewFrequency, rt.creativeClickFrequency, rt.advIOViewFrequency, rt.advIOClickFrequency,\n\t\tCASE WHEN (rt.impressionPiggybackPixelIds is null) THEN null ELSE SPLIT(regexp_replace(rt.impressionPiggybackPixelIds, '\\\\[|\\\\]',''),',') END AS impressionPiggybackPixelIds,\n\t\trt.creativeViewFrequencyOld, rt.dataCenterId, rt.adSpotId,\n\t\trt.pageType, rt.numSlots, rt.slotPosition, rt.debugStatusCode,\n\t\tCASE WHEN (rt.targetedSegmentIds is null) THEN null ELSE SPLIT(regexp_replace(rt.targetedSegmentIds, '\\\\[|\\\\]',''),',') END AS targetedSegmentIds,\n\t\tCASE WHEN (rt.blockedSegmentIds is null) THEN null ELSE SPLIT(regexp_replace(rt.blockedSegmentIds, '\\\\[|\\\\]',''),',') END AS blockedSegmentIds,\n\t\trt.revenue, rt.budgetSpent,\n\t\tCASE WHEN (rt.conversionInfo is null) THEN null ELSE str_to_map(regexp_replace(rt.conversionInfo, '\\\"|\\\\{|\\\\}', ''),'\\,',':') END AS conversionInfo,\n\t\trt.impressionTime, rt.clickTime,\n\t\tCASE WHEN (rt.userSignals is null) THEN null ELSE str_to_map(regexp_replace(rt.userSignals, '\\\"|\\\\{|\\\\}', ''), '\\,',':') END AS userSignals,\n\t\trt.sourceType, rt.osId, rt.deviceBrand, rt.deviceModel, rt.deviceType, rt.browser,\n\t\trt.cost, rt.moneySpent, rt.attributionRatio,\n\t\tto_date(from_unixtime(cast(rt.timestamp as int))) as ts_date,\n\t        hour(from_unixtime(cast(rt.timestamp as int))) as ts_hour,\n\t        CASE WHEN( cast(minute(from_unixtime(cast(rt.timestamp as int))) as int)/30<1) THEN '0' ELSE '30' END as ts_minute\n\tFROM loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$\n\tLATERAL VIEW json_tuple(protoread(proto), 'timestamp', 'isLearning', 'edgeServerId', 'sourceComponent', 'aggregatorId',\n\t'requestUri', 'userId', 'userIp', 'countryId', 'regionId', 'cityId', 'metroId', 'dma', 'timeZone', 'userAgent',\n\t'publisherId', 'siteId', 'foldPosition', 'refererUrl', 'uniqueResponseId', 'uniqueRowId', 'trackerServerId',\n\t'dataVersion', 'totalProcessingTime', 'intializationTime', 'requestParsingTime', 'requestProcessingTime',\n\t'advertiserId', 'advertiserIoId', 'advertiserLiId', 'creativeId', 'inventroySourceId', 'bidStrategyTypeId',\n\t'pixelId', 'contentCategoryId', 'userSegmentId', 'creativeWidth', 'creativeHeight', 'creativeBucketizedHeight',\n\t'creativeBucketizedWidth', 'bucketizeAdvertiserLineItemFrequency', 'trackingType', 'winningBid', 'impressions',\n\t'conversions', 'clicks', 'creativeOfferType', 'statusCode', 'impressionClickValidationStatusCode', 'conversionType',\n\t'advertiserTargetingExpression', 'userSegments', 'creativeViewFrequency', 'creativeClickFrequency', 'advIOViewFrequency',\n\t'advIOClickFrequency', 'impressionPiggybackPixelIds', 'creativeViewFrequencyOld', 'dataCenterId', 'adSpotId', 'pageType',\n\t'numSlots', 'slotPosition', 'debugStatusCode', 'targetedSegmentIds', 'blockedSegmentIds', 'revenue', 'budgetSpent',\n\t'conversionInfo', 'impressionTime', 'clickTime', 'userSignals', 'sourceType', 'osId', 'deviceBrand', 'deviceModel',\n\t'deviceType', 'browser', 'cost', 'moneySpent', 'attributionRatio') rt as \n\ttimestamp, isLearning, edgeServerId, sourceComponent, aggregatorId, requestUri, userCookie, userIp, countryId, regionId,\n\tcityId, metroId, dma, timeZone, userAgent, publisherId, siteId, foldPosition, refererUrl, uniqueResponseId, uniqueRowId,\n\ttrackerServerId, dataVersion, totalProcessingTime, intializationTime, requestParsingTime, requestProcessingTime, advertiserId,\n\tadvertiserIoId, advertiserLiId, creativeId, inventroySourceId, bidStrategyTypeId, pixelId, contentCategoryId, userSegmentId,\n\tcreativeWidth, creativeHeight, creativeBucketizedHeight, creativeBucketizedWidth, bucketizeAdvertiserLineItemFrequency,\n\ttrackingType, winningBid, impressions, conversions, clicks, creativeOfferType, statusCode, impressionClickValidationStatusCode,\n\tconversionType, advertiserTargetingExpression, userSegments, creativeViewFrequency, creativeClickFrequency, advIOViewFrequency,\n\tadvIOClickFrequency, impressionPiggybackPixelIds, creativeViewFrequencyOld, dataCenterId, adSpotId, pageType, numSlots,\n\tslotPosition, debugStatusCode, targetedSegmentIds, blockedSegmentIds, revenue, budgetSpent, conversionInfo, impressionTime,\n\tclickTime, userSignals, sourceType, osId, deviceBrand, deviceModel, deviceType, browser, cost, moneySpent, attributionRatio) tr \nwhere tr.ts_date='$year$_$month$_$day$' and cast(tr.ts_hour as int)=cast(\"$hour$\" as int) and cast(tr.ts_minute as int)=cast(\"$minute$\" as int);\nDROP TABLE loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$;",
                "sample": false,
                "approx_mode": false,
                "approx_aggregations": false,
                "loader_table_name": null,
                "loader_stable": null,
                "md_cmd": null,
                "script_location": null,
                "retry": 0
            },
            "dependency_info": {
                "files": [
                    {
                        "id": "file1",
                        "window_start": "-2",
                        "path": "s3://komliudslogs/tracker/%Y/%m/%d/%H/%M",
                        "window_end": "-2"
                    }
                ]
            },
            "incremental": {},
            "time_out": 600,
            "command_type": "HiveCommand",
            "macros": [
                {
                    "year": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%Y')"
                },
                {
                    "month": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%m')"
                },
                {
                    "day": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%d')"
                },
                {
                    "hour": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%H')"
                },
                {
                    "minute": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%M')"
                }
            ],
            "template": "generic",
            "pool": null,
            "label": "default",
            "is_digest": false,
            "can_notify": true,
            "digest_time_hour": 0,
            "digest_time_minute": 0,
            "email_list": "shailesh.garg@komli.com",
            "bitmap": 3
        },
        {
            "id": 3872,
            "name": "UDS-TrackerDataLoad_July8_10Fix",
            "status": "DONE",
            "concurrency": 5,
            "frequency": 30,
            "time_unit": "minutes",
            "no_catch_up": false,
            "cron_expression": "",
            "user_id": 507,
            "start_time": "2015-07-08 00:00",
            "end_time": "2015-07-10 23:30",
            "time_zone": "UTC",
            "next_materialized_time": "2015-07-11 00:00",
            "command": {
                "query": "drop table if exists loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$;\ncreate external table if not exists loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$ (is_rtb int, timestamp int, user_id string, proto string) \nROW FORMAT DELIMITED FIELDS TERMINATED by '\\t' LINES TERMINATED BY '\\n'\nLOCATION 's3n://komliudslogs/tracker/$year$/$month$/$day$/$hour$/$minute$/';\nset hive.optimize.s3.query=true;\nadd jar s3://komliudsdev/jars/logp-common-2.0.jar;\nadd jar s3://komliudsdev/jars/hiveUdfs-1.0.jar;\nCREATE temporary function protoread AS 'com.komli.hive.udfs.TrackerProtoDeserializer';\n\nINSERT OVERWRITE TABLE udsprod.trackerevent PARTITION(ts_date='$year$-$month$-$day$', ts_hour='$hour$', ts_minute='$minute$')\nSELECT tr.timestamp, tr.isLearning, tr.edgeServerId, tr.sourceComponent, tr.aggregatorId,\n        tr.requestUri, tr.userCookie, tr.userIp, tr.countryId, tr.regionId, tr.cityId, tr.metroId, \n        tr.dma, tr.timeZone, tr.userAgent, tr.publisherId, tr.siteId, tr.foldPosition, tr.refererUrl, \n        tr.uniqueResponseId, tr.uniqueRowId, tr.trackerServerId, tr.dataVersion, tr.totalProcessingTime, \n        tr.intializationTime, tr.requestParsingTime, tr.requestProcessingTime, tr.advertiserId, tr.advertiserIoId,\n        tr.advertiserLiId, tr.creativeId, tr.inventroySourceId, tr.bidStrategyTypeId, tr.pixelId,\n        tr.contentCategoryId, tr.userSegmentId, tr.creativeWidth, tr.creativeHeight, tr.creativeBucketizedHeight,\n        tr.creativeBucketizedWidth, tr.bucketizeAdvertiserLineItemFrequency, tr.trackingType, tr.winningBid,\n        tr.impressions, tr.conversions, tr.clicks, tr.creativeOfferType, tr.statusCode,\n        tr.impressionClickValidationStatusCode, tr.conversionType, tr.advertiserTargetingExpression,\n        tr.userSegments, tr.creativeViewFrequency, tr.creativeClickFrequency, tr.advIOViewFrequency, \n        tr.advIOClickFrequency, tr.impressionPiggybackPixelIds, tr.creativeViewFrequencyOld, tr.dataCenterId, \n        tr.adSpotId, tr.pageType, tr.numSlots, tr.slotPosition, tr.debugStatusCode, tr.targetedSegmentIds,\n        tr.blockedSegmentIds, tr.revenue, tr.budgetSpent, tr.conversionInfo, tr.impressionTime, tr.clickTime,\n        tr.userSignals, tr.sourceType, tr.osId, tr.deviceBrand, tr.deviceModel, tr.deviceType, tr.browser,\n        tr.cost, tr.moneySpent, tr.attributionRatio\nFROM (SELECT rt.timestamp, rt.isLearning, rt.edgeServerId, rt.sourceComponent, rt.aggregatorId,\n\t\trt.requestUri,\n\t\tCASE WHEN (rt.userCookie is null ) THEN null ELSE get_json_object(rt.userCookie, '$.userId') END AS userCookie,\n\t\trt.userIp, rt.countryId, rt.regionId, rt.cityId, rt.metroId, rt.dma, rt.timeZone,\n\t\trt.userAgent, rt.publisherId, rt.siteId, rt.foldPosition, rt.refererUrl, rt.uniqueResponseId,\n\t\trt.uniqueRowId, rt.trackerServerId, rt.dataVersion, rt.totalProcessingTime, rt.intializationTime,\n\t\trt.requestParsingTime, rt.requestProcessingTime, rt.advertiserId, rt.advertiserIoId,\n\t\trt.advertiserLiId, rt.creativeId, rt.inventroySourceId, rt.bidStrategyTypeId, rt.pixelId,\n\t\trt.contentCategoryId, rt.userSegmentId, rt.creativeWidth, rt.creativeHeight, rt.creativeBucketizedHeight,\n\t\trt.creativeBucketizedWidth, rt.bucketizeAdvertiserLineItemFrequency, rt.trackingType, rt.winningBid,\n\t\trt.impressions, rt.conversions, rt.clicks, rt.creativeOfferType, rt.statusCode,\n\t\trt.impressionClickValidationStatusCode, rt.conversionType, rt.advertiserTargetingExpression,\n\t\tCASE WHEN (rt.userSegments is null) THEN null ELSE SPLIT(regexp_replace(get_json_object(concat('{\\\"userSegments\\\":',rt.userSegments,'}'), '$.userSegments.segmentId'), '\\\\[|\\\\]',''),',') END as userSegments,\n\t\trt.creativeViewFrequency, rt.creativeClickFrequency, rt.advIOViewFrequency, rt.advIOClickFrequency,\n\t\tCASE WHEN (rt.impressionPiggybackPixelIds is null) THEN null ELSE SPLIT(regexp_replace(rt.impressionPiggybackPixelIds, '\\\\[|\\\\]',''),',') END AS impressionPiggybackPixelIds,\n\t\trt.creativeViewFrequencyOld, rt.dataCenterId, rt.adSpotId,\n\t\trt.pageType, rt.numSlots, rt.slotPosition, rt.debugStatusCode,\n\t\tCASE WHEN (rt.targetedSegmentIds is null) THEN null ELSE SPLIT(regexp_replace(rt.targetedSegmentIds, '\\\\[|\\\\]',''),',') END AS targetedSegmentIds,\n\t\tCASE WHEN (rt.blockedSegmentIds is null) THEN null ELSE SPLIT(regexp_replace(rt.blockedSegmentIds, '\\\\[|\\\\]',''),',') END AS blockedSegmentIds,\n\t\trt.revenue, rt.budgetSpent,\n\t\tCASE WHEN (rt.conversionInfo is null) THEN null ELSE str_to_map(regexp_replace(rt.conversionInfo, '\\\"|\\\\{|\\\\}', ''),'\\,',':') END AS conversionInfo,\n\t\trt.impressionTime, rt.clickTime,\n\t\tCASE WHEN (rt.userSignals is null) THEN null ELSE str_to_map(regexp_replace(rt.userSignals, '\\\"|\\\\{|\\\\}', ''), '\\,',':') END AS userSignals,\n\t\trt.sourceType, rt.osId, rt.deviceBrand, rt.deviceModel, rt.deviceType, rt.browser,\n\t\trt.cost, rt.moneySpent, rt.attributionRatio,\n\t\tto_date(from_unixtime(cast(rt.timestamp as int))) as ts_date,\n\t        hour(from_unixtime(cast(rt.timestamp as int))) as ts_hour,\n\t        CASE WHEN( cast(minute(from_unixtime(cast(rt.timestamp as int))) as int)/30<1) THEN '0' ELSE '30' END as ts_minute\n\tFROM loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$\n\tLATERAL VIEW json_tuple(protoread(proto), 'timestamp', 'isLearning', 'edgeServerId', 'sourceComponent', 'aggregatorId',\n\t'requestUri', 'userId', 'userIp', 'countryId', 'regionId', 'cityId', 'metroId', 'dma', 'timeZone', 'userAgent',\n\t'publisherId', 'siteId', 'foldPosition', 'refererUrl', 'uniqueResponseId', 'uniqueRowId', 'trackerServerId',\n\t'dataVersion', 'totalProcessingTime', 'intializationTime', 'requestParsingTime', 'requestProcessingTime',\n\t'advertiserId', 'advertiserIoId', 'advertiserLiId', 'creativeId', 'inventroySourceId', 'bidStrategyTypeId',\n\t'pixelId', 'contentCategoryId', 'userSegmentId', 'creativeWidth', 'creativeHeight', 'creativeBucketizedHeight',\n\t'creativeBucketizedWidth', 'bucketizeAdvertiserLineItemFrequency', 'trackingType', 'winningBid', 'impressions',\n\t'conversions', 'clicks', 'creativeOfferType', 'statusCode', 'impressionClickValidationStatusCode', 'conversionType',\n\t'advertiserTargetingExpression', 'userSegments', 'creativeViewFrequency', 'creativeClickFrequency', 'advIOViewFrequency',\n\t'advIOClickFrequency', 'impressionPiggybackPixelIds', 'creativeViewFrequencyOld', 'dataCenterId', 'adSpotId', 'pageType',\n\t'numSlots', 'slotPosition', 'debugStatusCode', 'targetedSegmentIds', 'blockedSegmentIds', 'revenue', 'budgetSpent',\n\t'conversionInfo', 'impressionTime', 'clickTime', 'userSignals', 'sourceType', 'osId', 'deviceBrand', 'deviceModel',\n\t'deviceType', 'browser', 'cost', 'moneySpent', 'attributionRatio') rt as \n\ttimestamp, isLearning, edgeServerId, sourceComponent, aggregatorId, requestUri, userCookie, userIp, countryId, regionId,\n\tcityId, metroId, dma, timeZone, userAgent, publisherId, siteId, foldPosition, refererUrl, uniqueResponseId, uniqueRowId,\n\ttrackerServerId, dataVersion, totalProcessingTime, intializationTime, requestParsingTime, requestProcessingTime, advertiserId,\n\tadvertiserIoId, advertiserLiId, creativeId, inventroySourceId, bidStrategyTypeId, pixelId, contentCategoryId, userSegmentId,\n\tcreativeWidth, creativeHeight, creativeBucketizedHeight, creativeBucketizedWidth, bucketizeAdvertiserLineItemFrequency,\n\ttrackingType, winningBid, impressions, conversions, clicks, creativeOfferType, statusCode, impressionClickValidationStatusCode,\n\tconversionType, advertiserTargetingExpression, userSegments, creativeViewFrequency, creativeClickFrequency, advIOViewFrequency,\n\tadvIOClickFrequency, impressionPiggybackPixelIds, creativeViewFrequencyOld, dataCenterId, adSpotId, pageType, numSlots,\n\tslotPosition, debugStatusCode, targetedSegmentIds, blockedSegmentIds, revenue, budgetSpent, conversionInfo, impressionTime,\n\tclickTime, userSignals, sourceType, osId, deviceBrand, deviceModel, deviceType, browser, cost, moneySpent, attributionRatio) tr \nwhere tr.ts_date='$year$-$month$-$day$' and cast(tr.ts_hour as int)=cast(\"$hour$\" as int) and cast(tr.ts_minute as int)=cast(\"$minute$\" as int);\nDROP TABLE loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$;",
                "sample": false,
                "approx_mode": false,
                "approx_aggregations": false,
                "loader_table_name": null,
                "loader_stable": null,
                "md_cmd": null,
                "script_location": null,
                "retry": 0
            },
            "dependency_info": {
                "files": [
                    {
                        "path": "s3://komliudslogs/tracker/%Y/%m/%d/%H/%M",
                        "id": "file1",
                        "window_end": "-2",
                        "window_start": "-2"
                    }
                ]
            },
            "incremental": {},
            "time_out": 600,
            "command_type": "HiveCommand",
            "macros": [
                {
                    "year": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%Y')"
                },
                {
                    "month": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%m')"
                },
                {
                    "day": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%d')"
                },
                {
                    "hour": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%H')"
                },
                {
                    "minute": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%M')"
                }
            ],
            "template": "generic",
            "pool": null,
            "label": "default",
            "is_digest": false,
            "can_notify": true,
            "digest_time_hour": 0,
            "digest_time_minute": 0,
            "email_list": "shailesh.garg@komli.com",
            "bitmap": 3
        },
        {
            "id": 3873,
            "name": "UDS-TrackerDataLoad_Aug2_9Fix",
            "status": "DONE",
            "concurrency": 5,
            "frequency": 30,
            "time_unit": "minutes",
            "no_catch_up": false,
            "cron_expression": "",
            "user_id": 507,
            "start_time": "2015-08-02 00:00",
            "end_time": "2015-08-09 23:30",
            "time_zone": "UTC",
            "next_materialized_time": "2015-08-10 00:00",
            "command": {
                "query": "drop table if exists loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$;\ncreate external table if not exists loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$ (is_rtb int, timestamp int, user_id string, proto string) \nROW FORMAT DELIMITED FIELDS TERMINATED by '\\t' LINES TERMINATED BY '\\n'\nLOCATION 's3n://komliudslogs/tracker/$year$/$month$/$day$/$hour$/$minute$/';\nset hive.optimize.s3.query=true;\nadd jar s3://komliudsdev/jars/logp-common-2.0.jar;\nadd jar s3://komliudsdev/jars/hiveUdfs-1.0.jar;\nCREATE temporary function protoread AS 'com.komli.hive.udfs.TrackerProtoDeserializer';\n\nINSERT OVERWRITE TABLE udsprod.trackerevent PARTITION(ts_date='$year$-$month$-$day$', ts_hour='$hour$', ts_minute='$minute$')\nSELECT tr.timestamp, tr.isLearning, tr.edgeServerId, tr.sourceComponent, tr.aggregatorId,\n        tr.requestUri, tr.userCookie, tr.userIp, tr.countryId, tr.regionId, tr.cityId, tr.metroId, \n        tr.dma, tr.timeZone, tr.userAgent, tr.publisherId, tr.siteId, tr.foldPosition, tr.refererUrl, \n        tr.uniqueResponseId, tr.uniqueRowId, tr.trackerServerId, tr.dataVersion, tr.totalProcessingTime, \n        tr.intializationTime, tr.requestParsingTime, tr.requestProcessingTime, tr.advertiserId, tr.advertiserIoId,\n        tr.advertiserLiId, tr.creativeId, tr.inventroySourceId, tr.bidStrategyTypeId, tr.pixelId,\n        tr.contentCategoryId, tr.userSegmentId, tr.creativeWidth, tr.creativeHeight, tr.creativeBucketizedHeight,\n        tr.creativeBucketizedWidth, tr.bucketizeAdvertiserLineItemFrequency, tr.trackingType, tr.winningBid,\n        tr.impressions, tr.conversions, tr.clicks, tr.creativeOfferType, tr.statusCode,\n        tr.impressionClickValidationStatusCode, tr.conversionType, tr.advertiserTargetingExpression,\n        tr.userSegments, tr.creativeViewFrequency, tr.creativeClickFrequency, tr.advIOViewFrequency, \n        tr.advIOClickFrequency, tr.impressionPiggybackPixelIds, tr.creativeViewFrequencyOld, tr.dataCenterId, \n        tr.adSpotId, tr.pageType, tr.numSlots, tr.slotPosition, tr.debugStatusCode, tr.targetedSegmentIds,\n        tr.blockedSegmentIds, tr.revenue, tr.budgetSpent, tr.conversionInfo, tr.impressionTime, tr.clickTime,\n        tr.userSignals, tr.sourceType, tr.osId, tr.deviceBrand, tr.deviceModel, tr.deviceType, tr.browser,\n        tr.cost, tr.moneySpent, tr.attributionRatio\nFROM (SELECT rt.timestamp, rt.isLearning, rt.edgeServerId, rt.sourceComponent, rt.aggregatorId,\n\t\trt.requestUri,\n\t\tCASE WHEN (rt.userCookie is null ) THEN null ELSE get_json_object(rt.userCookie, '$.userId') END AS userCookie,\n\t\trt.userIp, rt.countryId, rt.regionId, rt.cityId, rt.metroId, rt.dma, rt.timeZone,\n\t\trt.userAgent, rt.publisherId, rt.siteId, rt.foldPosition, rt.refererUrl, rt.uniqueResponseId,\n\t\trt.uniqueRowId, rt.trackerServerId, rt.dataVersion, rt.totalProcessingTime, rt.intializationTime,\n\t\trt.requestParsingTime, rt.requestProcessingTime, rt.advertiserId, rt.advertiserIoId,\n\t\trt.advertiserLiId, rt.creativeId, rt.inventroySourceId, rt.bidStrategyTypeId, rt.pixelId,\n\t\trt.contentCategoryId, rt.userSegmentId, rt.creativeWidth, rt.creativeHeight, rt.creativeBucketizedHeight,\n\t\trt.creativeBucketizedWidth, rt.bucketizeAdvertiserLineItemFrequency, rt.trackingType, rt.winningBid,\n\t\trt.impressions, rt.conversions, rt.clicks, rt.creativeOfferType, rt.statusCode,\n\t\trt.impressionClickValidationStatusCode, rt.conversionType, rt.advertiserTargetingExpression,\n\t\tCASE WHEN (rt.userSegments is null) THEN null ELSE SPLIT(regexp_replace(get_json_object(concat('{\\\"userSegments\\\":',rt.userSegments,'}'), '$.userSegments.segmentId'), '\\\\[|\\\\]',''),',') END as userSegments,\n\t\trt.creativeViewFrequency, rt.creativeClickFrequency, rt.advIOViewFrequency, rt.advIOClickFrequency,\n\t\tCASE WHEN (rt.impressionPiggybackPixelIds is null) THEN null ELSE SPLIT(regexp_replace(rt.impressionPiggybackPixelIds, '\\\\[|\\\\]',''),',') END AS impressionPiggybackPixelIds,\n\t\trt.creativeViewFrequencyOld, rt.dataCenterId, rt.adSpotId,\n\t\trt.pageType, rt.numSlots, rt.slotPosition, rt.debugStatusCode,\n\t\tCASE WHEN (rt.targetedSegmentIds is null) THEN null ELSE SPLIT(regexp_replace(rt.targetedSegmentIds, '\\\\[|\\\\]',''),',') END AS targetedSegmentIds,\n\t\tCASE WHEN (rt.blockedSegmentIds is null) THEN null ELSE SPLIT(regexp_replace(rt.blockedSegmentIds, '\\\\[|\\\\]',''),',') END AS blockedSegmentIds,\n\t\trt.revenue, rt.budgetSpent,\n\t\tCASE WHEN (rt.conversionInfo is null) THEN null ELSE str_to_map(regexp_replace(rt.conversionInfo, '\\\"|\\\\{|\\\\}', ''),'\\,',':') END AS conversionInfo,\n\t\trt.impressionTime, rt.clickTime,\n\t\tCASE WHEN (rt.userSignals is null) THEN null ELSE str_to_map(regexp_replace(rt.userSignals, '\\\"|\\\\{|\\\\}', ''), '\\,',':') END AS userSignals,\n\t\trt.sourceType, rt.osId, rt.deviceBrand, rt.deviceModel, rt.deviceType, rt.browser,\n\t\trt.cost, rt.moneySpent, rt.attributionRatio,\n\t\tto_date(from_unixtime(cast(rt.timestamp as int))) as ts_date,\n\t        hour(from_unixtime(cast(rt.timestamp as int))) as ts_hour,\n\t        CASE WHEN( cast(minute(from_unixtime(cast(rt.timestamp as int))) as int)/30<1) THEN '0' ELSE '30' END as ts_minute\n\tFROM loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$\n\tLATERAL VIEW json_tuple(protoread(proto), 'timestamp', 'isLearning', 'edgeServerId', 'sourceComponent', 'aggregatorId',\n\t'requestUri', 'userId', 'userIp', 'countryId', 'regionId', 'cityId', 'metroId', 'dma', 'timeZone', 'userAgent',\n\t'publisherId', 'siteId', 'foldPosition', 'refererUrl', 'uniqueResponseId', 'uniqueRowId', 'trackerServerId',\n\t'dataVersion', 'totalProcessingTime', 'intializationTime', 'requestParsingTime', 'requestProcessingTime',\n\t'advertiserId', 'advertiserIoId', 'advertiserLiId', 'creativeId', 'inventroySourceId', 'bidStrategyTypeId',\n\t'pixelId', 'contentCategoryId', 'userSegmentId', 'creativeWidth', 'creativeHeight', 'creativeBucketizedHeight',\n\t'creativeBucketizedWidth', 'bucketizeAdvertiserLineItemFrequency', 'trackingType', 'winningBid', 'impressions',\n\t'conversions', 'clicks', 'creativeOfferType', 'statusCode', 'impressionClickValidationStatusCode', 'conversionType',\n\t'advertiserTargetingExpression', 'userSegments', 'creativeViewFrequency', 'creativeClickFrequency', 'advIOViewFrequency',\n\t'advIOClickFrequency', 'impressionPiggybackPixelIds', 'creativeViewFrequencyOld', 'dataCenterId', 'adSpotId', 'pageType',\n\t'numSlots', 'slotPosition', 'debugStatusCode', 'targetedSegmentIds', 'blockedSegmentIds', 'revenue', 'budgetSpent',\n\t'conversionInfo', 'impressionTime', 'clickTime', 'userSignals', 'sourceType', 'osId', 'deviceBrand', 'deviceModel',\n\t'deviceType', 'browser', 'cost', 'moneySpent', 'attributionRatio') rt as \n\ttimestamp, isLearning, edgeServerId, sourceComponent, aggregatorId, requestUri, userCookie, userIp, countryId, regionId,\n\tcityId, metroId, dma, timeZone, userAgent, publisherId, siteId, foldPosition, refererUrl, uniqueResponseId, uniqueRowId,\n\ttrackerServerId, dataVersion, totalProcessingTime, intializationTime, requestParsingTime, requestProcessingTime, advertiserId,\n\tadvertiserIoId, advertiserLiId, creativeId, inventroySourceId, bidStrategyTypeId, pixelId, contentCategoryId, userSegmentId,\n\tcreativeWidth, creativeHeight, creativeBucketizedHeight, creativeBucketizedWidth, bucketizeAdvertiserLineItemFrequency,\n\ttrackingType, winningBid, impressions, conversions, clicks, creativeOfferType, statusCode, impressionClickValidationStatusCode,\n\tconversionType, advertiserTargetingExpression, userSegments, creativeViewFrequency, creativeClickFrequency, advIOViewFrequency,\n\tadvIOClickFrequency, impressionPiggybackPixelIds, creativeViewFrequencyOld, dataCenterId, adSpotId, pageType, numSlots,\n\tslotPosition, debugStatusCode, targetedSegmentIds, blockedSegmentIds, revenue, budgetSpent, conversionInfo, impressionTime,\n\tclickTime, userSignals, sourceType, osId, deviceBrand, deviceModel, deviceType, browser, cost, moneySpent, attributionRatio) tr \nwhere tr.ts_date='$year$-$month$-$day$' and cast(tr.ts_hour as int)=cast(\"$hour$\" as int) and cast(tr.ts_minute as int)=cast(\"$minute$\" as int);\nDROP TABLE loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$;",
                "sample": false,
                "approx_mode": false,
                "approx_aggregations": false,
                "loader_table_name": null,
                "loader_stable": null,
                "md_cmd": null,
                "script_location": null,
                "retry": 0
            },
            "dependency_info": {
                "files": [
                    {
                        "id": "file1",
                        "window_start": "-2",
                        "path": "s3://komliudslogs/tracker/%Y/%m/%d/%H/%M",
                        "window_end": "-2"
                    }
                ]
            },
            "incremental": {},
            "time_out": 600,
            "command_type": "HiveCommand",
            "macros": [
                {
                    "year": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%Y')"
                },
                {
                    "month": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%m')"
                },
                {
                    "day": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%d')"
                },
                {
                    "hour": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%H')"
                },
                {
                    "minute": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%M')"
                }
            ],
            "template": "generic",
            "pool": null,
            "label": "default",
            "is_digest": false,
            "can_notify": true,
            "digest_time_hour": 0,
            "digest_time_minute": 0,
            "email_list": "shailesh.garg@komli.com",
            "bitmap": 3
        },
        {
            "id": 3874,
            "name": "UDS-TrackerDataLoad_Aug10_14Fix",
            "status": "DONE",
            "concurrency": 5,
            "frequency": 30,
            "time_unit": "minutes",
            "no_catch_up": false,
            "cron_expression": "",
            "user_id": 507,
            "start_time": "2015-08-10 00:00",
            "end_time": "2015-08-14 23:30",
            "time_zone": "UTC",
            "next_materialized_time": "2015-08-15 00:00",
            "command": {
                "query": "drop table if exists loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$;\ncreate external table if not exists loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$ (is_rtb int, timestamp int, user_id string, proto string) \nROW FORMAT DELIMITED FIELDS TERMINATED by '\\t' LINES TERMINATED BY '\\n'\nLOCATION 's3n://komliudslogs/tracker/$year$/$month$/$day$/$hour$/$minute$/';\nset hive.optimize.s3.query=true;\nadd jar s3://komliudsdev/jars/logp-common-2.0.jar;\nadd jar s3://komliudsdev/jars/hiveUdfs-1.0.jar;\nCREATE temporary function protoread AS 'com.komli.hive.udfs.TrackerProtoDeserializer';\n\nINSERT OVERWRITE TABLE udsprod.trackerevent PARTITION(ts_date='$year$-$month$-$day$', ts_hour='$hour$', ts_minute='$minute$')\nSELECT tr.timestamp, tr.isLearning, tr.edgeServerId, tr.sourceComponent, tr.aggregatorId,\n        tr.requestUri, tr.userCookie, tr.userIp, tr.countryId, tr.regionId, tr.cityId, tr.metroId, \n        tr.dma, tr.timeZone, tr.userAgent, tr.publisherId, tr.siteId, tr.foldPosition, tr.refererUrl, \n        tr.uniqueResponseId, tr.uniqueRowId, tr.trackerServerId, tr.dataVersion, tr.totalProcessingTime, \n        tr.intializationTime, tr.requestParsingTime, tr.requestProcessingTime, tr.advertiserId, tr.advertiserIoId,\n        tr.advertiserLiId, tr.creativeId, tr.inventroySourceId, tr.bidStrategyTypeId, tr.pixelId,\n        tr.contentCategoryId, tr.userSegmentId, tr.creativeWidth, tr.creativeHeight, tr.creativeBucketizedHeight,\n        tr.creativeBucketizedWidth, tr.bucketizeAdvertiserLineItemFrequency, tr.trackingType, tr.winningBid,\n        tr.impressions, tr.conversions, tr.clicks, tr.creativeOfferType, tr.statusCode,\n        tr.impressionClickValidationStatusCode, tr.conversionType, tr.advertiserTargetingExpression,\n        tr.userSegments, tr.creativeViewFrequency, tr.creativeClickFrequency, tr.advIOViewFrequency, \n        tr.advIOClickFrequency, tr.impressionPiggybackPixelIds, tr.creativeViewFrequencyOld, tr.dataCenterId, \n        tr.adSpotId, tr.pageType, tr.numSlots, tr.slotPosition, tr.debugStatusCode, tr.targetedSegmentIds,\n        tr.blockedSegmentIds, tr.revenue, tr.budgetSpent, tr.conversionInfo, tr.impressionTime, tr.clickTime,\n        tr.userSignals, tr.sourceType, tr.osId, tr.deviceBrand, tr.deviceModel, tr.deviceType, tr.browser,\n        tr.cost, tr.moneySpent, tr.attributionRatio\nFROM (SELECT rt.timestamp, rt.isLearning, rt.edgeServerId, rt.sourceComponent, rt.aggregatorId,\n\t\trt.requestUri,\n\t\tCASE WHEN (rt.userCookie is null ) THEN null ELSE get_json_object(rt.userCookie, '$.userId') END AS userCookie,\n\t\trt.userIp, rt.countryId, rt.regionId, rt.cityId, rt.metroId, rt.dma, rt.timeZone,\n\t\trt.userAgent, rt.publisherId, rt.siteId, rt.foldPosition, rt.refererUrl, rt.uniqueResponseId,\n\t\trt.uniqueRowId, rt.trackerServerId, rt.dataVersion, rt.totalProcessingTime, rt.intializationTime,\n\t\trt.requestParsingTime, rt.requestProcessingTime, rt.advertiserId, rt.advertiserIoId,\n\t\trt.advertiserLiId, rt.creativeId, rt.inventroySourceId, rt.bidStrategyTypeId, rt.pixelId,\n\t\trt.contentCategoryId, rt.userSegmentId, rt.creativeWidth, rt.creativeHeight, rt.creativeBucketizedHeight,\n\t\trt.creativeBucketizedWidth, rt.bucketizeAdvertiserLineItemFrequency, rt.trackingType, rt.winningBid,\n\t\trt.impressions, rt.conversions, rt.clicks, rt.creativeOfferType, rt.statusCode,\n\t\trt.impressionClickValidationStatusCode, rt.conversionType, rt.advertiserTargetingExpression,\n\t\tCASE WHEN (rt.userSegments is null) THEN null ELSE SPLIT(regexp_replace(get_json_object(concat('{\\\"userSegments\\\":',rt.userSegments,'}'), '$.userSegments.segmentId'), '\\\\[|\\\\]',''),',') END as userSegments,\n\t\trt.creativeViewFrequency, rt.creativeClickFrequency, rt.advIOViewFrequency, rt.advIOClickFrequency,\n\t\tCASE WHEN (rt.impressionPiggybackPixelIds is null) THEN null ELSE SPLIT(regexp_replace(rt.impressionPiggybackPixelIds, '\\\\[|\\\\]',''),',') END AS impressionPiggybackPixelIds,\n\t\trt.creativeViewFrequencyOld, rt.dataCenterId, rt.adSpotId,\n\t\trt.pageType, rt.numSlots, rt.slotPosition, rt.debugStatusCode,\n\t\tCASE WHEN (rt.targetedSegmentIds is null) THEN null ELSE SPLIT(regexp_replace(rt.targetedSegmentIds, '\\\\[|\\\\]',''),',') END AS targetedSegmentIds,\n\t\tCASE WHEN (rt.blockedSegmentIds is null) THEN null ELSE SPLIT(regexp_replace(rt.blockedSegmentIds, '\\\\[|\\\\]',''),',') END AS blockedSegmentIds,\n\t\trt.revenue, rt.budgetSpent,\n\t\tCASE WHEN (rt.conversionInfo is null) THEN null ELSE str_to_map(regexp_replace(rt.conversionInfo, '\\\"|\\\\{|\\\\}', ''),'\\,',':') END AS conversionInfo,\n\t\trt.impressionTime, rt.clickTime,\n\t\tCASE WHEN (rt.userSignals is null) THEN null ELSE str_to_map(regexp_replace(rt.userSignals, '\\\"|\\\\{|\\\\}', ''), '\\,',':') END AS userSignals,\n\t\trt.sourceType, rt.osId, rt.deviceBrand, rt.deviceModel, rt.deviceType, rt.browser,\n\t\trt.cost, rt.moneySpent, rt.attributionRatio,\n\t\tto_date(from_unixtime(cast(rt.timestamp as int))) as ts_date,\n\t        hour(from_unixtime(cast(rt.timestamp as int))) as ts_hour,\n\t        CASE WHEN( cast(minute(from_unixtime(cast(rt.timestamp as int))) as int)/30<1) THEN '0' ELSE '30' END as ts_minute\n\tFROM loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$\n\tLATERAL VIEW json_tuple(protoread(proto), 'timestamp', 'isLearning', 'edgeServerId', 'sourceComponent', 'aggregatorId',\n\t'requestUri', 'userId', 'userIp', 'countryId', 'regionId', 'cityId', 'metroId', 'dma', 'timeZone', 'userAgent',\n\t'publisherId', 'siteId', 'foldPosition', 'refererUrl', 'uniqueResponseId', 'uniqueRowId', 'trackerServerId',\n\t'dataVersion', 'totalProcessingTime', 'intializationTime', 'requestParsingTime', 'requestProcessingTime',\n\t'advertiserId', 'advertiserIoId', 'advertiserLiId', 'creativeId', 'inventroySourceId', 'bidStrategyTypeId',\n\t'pixelId', 'contentCategoryId', 'userSegmentId', 'creativeWidth', 'creativeHeight', 'creativeBucketizedHeight',\n\t'creativeBucketizedWidth', 'bucketizeAdvertiserLineItemFrequency', 'trackingType', 'winningBid', 'impressions',\n\t'conversions', 'clicks', 'creativeOfferType', 'statusCode', 'impressionClickValidationStatusCode', 'conversionType',\n\t'advertiserTargetingExpression', 'userSegments', 'creativeViewFrequency', 'creativeClickFrequency', 'advIOViewFrequency',\n\t'advIOClickFrequency', 'impressionPiggybackPixelIds', 'creativeViewFrequencyOld', 'dataCenterId', 'adSpotId', 'pageType',\n\t'numSlots', 'slotPosition', 'debugStatusCode', 'targetedSegmentIds', 'blockedSegmentIds', 'revenue', 'budgetSpent',\n\t'conversionInfo', 'impressionTime', 'clickTime', 'userSignals', 'sourceType', 'osId', 'deviceBrand', 'deviceModel',\n\t'deviceType', 'browser', 'cost', 'moneySpent', 'attributionRatio') rt as \n\ttimestamp, isLearning, edgeServerId, sourceComponent, aggregatorId, requestUri, userCookie, userIp, countryId, regionId,\n\tcityId, metroId, dma, timeZone, userAgent, publisherId, siteId, foldPosition, refererUrl, uniqueResponseId, uniqueRowId,\n\ttrackerServerId, dataVersion, totalProcessingTime, intializationTime, requestParsingTime, requestProcessingTime, advertiserId,\n\tadvertiserIoId, advertiserLiId, creativeId, inventroySourceId, bidStrategyTypeId, pixelId, contentCategoryId, userSegmentId,\n\tcreativeWidth, creativeHeight, creativeBucketizedHeight, creativeBucketizedWidth, bucketizeAdvertiserLineItemFrequency,\n\ttrackingType, winningBid, impressions, conversions, clicks, creativeOfferType, statusCode, impressionClickValidationStatusCode,\n\tconversionType, advertiserTargetingExpression, userSegments, creativeViewFrequency, creativeClickFrequency, advIOViewFrequency,\n\tadvIOClickFrequency, impressionPiggybackPixelIds, creativeViewFrequencyOld, dataCenterId, adSpotId, pageType, numSlots,\n\tslotPosition, debugStatusCode, targetedSegmentIds, blockedSegmentIds, revenue, budgetSpent, conversionInfo, impressionTime,\n\tclickTime, userSignals, sourceType, osId, deviceBrand, deviceModel, deviceType, browser, cost, moneySpent, attributionRatio) tr \nwhere tr.ts_date='$year$-$month$-$day$' and cast(tr.ts_hour as int)=cast(\"$hour$\" as int) and cast(tr.ts_minute as int)=cast(\"$minute$\" as int);\nDROP TABLE loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$;",
                "sample": false,
                "approx_mode": false,
                "approx_aggregations": false,
                "loader_table_name": null,
                "loader_stable": null,
                "md_cmd": null,
                "script_location": null,
                "retry": 0
            },
            "dependency_info": {
                "files": [
                    {
                        "id": "file1",
                        "window_end": "-2",
                        "path": "s3://komliudslogs/tracker/%Y/%m/%d/%H/%M",
                        "window_start": "-2"
                    }
                ]
            },
            "incremental": {},
            "time_out": 600,
            "command_type": "HiveCommand",
            "macros": [
                {
                    "year": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%Y')"
                },
                {
                    "month": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%m')"
                },
                {
                    "day": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%d')"
                },
                {
                    "hour": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%H')"
                },
                {
                    "minute": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%M')"
                }
            ],
            "template": "generic",
            "pool": null,
            "label": "default",
            "is_digest": false,
            "can_notify": true,
            "digest_time_hour": 0,
            "digest_time_minute": 0,
            "email_list": "shailesh.garg@komli.com",
            "bitmap": 3
        },
        {
            "id": 3875,
            "name": "UDS-TrackerDataLoad_July11_15Fix",
            "status": "DONE",
            "concurrency": 5,
            "frequency": 30,
            "time_unit": "minutes",
            "no_catch_up": false,
            "cron_expression": "",
            "user_id": 507,
            "start_time": "2015-07-11 00:00",
            "end_time": "2015-07-15 23:30",
            "time_zone": "UTC",
            "next_materialized_time": "2015-07-16 00:00",
            "command": {
                "query": "drop table if exists loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$;\ncreate external table if not exists loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$ (is_rtb int, timestamp int, user_id string, proto string) \nROW FORMAT DELIMITED FIELDS TERMINATED by '\\t' LINES TERMINATED BY '\\n'\nLOCATION 's3n://komliudslogs/tracker/$year$/$month$/$day$/$hour$/$minute$/';\nset hive.optimize.s3.query=true;\nadd jar s3://komliudsdev/jars/logp-common-2.0.jar;\nadd jar s3://komliudsdev/jars/hiveUdfs-1.0.jar;\nCREATE temporary function protoread AS 'com.komli.hive.udfs.TrackerProtoDeserializer';\n\nINSERT OVERWRITE TABLE udsprod.trackerevent PARTITION(ts_date='$year$-$month$-$day$', ts_hour='$hour$', ts_minute='$minute$')\nSELECT tr.timestamp, tr.isLearning, tr.edgeServerId, tr.sourceComponent, tr.aggregatorId,\n        tr.requestUri, tr.userCookie, tr.userIp, tr.countryId, tr.regionId, tr.cityId, tr.metroId, \n        tr.dma, tr.timeZone, tr.userAgent, tr.publisherId, tr.siteId, tr.foldPosition, tr.refererUrl, \n        tr.uniqueResponseId, tr.uniqueRowId, tr.trackerServerId, tr.dataVersion, tr.totalProcessingTime, \n        tr.intializationTime, tr.requestParsingTime, tr.requestProcessingTime, tr.advertiserId, tr.advertiserIoId,\n        tr.advertiserLiId, tr.creativeId, tr.inventroySourceId, tr.bidStrategyTypeId, tr.pixelId,\n        tr.contentCategoryId, tr.userSegmentId, tr.creativeWidth, tr.creativeHeight, tr.creativeBucketizedHeight,\n        tr.creativeBucketizedWidth, tr.bucketizeAdvertiserLineItemFrequency, tr.trackingType, tr.winningBid,\n        tr.impressions, tr.conversions, tr.clicks, tr.creativeOfferType, tr.statusCode,\n        tr.impressionClickValidationStatusCode, tr.conversionType, tr.advertiserTargetingExpression,\n        tr.userSegments, tr.creativeViewFrequency, tr.creativeClickFrequency, tr.advIOViewFrequency, \n        tr.advIOClickFrequency, tr.impressionPiggybackPixelIds, tr.creativeViewFrequencyOld, tr.dataCenterId, \n        tr.adSpotId, tr.pageType, tr.numSlots, tr.slotPosition, tr.debugStatusCode, tr.targetedSegmentIds,\n        tr.blockedSegmentIds, tr.revenue, tr.budgetSpent, tr.conversionInfo, tr.impressionTime, tr.clickTime,\n        tr.userSignals, tr.sourceType, tr.osId, tr.deviceBrand, tr.deviceModel, tr.deviceType, tr.browser,\n        tr.cost, tr.moneySpent, tr.attributionRatio\nFROM (SELECT rt.timestamp, rt.isLearning, rt.edgeServerId, rt.sourceComponent, rt.aggregatorId,\n\t\trt.requestUri,\n\t\tCASE WHEN (rt.userCookie is null ) THEN null ELSE get_json_object(rt.userCookie, '$.userId') END AS userCookie,\n\t\trt.userIp, rt.countryId, rt.regionId, rt.cityId, rt.metroId, rt.dma, rt.timeZone,\n\t\trt.userAgent, rt.publisherId, rt.siteId, rt.foldPosition, rt.refererUrl, rt.uniqueResponseId,\n\t\trt.uniqueRowId, rt.trackerServerId, rt.dataVersion, rt.totalProcessingTime, rt.intializationTime,\n\t\trt.requestParsingTime, rt.requestProcessingTime, rt.advertiserId, rt.advertiserIoId,\n\t\trt.advertiserLiId, rt.creativeId, rt.inventroySourceId, rt.bidStrategyTypeId, rt.pixelId,\n\t\trt.contentCategoryId, rt.userSegmentId, rt.creativeWidth, rt.creativeHeight, rt.creativeBucketizedHeight,\n\t\trt.creativeBucketizedWidth, rt.bucketizeAdvertiserLineItemFrequency, rt.trackingType, rt.winningBid,\n\t\trt.impressions, rt.conversions, rt.clicks, rt.creativeOfferType, rt.statusCode,\n\t\trt.impressionClickValidationStatusCode, rt.conversionType, rt.advertiserTargetingExpression,\n\t\tCASE WHEN (rt.userSegments is null) THEN null ELSE SPLIT(regexp_replace(get_json_object(concat('{\\\"userSegments\\\":',rt.userSegments,'}'), '$.userSegments.segmentId'), '\\\\[|\\\\]',''),',') END as userSegments,\n\t\trt.creativeViewFrequency, rt.creativeClickFrequency, rt.advIOViewFrequency, rt.advIOClickFrequency,\n\t\tCASE WHEN (rt.impressionPiggybackPixelIds is null) THEN null ELSE SPLIT(regexp_replace(rt.impressionPiggybackPixelIds, '\\\\[|\\\\]',''),',') END AS impressionPiggybackPixelIds,\n\t\trt.creativeViewFrequencyOld, rt.dataCenterId, rt.adSpotId,\n\t\trt.pageType, rt.numSlots, rt.slotPosition, rt.debugStatusCode,\n\t\tCASE WHEN (rt.targetedSegmentIds is null) THEN null ELSE SPLIT(regexp_replace(rt.targetedSegmentIds, '\\\\[|\\\\]',''),',') END AS targetedSegmentIds,\n\t\tCASE WHEN (rt.blockedSegmentIds is null) THEN null ELSE SPLIT(regexp_replace(rt.blockedSegmentIds, '\\\\[|\\\\]',''),',') END AS blockedSegmentIds,\n\t\trt.revenue, rt.budgetSpent,\n\t\tCASE WHEN (rt.conversionInfo is null) THEN null ELSE str_to_map(regexp_replace(rt.conversionInfo, '\\\"|\\\\{|\\\\}', ''),'\\,',':') END AS conversionInfo,\n\t\trt.impressionTime, rt.clickTime,\n\t\tCASE WHEN (rt.userSignals is null) THEN null ELSE str_to_map(regexp_replace(rt.userSignals, '\\\"|\\\\{|\\\\}', ''), '\\,',':') END AS userSignals,\n\t\trt.sourceType, rt.osId, rt.deviceBrand, rt.deviceModel, rt.deviceType, rt.browser,\n\t\trt.cost, rt.moneySpent, rt.attributionRatio,\n\t\tto_date(from_unixtime(cast(rt.timestamp as int))) as ts_date,\n\t        hour(from_unixtime(cast(rt.timestamp as int))) as ts_hour,\n\t        CASE WHEN( cast(minute(from_unixtime(cast(rt.timestamp as int))) as int)/30<1) THEN '0' ELSE '30' END as ts_minute\n\tFROM loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$\n\tLATERAL VIEW json_tuple(protoread(proto), 'timestamp', 'isLearning', 'edgeServerId', 'sourceComponent', 'aggregatorId',\n\t'requestUri', 'userId', 'userIp', 'countryId', 'regionId', 'cityId', 'metroId', 'dma', 'timeZone', 'userAgent',\n\t'publisherId', 'siteId', 'foldPosition', 'refererUrl', 'uniqueResponseId', 'uniqueRowId', 'trackerServerId',\n\t'dataVersion', 'totalProcessingTime', 'intializationTime', 'requestParsingTime', 'requestProcessingTime',\n\t'advertiserId', 'advertiserIoId', 'advertiserLiId', 'creativeId', 'inventroySourceId', 'bidStrategyTypeId',\n\t'pixelId', 'contentCategoryId', 'userSegmentId', 'creativeWidth', 'creativeHeight', 'creativeBucketizedHeight',\n\t'creativeBucketizedWidth', 'bucketizeAdvertiserLineItemFrequency', 'trackingType', 'winningBid', 'impressions',\n\t'conversions', 'clicks', 'creativeOfferType', 'statusCode', 'impressionClickValidationStatusCode', 'conversionType',\n\t'advertiserTargetingExpression', 'userSegments', 'creativeViewFrequency', 'creativeClickFrequency', 'advIOViewFrequency',\n\t'advIOClickFrequency', 'impressionPiggybackPixelIds', 'creativeViewFrequencyOld', 'dataCenterId', 'adSpotId', 'pageType',\n\t'numSlots', 'slotPosition', 'debugStatusCode', 'targetedSegmentIds', 'blockedSegmentIds', 'revenue', 'budgetSpent',\n\t'conversionInfo', 'impressionTime', 'clickTime', 'userSignals', 'sourceType', 'osId', 'deviceBrand', 'deviceModel',\n\t'deviceType', 'browser', 'cost', 'moneySpent', 'attributionRatio') rt as \n\ttimestamp, isLearning, edgeServerId, sourceComponent, aggregatorId, requestUri, userCookie, userIp, countryId, regionId,\n\tcityId, metroId, dma, timeZone, userAgent, publisherId, siteId, foldPosition, refererUrl, uniqueResponseId, uniqueRowId,\n\ttrackerServerId, dataVersion, totalProcessingTime, intializationTime, requestParsingTime, requestProcessingTime, advertiserId,\n\tadvertiserIoId, advertiserLiId, creativeId, inventroySourceId, bidStrategyTypeId, pixelId, contentCategoryId, userSegmentId,\n\tcreativeWidth, creativeHeight, creativeBucketizedHeight, creativeBucketizedWidth, bucketizeAdvertiserLineItemFrequency,\n\ttrackingType, winningBid, impressions, conversions, clicks, creativeOfferType, statusCode, impressionClickValidationStatusCode,\n\tconversionType, advertiserTargetingExpression, userSegments, creativeViewFrequency, creativeClickFrequency, advIOViewFrequency,\n\tadvIOClickFrequency, impressionPiggybackPixelIds, creativeViewFrequencyOld, dataCenterId, adSpotId, pageType, numSlots,\n\tslotPosition, debugStatusCode, targetedSegmentIds, blockedSegmentIds, revenue, budgetSpent, conversionInfo, impressionTime,\n\tclickTime, userSignals, sourceType, osId, deviceBrand, deviceModel, deviceType, browser, cost, moneySpent, attributionRatio) tr \nwhere tr.ts_date='$year$-$month$-$day$' and cast(tr.ts_hour as int)=cast(\"$hour$\" as int) and cast(tr.ts_minute as int)=cast(\"$minute$\" as int);\nDROP TABLE loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$;",
                "sample": false,
                "approx_mode": false,
                "approx_aggregations": false,
                "loader_table_name": null,
                "loader_stable": null,
                "md_cmd": null,
                "script_location": null,
                "retry": 0
            },
            "dependency_info": {
                "files": [
                    {
                        "window_end": "-2",
                        "window_start": "-2",
                        "path": "s3://komliudslogs/tracker/%Y/%m/%d/%H/%M",
                        "id": "file1"
                    }
                ]
            },
            "incremental": {},
            "time_out": 600,
            "command_type": "HiveCommand",
            "macros": [
                {
                    "year": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%Y')"
                },
                {
                    "month": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%m')"
                },
                {
                    "day": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%d')"
                },
                {
                    "hour": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%H')"
                },
                {
                    "minute": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%M')"
                }
            ],
            "template": "generic",
            "pool": null,
            "label": "default",
            "is_digest": false,
            "can_notify": true,
            "digest_time_hour": 0,
            "digest_time_minute": 0,
            "email_list": "shailesh.garg@komli.com",
            "bitmap": 3
        },
        {
            "id": 3876,
            "name": "UDS-TrackerDataLoad_July16_20Fix",
            "status": "DONE",
            "concurrency": 5,
            "frequency": 30,
            "time_unit": "minutes",
            "no_catch_up": false,
            "cron_expression": "",
            "user_id": 507,
            "start_time": "2015-07-16 00:00",
            "end_time": "2015-07-20 23:30",
            "time_zone": "UTC",
            "next_materialized_time": "2015-07-21 00:00",
            "command": {
                "query": "drop table if exists loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$;\ncreate external table if not exists loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$ (is_rtb int, timestamp int, user_id string, proto string) \nROW FORMAT DELIMITED FIELDS TERMINATED by '\\t' LINES TERMINATED BY '\\n'\nLOCATION 's3n://komliudslogs/tracker/$year$/$month$/$day$/$hour$/$minute$/';\nset hive.optimize.s3.query=true;\nadd jar s3://komliudsdev/jars/logp-common-2.0.jar;\nadd jar s3://komliudsdev/jars/hiveUdfs-1.0.jar;\nCREATE temporary function protoread AS 'com.komli.hive.udfs.TrackerProtoDeserializer';\n\nINSERT OVERWRITE TABLE udsprod.trackerevent PARTITION(ts_date='$year$-$month$-$day$', ts_hour='$hour$', ts_minute='$minute$')\nSELECT tr.timestamp, tr.isLearning, tr.edgeServerId, tr.sourceComponent, tr.aggregatorId,\n        tr.requestUri, tr.userCookie, tr.userIp, tr.countryId, tr.regionId, tr.cityId, tr.metroId, \n        tr.dma, tr.timeZone, tr.userAgent, tr.publisherId, tr.siteId, tr.foldPosition, tr.refererUrl, \n        tr.uniqueResponseId, tr.uniqueRowId, tr.trackerServerId, tr.dataVersion, tr.totalProcessingTime, \n        tr.intializationTime, tr.requestParsingTime, tr.requestProcessingTime, tr.advertiserId, tr.advertiserIoId,\n        tr.advertiserLiId, tr.creativeId, tr.inventroySourceId, tr.bidStrategyTypeId, tr.pixelId,\n        tr.contentCategoryId, tr.userSegmentId, tr.creativeWidth, tr.creativeHeight, tr.creativeBucketizedHeight,\n        tr.creativeBucketizedWidth, tr.bucketizeAdvertiserLineItemFrequency, tr.trackingType, tr.winningBid,\n        tr.impressions, tr.conversions, tr.clicks, tr.creativeOfferType, tr.statusCode,\n        tr.impressionClickValidationStatusCode, tr.conversionType, tr.advertiserTargetingExpression,\n        tr.userSegments, tr.creativeViewFrequency, tr.creativeClickFrequency, tr.advIOViewFrequency, \n        tr.advIOClickFrequency, tr.impressionPiggybackPixelIds, tr.creativeViewFrequencyOld, tr.dataCenterId, \n        tr.adSpotId, tr.pageType, tr.numSlots, tr.slotPosition, tr.debugStatusCode, tr.targetedSegmentIds,\n        tr.blockedSegmentIds, tr.revenue, tr.budgetSpent, tr.conversionInfo, tr.impressionTime, tr.clickTime,\n        tr.userSignals, tr.sourceType, tr.osId, tr.deviceBrand, tr.deviceModel, tr.deviceType, tr.browser,\n        tr.cost, tr.moneySpent, tr.attributionRatio\nFROM (SELECT rt.timestamp, rt.isLearning, rt.edgeServerId, rt.sourceComponent, rt.aggregatorId,\n\t\trt.requestUri,\n\t\tCASE WHEN (rt.userCookie is null ) THEN null ELSE get_json_object(rt.userCookie, '$.userId') END AS userCookie,\n\t\trt.userIp, rt.countryId, rt.regionId, rt.cityId, rt.metroId, rt.dma, rt.timeZone,\n\t\trt.userAgent, rt.publisherId, rt.siteId, rt.foldPosition, rt.refererUrl, rt.uniqueResponseId,\n\t\trt.uniqueRowId, rt.trackerServerId, rt.dataVersion, rt.totalProcessingTime, rt.intializationTime,\n\t\trt.requestParsingTime, rt.requestProcessingTime, rt.advertiserId, rt.advertiserIoId,\n\t\trt.advertiserLiId, rt.creativeId, rt.inventroySourceId, rt.bidStrategyTypeId, rt.pixelId,\n\t\trt.contentCategoryId, rt.userSegmentId, rt.creativeWidth, rt.creativeHeight, rt.creativeBucketizedHeight,\n\t\trt.creativeBucketizedWidth, rt.bucketizeAdvertiserLineItemFrequency, rt.trackingType, rt.winningBid,\n\t\trt.impressions, rt.conversions, rt.clicks, rt.creativeOfferType, rt.statusCode,\n\t\trt.impressionClickValidationStatusCode, rt.conversionType, rt.advertiserTargetingExpression,\n\t\tCASE WHEN (rt.userSegments is null) THEN null ELSE SPLIT(regexp_replace(get_json_object(concat('{\\\"userSegments\\\":',rt.userSegments,'}'), '$.userSegments.segmentId'), '\\\\[|\\\\]',''),',') END as userSegments,\n\t\trt.creativeViewFrequency, rt.creativeClickFrequency, rt.advIOViewFrequency, rt.advIOClickFrequency,\n\t\tCASE WHEN (rt.impressionPiggybackPixelIds is null) THEN null ELSE SPLIT(regexp_replace(rt.impressionPiggybackPixelIds, '\\\\[|\\\\]',''),',') END AS impressionPiggybackPixelIds,\n\t\trt.creativeViewFrequencyOld, rt.dataCenterId, rt.adSpotId,\n\t\trt.pageType, rt.numSlots, rt.slotPosition, rt.debugStatusCode,\n\t\tCASE WHEN (rt.targetedSegmentIds is null) THEN null ELSE SPLIT(regexp_replace(rt.targetedSegmentIds, '\\\\[|\\\\]',''),',') END AS targetedSegmentIds,\n\t\tCASE WHEN (rt.blockedSegmentIds is null) THEN null ELSE SPLIT(regexp_replace(rt.blockedSegmentIds, '\\\\[|\\\\]',''),',') END AS blockedSegmentIds,\n\t\trt.revenue, rt.budgetSpent,\n\t\tCASE WHEN (rt.conversionInfo is null) THEN null ELSE str_to_map(regexp_replace(rt.conversionInfo, '\\\"|\\\\{|\\\\}', ''),'\\,',':') END AS conversionInfo,\n\t\trt.impressionTime, rt.clickTime,\n\t\tCASE WHEN (rt.userSignals is null) THEN null ELSE str_to_map(regexp_replace(rt.userSignals, '\\\"|\\\\{|\\\\}', ''), '\\,',':') END AS userSignals,\n\t\trt.sourceType, rt.osId, rt.deviceBrand, rt.deviceModel, rt.deviceType, rt.browser,\n\t\trt.cost, rt.moneySpent, rt.attributionRatio,\n\t\tto_date(from_unixtime(cast(rt.timestamp as int))) as ts_date,\n\t        hour(from_unixtime(cast(rt.timestamp as int))) as ts_hour,\n\t        CASE WHEN( cast(minute(from_unixtime(cast(rt.timestamp as int))) as int)/30<1) THEN '0' ELSE '30' END as ts_minute\n\tFROM loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$\n\tLATERAL VIEW json_tuple(protoread(proto), 'timestamp', 'isLearning', 'edgeServerId', 'sourceComponent', 'aggregatorId',\n\t'requestUri', 'userId', 'userIp', 'countryId', 'regionId', 'cityId', 'metroId', 'dma', 'timeZone', 'userAgent',\n\t'publisherId', 'siteId', 'foldPosition', 'refererUrl', 'uniqueResponseId', 'uniqueRowId', 'trackerServerId',\n\t'dataVersion', 'totalProcessingTime', 'intializationTime', 'requestParsingTime', 'requestProcessingTime',\n\t'advertiserId', 'advertiserIoId', 'advertiserLiId', 'creativeId', 'inventroySourceId', 'bidStrategyTypeId',\n\t'pixelId', 'contentCategoryId', 'userSegmentId', 'creativeWidth', 'creativeHeight', 'creativeBucketizedHeight',\n\t'creativeBucketizedWidth', 'bucketizeAdvertiserLineItemFrequency', 'trackingType', 'winningBid', 'impressions',\n\t'conversions', 'clicks', 'creativeOfferType', 'statusCode', 'impressionClickValidationStatusCode', 'conversionType',\n\t'advertiserTargetingExpression', 'userSegments', 'creativeViewFrequency', 'creativeClickFrequency', 'advIOViewFrequency',\n\t'advIOClickFrequency', 'impressionPiggybackPixelIds', 'creativeViewFrequencyOld', 'dataCenterId', 'adSpotId', 'pageType',\n\t'numSlots', 'slotPosition', 'debugStatusCode', 'targetedSegmentIds', 'blockedSegmentIds', 'revenue', 'budgetSpent',\n\t'conversionInfo', 'impressionTime', 'clickTime', 'userSignals', 'sourceType', 'osId', 'deviceBrand', 'deviceModel',\n\t'deviceType', 'browser', 'cost', 'moneySpent', 'attributionRatio') rt as \n\ttimestamp, isLearning, edgeServerId, sourceComponent, aggregatorId, requestUri, userCookie, userIp, countryId, regionId,\n\tcityId, metroId, dma, timeZone, userAgent, publisherId, siteId, foldPosition, refererUrl, uniqueResponseId, uniqueRowId,\n\ttrackerServerId, dataVersion, totalProcessingTime, intializationTime, requestParsingTime, requestProcessingTime, advertiserId,\n\tadvertiserIoId, advertiserLiId, creativeId, inventroySourceId, bidStrategyTypeId, pixelId, contentCategoryId, userSegmentId,\n\tcreativeWidth, creativeHeight, creativeBucketizedHeight, creativeBucketizedWidth, bucketizeAdvertiserLineItemFrequency,\n\ttrackingType, winningBid, impressions, conversions, clicks, creativeOfferType, statusCode, impressionClickValidationStatusCode,\n\tconversionType, advertiserTargetingExpression, userSegments, creativeViewFrequency, creativeClickFrequency, advIOViewFrequency,\n\tadvIOClickFrequency, impressionPiggybackPixelIds, creativeViewFrequencyOld, dataCenterId, adSpotId, pageType, numSlots,\n\tslotPosition, debugStatusCode, targetedSegmentIds, blockedSegmentIds, revenue, budgetSpent, conversionInfo, impressionTime,\n\tclickTime, userSignals, sourceType, osId, deviceBrand, deviceModel, deviceType, browser, cost, moneySpent, attributionRatio) tr \nwhere tr.ts_date='$year$-$month$-$day$' and cast(tr.ts_hour as int)=cast(\"$hour$\" as int) and cast(tr.ts_minute as int)=cast(\"$minute$\" as int);\nDROP TABLE loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$;",
                "sample": false,
                "approx_mode": false,
                "approx_aggregations": false,
                "loader_table_name": null,
                "loader_stable": null,
                "md_cmd": null,
                "script_location": null,
                "retry": 0
            },
            "dependency_info": {
                "files": [
                    {
                        "id": "file1",
                        "window_start": "-2",
                        "window_end": "-2",
                        "path": "s3://komliudslogs/tracker/%Y/%m/%d/%H/%M"
                    }
                ]
            },
            "incremental": {},
            "time_out": 600,
            "command_type": "HiveCommand",
            "macros": [
                {
                    "year": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%Y')"
                },
                {
                    "month": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%m')"
                },
                {
                    "day": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%d')"
                },
                {
                    "hour": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%H')"
                },
                {
                    "minute": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%M')"
                }
            ],
            "template": "generic",
            "pool": null,
            "label": "default",
            "is_digest": false,
            "can_notify": true,
            "digest_time_hour": 0,
            "digest_time_minute": 0,
            "email_list": "shailesh.garg@komli.com",
            "bitmap": 3
        },
        {
            "id": 3877,
            "name": "UDS-TrackerDataLoad_July21_25Fix",
            "status": "DONE",
            "concurrency": 5,
            "frequency": 30,
            "time_unit": "minutes",
            "no_catch_up": false,
            "cron_expression": "",
            "user_id": 507,
            "start_time": "2015-07-21 00:00",
            "end_time": "2015-07-25 23:30",
            "time_zone": "UTC",
            "next_materialized_time": "2015-07-26 00:00",
            "command": {
                "query": "drop table if exists loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$;\ncreate external table if not exists loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$ (is_rtb int, timestamp int, user_id string, proto string) \nROW FORMAT DELIMITED FIELDS TERMINATED by '\\t' LINES TERMINATED BY '\\n'\nLOCATION 's3n://komliudslogs/tracker/$year$/$month$/$day$/$hour$/$minute$/';\nset hive.optimize.s3.query=true;\nadd jar s3://komliudsdev/jars/logp-common-2.0.jar;\nadd jar s3://komliudsdev/jars/hiveUdfs-1.0.jar;\nCREATE temporary function protoread AS 'com.komli.hive.udfs.TrackerProtoDeserializer';\n\nINSERT OVERWRITE TABLE udsprod.trackerevent PARTITION(ts_date='$year$-$month$-$day$', ts_hour='$hour$', ts_minute='$minute$')\nSELECT tr.timestamp, tr.isLearning, tr.edgeServerId, tr.sourceComponent, tr.aggregatorId,\n        tr.requestUri, tr.userCookie, tr.userIp, tr.countryId, tr.regionId, tr.cityId, tr.metroId, \n        tr.dma, tr.timeZone, tr.userAgent, tr.publisherId, tr.siteId, tr.foldPosition, tr.refererUrl, \n        tr.uniqueResponseId, tr.uniqueRowId, tr.trackerServerId, tr.dataVersion, tr.totalProcessingTime, \n        tr.intializationTime, tr.requestParsingTime, tr.requestProcessingTime, tr.advertiserId, tr.advertiserIoId,\n        tr.advertiserLiId, tr.creativeId, tr.inventroySourceId, tr.bidStrategyTypeId, tr.pixelId,\n        tr.contentCategoryId, tr.userSegmentId, tr.creativeWidth, tr.creativeHeight, tr.creativeBucketizedHeight,\n        tr.creativeBucketizedWidth, tr.bucketizeAdvertiserLineItemFrequency, tr.trackingType, tr.winningBid,\n        tr.impressions, tr.conversions, tr.clicks, tr.creativeOfferType, tr.statusCode,\n        tr.impressionClickValidationStatusCode, tr.conversionType, tr.advertiserTargetingExpression,\n        tr.userSegments, tr.creativeViewFrequency, tr.creativeClickFrequency, tr.advIOViewFrequency, \n        tr.advIOClickFrequency, tr.impressionPiggybackPixelIds, tr.creativeViewFrequencyOld, tr.dataCenterId, \n        tr.adSpotId, tr.pageType, tr.numSlots, tr.slotPosition, tr.debugStatusCode, tr.targetedSegmentIds,\n        tr.blockedSegmentIds, tr.revenue, tr.budgetSpent, tr.conversionInfo, tr.impressionTime, tr.clickTime,\n        tr.userSignals, tr.sourceType, tr.osId, tr.deviceBrand, tr.deviceModel, tr.deviceType, tr.browser,\n        tr.cost, tr.moneySpent, tr.attributionRatio\nFROM (SELECT rt.timestamp, rt.isLearning, rt.edgeServerId, rt.sourceComponent, rt.aggregatorId,\n\t\trt.requestUri,\n\t\tCASE WHEN (rt.userCookie is null ) THEN null ELSE get_json_object(rt.userCookie, '$.userId') END AS userCookie,\n\t\trt.userIp, rt.countryId, rt.regionId, rt.cityId, rt.metroId, rt.dma, rt.timeZone,\n\t\trt.userAgent, rt.publisherId, rt.siteId, rt.foldPosition, rt.refererUrl, rt.uniqueResponseId,\n\t\trt.uniqueRowId, rt.trackerServerId, rt.dataVersion, rt.totalProcessingTime, rt.intializationTime,\n\t\trt.requestParsingTime, rt.requestProcessingTime, rt.advertiserId, rt.advertiserIoId,\n\t\trt.advertiserLiId, rt.creativeId, rt.inventroySourceId, rt.bidStrategyTypeId, rt.pixelId,\n\t\trt.contentCategoryId, rt.userSegmentId, rt.creativeWidth, rt.creativeHeight, rt.creativeBucketizedHeight,\n\t\trt.creativeBucketizedWidth, rt.bucketizeAdvertiserLineItemFrequency, rt.trackingType, rt.winningBid,\n\t\trt.impressions, rt.conversions, rt.clicks, rt.creativeOfferType, rt.statusCode,\n\t\trt.impressionClickValidationStatusCode, rt.conversionType, rt.advertiserTargetingExpression,\n\t\tCASE WHEN (rt.userSegments is null) THEN null ELSE SPLIT(regexp_replace(get_json_object(concat('{\\\"userSegments\\\":',rt.userSegments,'}'), '$.userSegments.segmentId'), '\\\\[|\\\\]',''),',') END as userSegments,\n\t\trt.creativeViewFrequency, rt.creativeClickFrequency, rt.advIOViewFrequency, rt.advIOClickFrequency,\n\t\tCASE WHEN (rt.impressionPiggybackPixelIds is null) THEN null ELSE SPLIT(regexp_replace(rt.impressionPiggybackPixelIds, '\\\\[|\\\\]',''),',') END AS impressionPiggybackPixelIds,\n\t\trt.creativeViewFrequencyOld, rt.dataCenterId, rt.adSpotId,\n\t\trt.pageType, rt.numSlots, rt.slotPosition, rt.debugStatusCode,\n\t\tCASE WHEN (rt.targetedSegmentIds is null) THEN null ELSE SPLIT(regexp_replace(rt.targetedSegmentIds, '\\\\[|\\\\]',''),',') END AS targetedSegmentIds,\n\t\tCASE WHEN (rt.blockedSegmentIds is null) THEN null ELSE SPLIT(regexp_replace(rt.blockedSegmentIds, '\\\\[|\\\\]',''),',') END AS blockedSegmentIds,\n\t\trt.revenue, rt.budgetSpent,\n\t\tCASE WHEN (rt.conversionInfo is null) THEN null ELSE str_to_map(regexp_replace(rt.conversionInfo, '\\\"|\\\\{|\\\\}', ''),'\\,',':') END AS conversionInfo,\n\t\trt.impressionTime, rt.clickTime,\n\t\tCASE WHEN (rt.userSignals is null) THEN null ELSE str_to_map(regexp_replace(rt.userSignals, '\\\"|\\\\{|\\\\}', ''), '\\,',':') END AS userSignals,\n\t\trt.sourceType, rt.osId, rt.deviceBrand, rt.deviceModel, rt.deviceType, rt.browser,\n\t\trt.cost, rt.moneySpent, rt.attributionRatio,\n\t\tto_date(from_unixtime(cast(rt.timestamp as int))) as ts_date,\n\t        hour(from_unixtime(cast(rt.timestamp as int))) as ts_hour,\n\t        CASE WHEN( cast(minute(from_unixtime(cast(rt.timestamp as int))) as int)/30<1) THEN '0' ELSE '30' END as ts_minute\n\tFROM loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$\n\tLATERAL VIEW json_tuple(protoread(proto), 'timestamp', 'isLearning', 'edgeServerId', 'sourceComponent', 'aggregatorId',\n\t'requestUri', 'userId', 'userIp', 'countryId', 'regionId', 'cityId', 'metroId', 'dma', 'timeZone', 'userAgent',\n\t'publisherId', 'siteId', 'foldPosition', 'refererUrl', 'uniqueResponseId', 'uniqueRowId', 'trackerServerId',\n\t'dataVersion', 'totalProcessingTime', 'intializationTime', 'requestParsingTime', 'requestProcessingTime',\n\t'advertiserId', 'advertiserIoId', 'advertiserLiId', 'creativeId', 'inventroySourceId', 'bidStrategyTypeId',\n\t'pixelId', 'contentCategoryId', 'userSegmentId', 'creativeWidth', 'creativeHeight', 'creativeBucketizedHeight',\n\t'creativeBucketizedWidth', 'bucketizeAdvertiserLineItemFrequency', 'trackingType', 'winningBid', 'impressions',\n\t'conversions', 'clicks', 'creativeOfferType', 'statusCode', 'impressionClickValidationStatusCode', 'conversionType',\n\t'advertiserTargetingExpression', 'userSegments', 'creativeViewFrequency', 'creativeClickFrequency', 'advIOViewFrequency',\n\t'advIOClickFrequency', 'impressionPiggybackPixelIds', 'creativeViewFrequencyOld', 'dataCenterId', 'adSpotId', 'pageType',\n\t'numSlots', 'slotPosition', 'debugStatusCode', 'targetedSegmentIds', 'blockedSegmentIds', 'revenue', 'budgetSpent',\n\t'conversionInfo', 'impressionTime', 'clickTime', 'userSignals', 'sourceType', 'osId', 'deviceBrand', 'deviceModel',\n\t'deviceType', 'browser', 'cost', 'moneySpent', 'attributionRatio') rt as \n\ttimestamp, isLearning, edgeServerId, sourceComponent, aggregatorId, requestUri, userCookie, userIp, countryId, regionId,\n\tcityId, metroId, dma, timeZone, userAgent, publisherId, siteId, foldPosition, refererUrl, uniqueResponseId, uniqueRowId,\n\ttrackerServerId, dataVersion, totalProcessingTime, intializationTime, requestParsingTime, requestProcessingTime, advertiserId,\n\tadvertiserIoId, advertiserLiId, creativeId, inventroySourceId, bidStrategyTypeId, pixelId, contentCategoryId, userSegmentId,\n\tcreativeWidth, creativeHeight, creativeBucketizedHeight, creativeBucketizedWidth, bucketizeAdvertiserLineItemFrequency,\n\ttrackingType, winningBid, impressions, conversions, clicks, creativeOfferType, statusCode, impressionClickValidationStatusCode,\n\tconversionType, advertiserTargetingExpression, userSegments, creativeViewFrequency, creativeClickFrequency, advIOViewFrequency,\n\tadvIOClickFrequency, impressionPiggybackPixelIds, creativeViewFrequencyOld, dataCenterId, adSpotId, pageType, numSlots,\n\tslotPosition, debugStatusCode, targetedSegmentIds, blockedSegmentIds, revenue, budgetSpent, conversionInfo, impressionTime,\n\tclickTime, userSignals, sourceType, osId, deviceBrand, deviceModel, deviceType, browser, cost, moneySpent, attributionRatio) tr \nwhere tr.ts_date='$year$-$month$-$day$' and cast(tr.ts_hour as int)=cast(\"$hour$\" as int) and cast(tr.ts_minute as int)=cast(\"$minute$\" as int);\nDROP TABLE loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$;",
                "sample": false,
                "approx_mode": false,
                "approx_aggregations": false,
                "loader_table_name": null,
                "loader_stable": null,
                "md_cmd": null,
                "script_location": null,
                "retry": 0
            },
            "dependency_info": {
                "files": [
                    {
                        "window_start": "-2",
                        "window_end": "-2",
                        "id": "file1",
                        "path": "s3://komliudslogs/tracker/%Y/%m/%d/%H/%M"
                    }
                ]
            },
            "incremental": {},
            "time_out": 600,
            "command_type": "HiveCommand",
            "macros": [
                {
                    "year": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%Y')"
                },
                {
                    "month": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%m')"
                },
                {
                    "day": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%d')"
                },
                {
                    "hour": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%H')"
                },
                {
                    "minute": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%M')"
                }
            ],
            "template": "generic",
            "pool": null,
            "label": "default",
            "is_digest": false,
            "can_notify": true,
            "digest_time_hour": 0,
            "digest_time_minute": 0,
            "email_list": "shailesh.garg@komli.com",
            "bitmap": 3
        },
        {
            "id": 3878,
            "name": "UDS-TrackerDataLoad_July26_31Fix",
            "status": "DONE",
            "concurrency": 5,
            "frequency": 30,
            "time_unit": "minutes",
            "no_catch_up": false,
            "cron_expression": "",
            "user_id": 507,
            "start_time": "2015-07-26 00:00",
            "end_time": "2015-07-31 23:30",
            "time_zone": "UTC",
            "next_materialized_time": "2015-08-01 00:00",
            "command": {
                "query": "drop table if exists loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$;\ncreate external table if not exists loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$ (is_rtb int, timestamp int, user_id string, proto string) \nROW FORMAT DELIMITED FIELDS TERMINATED by '\\t' LINES TERMINATED BY '\\n'\nLOCATION 's3n://komliudslogs/tracker/$year$/$month$/$day$/$hour$/$minute$/';\nset hive.optimize.s3.query=true;\nadd jar s3://komliudsdev/jars/logp-common-2.0.jar;\nadd jar s3://komliudsdev/jars/hiveUdfs-1.0.jar;\nCREATE temporary function protoread AS 'com.komli.hive.udfs.TrackerProtoDeserializer';\n\nINSERT OVERWRITE TABLE udsprod.trackerevent PARTITION(ts_date='$year$-$month$-$day$', ts_hour='$hour$', ts_minute='$minute$')\nSELECT tr.timestamp, tr.isLearning, tr.edgeServerId, tr.sourceComponent, tr.aggregatorId,\n        tr.requestUri, tr.userCookie, tr.userIp, tr.countryId, tr.regionId, tr.cityId, tr.metroId, \n        tr.dma, tr.timeZone, tr.userAgent, tr.publisherId, tr.siteId, tr.foldPosition, tr.refererUrl, \n        tr.uniqueResponseId, tr.uniqueRowId, tr.trackerServerId, tr.dataVersion, tr.totalProcessingTime, \n        tr.intializationTime, tr.requestParsingTime, tr.requestProcessingTime, tr.advertiserId, tr.advertiserIoId,\n        tr.advertiserLiId, tr.creativeId, tr.inventroySourceId, tr.bidStrategyTypeId, tr.pixelId,\n        tr.contentCategoryId, tr.userSegmentId, tr.creativeWidth, tr.creativeHeight, tr.creativeBucketizedHeight,\n        tr.creativeBucketizedWidth, tr.bucketizeAdvertiserLineItemFrequency, tr.trackingType, tr.winningBid,\n        tr.impressions, tr.conversions, tr.clicks, tr.creativeOfferType, tr.statusCode,\n        tr.impressionClickValidationStatusCode, tr.conversionType, tr.advertiserTargetingExpression,\n        tr.userSegments, tr.creativeViewFrequency, tr.creativeClickFrequency, tr.advIOViewFrequency, \n        tr.advIOClickFrequency, tr.impressionPiggybackPixelIds, tr.creativeViewFrequencyOld, tr.dataCenterId, \n        tr.adSpotId, tr.pageType, tr.numSlots, tr.slotPosition, tr.debugStatusCode, tr.targetedSegmentIds,\n        tr.blockedSegmentIds, tr.revenue, tr.budgetSpent, tr.conversionInfo, tr.impressionTime, tr.clickTime,\n        tr.userSignals, tr.sourceType, tr.osId, tr.deviceBrand, tr.deviceModel, tr.deviceType, tr.browser,\n        tr.cost, tr.moneySpent, tr.attributionRatio\nFROM (SELECT rt.timestamp, rt.isLearning, rt.edgeServerId, rt.sourceComponent, rt.aggregatorId,\n\t\trt.requestUri,\n\t\tCASE WHEN (rt.userCookie is null ) THEN null ELSE get_json_object(rt.userCookie, '$.userId') END AS userCookie,\n\t\trt.userIp, rt.countryId, rt.regionId, rt.cityId, rt.metroId, rt.dma, rt.timeZone,\n\t\trt.userAgent, rt.publisherId, rt.siteId, rt.foldPosition, rt.refererUrl, rt.uniqueResponseId,\n\t\trt.uniqueRowId, rt.trackerServerId, rt.dataVersion, rt.totalProcessingTime, rt.intializationTime,\n\t\trt.requestParsingTime, rt.requestProcessingTime, rt.advertiserId, rt.advertiserIoId,\n\t\trt.advertiserLiId, rt.creativeId, rt.inventroySourceId, rt.bidStrategyTypeId, rt.pixelId,\n\t\trt.contentCategoryId, rt.userSegmentId, rt.creativeWidth, rt.creativeHeight, rt.creativeBucketizedHeight,\n\t\trt.creativeBucketizedWidth, rt.bucketizeAdvertiserLineItemFrequency, rt.trackingType, rt.winningBid,\n\t\trt.impressions, rt.conversions, rt.clicks, rt.creativeOfferType, rt.statusCode,\n\t\trt.impressionClickValidationStatusCode, rt.conversionType, rt.advertiserTargetingExpression,\n\t\tCASE WHEN (rt.userSegments is null) THEN null ELSE SPLIT(regexp_replace(get_json_object(concat('{\\\"userSegments\\\":',rt.userSegments,'}'), '$.userSegments.segmentId'), '\\\\[|\\\\]',''),',') END as userSegments,\n\t\trt.creativeViewFrequency, rt.creativeClickFrequency, rt.advIOViewFrequency, rt.advIOClickFrequency,\n\t\tCASE WHEN (rt.impressionPiggybackPixelIds is null) THEN null ELSE SPLIT(regexp_replace(rt.impressionPiggybackPixelIds, '\\\\[|\\\\]',''),',') END AS impressionPiggybackPixelIds,\n\t\trt.creativeViewFrequencyOld, rt.dataCenterId, rt.adSpotId,\n\t\trt.pageType, rt.numSlots, rt.slotPosition, rt.debugStatusCode,\n\t\tCASE WHEN (rt.targetedSegmentIds is null) THEN null ELSE SPLIT(regexp_replace(rt.targetedSegmentIds, '\\\\[|\\\\]',''),',') END AS targetedSegmentIds,\n\t\tCASE WHEN (rt.blockedSegmentIds is null) THEN null ELSE SPLIT(regexp_replace(rt.blockedSegmentIds, '\\\\[|\\\\]',''),',') END AS blockedSegmentIds,\n\t\trt.revenue, rt.budgetSpent,\n\t\tCASE WHEN (rt.conversionInfo is null) THEN null ELSE str_to_map(regexp_replace(rt.conversionInfo, '\\\"|\\\\{|\\\\}', ''),'\\,',':') END AS conversionInfo,\n\t\trt.impressionTime, rt.clickTime,\n\t\tCASE WHEN (rt.userSignals is null) THEN null ELSE str_to_map(regexp_replace(rt.userSignals, '\\\"|\\\\{|\\\\}', ''), '\\,',':') END AS userSignals,\n\t\trt.sourceType, rt.osId, rt.deviceBrand, rt.deviceModel, rt.deviceType, rt.browser,\n\t\trt.cost, rt.moneySpent, rt.attributionRatio,\n\t\tto_date(from_unixtime(cast(rt.timestamp as int))) as ts_date,\n\t        hour(from_unixtime(cast(rt.timestamp as int))) as ts_hour,\n\t        CASE WHEN( cast(minute(from_unixtime(cast(rt.timestamp as int))) as int)/30<1) THEN '0' ELSE '30' END as ts_minute\n\tFROM loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$\n\tLATERAL VIEW json_tuple(protoread(proto), 'timestamp', 'isLearning', 'edgeServerId', 'sourceComponent', 'aggregatorId',\n\t'requestUri', 'userId', 'userIp', 'countryId', 'regionId', 'cityId', 'metroId', 'dma', 'timeZone', 'userAgent',\n\t'publisherId', 'siteId', 'foldPosition', 'refererUrl', 'uniqueResponseId', 'uniqueRowId', 'trackerServerId',\n\t'dataVersion', 'totalProcessingTime', 'intializationTime', 'requestParsingTime', 'requestProcessingTime',\n\t'advertiserId', 'advertiserIoId', 'advertiserLiId', 'creativeId', 'inventroySourceId', 'bidStrategyTypeId',\n\t'pixelId', 'contentCategoryId', 'userSegmentId', 'creativeWidth', 'creativeHeight', 'creativeBucketizedHeight',\n\t'creativeBucketizedWidth', 'bucketizeAdvertiserLineItemFrequency', 'trackingType', 'winningBid', 'impressions',\n\t'conversions', 'clicks', 'creativeOfferType', 'statusCode', 'impressionClickValidationStatusCode', 'conversionType',\n\t'advertiserTargetingExpression', 'userSegments', 'creativeViewFrequency', 'creativeClickFrequency', 'advIOViewFrequency',\n\t'advIOClickFrequency', 'impressionPiggybackPixelIds', 'creativeViewFrequencyOld', 'dataCenterId', 'adSpotId', 'pageType',\n\t'numSlots', 'slotPosition', 'debugStatusCode', 'targetedSegmentIds', 'blockedSegmentIds', 'revenue', 'budgetSpent',\n\t'conversionInfo', 'impressionTime', 'clickTime', 'userSignals', 'sourceType', 'osId', 'deviceBrand', 'deviceModel',\n\t'deviceType', 'browser', 'cost', 'moneySpent', 'attributionRatio') rt as \n\ttimestamp, isLearning, edgeServerId, sourceComponent, aggregatorId, requestUri, userCookie, userIp, countryId, regionId,\n\tcityId, metroId, dma, timeZone, userAgent, publisherId, siteId, foldPosition, refererUrl, uniqueResponseId, uniqueRowId,\n\ttrackerServerId, dataVersion, totalProcessingTime, intializationTime, requestParsingTime, requestProcessingTime, advertiserId,\n\tadvertiserIoId, advertiserLiId, creativeId, inventroySourceId, bidStrategyTypeId, pixelId, contentCategoryId, userSegmentId,\n\tcreativeWidth, creativeHeight, creativeBucketizedHeight, creativeBucketizedWidth, bucketizeAdvertiserLineItemFrequency,\n\ttrackingType, winningBid, impressions, conversions, clicks, creativeOfferType, statusCode, impressionClickValidationStatusCode,\n\tconversionType, advertiserTargetingExpression, userSegments, creativeViewFrequency, creativeClickFrequency, advIOViewFrequency,\n\tadvIOClickFrequency, impressionPiggybackPixelIds, creativeViewFrequencyOld, dataCenterId, adSpotId, pageType, numSlots,\n\tslotPosition, debugStatusCode, targetedSegmentIds, blockedSegmentIds, revenue, budgetSpent, conversionInfo, impressionTime,\n\tclickTime, userSignals, sourceType, osId, deviceBrand, deviceModel, deviceType, browser, cost, moneySpent, attributionRatio) tr \nwhere tr.ts_date='$year$-$month$-$day$' and cast(tr.ts_hour as int)=cast(\"$hour$\" as int) and cast(tr.ts_minute as int)=cast(\"$minute$\" as int);\nDROP TABLE loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$;",
                "sample": false,
                "approx_mode": false,
                "approx_aggregations": false,
                "loader_table_name": null,
                "loader_stable": null,
                "md_cmd": null,
                "script_location": null,
                "retry": 0
            },
            "dependency_info": {
                "files": [
                    {
                        "window_start": "-2",
                        "path": "s3://komliudslogs/tracker/%Y/%m/%d/%H/%M",
                        "id": "file1",
                        "window_end": "-2"
                    }
                ]
            },
            "incremental": {},
            "time_out": 600,
            "command_type": "HiveCommand",
            "macros": [
                {
                    "year": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%Y')"
                },
                {
                    "month": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%m')"
                },
                {
                    "day": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%d')"
                },
                {
                    "hour": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%H')"
                },
                {
                    "minute": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%M')"
                }
            ],
            "template": "generic",
            "pool": null,
            "label": "default",
            "is_digest": false,
            "can_notify": true,
            "digest_time_hour": 0,
            "digest_time_minute": 0,
            "email_list": "shailesh.garg@komli.com",
            "bitmap": 3
        },
        {
            "id": 3879,
            "name": "UDS-TrackerDataLoad_Aug1Fix",
            "status": "DONE",
            "concurrency": 5,
            "frequency": 30,
            "time_unit": "minutes",
            "no_catch_up": false,
            "cron_expression": "",
            "user_id": 507,
            "start_time": "2015-08-01 05:00",
            "end_time": "2015-08-01 23:30",
            "time_zone": "UTC",
            "next_materialized_time": "2015-08-02 00:00",
            "command": {
                "query": "drop table if exists loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$;\ncreate external table if not exists loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$ (is_rtb int, timestamp int, user_id string, proto string) \nROW FORMAT DELIMITED FIELDS TERMINATED by '\\t' LINES TERMINATED BY '\\n'\nLOCATION 's3n://komliudslogs/tracker/$year$/$month$/$day$/$hour$/$minute$/';\nset hive.optimize.s3.query=true;\nadd jar s3://komliudsdev/jars/logp-common-2.0.jar;\nadd jar s3://komliudsdev/jars/hiveUdfs-1.0.jar;\nCREATE temporary function protoread AS 'com.komli.hive.udfs.TrackerProtoDeserializer';\n\nINSERT OVERWRITE TABLE udsprod.trackerevent PARTITION(ts_date='$year$-$month$-$day$', ts_hour='$hour$', ts_minute='$minute$')\nSELECT tr.timestamp, tr.isLearning, tr.edgeServerId, tr.sourceComponent, tr.aggregatorId,\n        tr.requestUri, tr.userCookie, tr.userIp, tr.countryId, tr.regionId, tr.cityId, tr.metroId, \n        tr.dma, tr.timeZone, tr.userAgent, tr.publisherId, tr.siteId, tr.foldPosition, tr.refererUrl, \n        tr.uniqueResponseId, tr.uniqueRowId, tr.trackerServerId, tr.dataVersion, tr.totalProcessingTime, \n        tr.intializationTime, tr.requestParsingTime, tr.requestProcessingTime, tr.advertiserId, tr.advertiserIoId,\n        tr.advertiserLiId, tr.creativeId, tr.inventroySourceId, tr.bidStrategyTypeId, tr.pixelId,\n        tr.contentCategoryId, tr.userSegmentId, tr.creativeWidth, tr.creativeHeight, tr.creativeBucketizedHeight,\n        tr.creativeBucketizedWidth, tr.bucketizeAdvertiserLineItemFrequency, tr.trackingType, tr.winningBid,\n        tr.impressions, tr.conversions, tr.clicks, tr.creativeOfferType, tr.statusCode,\n        tr.impressionClickValidationStatusCode, tr.conversionType, tr.advertiserTargetingExpression,\n        tr.userSegments, tr.creativeViewFrequency, tr.creativeClickFrequency, tr.advIOViewFrequency, \n        tr.advIOClickFrequency, tr.impressionPiggybackPixelIds, tr.creativeViewFrequencyOld, tr.dataCenterId, \n        tr.adSpotId, tr.pageType, tr.numSlots, tr.slotPosition, tr.debugStatusCode, tr.targetedSegmentIds,\n        tr.blockedSegmentIds, tr.revenue, tr.budgetSpent, tr.conversionInfo, tr.impressionTime, tr.clickTime,\n        tr.userSignals, tr.sourceType, tr.osId, tr.deviceBrand, tr.deviceModel, tr.deviceType, tr.browser,\n        tr.cost, tr.moneySpent, tr.attributionRatio\nFROM (SELECT rt.timestamp, rt.isLearning, rt.edgeServerId, rt.sourceComponent, rt.aggregatorId,\n\t\trt.requestUri,\n\t\tCASE WHEN (rt.userCookie is null ) THEN null ELSE get_json_object(rt.userCookie, '$.userId') END AS userCookie,\n\t\trt.userIp, rt.countryId, rt.regionId, rt.cityId, rt.metroId, rt.dma, rt.timeZone,\n\t\trt.userAgent, rt.publisherId, rt.siteId, rt.foldPosition, rt.refererUrl, rt.uniqueResponseId,\n\t\trt.uniqueRowId, rt.trackerServerId, rt.dataVersion, rt.totalProcessingTime, rt.intializationTime,\n\t\trt.requestParsingTime, rt.requestProcessingTime, rt.advertiserId, rt.advertiserIoId,\n\t\trt.advertiserLiId, rt.creativeId, rt.inventroySourceId, rt.bidStrategyTypeId, rt.pixelId,\n\t\trt.contentCategoryId, rt.userSegmentId, rt.creativeWidth, rt.creativeHeight, rt.creativeBucketizedHeight,\n\t\trt.creativeBucketizedWidth, rt.bucketizeAdvertiserLineItemFrequency, rt.trackingType, rt.winningBid,\n\t\trt.impressions, rt.conversions, rt.clicks, rt.creativeOfferType, rt.statusCode,\n\t\trt.impressionClickValidationStatusCode, rt.conversionType, rt.advertiserTargetingExpression,\n\t\tCASE WHEN (rt.userSegments is null) THEN null ELSE SPLIT(regexp_replace(get_json_object(concat('{\\\"userSegments\\\":',rt.userSegments,'}'), '$.userSegments.segmentId'), '\\\\[|\\\\]',''),',') END as userSegments,\n\t\trt.creativeViewFrequency, rt.creativeClickFrequency, rt.advIOViewFrequency, rt.advIOClickFrequency,\n\t\tCASE WHEN (rt.impressionPiggybackPixelIds is null) THEN null ELSE SPLIT(regexp_replace(rt.impressionPiggybackPixelIds, '\\\\[|\\\\]',''),',') END AS impressionPiggybackPixelIds,\n\t\trt.creativeViewFrequencyOld, rt.dataCenterId, rt.adSpotId,\n\t\trt.pageType, rt.numSlots, rt.slotPosition, rt.debugStatusCode,\n\t\tCASE WHEN (rt.targetedSegmentIds is null) THEN null ELSE SPLIT(regexp_replace(rt.targetedSegmentIds, '\\\\[|\\\\]',''),',') END AS targetedSegmentIds,\n\t\tCASE WHEN (rt.blockedSegmentIds is null) THEN null ELSE SPLIT(regexp_replace(rt.blockedSegmentIds, '\\\\[|\\\\]',''),',') END AS blockedSegmentIds,\n\t\trt.revenue, rt.budgetSpent,\n\t\tCASE WHEN (rt.conversionInfo is null) THEN null ELSE str_to_map(regexp_replace(rt.conversionInfo, '\\\"|\\\\{|\\\\}', ''),'\\,',':') END AS conversionInfo,\n\t\trt.impressionTime, rt.clickTime,\n\t\tCASE WHEN (rt.userSignals is null) THEN null ELSE str_to_map(regexp_replace(rt.userSignals, '\\\"|\\\\{|\\\\}', ''), '\\,',':') END AS userSignals,\n\t\trt.sourceType, rt.osId, rt.deviceBrand, rt.deviceModel, rt.deviceType, rt.browser,\n\t\trt.cost, rt.moneySpent, rt.attributionRatio,\n\t\tto_date(from_unixtime(cast(rt.timestamp as int))) as ts_date,\n\t        hour(from_unixtime(cast(rt.timestamp as int))) as ts_hour,\n\t        CASE WHEN( cast(minute(from_unixtime(cast(rt.timestamp as int))) as int)/30<1) THEN '0' ELSE '30' END as ts_minute\n\tFROM loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$\n\tLATERAL VIEW json_tuple(protoread(proto), 'timestamp', 'isLearning', 'edgeServerId', 'sourceComponent', 'aggregatorId',\n\t'requestUri', 'userId', 'userIp', 'countryId', 'regionId', 'cityId', 'metroId', 'dma', 'timeZone', 'userAgent',\n\t'publisherId', 'siteId', 'foldPosition', 'refererUrl', 'uniqueResponseId', 'uniqueRowId', 'trackerServerId',\n\t'dataVersion', 'totalProcessingTime', 'intializationTime', 'requestParsingTime', 'requestProcessingTime',\n\t'advertiserId', 'advertiserIoId', 'advertiserLiId', 'creativeId', 'inventroySourceId', 'bidStrategyTypeId',\n\t'pixelId', 'contentCategoryId', 'userSegmentId', 'creativeWidth', 'creativeHeight', 'creativeBucketizedHeight',\n\t'creativeBucketizedWidth', 'bucketizeAdvertiserLineItemFrequency', 'trackingType', 'winningBid', 'impressions',\n\t'conversions', 'clicks', 'creativeOfferType', 'statusCode', 'impressionClickValidationStatusCode', 'conversionType',\n\t'advertiserTargetingExpression', 'userSegments', 'creativeViewFrequency', 'creativeClickFrequency', 'advIOViewFrequency',\n\t'advIOClickFrequency', 'impressionPiggybackPixelIds', 'creativeViewFrequencyOld', 'dataCenterId', 'adSpotId', 'pageType',\n\t'numSlots', 'slotPosition', 'debugStatusCode', 'targetedSegmentIds', 'blockedSegmentIds', 'revenue', 'budgetSpent',\n\t'conversionInfo', 'impressionTime', 'clickTime', 'userSignals', 'sourceType', 'osId', 'deviceBrand', 'deviceModel',\n\t'deviceType', 'browser', 'cost', 'moneySpent', 'attributionRatio') rt as \n\ttimestamp, isLearning, edgeServerId, sourceComponent, aggregatorId, requestUri, userCookie, userIp, countryId, regionId,\n\tcityId, metroId, dma, timeZone, userAgent, publisherId, siteId, foldPosition, refererUrl, uniqueResponseId, uniqueRowId,\n\ttrackerServerId, dataVersion, totalProcessingTime, intializationTime, requestParsingTime, requestProcessingTime, advertiserId,\n\tadvertiserIoId, advertiserLiId, creativeId, inventroySourceId, bidStrategyTypeId, pixelId, contentCategoryId, userSegmentId,\n\tcreativeWidth, creativeHeight, creativeBucketizedHeight, creativeBucketizedWidth, bucketizeAdvertiserLineItemFrequency,\n\ttrackingType, winningBid, impressions, conversions, clicks, creativeOfferType, statusCode, impressionClickValidationStatusCode,\n\tconversionType, advertiserTargetingExpression, userSegments, creativeViewFrequency, creativeClickFrequency, advIOViewFrequency,\n\tadvIOClickFrequency, impressionPiggybackPixelIds, creativeViewFrequencyOld, dataCenterId, adSpotId, pageType, numSlots,\n\tslotPosition, debugStatusCode, targetedSegmentIds, blockedSegmentIds, revenue, budgetSpent, conversionInfo, impressionTime,\n\tclickTime, userSignals, sourceType, osId, deviceBrand, deviceModel, deviceType, browser, cost, moneySpent, attributionRatio) tr \nwhere tr.ts_date='$year$-$month$-$day$' and cast(tr.ts_hour as int)=cast(\"$hour$\" as int) and cast(tr.ts_minute as int)=cast(\"$minute$\" as int);\nDROP TABLE loaddb.tracker_$year$_$month$_$day$_$hour$_$minute$;",
                "sample": false,
                "approx_mode": false,
                "approx_aggregations": false,
                "loader_table_name": null,
                "loader_stable": null,
                "md_cmd": null,
                "script_location": null,
                "retry": 0
            },
            "dependency_info": {
                "files": [
                    {
                        "path": "s3://komliudslogs/tracker/%Y/%m/%d/%H/%M",
                        "id": "file1",
                        "window_end": "-2",
                        "window_start": "-2"
                    }
                ]
            },
            "incremental": {},
            "time_out": 600,
            "command_type": "HiveCommand",
            "macros": [
                {
                    "year": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%Y')"
                },
                {
                    "month": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%m')"
                },
                {
                    "day": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%d')"
                },
                {
                    "hour": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%H')"
                },
                {
                    "minute": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%M')"
                }
            ],
            "template": "generic",
            "pool": null,
            "label": "default",
            "is_digest": false,
            "can_notify": true,
            "digest_time_hour": 0,
            "digest_time_minute": 0,
            "email_list": "shailesh.garg@komli.com",
            "bitmap": 3
        },
        {
            "id": 3898,
            "name": "UDS-ProcessorDataLoad_11th_JulyFix",
            "status": "KILLED",
            "concurrency": 5,
            "frequency": 30,
            "time_unit": "minutes",
            "no_catch_up": false,
            "cron_expression": "",
            "user_id": 507,
            "start_time": "2015-07-11 12:00",
            "end_time": "2018-07-11 23:30",
            "time_zone": "UTC",
            "next_materialized_time": "2015-07-12 08:30",
            "command": {
                "query": "drop table if exists loaddb.processor_$year$_$month$_$day$_$hour$_$minute$;\ncreate external table if not exists loaddb.processor_$year$_$month$_$day$_$hour$_$minute$ (timestamp int, user_id string, proto string) \nROW FORMAT DELIMITED FIELDS TERMINATED by '\\t' LINES TERMINATED BY '\\n'\nLOCATION 's3n://komliudslogs/processor/$year$/$month$/$day$/$hour$/$minute$/';\nset hive.optimize.s3.query=true;\nadd jar s3://komliudsdev/jars/logp-common-2.0.jar;\nadd jar s3://komliudsdev/jars/hiveUdfs-1.0.jar;\nCREATE temporary function procprotoread AS 'com.komli.hive.udfs.ProcessorProtoDeserializer';\n\nINSERT OVERWRITE TABLE udsprod.processorevent PARTITION(ts_date='$year$-$month$-$day$', ts_hour='$hour$', ts_minute='$minute$')\nSELECT pe.timestamp, pe.responseId, pe.adSlotId, pe.aggregatorId, pe.isTest, pe.isLearning,\n\tpe.mediaType, pe.userCookie, pe.remoteIp, pe.country, pe.region, pe.city, pe.area, \n\tpe.dma, pe.timezoneOffset, pe.os, pe.browser, pe.pubId, pe.siteId, pe.requestingPage, \n\tpe.foldPosition, pe.uniqueResponseId, pe.bidCurrency, pe.numberOfBids, pe.adserverId, \n\tpe.dataVersion, pe.totalTime, pe.bidInitializationTime, pe.datastoreProcessTime, \n\tpe.getCandidatesTime, pe.adFilteringTime, pe.ecpmComputationTime, pe.bidComputationTime, \n\tpe.adSelectionTime, pe.bidSubmitTime, pe.learningPercent, pe.pageCategories, pe.userSegments, \n\tpe.bids, pe.brandSafetyCategories, pe.pageLanguageId, pe.sspUserId, pe.minEcpm, pe.adSpotId, \n\tpe.creativeSizes, pe.pageTypeId, pe.numSlots, pe.eligibleLIs, pe.bidType, pe.isSecureRequest, \n\tpe.sourceType\nFROM (SELECT p.timestamp, p.responseId, p.adSlotId, p.aggregatorId, p.isTest, p.isLearning,\n\t\tp.mediaType, p.userCookie, p.remoteIp, p.country, p.region, p.city, p.area, \n\t\tp.dma, p.timezoneOffset, p.os, p.browser, p.pubId, p.siteId, p.requestingPage, \n\t\tp.foldPosition, p.uniqueResponseId, p.bidCurrency, p.numberOfBids, p.adserverId, \n\t\tp.dataVersion, p.totalTime, p.bidInitializationTime, p.datastoreProcessTime, \n\t\tp.getCandidatesTime, p.adFilteringTime, p.ecpmComputationTime, p.bidComputationTime, \n\t\tp.adSelectionTime, p.bidSubmitTime, p.learningPercent, \n\t\tCASE WHEN (p.pageCategories is null) THEN null ELSE str_to_map(regexp_replace(p.pageCategories, '\\\\[|\\\\]|\\\\{|\\\\}|\\\\\"categoryId\\\\\":|\\\\,\\\\\"weight\\\\\"',''), '\\\\,', ':') END as pageCategories,\n\t\tCASE WHEN (p.userSegments is null) THEN null ELSE SPLIT(regexp_replace(p.userSegments, '\\\\[|\\\\]',''), '\\\\,') END as userSegments, \n\t\tp.bids, \n\t\tCASE WHEN (p.brandSafetyCategories is null) THEN null ELSE SPLIT(regexp_replace(p.brandSafetyCategories, '\\\\[|\\\\]', ''), '\\\\,') END as brandSafetyCategories, \n\t\tp.pageLanguageId, p.sspUserId, p.minEcpm, p.adSpotId, \n\t\tp.creativeSizes, p.pageTypeId, p.numSlots, p.eligibleLIs, p.bidType, p.isSecureRequest, \n\t\tp.sourceType,\n\t\tto_date(from_unixtime(cast(p.timestamp as int))) as ts_date,\n                hour(from_unixtime(cast(p.timestamp as int))) as ts_hour,\n                CASE WHEN( cast(minute(from_unixtime(cast(p.timestamp as int))) as int)/30<1) THEN '0' ELSE '30' END as ts_minute\n\tFROM loaddb.processor_$year$_$month$_$day$_$hour$_$minute$\n\tLATERAL VIEW json_tuple(procprotoread(proto), 'timestamp', 'responseId', 'adSlotId', \n\t'aggregatorId', 'isTest', 'isLearning', 'mediaType', 'userCookie', 'remoteIp', 'country', \n\t'region', 'city', 'area', 'dma', 'timezoneOffset', 'os', 'browser', 'pubId', 'siteId', \n\t'requestingPage', 'foldPosition', 'uniqueResponseId', 'bidCurrency', 'numberOfBids', \n\t'adserverId', 'dataVersion', 'totalTime', 'bidInitializationTime', 'datastoreProcessTime',\n\t'getCandidatesTime', 'adFilteringTime', 'ecpmComputationTime', 'bidComputationTime',\n\t'adSelectionTime', 'bidSubmitTime', 'learningPercent', 'pageCategories', 'userSegments',\n\t'bids', 'brandSafetyCategories', 'pageLanguageId', 'sspUserId', 'minEcpm', 'adSpotId',\n\t'creativeSizes', 'pageTypeId', 'numSlots', 'eligibleLIs', 'bidType', 'isSecureRequest',\n\t'sourceType') p as timestamp, responseId, adSlotId, aggregatorId, isTest, isLearning, \n\tmediaType, userCookie, remoteIp, country, region, city, area, dma, timezoneOffset, os, \n\tbrowser, pubId, siteId, requestingPage, foldPosition, uniqueResponseId, bidCurrency, \n\tnumberOfBids, adserverId, dataVersion, totalTime, bidInitializationTime, \n\tdatastoreProcessTime, getCandidatesTime, adFilteringTime, ecpmComputationTime, \n\tbidComputationTime, adSelectionTime, bidSubmitTime, learningPercent, pageCategories, \n\tuserSegments, bids, brandSafetyCategories, pageLanguageId, sspUserId, minEcpm, adSpotId,\n\tcreativeSizes, pageTypeId, numSlots, eligibleLIs, bidType, isSecureRequest, sourceType) pe\nwhere pe.ts_date='$year$-$month$-$day$' and cast(pe.ts_hour as int)=cast('$hour$' as int) and cast(pe.ts_minute as int)=cast('$minute$' as int);\n\ndrop table loaddb.processor_$year$_$month$_$day$_$hour$_$minute$;",
                "sample": false,
                "approx_mode": false,
                "approx_aggregations": false,
                "loader_table_name": null,
                "loader_stable": null,
                "md_cmd": null,
                "script_location": null,
                "retry": 0
            },
            "dependency_info": {
                "files": [
                    {
                        "id": "file1",
                        "path": "s3://komliudslogs/processor/%Y/%m/%d/%H/%M",
                        "window_end": "-2",
                        "window_start": "-2"
                    }
                ]
            },
            "incremental": {},
            "time_out": 600,
            "command_type": "HiveCommand",
            "macros": [
                {
                    "year": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%Y')"
                },
                {
                    "month": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%m')"
                },
                {
                    "day": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%d')"
                },
                {
                    "hour": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%H')"
                },
                {
                    "minute": "Qubole_nominal_time.clone().subtract('minutes', 60).strftime('%M')"
                }
            ],
            "template": "generic",
            "pool": null,
            "label": "default",
            "is_digest": false,
            "can_notify": true,
            "digest_time_hour": 0,
            "digest_time_minute": 0,
            "email_list": "dataengg@komli.com",
            "bitmap": 3
        }
    ]
}