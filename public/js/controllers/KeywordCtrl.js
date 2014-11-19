angular.module('KeywordCtrl', []).controller('KeywordController',
		function($scope,$http, Keyword) {
			$scope.formData = {};
			Keyword.get().success(function(data) {
				$scope.keywords = data;
			});

			$scope.createKeyword = function() {
				Keyword.create($scope.formData).success(function(data) {
					$scope.formData = {}; 
					$scope.keywords = data; 
				});
			};
		});


