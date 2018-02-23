(function() {
    angular.module("network-services", [])
        .service("networkService",
            function($http) {
                var vm = this;
                vm.requestBuilder = function() {
                    var request = {};
                    this.method = function(method) {
                        request["method"] = method;
                        return this;
                    }
                    this.url = function(url) {
                        request["url"] = url;
                        return this;
                    }
                    this.body = function(body) {
                        request["data"] = body;
                        return this;
                    }
                    this.params = function(params) {
                        request["params"] = params;
                        return this;
                    }
                    this.build = function() {
                        return request;
                    }
                    return this;
                }
                vm.sendRequest = function(request) {
                    return $http(request)
                        .then(function(response) {
                                return response.data;
                            },
                            function(error) {
                                console.log(error);
                                return error;
                            });
                }

                return vm;
            })
        .service("crudService",
            function(networkService) {
                var vm = this;

                vm.list = function(controllerName) {
                    var queryObj = networkService.requestBuilder()
                        .method("GET")
                        .url(buildUrl(controllerName, "List"))
                        .build();
                    return networkService.sendRequest(queryObj);
                }
                vm.create = function(controllerName, record) {
                    var queryObj = networkService.requestBuilder()
                        .method("POST")
                        .url(buildUrl(controllerName, "Create"))
                        .body(record)
                        .build();
                    return networkService.sendRequest(queryObj);
                }
                vm.update = function(controllerName, record) {
                    var queryObj = networkService.requestBuilder()
                        .method("POST")
                        .url(buildUrl(controllerName, "Update"))
                        .body(record)
                        .build();
                    return networkService.sendRequest(queryObj);
                }
                vm.remove = function(controllerName, id) {
                    var queryObj = networkService.requestBuilder()
                        .method("POST")
                        .url(buildUrl(controllerName, "Delete"))
                        .params({ id: id })
                        .build();
                    return networkService.sendRequest(queryObj);
                }

                vm.get = function(controllerName, action, params) {
                    return networkService.sendRequest(networkService.requestBuilder()
                        .method("GET")
                        .url(buildUrl(controllerName, action))
                        .params(params)
                        .build());
                }

                vm.post = function(controllerName, action, params) {
                    return networkService.sendRequest(networkService.requestBuilder()
                        .method("POST")
                        .url(buildUrl(controllerName, action))
                        .body(params)
                        .build());
                }

                function buildUrl(controllerName, methodName) {
                    return "/" + controllerName + "/" + methodName;
                }

                return vm;
            });

}());