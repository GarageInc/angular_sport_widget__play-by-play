playByPlayApp.controller("eventsController", function ($scope, $rootScope, sportsFactory, dataService, animationsService, $filter, $timeout, $window, sizeService, __config) {
    
    var vm = this;

    var TABS = {
        STATISTICS: 'statistics',
        ANIMATIONS: 'animation',
        INCIDENTS: 'incidents'
    };

    $scope.isLoopAnimation = false;


    $scope.snapshot = {
        IN_UI: []
    };

    // TODO: implement 3rd party authorization and remove\use this field after
    $scope.isAuthorized = false;

    $scope.apiAddress = __config.apiUrl;

    $scope.incident_title_visible = [];
    $scope.incident_title_text_visible = [];
    $scope.incident_grouped_title_visible = [];
    $scope.incident_title_text_hiding = [];
    $scope.incident_title_hiding = [];
    $scope.stat_icon_title_visible = [];

    $scope.timeUpdated = true;
    $scope.currentPeriod = null;

    $scope.clockHeader = null;
    $scope.incidentsShowing = {};

    $scope.incidentsIconPageSizeNormal = 9;
    $scope.scrollPageSize = 16;

    $scope.loadMore = function () {
        var counter = 0;
        var last = $scope.snapshot.IN_UI.length;
        for (var i = last; counter <= $scope.scrollPageSize && i <= $scope.allIncidents.length; i++) {
            var incident = $scope.allIncidents[i];
            if (incident) {
                $scope.snapshot.IN_UI.push(incident);
                if ($scope.incidentVisible(incident)) {
                    counter++;
                }
            }
        }
    };

    $scope.getUrlVars = function () {
        var params = window.location.href.split('/');
        return {
            address: $scope.apiAddress,
            eventId: params[4],
            providerId: params[5]
        }
    }

    ///////////////////////////////////////////////////////
    // ABLY
    ///////////////////////////////////////////////////////

    var initByToken = function (ablyToken, channelName) {

        vm.realtime = new Ably.Realtime(ablyToken);
        vm.channel = vm.realtime.channels.get(channelName);
    }

    var subscribe = function (eventId) {

        vm.realtime.connection.on('connected', function () {
            // console.log("Connected to ably");
        });

        vm.channel.subscribe(function (message) {

            var dt = new Date();
            console.log('Got data from the API at: ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds());
            console.log(message.data);

            // Process update
            dataService.processUpdate($scope.snapshot, message.data);

            $scope.processUpdates(message);
        });
    }

    var unsubscribe = function () {
        if (vm.channel) {
            vm.channel.unsubscribe();
        }
    }

    ///////////////////////////////////////////////////////

    $scope.init = function () {

        $scope.loading = true;
        $scope.noData = false;
        $scope.snapshot = {};

        $scope.urlParams = $scope.getUrlVars();
        //console.log($scope.urlParams);

        dataService.getData($scope.urlParams).done(function (data) {

            $scope.loading = false;

            if (!data || !data.DT || !data.PA || !data.IN) {
                $scope.noData = true;
                $scope.$digest();
                return;
            }

            // Initiate sport
            $scope.currentSport = sportsFactory.getSport(data.SP);

            // Hide ignored incidents
            for (var i = 0; i < $scope.currentSport.ignoredIncidentTypes.length; i++) {
                var type = $scope.currentSport.ignoredIncidentTypes[i];
                $scope.incidentsShowing[type] = false;
            }

            // Start the timer
            if ($scope.currentSport.timerEnabled) {
                $timeout(tick, $scope.tickInterval);
            }

            //Sort teams by position
            var teamIds = [];
            var teams = [];
            for (var team in data.PA) {
                teamIds.push({
                    id: team,
                    PO: data.PA[team].PO,
                    data: data.PA[team]
                });
            }

            teamIds = $filter('orderBy')(teamIds, '+PO');

            var teams_temp = [];
            for (var team in teamIds) {
                teams_temp.push(teamIds[team].data);
            }
            data.PA_UI = teams_temp;

            // Prepare statistics
            $scope.prepareStatistics(data, data.Updates);

            // Reset updates
            data.Updates = [];

            // Set data
            $scope.snapshot = data;

            // Count columns
            $scope.resultColumns = $scope.resultsColumnsCount();

            $scope.snapshot.Updates = [];

            // Prepare incidents for UI
            $scope.allIncidents = $filter('orderBy')($scope.getShownIncidents(undefined, true, true), $scope.currentSport.incidentsTabFilter);
            $scope.snapshot.IN_UI = $scope.allIncidents.slice(0, $scope.snapshot.CurrentIncidents_UI.length);

            // Prepare incidents for progress bar
            setProgressBarIncidents($scope.getShownIncidents($scope.currentSport.progressBarIncidents, $scope.currentSport.progressBarSkipGrouping));

            // Show appropriate progress bar
            $scope.showExtendedMatch = $scope.incidentExist(446);
            $scope.changeMatchLength();

            // Get last incident
            var lastIncident = $scope.snapshot.IN_UI[0];

            // Start \ stop timer
            var timerCheck = [];
            timerCheck.push(lastIncident);
            $scope.toggleTimer(timerCheck);
            if ($scope.snapshot.TT == 1) {
                $scope.fixTimer();
            } else {
                // Set timer to 45 minutes in case of halftime, and 105 in case of extended halftime
                var type = $scope.getMatchFinishedIncident();
                if ($scope.currentSport.halfTimeIncidents.indexOf(type) >= 0
                    && $scope.currentSport.halfTimeIncidentsTiming) {
                    $scope.snapshot.TS = $scope.currentSport.halfTimeIncidentsTiming[type].time;
                } else {
                    $scope.snapshot.TS = lastIncident.SE;
                }
                $scope.updateTimer();
            }

            // Enable scroll
            $scope.setScrollable();

            //console.log(JSON.stringify($scope.snapshot));

            // Play last incident animation on first load
            if (lastIncident) {
                setTimeout(function() {
                    var lastAnimationData = {
                        updates: [{
                            incidentType: parseInt(lastIncident.TY),
                            position: parseInt(lastIncident.PO),
                            player: lastIncident.PL
                        }],
                        teams: $scope.snapshot.PA_UI
                    };
                    animationsService.prepareLabelsForUpdates(lastAnimationData, $scope.currentSport);
                    animationsService.playAnimations(lastAnimationData.updates, $scope.snapshot.SP, $scope.isSmallWidget);
                }, 500);
            }

            // Subscribe to match updates
            initByToken('j6AFFw.F3eTSQ:ZaQxPnLwvRDK0RZA', $scope.urlParams.eventId);
            subscribe($scope.urlParams.eventId);

            //console.log($scope.snapshot.IN_UI);

            $scope.$digest();
        });
    }

    $scope.toggleTimer = function (updates) {
        // Stop / start timer
        for (var i = 0; i < updates.length; i++) {
            var inc = updates[i];
            var type = inc ? inc.incidentType || inc.TY : null;
            if (inc && type) {
                if ($scope.currentSport.halfTimeIncidents.indexOf(parseInt(type)) >= 0) {
                    $scope.snapshot.TT = 0;
                }
                if ($scope.currentSport.halfStartedIncidents.indexOf(parseInt(type)) >= 0) {
                    $scope.snapshot.TT = 1;
                }
            }
        }
    }

    $scope.processUpdates = function (message) {

        // Copy updates
        var updates = JSON.parse(JSON.stringify($scope.snapshot.Updates));

        // Set timer
        $scope.timeUpdated = message.data.indexOf('TS=') >= 0;
        if ($scope.timeUpdated) {
            //console.log('fix timer on update');
            $scope.fixTimer();
        }

        // Start / stop timer if necessary
        $scope.toggleTimer(updates);

        // Prepare incidents for progress bar
        for (var i = 0; i < $scope.snapshot.Updates.length; i++) {
            var update = $scope.snapshot.Updates[i];
            if (update && update.incidentType) {
                var dt = $scope.currentSport.incidentsData[update.incidentType];
                if ($scope.incidentsShowing[update.incidentType] == undefined) {
                    $scope.incidentsShowing[update.incidentType] = true;
                }
                var inUi = {
                    PO: update.position,
                    SE: parseInt(update.second),
                    TY: update.incidentType.toString(),
                    groupId: dt ? dt.groupId : null
                };
                $scope.snapshot.IN_UI.unshift(inUi);
                $scope.allIncidents.unshift(inUi);
            }
        }
        $scope.snapshot.Updates = [];

        setProgressBarIncidents($scope.getShownIncidents($scope.currentSport.progressBarIncidents, $scope.currentSport.progressBarSkipGrouping));

        // Play animations
        $scope.$broadcast('playAnimations', { updates: updates, teams: $scope.snapshot.PA_UI });

        // Show appropriate progress bar
        $scope.showExtendedMatch = $scope.incidentExist(446);
        $scope.changeMatchLength();

        //Set current period
        $scope.setCurrentPeriod();

        // Set timer to 45 minutes in case of halftime, and 105 in case of extended halftime
        if ($scope.snapshot.TT == 0) {
            var type = $scope.getMatchFinishedIncident();
            if ($scope.currentSport.halfTimeIncidents.indexOf(type) >= 0
                && $scope.currentSport.halfTimeIncidentsTiming) {
                $scope.snapshot.TS = $scope.currentSport.halfTimeIncidentsTiming[type].time;
                $scope.updateTimer();
            }
        }

        // Update statistics if necessary
        $scope.prepareStatistics($scope.snapshot, updates);

        // Count columns
        $scope.resultColumns = $scope.resultsColumnsCount();

        $scope.$broadcast('updateTooltips');

        // When timer enabled, it moving on each tick
        // When disabled - move on each update
        if (!$scope.currentSport.timerEnabled) {
            $(document).trigger("moveToLastTime");
        }

        $scope.$digest();
    }

    var setProgressBarIncidents = function (incidents) {

        $scope.snapshot.IN_UI_PB = incidents;

        for (var i = 0; i < incidents.length; i++) {
            $scope.incident_grouped_title_visible[i] = $scope.incident_grouped_title_visible[i] || false;
        }
    };

    $scope.$on('setCurrentPeriodValue',
        function(e, data) {
            $scope.currentPeriod = data.value;
            $scope.clockHeader = $scope.getClockHeader();
            var periodData = $scope.currentSport.periodsTiming[$scope.currentPeriod];
            if ($scope.timeUpdated && periodData && $scope.snapshot.TT && !$scope.getMatchFinishedIncident()) {
                $scope.snapshot.TS = parseInt($scope.snapshot.TS) + periodData.timeFix;
                $scope.updateTimer();
                $scope.timeUpdated = false;
            }
        });

    $scope.setCurrentPeriod = function () {
        $scope.$broadcast('setCurrentPeriod');
    }

    $scope.prepareStatistics = function (data, incidents) {

        var statisticsAdded = [];
        var statisticsGroupedAdded = [];

        var createStatistics = !data.Statistics_UI && !data.Statistics_Grouped_UI;

        if (!data.Statistics_UI) {
            data.Statistics_UI = [];
        }
        if (!data.Statistics_Grouped_UI) {
            data.Statistics_Grouped_UI = [];
        }
        if (!data.Periods_UI) {
            data.Periods_UI = [];
        }
        if (!data.CurrentIncidents_UI) {
            data.CurrentIncidents_UI = [];
        }

        incidents = $filter('orderBy')(incidents, $scope.currentSport.incidentsUpdatesOrderByField);

        for (var u in incidents) {

            var update = incidents[u];
            if (!update || !update.incidentType || !update.period) continue;

            if ($scope.currentSport.periods[update.period] && data.Periods_UI.indexOf(update.period) < 0) {
                data.Periods_UI.push(update.period);
            }

            var periodPostfix = "_" + update.period;
            var incidentId = update.incidentType + periodPostfix;

            var updatedSt = createStatistics ? data.Statistics_UI[statisticsAdded.indexOf(incidentId)]
                                             : $filter('filter')(data.Statistics_UI, { period: update.period, incidentType: update.incidentType })[0];
            var updatedStGrouped = createStatistics ? data.Statistics_Grouped_UI[statisticsGroupedAdded.indexOf(update.incidentType)]
                                                    : $filter('filter')(data.Statistics_Grouped_UI, { incidentType: update.incidentType })[0];

            // Check if event is ignored in statistics
            var type = parseInt(update.incidentType);
            var ignored = $scope.currentSport.timePeriodFinishedIncidents.indexOf(type) >= 0
                          || $scope.currentSport.halfTimeIncidents.indexOf(type) >= 0
                          || $scope.currentSport.incidentsIgnoredInStatistics.indexOf(type) >= 0;

            // Get incident data
            var incidentData = $scope.currentSport.incidentsData[type];

            // Add statistics separated by period
            if (!updatedSt) {
                var label = $scope.currentSport.getLabel(update.incidentType);
                updatedSt = {
                    incidentType: update.incidentType,
                    label: label,
                    period: update.period,
                    team1: 0,
                    team2: 0
                };

                // Don't add ignored type into statistics
                if (!ignored && $scope.currentSport.usedInStatistics(type)) {
                    statisticsAdded.push(update.incidentType + periodPostfix);
                    updatedSt.label = $scope.currentSport.getLabelStatistics(type);
                    data.Statistics_UI.push(updatedSt);
                }

                // Add incidents
                var incidentId = incidentData && incidentData.groupId ? incidentData.groupId : update.incidentType;
                if (!$scope.currentSport.isIgnored(update.incidentType)
                    && $filter('filter')(data.CurrentIncidents_UI, { incidentType: incidentId }).length == 0) {
                    data.CurrentIncidents_UI.push({
                        incidentType: incidentId,
                        label: incidentData && incidentData.groupId ? $scope.currentSport.incidentGroups[incidentData.groupId].label : label,
                        icon: incidentData && incidentData.groupId ? $scope.currentSport.incidentGroups[incidentData.groupId].icon : $scope.getIncidentIcon(update),
                        second: update.second
                    });
                }
            }

            // Add grouped statistics
            if (!updatedStGrouped) {
                updatedStGrouped = {
                    incidentType: update.incidentType,
                    label: label,
                    team1: 0,
                    team2: 0
                };
                if (!ignored && $scope.currentSport.usedInStatistics(type)) {
                    statisticsGroupedAdded.push(update.incidentType);
                    updatedStGrouped.label = $scope.currentSport.getLabelStatistics(type);
                    data.Statistics_Grouped_UI.push(updatedStGrouped);
                }
            }

            if (update.position == 1) {
                updatedSt.team1++;
                updatedStGrouped.team1++;
            } else {
                updatedSt.team2++;
                updatedStGrouped.team2++;
            }
        }

        // Custom statistics related to the whole match
        if ($scope.currentSport.wholeMatchStatistics) {
            for (var i = 0; i < $scope.currentSport.wholeMatchStatistics.length; i++) {

                var stat = $scope.currentSport.wholeMatchStatistics[i];
                var stGrouped = createStatistics ? data.Statistics_Grouped_UI[statisticsGroupedAdded.indexOf(stat.id)]
                                                 : $filter('filter')(data.Statistics_Grouped_UI, { incidentType: stat.id })[0];
                if (!stGrouped) {
                    stGrouped = {
                        incidentType: stat.id,
                        label: stat.name,
                        icon: stat.icon,
                        team1: 0,
                        team2: 0
                    };
                    data.Statistics_Grouped_UI.push(stGrouped);
                }

                var getStatData = function(teamData, id) {
                    if (teamData && teamData.ST[id]) {
                        return parseInt(teamData.ST[id].VA);
                    }
                    return 0;
                }

                stGrouped.team1 = getStatData(data.PA_UI[0], stat.id);
                stGrouped.team2 = getStatData(data.PA_UI[1], stat.id);
            }
        }
    }

    $scope.setSliderPosition = function (tab) {
        var left;

        switch (tab) {
            case TABS.ANIMATIONS:
                left = $scope.isSmallWidget ? '3.7%' : '6%';
                break;
            case TABS.STATISTICS:
                left = $scope.isSmallWidget ? '37.5%' : '40%';
                break;
            case TABS.INCIDENTS:
                left = $scope.isSmallWidget ? '71%' : '73.5%';
                break;
        }

        $scope.sliderLeftPosition = left;
    }

    $scope.setSelectedTab = function (tabName) {

        // Set slider
        $scope.setSliderPosition(tabName);

        // Reset scrolled list of incidents
        /*if (tabName == TABS.INCIDENTS && $scope.snapshot.IN_UI.length > $scope.scrollPageSize) {
            $scope.snapshot.IN_UI = $scope.allIncidents.slice(0,
                $scope.isSmallWidget ? $scope.snapshot.CurrentIncidents_UI.length : $scope.scrollPageSize);
        };*/

        $scope.selectedTab = tabName;

        // Set scroll
        if ($scope.isSmallWidget && $scope.selectedTab === TABS.ANIMATIONS) {
            $scope.setScrollable();
        }

        // Set upper bar
        if (tabName == TABS.STATISTICS) {
            $scope.$broadcast('updateStatistics');
        }
    }

    $scope.changedPeriodFilter = function() {
        $scope.$broadcast('updateStatistics');
    };

    $scope.setSizeForIncidentService = function () {
        animationsService.width = $scope.width;
        animationsService.height = $scope.width;
        animationsService.makeResponsive();
    };

    var setScopeWidthAndHeight = function (widthValue, heightValue) {

        if ($scope.isSmallWidget) {

            $scope.width = widthValue;
            $scope.height = heightValue;

            $scope.widthTmp = $scope.width * 1.9;
            $scope.heightTmp = $scope.height * 1.9;
        } else {

            $scope.widthTmp = $scope.width = widthValue;
            $scope.heightTmp = $scope.height = heightValue;
        }
    }

    // Width/Height ratio is constant
    $scope.ratio = 670 / 440;

    // Min & Max width are fixed
    $scope.maxWidth = 900;
    $scope.minHeight = 230;

    $scope.minWidth = $scope.minHeight * $scope.ratio;
    $scope.maxHeight = $scope.maxWidth / $scope.ratio;

    $scope.borderHeight = 440;

    $scope.w = angular.element($window);
    $scope.width = $scope.w.width() > __config.widgetWidth ? __config.widgetWidth : $scope.w.width();
    $scope.w.bind('resize', function (e, i) {
        $scope.width = this.innerWidth > __config.widgetWidth ? __config.widgetWidth : this.innerWidth;
        $scope.changeSize($scope.width);
    });

    $scope.sliderLeftPosition = "";

    $scope.changeSize = function (width) {
        if (!width) return false;

        var height = width / $scope.ratio;

        $scope.isSmallWidget = height < $scope.borderHeight;
        setScopeWidthAndHeight(width, height);

        $scope.setScrollable();

        $scope.setSizeForIncidentService();
        
        $scope.$broadcast('changedSize');
        $scope.$broadcast('updateStatistics');
    }

    $scope.setScrollable = function () {

        if ($scope.isSmallWidget) {

            var elem = $("#makeMeScrollable");
            var lastElementForSmoothScroll = $('#lastElementForSmoothScroll');

            if (!elem || !elem.length || !lastElementForSmoothScroll || !lastElementForSmoothScroll.length) {

                $scope.scrollAttached = false;
                $timeout($scope.setScrollable, 50);
                return;
            }

            elem.smoothDivScroll({
                mousewheelScrolling: "allDirections",
                touchScrolling: true,
                manualContinuousScrolling: false,
                hotSpotScrolling: true,
                hotSpotScrollingStep: 1,
                startAtElementId: "lastElementForSmoothScroll",
                setupComplete: function () {
                    $scope.scrollAttached = true;
                }
            });

            // Init colorbox
            $("#makeMeScrollable a").colorbox({ speed: "500" });
        }
    }

    $scope.changeSize($scope.width);

    function setWidth(setBorders) {

        var getWidthIsTabRight = function(height) {
            return (height * animationsService.animationBgWidth) / animationsService.animationBgHeight;
        }

        setScopeWidthAndHeight(getWidthIsTabRight($scope.height), $scope.height);

        if (setBorders) {

            $scope.minWidth = getWidthIsTabRight($scope.minHeight);
            $scope.maxWidth = getWidthIsTabRight($scope.maxHeight);
        }
    }

    $scope.changedTabState = function() {
       
        setWidth(false);
    }

    $scope.sports = sportsFactory.sports;

    $scope.currentSport = {};
    $scope.selectedEvent = undefined;
    $scope.selectedIncident = undefined;

    $scope.getBottomContainerHeight = function() {
        
        if ($scope.isSmallWidget) {
            if ($scope.selectedTab == 'statistics' || $scope.selectedTab == 'incidents') {
                return "90%";
            } else {
                return "52%";
            }
        } else {
            return $scope.getSize('bottomContainer');
        }
    }

    $scope.stopCurrentAnimation = function() {
        createjs.Ticker.removeEventListener("tick", stages);
    }

    $scope.userChecked = function() {
        $scope.isAuthorized = true;
        $scope.init();
        $scope.setScrollable();
        $scope.setSelectedTab(TABS.ANIMATIONS);
    }

    $scope.lessStatisticsBorder = function() {
        return $scope.width < 470;
    };

    $scope.getTeamPlace = function (index) {
        return index == 0 ? 'H' : 'A';
    }

    $scope.formatToTwoDigits = function (v) {
        return v >= 10 ? v : "0" + v;
    }

    $scope.getMinuteForIncidentFormatted = function (incident) {
        var min = $scope.getMinuteForIncident(incident);
        var sec = $scope.getSecondForIncident(incident);
        return $scope.formatToTwoDigits(min) + ':' + $scope.formatToTwoDigits(sec) + '\'';
    }

    $scope.getMinuteForIncident = function (incident) {
        return Math.floor(incident.SE / 60);
    }

    $scope.getMinuteForIncidentProgressBar = function (incident) {
        return Math.floor((incident.SE_Actual ? incident.SE_Actual : incident.SE) / 60);
    }

    $scope.getSecondForIncident = function (incident) {
        return incident.SE - ($scope.getMinuteForIncident(incident) * 60);
    }

    $scope.getStepLength = function (dividers) {
        return $scope.widthTmp / dividers / 2.185;
    }

    $scope.getProgressBarPadding = function () {
        return $scope.widthTmp / 29;
    }

    $scope.getLeftPositionForTimeProgress = function () {
        var minute = $scope.getMatchMinutesPlayed(true);
        var padding = $scope.getProgressBarPadding()*1.3;
        return padding + minute * $scope.getStepLength($scope.match.dividers);
    }

    $scope.getLeftPositionForIncident = function (incident, index, dividers) {
        if (!incident) return 0;
        var minute = $scope.getMinuteForIncident(incident);
        var padding = $scope.getProgressBarPadding();
        return padding + minute * $scope.getStepLength(dividers);
    }

    $scope.getLeftPositionForDivider = function (index, dividers) {
        var padding = $scope.getProgressBarPadding();
        return padding + index * ($scope.widthTmp - padding * 2) / dividers;
    }

    $scope.getLeftPositionForIndicator = function (minute, dividers) {
        var padding = $scope.getProgressBarPadding();
        return padding + minute * $scope.getStepLength(dividers) - ($scope.getSize('timelineRoundMinute') / ($scope.isSmallWidget ? 3 : 4));
    }

    $scope.getNumber = function (num) {
        var result = [];
        for (var i = 0; i < num; i++) {
            result.push(i);
        }
        return result;
    }

    $scope.getNumberGrouped = function (len, groupSize) {
        var groups = Math.ceil(len / groupSize);
        return $scope.getNumber(groups);
    };

    $scope.resultsColumnsCount = function () {
        $rootScope.$broadcast('recountColumns');
    }

    $scope.changeColumns = function () {
        if ($scope.showAllColumns) {
            $scope.hasExtra1Half = true;
            $scope.hasExtra2Half = true;
            $scope.hasPenalty = true;
            $scope.resultColumns = 6;
        } else {
            $scope.resultColumns = $scope.resultsColumnsCount();
        }
    }

    $scope.changeMatchLength = function () {
        if ($scope.showExtendedMatch) {
            $scope.match = $scope.currentSport.match_extended;
        } else {
            $scope.match = $scope.currentSport.match_normal;
        }
    }

    $scope.checkIncident = function (incidentType, second, allowedTypes) {
        return incidentType
               && parseInt(second) >= 0
               && (!allowedTypes || allowedTypes.indexOf(incidentType) >= 0);
    }

    $scope.checkTiming = function (period, second) {
        if (period && $scope.currentSport.periodsTiming) {
            var timing = $scope.currentSport.periodsTiming[period];
            if (timing && second > timing.maxSec) {
                return timing.maxSec;
            }
        }
        return parseInt(second);
    }

    $scope.getShownIncidents = function (allowedTypes, skipGrouping, skipTimeFix) {

        var result = [];
        var resultGrouped = [];

        // Process incidents
        angular.forEach($scope.snapshot.IN, function (incident, id) {
            if (incident && $scope.checkIncident(incident.TY, incident.SE, allowedTypes)) {
                var dt = $scope.currentSport.incidentsData[incident.TY];
                if ($scope.incidentsShowing[incident.TY] == undefined) {
                    $scope.incidentsShowing[incident.TY] = true;
                }
                if (!skipTimeFix && !incident.SE_Actual) {
                    incident.SE_Actual = parseInt(incident.SE.toString());
                    incident.SE = $scope.checkTiming(incident.PE, incident.SE);
                } else {
                    incident.SE = parseInt(incident.SE);
                }
                incident.id = id;
                if (dt) {
                    incident.groupId = dt.groupId;
                }
                result.push(incident);
            }
        });

        //// Process updates
        //angular.forEach($scope.snapshot.Updates, function (incident, id) {
        //    if (incident && $scope.checkIncident(incident.incidentType, incident.second, allowedTypes)) {
        //        console.log('UPD')
        //        var dt = $scope.currentSport.incidentsData[incident.TY];
        //        if ($scope.incidentsShowing[incident.incidentType] == undefined) {
        //            $scope.incidentsShowing[incident.incidentType] = true;
        //        }
        //        result.push({
        //            TY: incident.incidentType,
        //            SE: !skipTimeFix ? $scope.checkTiming(incident.period, incident.second) : parseInt(incident.second),
        //            SE_Actual: !skipTimeFix ? parseInt(incident.second) : null,
        //            PO: incident.position,
        //            PE: incident.period,
        //            id: id,
        //            groupId: dt ? dt.groupId : null
        //        });
        //    }
        //});

        // Make grouped icons visible by default
        if ($scope.currentSport.incidentGroups) {
            for (var groupId in $scope.currentSport.incidentGroups) {
                if ($scope.incidentsShowing[groupId] == undefined) {
                    $scope.incidentsShowing[groupId] = true;
                }
            }
        }

        result = $filter('orderBy')(result, $scope.currentSport.incidentsOrderByField);

        if (skipGrouping) {
            return result;
        }
        
        var groupedIndexes = [];
        var groupingSec = 120;
        for (var i = 0; i < result.length; i++) {
            if (groupedIndexes.indexOf(i) >= 0) {
                continue;
            } else {
                resultGrouped.push(result[i]);
            }
            var currentIncident = result[i];
            currentIncident.Group = [];
            var currentTime = parseInt(currentIncident.SE);
            for (var k = i + 1; k < result.length; k++) {
                var nextIncident = result[k];

                if (nextIncident == currentIncident) continue;
                var nextTime = parseInt(nextIncident.SE);
                var timeDiff = nextTime - currentTime;

                if (timeDiff > groupingSec) {
                    break;
                }

                if (nextIncident.PE == currentIncident.PE
                    && nextIncident.PO == currentIncident.PO
                    && (timeDiff <= groupingSec)) {
                    if (currentIncident.Group.length == 0) {
                        currentIncident.Group.push({
                            TY: currentIncident.TY,
                            PO: currentIncident.PO,
                            SE: parseInt(currentIncident.SE),
                            SE_Actual: parseInt(currentIncident.SE_Actual),
                            PL: currentIncident.PL,
                            PE: currentIncident.PE
                        });
                    }
                    currentIncident.Group.push(nextIncident);
                    groupedIndexes.push(k);
                }
            }
        }

        return resultGrouped;
    }

    $scope.isGoalIncident = function (incident) {
        return incident.TY == 413 || incident.TY == 423 || incident.TY == 421;
    }

    $scope.resetTooltipsVisibility = function() {
        for (var i=0; i < $scope.incident_title_visible.length; i++) {
            $scope.incident_title_visible[i] = false;
            $scope.incident_title_text_visible[i] = false;
            $scope.incident_grouped_title_visible[i] = false;
            $scope.incident_title_hiding[i] = false;
            $scope.incident_title_text_hiding[i] = false;
        }
    }

    $scope.mouseOverIncident = function (index) {
        $timeout(function () {
            // Hide all tooltips if there are something opened
            $scope.resetTooltipsVisibility();

            // Show text stand
            $scope.incident_title_visible[index] = true;
            $scope.incident_grouped_title_visible[index] = true;

            // Show text with delay
            $timeout(function() {
                    $scope.incident_title_text_visible[index] = true;
                },
                301);
        }, 302);
    }

    $scope.mouseOutIncident = function (incident, index) {
        // Start hiding of tooltip text
        $scope.incident_title_text_hiding[index] = true;

        // Start hiding of stand near the text
        $timeout(function() {
            $scope.incident_title_hiding[index] = true;
        }, 501);

        // Hide grouped
        $scope.incident_grouped_title_visible[index] = false;
    }

    $scope.mouseOutGroupedIncident = function (index) {
        $scope.incident_grouped_title_visible[index] = false;
        $scope.incident_title_visible[index] = false;
    }

    $scope.toggleIncidentInTab = function () {
        // Toggle visibility of incident
        for (var i = 0; i < arguments.length; i++) {
            $scope.incidentsShowing[arguments[i]] = !$scope.incidentsShowing[arguments[i]];
        }

        // Load more elements if filtered list become shorter than page size
        var shownElements = 0;
        var checked = [];
        for (var index in $scope.snapshot.IN_UI) {
            var incident = $scope.snapshot.IN_UI[index];
            var val = $scope.incidentsShowing[incident.TY];
            if (val && checked.indexOf(incident.TY) < 0) {
                checked.push(incident.TY);
                shownElements++;
            }
        }
        if (shownElements < $scope.scrollPageSize) {
            $scope.loadMore();
        }
    }

    $scope.incidentExist = function () {
        if (!$scope.snapshot.IN_UI || $scope.snapshot.IN_UI.length == 0) return false;
        for (var i = 0; i < arguments.length; i++) {
            var exist = $filter('filter')($scope.snapshot.IN_UI, { TY: arguments[i] }).length > 0;
            if (exist) {
                return true;
            }
        }
        return false;
    }

    $scope.checkIfTimeIncident = function (incident) {
        return $scope.currentSport.halfTimeIncidents.indexOf(parseInt(incident.TY)) >= 0
               || $scope.currentSport.timePeriodFinishedIncidents.indexOf(parseInt(incident.TY)) >= 0;
    }

    $scope.getMatchFinishedIncident = function () {

        // Check match finished incidents
        for (var i = 0; i < $scope.currentSport.timePeriodFinishedIncidents.length; i++) {
            var inc = $scope.currentSport.timePeriodFinishedIncidents[i];
            if ($scope.incidentExist(inc)) {
                return inc;
            }
        }

        // Check halftime incidents
        if ($scope.snapshot.TT == 0) {
            for (var i = 0; i < $scope.currentSport.halfTimeIncidents.length; i++) {
                var inc = $scope.currentSport.halfTimeIncidents[i];
                if ($scope.incidentExist(inc)) {
                    return inc;
                }
            }
        }
        return null;
    }

    $scope.getClockHeader = function () {
        var matchFinishedIncident = $scope.getMatchFinishedIncident();
        if (matchFinishedIncident) {
            return $scope.currentSport.getLabel(matchFinishedIncident);
        }
        return $scope.getPeriodLabel($scope.currentPeriod);
    }

    $scope.getCurrentPeriodMinutesPlayed = function () {
        return Math.floor($scope.getCurrentPeriodMinutesPlayedFull());
    }

    $scope.getCurrentPeriodMinutesPlayedFull = function () {
        var minutesPlayed = $scope.snapshot.TS / 60;
        return minutesPlayed;
    }

    $scope.getMatchMinutesPlayed = function (full) {
        var finishedAt = $scope.getMatchFinishedIncident();
        // Set finished time if exist
        if (finishedAt) {
            $scope.snapshot.TS = $scope.getIncidentData(finishedAt).SE;
        }
        var minutesPlayed = (full ? $scope.getCurrentPeriodMinutesPlayedFull() : $scope.getCurrentPeriodMinutesPlayed());
        return minutesPlayed;
    }

    $scope.getIncidentData = function(type) {
        var finishedIncidentVal = $filter('filter')($scope.snapshot.IN_UI, { TY: type });
        if (finishedIncidentVal && finishedIncidentVal.length > 0) {
            return finishedIncidentVal[0];
        }
        return null;
    }

    $scope.tickInterval = 1000; //ms
    $scope.timerMin = 0;
    $scope.timerSec = 0;

    var tick = function () {
        var finishedIncident = $scope.getMatchFinishedIncident();
        if (+$scope.snapshot.TT === 1 && !finishedIncident) {
            if (+$scope.timerSec === 59) {
                $scope.timerMin++;
                $scope.timerSec = 0;
            } else {
                $scope.timerSec++;
            }
            $scope.snapshot.TS++;
            $(document).trigger("moveToLastTime");
        }
        else if (+$scope.snapshot.TT === 0 && finishedIncident) {
            unsubscribe();
        }
        $timeout(tick, $scope.tickInterval); // reset the timer
    }

    $scope.setMatchTimer = function () {
        var matchMinutesPlayed = $scope.getMatchMinutesPlayed();
        var minutesPlayed = $scope.getCurrentPeriodMinutesPlayed();
        var secondsPlayed = $scope.snapshot.TS - (minutesPlayed * 60);
        $scope.timerMin = matchMinutesPlayed;
        $scope.timerSec = secondsPlayed;
    }

    $scope.playAnimationsTest = function () {

        var updatesFile;

        switch ($scope.snapshot.SP) {
            case 'Football':
                updatesFile = "/js/example/soccer_response_updates.txt";
                break;
            case 'Tennis':
                updatesFile = "/js/example/tennis_response_updates.txt";
                break;
            case 'Basketball':
                updatesFile = "/js/example/basketball_response_updates.txt";
                break;
        }

        $.get(updatesFile,
            function(data) {
                var updates = data.split('\r\n');
                for (var i = 0; i < updates.length; i++) {
                    var upd = updates[i];
                    (function(i, upd) {
                        setTimeout(function () {
                            if (upd) {
                                console.log(upd);
                                dataService.processUpdate($scope.snapshot, upd);
                                $scope.processUpdates({ data: upd });
                                $(document).trigger("moveToLastTime");
                            } else {
                                console.log('skipping empty update...')
                            }
                        }, i * 10);
                    })(i, upd);
                }
            });
    }

    $scope.getPeriodLabel = function (period) {
        return $scope.currentSport.getPeriodLabel(period);
    }

    $scope.getDividedPercentage = function (team1, team2) {

        if (!team2) {
            return 0;
        }

        if (!team1) {
            return 100;
        }
        if (team1 == team2) {
            return 50;
        }
        if (((team2 / team1) / 2) >= 1) {
            return 100 - ((Math.abs((team2 / team1) / (team1 + team2))) * 100);
        }

        return (((team2 / team1) / 2) * 100);
    }

    $scope.getIncidentIcon = function (stat) {
        return $scope.currentSport.getIncidentIcon(stat.incidentType ? stat.incidentType : stat.TY);
    };

    $scope.getStatistics = function () {
        if ($scope.currentPeriod) {
            return $filter('filter')($scope.snapshot.Statistics_UI, { period: $scope.currentPeriod });
        }
        return $scope.snapshot.Statistics_Grouped_UI;
    }

    $scope.matchNotFinished = function () {
        return !$scope.incidentExist(437)
                && !$scope.incidentExist(434)
                && !$scope.incidentExist(436)
                && !$scope.incidentExist(435);
    }

    $scope.updateTimer = function () {
        $scope.timerMin = Math.floor($scope.snapshot.TS / 60);
        $scope.timerSec = $scope.snapshot.TS - ($scope.timerMin * 60);
    }

    $scope.fixTimer = function () {
        var incident = $scope.getMatchFinishedIncident();
        if (incident) {
            var eventSecond = $scope.getIncidentData(incident.incidentType).SE;
            $scope.snapshot.TS = eventSecond;
        }
        $scope.updateTimer();
    }

    $scope.slideIcon = function (event, index) {

        var visible = $scope.stat_icon_title_visible[index] == true;
        var slideBack = event.type == 'mouseleave';

        if ((slideBack && !visible)
            || (!slideBack && visible)) {
            return;
        }

        $scope.stat_icon_title_visible[index] = !slideBack;

        var el = slideBack ? event.currentTarget.children[0] : event.currentTarget;
        if (el.attributes["data-animated-icon"]) {
            el.style.left = slideBack ? ($scope.isSmallWidget ? '43%' : '43.5%') : '10%';
        }
    }

    $scope.getIncidentPaged = function (icon, iconBlock, pageSize) {
        return $scope.snapshot.CurrentIncidents_UI[parseInt(icon) + (pageSize * iconBlock)];
    }

    $scope.incidents_tab_selected_incident = [];

    $scope.$on('$locationChangeStart', function (event) {
        if ($scope.isAuthorized) {
            $window.location.reload();
        }
    });

    $scope.getTextWidth = function(text, font) {
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    };

    $scope.getProgressBarWidth = function() {
        return $scope.widthTmp - ($scope.widthTmp * 0.025);
    };

    var canvasTextToMeasure = function (playerName) {
        return ' 99\' ' + playerName + '  ';
    };

    $scope.getFontSize = function() {
        return $scope.getSize('timelineText') + 'px';
    };

    $scope.getTooltipWidth = function (incident) {
        
        var tooltipWidth = $scope.getTextWidth(canvasTextToMeasure(incident.PL));
        var fontSize = $scope.getFontSize();

        if (incident.Group) {
            for (var i = 1; i < incident.Group.length && i<3; i++) {
                tooltipWidth += $scope.getTextWidth(canvasTextToMeasure(incident.Group[i].PL), 'normal ' + fontSize + ' sans-serif');
            }
        }

        return tooltipWidth;
    };

    $scope.tooltipIsOutOfBorders = function (incident, index) {

        var groupLength = 0;

        if (incident.Group) {
            groupLength = Math.min(incident.Group.length, 3) * ($scope.widthTmp / 65);
        }

        return $scope.getTooltipWidth(incident) > ($scope.getProgressBarWidth() - $scope.getLeftPositionForIncident(incident, index, $scope.match.dividers) - groupLength);
    };

    $scope.anyIncidentHovered = function () {

        if (!$scope.incident_grouped_title_visible) {
            return false;
        }

        for (var i = 0; i < $scope.incident_grouped_title_visible.length; i++) {
            if ($scope.incident_grouped_title_visible[i] === true) {
                return true;
            }
        }

        return false;
    }

    $scope.setActiveIncident = function (index) {
        if ($scope.incident_grouped_title_visible[index] === true) {
            return;
        }

        $scope.incident_grouped_title_visible[index] = true;
    }

    $scope.getHeightForIncidentIcons = function() {
        return $scope.snapshot.CurrentIncidents_UI.length * ($scope.heightTmp / 22);
    }

    $scope.incidentVisible = function (incident) {
        var type = incident.TY;
        var pos = incident.PO;
        return ((pos == 1 || pos == 2) && $scope.incidentsShowing[parseInt(type)])
               || (pos == -1 && $scope.checkIfTimeIncident(incident));
    }

    $scope.getShownIncidentsAmount = function() {
        var count = 0;
        for (var i in $scope.snapshot.IN_UI) {
            var incident = $scope.snapshot.IN_UI[i];
            if ($scope.incidentVisible(incident)) {
                count++;
            }
        }
        return count > $scope.snapshot.CurrentIncidents_UI.length ? count : $scope.snapshot.CurrentIncidents_UI.length;
    }

    $scope.isAnyIncidentTooltipShowing = function () {
        for (var key in $scope.incidents_tab_selected_incident){
            if ($scope.incidents_tab_selected_incident[key] == true) {
                return true;
            }
        }
        return false;
    }

    $scope.getIncidentId = function (incident) {
        return incident.groupId ? incident.groupId : incident.TY;
    }

    $scope.getSize = function(id) {
        return sizeService.getSize(id, $scope.width);
    }

    $scope.getPaddingTopTimeline = function() {
        return ($scope.heightTmp * 0.19 - $scope.getSize('timelineHeight') * 2 - $scope.getSize('timelineSpace')) / 2;
    }

    return vm;
});