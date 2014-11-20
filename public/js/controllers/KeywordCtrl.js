angular.module('KeywordCtrl', []).controller('KeywordController',
		function($scope,$http, Keyword) {
			$scope.hasMsg = false;
			$scope.hasMsgError = false;
			$scope.formData = {};
			Keyword.get().success(function(data) {
				$scope.keywords = data;
			});

			$scope.createKeyword = function() {
				Keyword.create($scope.formData).success(function(data) {
					if(!data.error){
						$scope.formData = {}; 
						$scope.keywords = data;
						$scope.msgToUser = 'Palavra-chave adicionada com sucesso';
						$scope.hasMsg = true;						
					}else{
						$scope.hasMsg = false;
						$scope.hasMsgError = true;
						$scope.msgToUser = data.error.err;
					}
				});
			};

			$scope.delete = function(id) {
				$scope.loading = true;

				Keyword.delete(id)
					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.keywords = data; // assign our new list of todos
						$scope.msgToUser = 'Palavra-chave removida com sucesso';
						$scope.hasMsg = true;
					});
			};
		});