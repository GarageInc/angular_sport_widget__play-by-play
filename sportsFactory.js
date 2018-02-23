(function () {

    angular.module("sportsFactory", ['tennisService', 'soccerService', 'basketballService'])
        .service("sportsFactory",
            function (tennisService, soccerService, basketballService) {
                var vm = this;

                vm.sports = {
                    soccer: soccerService.getSport(),
                    tennis: tennisService.getSport(),
                    basketball: basketballService.getSport()
                }

                vm.getSport = function (sportId) {
                    switch (sportId) {
                        case "Football":
                            return vm.sports.soccer;
                        case "Tennis":
                            return vm.sports.tennis;
                        case "Basketball":
                            return vm.sports.basketball
                    }
                }

                return vm;
            });

}());