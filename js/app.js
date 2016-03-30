(function() {
	'use strict';

	angular
		.module('MyApp', [])
		.factory('FinalsFactory', FinalsFactory)
		.controller('MyCtrl', MyCtrl);

	function FinalsFactory($http, $q) {
		var factory = {
			getFinals: getFinals
		};

		return factory;

		function getFinals() {
			var defered = $q.defer();

			$http({
				method: 'GET',
				url: './model/championsFinals.json'
			})
	  		.success(function(finals) {
	  			defered.resolve(finals);
		    })
		    .error(function(err) {
		    	defered.reject(err);
		    });

			return defered.promise;
		}
	}

	function MyCtrl($scope, $timeout, FinalsFactory) {
		$scope.finals = [];
		$scope.counter = 0;
    	$scope.limit = 10;
    	$scope.loading = false;
    	$scope.loadMore = loadMore;
    	$scope.nothingForLoad = false;

    	FinalsFactory
    		.getFinals()
    		.then(function(finals) {
        		$scope.data = finals;
        	})
        	.finally(function() {
				$scope.finals = $scope.data.slice(0, $scope.limit);
			});

    	function getFinals(start, finish) {
    		for( ; start < finish; start++) {
    			$scope.finals.push($scope.data[start]);
    		}
    	}

    	function loadMore() {
    		$scope.loading = true;

    		$timeout(function() {
	    		getFinals($scope.limit, $scope.limit + 10);
		        $scope.limit += 10;
		        $scope.loading = false;
	        }, 2000)
	        .then(function() {
	    		if($scope.limit >= $scope.data.length) {
	    			$scope.nothingForLoad = true;
	    		}
	        });
	    }
	}

})();