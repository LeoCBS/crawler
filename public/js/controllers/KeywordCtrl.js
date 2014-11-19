angular.module('KeywordCtrl', []).controller('KeywordController',
		function($scope,$http, Keyword) {

			Keyword.get().success(function(data) {
				$scope.keywords = data;
			});

			// CREATE =================================================================
			$scope.create = function() {
				// validate the formData to make sure that something is there
				// if form is empty, nothing will happen
				
				$scope.loading = true;
				Keyword.create($scope.formData).success(function(data) {
					$scope.loading = false;
					$scope.formData = {}; 
					$scope.keywords = data; 
				});
			};
		});


