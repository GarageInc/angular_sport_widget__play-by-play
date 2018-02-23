// Get config
var config = {};
if (window) {
    Object.assign(config, window.__config);
}

var playByPlayApp = angular.module("playByPlayApp", [
    "network-services",
    "sportsFactory",

    "animationsService",
    "dataService",
    "sizeService",

    "tennisService",
    "soccerService",
    "basketballService",

    "ngSanitize",
    "ngRoute"
]);

// Register config in application
playByPlayApp.constant('__config', config);

playByPlayApp.config(function ($locationProvider) {
    $locationProvider.hashPrefix('!');
});

function getIncidentData(scope, element, attrs) {

    var incident = JSON.parse(attrs.incident);
    var fontSize = scope.getFontSize();

    var tooltipWidth = scope.getTooltipWidth(incident);

    return {
        fontSize: fontSize,
        incident: incident,
        tooltipWidth: tooltipWidth,
        position: '70%',
        tooltipIsOutOfBorders: function() {
            return scope.tooltipIsOutOfBorders(incident, attrs.index);
        }
};
}

playByPlayApp.directive("incidentTooltipText", function () {
    return {
        link: function (scope, element, attrs, data) {

            var prepareTooltip = function (scope, element, attrs) {

                var data = getIncidentData(scope, element, attrs);
                var el = element[0];

                var tooltipOutOfBorders = data.tooltipIsOutOfBorders();

                if (data.incident.Group && data.incident.Group.length > 0 && tooltipOutOfBorders) {
                    var left = (data.tooltipWidth + scope.widthTmp / 80 + (scope.isSmallWidget ? 9 : 8)) * (-1);
                    if (!scope.isSmallWidget && data.incident.Group.length >= 3) {
                        left *= 1.06;
                    }
                    el.style.left = left + 'px';
                    el.style['padding-right'] = 5 + 'px';
                } else {
                    if (data.incident.Group && data.incident.Group.length > 0) {
                        data.position = data.incident.PO === 1 ? '110%' : '500%';
                    }
                    
                    if (tooltipOutOfBorders) {
                        el.style.right = scope.getSize('ballIcon') + "px";
                    } else {
                        el.style.left = scope.getSize('ballIcon') + "px";
                    }
                    if (data.incident.PO === 1) {
                        el.style['padding-top'] = 5 + 'px';    
                    }
                }

                if (data.incident.Group && data.incident.Group.length > 0) {
                    var animationClass = ' fadeIn'; // tooltipOutOfBorders ? ' fadeIn' : ' appearFromLeftToRight';
                    el.parentNode.className += " animated" + animationClass;
                    el.children[0].className += animationClass;
                } else {
                    el.children[0].className += " appearFromLeftToRight";
                }

                //console.log(el.style.left)
            }

            scope.$on('changedSize', function (event, data) {
                prepareTooltip(scope, element, attrs);
            });

            scope.$on('updateTooltips', function (event, data) {
                prepareTooltip(scope, element, attrs);
            });

            prepareTooltip(scope, element, attrs);
        }        
    }      
});

playByPlayApp.directive("incidentTooltipEnding", function () {
    return {
        link: function (scope, element, attrs, data) {
            var data = getIncidentData(scope, element, attrs);
            var div = document.createElement("div");
            div.className += data.tooltipIsOutOfBorders() ? ' triangle-top-left-left-side' : ' triangle-top-left-right-side';
            element[0].parentNode.appendChild(div);
        }
    };
});

playByPlayApp.directive('infiniteScrollWithSidebar', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var el = element[0];
            var lastScrollTop = 0;

            element.bind('scroll', function () {
                // Load more function
                var executeLoadMore = function (scrolled, el) {
                    var scrollTop = Math.ceil(scrolled + el.offsetHeight);
                    var diff = scrollTop - el.scrollHeight;
                    if (diff > -10) {
                        scope.$apply(attrs.infiniteScrollWithSidebar);
                    }
                }
                
                // Get position of sidebar element
                var sidebar = $(attrs.sideBarSelector);
                var position = sidebar.position();
                var vpHeight = $(attrs.sideBarViewportSelector).height();
                var height = sidebar.height();
                var scrolled = el.scrollTop;

                // Side bar is hidden
                if (!position) {
                    executeLoadMore(scrolled, el);
                    return;
                };

                var currentTop = position.top;

                // Check if user scrolls down
                var scrollDown = scrolled > lastScrollTop;

                // If all icons fit screen and there is no need in scroll down
                var iconsFitScreen = height < vpHeight;

                // Scroll down
                if (scrollDown) {

                    // Load more if necessary
                    executeLoadMore(scrolled, el);
                    
                    if (!iconsFitScreen) {
                        // Check if icons are fit on the viewport
                        var partOnScreen = (scrolled + vpHeight) < (currentTop + height);

                        // New top position
                        var newTop = scrolled + vpHeight - height;
                        if (!partOnScreen && newTop > 0) {
                            sidebar.css('top', newTop);
                        }
                    } else {
                        sidebar.css('top', scrolled);
                    }

                } else {
                    // Scroll up
                    if (scrolled < currentTop) {
                        sidebar.css('top', scrolled);
                    }
                }
                lastScrollTop = scrolled;
            });
        }
    };
});

playByPlayApp.directive('fullWidthDependentOnElementScroll',
    function() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                var setWidth = function () {
                    setTimeout(function() {
                        var el = $(element[0]);
                        var wrapper = $(attrs.wrapperSelector);
                        var parentHasScroll = $(attrs.scrolledElementSelector).height() > wrapper.height();
                        $(el).width(parentHasScroll ? (wrapper.width() - 15) + 'px' : '100%');
                    }, 50);
                };

                scope.$on('updateStatistics', function () {
                    setWidth();
                });

                setWidth();
            }
        }
});
    

var SportBase = function (name, bg_image, animationsLeft, animationsRight) {

    this.name = name;
    this.bg_image = bg_image;
    this.lib = {};

    this.animationsLeft = animationsLeft;
    this.animationsRight = animationsRight;

    this.incidentsData = [];
    this.incidentGroups = null;
    this.periods = [];

    this.match_normal = {};
    this.match_extended = {};

    this.progressBarIncidents = [];
    this.incidentsOrderByField = '+SE'; // By default - incidents sorted by seconds

    this.incidentTypes = {
        notAnimated: [],
        animated: [],
        animatedWithWithBlackBox: [],
        animatedWhiteWithClock: [],
        oppositeSideAnimations: []
    };

    this.incidentsWithTeamName = [];
    this.incidentsWithTeamAndPlayerName = [];

    this.ignoredIncidentTypes = [
        1000, // Betstart
        1010, // Betstop
        1200  // Technical problems
    ];

    // Side means PO (position) from response - 1 for left side, 2 for right
    this.getAnimation = function (type, side) {
        var animations = side == 1 ? this.animationsLeft : this.animationsRight;
        return animations[type] ? animations[type] : null;
    }

    this.getLabel = function (type) {
        var label = this.incidentsData[type] ? this.incidentsData[type].label : "Unknown Type = " + type;
        return label;
    }

    this.usedInStatistics = function (type) {
        return this.incidentsData[type] && this.incidentsData[type].labelStat;
    }

    this.getLabelStatistics = function (type) {
        var label = this.incidentsData[type] ? (this.incidentsData[type].labelStat ? this.incidentsData[type].labelStat : this.incidentsData[type].label) : "Unknown Type = " + type;
        return label;
    }

    this.getIncidentIcon = function (type) {
        var icon = this.incidentsData[type] && this.incidentsData[type].icon ? this.incidentsData[type].icon : "ball_default";
        return icon;
    }

    this.getPeriodLabel = function (period) {
        return this.periods[period] ? this.periods[period].label : null;
    }

    this.isAnimatedWhiteWithClock = function (type) {
        return this.incidentTypes.animatedWhiteWithClock.indexOf(type) >= 0;
    }

    this.isAnimated = function (type) {
        return this.incidentTypes.animated.indexOf(type) >= 0;
    }

    this.isIgnored = function (type) {
        return this.ignoredIncidentTypes.indexOf(parseInt(type)) >= 0;
    }

    this.isIgnoredAnimation = function (type) {
        return this.ignoredIncidentTypesForAnimation && this.ignoredIncidentTypesForAnimation.indexOf(parseInt(type)) >= 0;
    }

    this.hasBlackBoxAnimation = function (type) {
        return this.incidentTypes.animatedWithWithBlackBox.indexOf(type) >= 0;
    }
}