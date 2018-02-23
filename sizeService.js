/* Service for calculation of sizes for element attributes according to provided ranges  */
(function () {
    angular.module("sizeService", [])
        .service("sizeService",
            function() {

                var vm = this;

                var RangeGroup = function(id, min, max) {
                    this.id = id;
                    this.min = min;
                    this.max = max;
                    this.diff = max - min;
                };

                var Range = function(group, from, to) {
                    this.group = group;
                    this.from = from;
                    this.to = to;
                    this.diff = to - from;
                    this.step = this.diff / this.group.diff;

                    this.getSize = function (width) {
                        if (this.from === this.to) {
                            return this.from;
                        }
                        var newSizeAdd = width - this.group.min;
                        return this.from + (this.step * newSizeAdd);
                    }
                };

                var ElementSize = function (ranges) {
                    this.ranges = ranges;
                    this.getRange = function(groupId) {
                        for (var i = 0; i < this.ranges.length; i++) {
                            var range = this.ranges[i];
                            if (range.group.id === groupId) {
                                return range;
                            }
                        }
                        return null;
                    };
                }

                vm.small = new RangeGroup("small", 350, 669);
                vm.big = new RangeGroup("big", 670, 900);

                vm.rangeGroups = [
                    vm.big,
                    vm.small
                ];

                vm.elementSizes = {
                    "tabText": new ElementSize([new Range(vm.big, 13, 14), new Range(vm.small, 12, 14)]),
                    "nameScore": new ElementSize([new Range(vm.big, 12, 12), new Range(vm.small, 12, 12)]),
                    "homeAway": new ElementSize([new Range(vm.big, 11, 12), new Range(vm.small, 11, 12)]),
                    "ballIcon": new ElementSize([new Range(vm.big, 17, 19), new Range(vm.small, 14, 19)]),
                    "timelineHeight": new ElementSize([new Range(vm.big, 11, 11), new Range(vm.small, 11, 11)]),
                    "timelineSpace": new ElementSize([new Range(vm.big, 4, 4), new Range(vm.small, 4, 4)]),
                    "timelineRoundMinute": new ElementSize([new Range(vm.big, 18, 18), new Range(vm.small, 18, 18)]),
                    "timelineText": new ElementSize([new Range(vm.big, 9, 9), new Range(vm.small, 9, 9)]),
                    "menuBarHeight": new ElementSize([new Range(vm.big, 37, 37), new Range(vm.small, 23, 37)]),
                    "menuChosenRectangle": new ElementSize([new Range(vm.big, 51, 51), new Range(vm.small, 29, 51)]),
                    "chooseBarText": new ElementSize([new Range(vm.big, 12, 13), new Range(vm.small, 10.5, 12)]),
                    "chooseBarHeight": new ElementSize([new Range(vm.big, 30, 30), new Range(vm.small, 26, 30)]),
                    "graphNumberText": new ElementSize([new Range(vm.big, 11, 12), new Range(vm.small, 11, 11)]),
                    "graphSubjectText": new ElementSize([new Range(vm.big, 11, 12), new Range(vm.small, 11, 11)]),
                    "graphRoundIcon": new ElementSize([new Range(vm.big, 26, 30), new Range(vm.small, 27, 28)]),
                    "graphBarHeight": new ElementSize([new Range(vm.big, 15, 16), new Range(vm.small, 16, 16)]),
                    "linesText": new ElementSize([new Range(vm.big, 11, 12), new Range(vm.small, 10, 12)]),
                    "linesIcons": new ElementSize([new Range(vm.big, 14, 18), new Range(vm.small, 14, 18)]),
                    "iconsList": new ElementSize([new Range(vm.big, 16, 19), new Range(vm.small, 16, 19)]),
                    "linesHeight": new ElementSize([new Range(vm.big, 18, 20), new Range(vm.small, 18, 20)]),
                    "tooltipText": new ElementSize([new Range(vm.big, 11, 12), new Range(vm.small, 10, 12)]),
                    "iconPlus": new ElementSize([new Range(vm.big, 12, 12), new Range(vm.small, 12, 12)]),
                    "animationWhiteMessageText": new ElementSize([new Range(vm.big, 13, 14), new Range(vm.small, 12, 14)]),
                    "animationBlackBoxText": new ElementSize([new Range(vm.big, 12, 12), new Range(vm.small, 10, 12)]),
                    "bottomContainer": new ElementSize([new Range(vm.big, 208, 294)]),
                };

                vm.getSize = function (id, width) {

                    var currentRange = null;
                    for (var i = 0; i < vm.rangeGroups.length; i++) {
                        var range = vm.rangeGroups[i];
                        if (width >= range.min && width <= range.max) {
                            currentRange = range.id;
                            break;
                        }
                    }

                    var currentElement = vm.elementSizes[id];
                    var elementsRange = currentElement.getRange(currentRange);
                    var size = elementsRange.getSize(width);

                    //console.log(id, size);

                    return size;
                }

                return vm;
            });
})();
