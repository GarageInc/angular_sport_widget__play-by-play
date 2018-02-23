/* Service for playing of animations */
(function () {
    angular.module("animationsService", ["sportsFactory", "sizeService"])
        .service("animationsService",
            function (sportsFactory, sizeService) {

                var vm = this;

                var canvas, stage;
                var lib = {}, libRel = {}, images = {}, imagesRel = {};

                vm.animationBgWidth = 666;
                vm.animationBgHeight = 250;

                vm.sportsFactory = sportsFactory;
                vm.sizeService = sizeService;

                vm.animationsQueue = [];
                vm.activeAnimation = null;

                vm.mainAnimation = null;
                vm.relatedAnimation = null;

                vm.animationsLoaded = [];
                vm.animations = [];
                vm.loaders = [];

                createjs.EventDispatcher.initialize(createjs);

                createjs.addEventListener('changeState', function (e) {
                    if (vm.activeAnimation) {
                        //console.log('changed state to', e.detail)
                        vm.activeAnimation.state = e.detail;
                    }
                });

                vm.prepareCurrentAnimation = function () {
                    console.log('animations to play amount', vm.animationsQueue.length)
                    vm.activeAnimation = vm.animationsQueue.shift();
                    if (vm.activeAnimation) {
                        vm.activeAnimation.state = "new";
                        lib = {}, images = {};
                        vm.animationsLoaded = [false];
                        vm.animations = [];
                        vm.loaders = [];
                        vm.relatedAnimation = null;
                        console.log('play animation', vm.activeAnimation);
                        vm.prepareAnimation(vm.activeAnimation.handler, vm.activeAnimation.text, lib, images, 0);
                        if (vm.activeAnimation.handlerRelated) {
                            libRel = {}, imagesRel = {};
                            vm.animationsLoaded.push(false);
                            vm.prepareAnimation(vm.activeAnimation.handlerRelated, vm.activeAnimation.text, libRel, imagesRel, 1);
                        }
                    }
                };

                setInterval(function() {
                    //console.log('checking queue', vm.animationsQueue.length);
                    if (!vm.activeAnimation) {
                        vm.prepareCurrentAnimation();
                    } else {
                        switch (vm.activeAnimation.state) {
                            case "new":
                                vm.mainAnimation.dispatchEvent(new CustomEvent('play'));
                                break;
                            case "playedForward":
                                if (vm.animationsQueue.length > 0) {
                                    //console.log('play back activeAnimation animation')
                                    vm.activeAnimation.state = "inProcess";
                                    vm.mainAnimation.dispatchEvent(new CustomEvent('playReverse'));
                                }
                                break;
                            case "playedBackward":
                                //console.log('process next animation in queue');
                                vm.prepareCurrentAnimation();
                                break;
                            case "inProcess":
                                break;
                        }
                    }
                }, 750);

                vm.fileLoaded = function (evt, images) {
                    if (evt.item.type === "image") {
                        images[evt.item.id] = evt.result;
                    }
                }

                vm.animationPrepared = function (event, number, lib) {

                    //console.log('loaded animation', number);
                    vm.animationsLoaded[number] = true;

                    var allAnimationsLoaded = true;
                    for (var i = 0; i < vm.animationsLoaded.length; i++) {
                        if (!vm.animationsLoaded[i]) {
                            allAnimationsLoaded = false;
                        }
                    }

                    if (!canvas) {
                        console.log("canvas is missing");
                        return;
                    }

                    var queue = event.target;
                    var ssMetadata = lib.ssMetadata;

                    for (var i = 0; i < ssMetadata.length; i++) {
                        ss[ssMetadata[i].name] = new createjs.SpriteSheet({
                            "images": [queue.getResult(ssMetadata[i].name)],
                            "frames": ssMetadata[i].frames
                        });
                    }

                    vm.animations[number] = new lib.getExportRoot();

                    if (!allAnimationsLoaded) {
                        return;
                    }

                    //console.log('play all');

                    vm.mainAnimation = vm.animations[vm.animations.length > 1 ? 1 : 0];
                    if (vm.animations.length > 1) {
                        vm.relatedAnimation = vm.animations[0];
                    }

                    if (!stage) {
                        stage = new createjs.Stage(canvas);
                    }

                    stage.removeAllChildren();

                    stage.addChild(vm.mainAnimation);
                    if (vm.relatedAnimation) {
                        stage.addChild(vm.relatedAnimation);
                    }

                    vm.makeResponsive();

                    createjs.Ticker.setFPS(lib.properties.fps);
                    createjs.Ticker.removeEventListener("tick", stage);
                    createjs.Ticker.addEventListener("tick", stage);
                }

                vm.prepareAnimation = function(event, txt, lib, images, number) {

                    //console.log('prepare animation', number);
                    canvas = document.getElementById("canvas");

                    if (!event) return;

                    vm.loaders[number] = new createjs.LoadQueue(false);
                    vm.loaders[number].addEventListener("fileload",
                        function(event) {
                            vm.fileLoaded(event, images);
                        });

                    vm.loaders[number].addEventListener("complete",
                        function(event) {
                            //console.log('completed', number);
                            vm.animationPrepared(event, number, lib);
                        });

                    if (event.func) {
                        event.func(lib, images, createjs, txt);
                    } else {
                        event(lib, images, createjs, txt);
                    }

                    if (lib.properties.manifest.length > 0) {
                        vm.loaders[number].loadManifest(lib.properties.manifest);
                    } else {
                        vm.animationPrepared(event, number, lib);
                    }
                };

                vm.playAnimations = function(incidents, sportId, isSmallWidget) {

                    if (!incidents) return;

                    if (!vm.sport) {
                        vm.sport = vm.sportsFactory.getSport(sportId);
                    }

                    // Show animations
                    for (var i = 0; i < incidents.length; i++) {

                        var incident = incidents[i];
                        if (!incident || !incident.incidentType) continue;

                        var type = parseInt(incident.incidentType);

                        // Ignored incident
                        if (vm.sport.isIgnoredAnimation(type)) continue;

                        // Switch sides for some animations
                        var currentPosition = incident.position;
                        var showAtOppositeSide = vm.sport.incidentTypes.oppositeSideAnimations.indexOf(type) >= 0;
                        if (showAtOppositeSide) {
                            currentPosition = currentPosition == 1 ? 2 : 1;
                        }

                        var getLines = function(label, incident) {
                            var maxLength = 23;
                            var secondLine = '';
                            if (!incident.ignoreSecondLine) {
                                secondLine = incident.secondLine ||
                                    incident.player + (incident.teamName ? ' (' + incident.teamName + ')' : '');
                            }
                            if (secondLine.length > maxLength) {
                                secondLine = secondLine.substr(0, maxLength) + '...)';
                            }

                            var sizeKey = !vm.sport.isAnimated(incident.incidentType)
                                ? "animationWhiteMessageText"
                                : "animationBlackBoxText";

                            //console.log('width', vm.width);
                            var size = vm.sizeService.getSize(sizeKey, vm.width);

                            return {
                                header: label,
                                addLine: secondLine,
                                headerSize: size,
                                addLineSize: size
                            };
                        }

                        var label = incident.label ? incident.label : vm.sport.getLabel(type);
                        var text = getLines(label, incident);

                        var handler;
                        var handlerRelated = null;

                        if (vm.sport.isAnimatedWhiteWithClock(type)) {
                            handler = AnimationWithWhiteStripAndTimer;
                        } else if (vm.sport.isAnimated(type)) {
                            handler = vm.sport.getAnimation(type, currentPosition);
                            if (vm.sport.hasBlackBoxAnimation(type)) {
                                handlerRelated = AnimationWithBlackBox;
                            }
                        } else {
                            handler = AnimationWithWhiteStrip;
                        }

                        vm.animationsQueue.push({
                            type: type,
                            text: text,
                            position: currentPosition,
                            handler: handler,
                            handlerRelated: handlerRelated
                        });
                    }
                };

                vm.prepareLabelForUpdate = function(inc, teams, config) {

                    inc.label = config.getLabel(inc.incidentType);

                    var secondLine;
                    var team = teams[inc.position - 1];
                    var teamName = team ? team.NA : '';
                    switch (true) {
                    case config.incidentsWithTeamName.indexOf(inc.incidentType) >= 0:
                        secondLine = teamName;
                        break;
                    case config.incidentsWithTeamAndPlayerName.indexOf(inc.incidentType) >= 0:
                        secondLine = inc.player + (teamName ? ' (' + teamName + ')' : '');
                        break;
                    default:
                        inc.ignoreSecondLine = true;
                        break;
                    }

                    inc.secondLine = secondLine;
                };

                vm.prepareLabelsForUpdates = function(data, config) {
                    for (var i = 0; i < data.updates.length; i++) {
                        var inc = data.updates[i];
                        if (inc && inc.incidentType) {
                            vm.prepareLabelForUpdate(inc, data.teams, config);
                        }
                    };
                };

                vm.makeResponsive = function() {

                    if (!canvas) {
                        return;
                    }

                    var w = 0, h = 0;

                    w = vm.width;
                    h = vm.height * 0.5;

                    canvas.width = w;
                    canvas.height = h;

                    stage.scaleX = canvas.width / vm.animationBgWidth;
                    stage.scaleY = canvas.height / vm.animationBgHeight;

                    stage.update();
                };

                return vm;

            });

}());