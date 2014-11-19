angular.module('KeywordService', []).factory('Keyword', ['$http', function($http) {

    return {
        // call to get all keywords
        get : function() {
            return $http.get('/keyword/list');
        },


                // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new nerd
        create : function(formData) {
            return $http.post('/keyword/add', formData);
        },

        // call to DELETE a nerd
        delete : function(id) {
            return $http.delete('/api/nerds/' + id);
        }
    }       

}]);
