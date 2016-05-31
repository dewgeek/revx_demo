'use strict';

var AUTH_TOKEN = 'j4Bd6dqNumcFjsfx283tCor86gZRv1hxAsnq9QcPb3TLDHmFS2EFxWGunze3AjzL';
angular.module('revxApp').factory('loadSchedules', ['$resource',function ($resource) {

	return $resource('http://crossorigin.me/https://api.qubole.com/api/v1.2/scheduler/', {}, {
        query: {
        	method:'GET',
        	headers:{ 
        		
        		'X-AUTH-TOKEN': AUTH_TOKEN 
        	}
        }
	});

  }]);
