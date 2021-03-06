angular.module('nodeblog', ['ngRoute', 'regServices', 'ngCookies', 'ngSanitize'])
    .controller('IndexCtrl', ['$scope', '$cookies', '$http', function($scope, $cookies, $http) {
        
    }])

    .controller('RegCtrl', function($scope, User) {
        $scope.name = "";
        $scope.password = "";
        $scope.passwordRepeat = "";
        $scope.email = "";
        $scope.error = "";

        $scope.submit = function() {
            if ($scope.password != $scope.passwordRepeat) {
                $scope.reset();
                return $scope.error = "两次密码不一致！";
            };

            var user = {
                name: $scope.name,
                password: $scope.password,
                passwordRepeat: $scope.passwordRepeat,
                email: $scope.email
            };

            User.reg.save({}, user, function(res) {

                $scope.reset();

                if (res.error == "success") {
                    window.location.href = "/";
                } else { 
                    $scope.error = res.error; 
                };
                
            }, function(err) {
                $scope.reset();
                $scope.error = "注册失败，请重试";
            });
        };

        $scope.reset = function() {
            $scope.name = "";
            $scope.password = "";
            $scope.passwordRepeat = "";
            $scope.email = "";
        };

    })

    .controller('LoginCtrl', function($scope, User) {
        $scope.name = "";
        $scope.password = "";
        $scope.error = "";

        $scope.login = function() {
            var user = {
                name: $scope.name,
                password: $scope.password
            };

            User.login.save({}, user, function(res) {
                $scope.reset();

                if (res.error == "success") {
                    window.location.href = "/";
                } else {
                    $scope.error = res.error; 
                };

            }, function(err) {
                $scope.reset();
                $scope.error = "登录失败，请重试";
            });

        };

        $scope.reset = function() {
            $scope.name = "";
            $scope.password = "";
        };

    })

    .controller("ListCtrl", ['$scope', '$http', function($scope, $http) {
        $http.get("/list").success(function(response) {
            $scope.items = response;
        });

        $scope.items = function() {

        }
    }])

    .controller("WriteCtrl", ['$scope', '$cookies', '$location', 'Article', function($scope, $cookies, $location, Article) {
        $scope.title = "";
        $scope.content = "";

        $scope.publish = function() {
            var article = {
                user: $cookies.get("user"),
                title: $scope.title,
                content: $scope.content
            }

            Article.post.save({}, article, function(res) {
                $scope.reset();

                if (res.error == "success") {
                    $location.path('/list');
                } else {
                    $scope.error = res.error; 
                };

            }, function(err) {
                $scope.reset();
                $scope.error = "文章发布失败，请重试";
            });

        };

        $scope.reset = function() {
            $scope.title = "";
            $scope.content = "";
        };
    }])

    .controller("ArticleCtrl", ['$scope', '$http', '$routeParams', 'Article', function($scope, $http, $routeParams, Article) {
        var id = $routeParams.articleId;
        $http.get('/article/' + id).success(function(response) {
            $scope.article = response;
        });
    }])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/', { templateUrl: 'parts/index.html', controller: 'IndexCtrl' }).
            when('/reg', { templateUrl: 'parts/reg.html', controller: 'RegCtrl' }).
            when('/login', { templateUrl: 'parts/login.html', controller: 'LoginCtrl' }).

            when('/write', { templateUrl: 'parts/write.html', controller: 'WriteCtrl' }).
            when('/list', { templateUrl: 'parts/list.html', controller: 'ListCtrl' }).
            when('/article/:articleId', { templateUrl: 'parts/article.html', controller: 'ArticleCtrl' }).
            otherwise({ redirectTo: '/' });
    }]);