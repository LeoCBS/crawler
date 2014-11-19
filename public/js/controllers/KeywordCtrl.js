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

			$scope.delete = function(id) {
				$scope.loading = true;

				Keyword.delete(id)
					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.keywords = data; // assign our new list of todos
					});
			};
		});


