/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var swbModule = angular.module('swbModule', []);

swbModule.controller('swbCtrl', function($scope) {
    $scope.data = [
        {'name': 'Nexus S',
            'snippet': 'Fast just got faster with Nexus S.'},
        {'name': 'Motorola XOOM™ with Wi-Fi',
            'snippet': 'The Next, Next Generation tablet.'},
        {'name': 'MOTOROLA XOOM™',
            'snippet': 'The Next, Next Generation tablet.'}
    ];
});


swbModule.controller('mongoCtrl', function($scope, $http)
{
    $scope.update = function(user) {
      $scope.odata= angular.copy($scope.data);
    };

    $scope.reset = function() {
      $scope.data = angular.copy($scope.odata);
    };         
    
    
    var data = {
        "operationType": "fetch",
        "data": {
            "_id": "_suri:Agenda:Agenda:52ab95f4300483cfef02350d"
        },
        //"oldValues": null
    };
    
    $http.post('/swbadmin/jsp/datasource.jsp?modelid=Agenda&scls=Agenda&isc_dataFormat=json', data).success(function(data) 
    {
        if(data.response.status==0)
        {
            $scope.odata = data.response.data[0];
        }else
        {
            $scope.odata = {};
        }
        $scope.reset();
    });
    
});