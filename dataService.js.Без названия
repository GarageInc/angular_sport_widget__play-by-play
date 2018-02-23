(function () {
    angular.module("dataService", [])
        .service("dataService",
            function () {

                var vm = this;

                var elementSplitter = '\u0015';
                var pathSplitter = '\u0016';
                var eventSplitter = '\u0014';

                function notEmpty(data) {
                    return data !== undefined && data !== null && data;
                };

                vm.processUpdate = function (snapshot, data) {
                    var messages = data.split(eventSplitter)[1];
                    vm.processUpdates(snapshot, [messages]);
                }

                vm.processMessage = function (data) {

                    if (!data) return null;

                    var eventData = {};
                    var scope = this;

                    var splittedMessages = $.map(data.split('|'), notEmpty); // split the message element parts

                    $(splittedMessages)
                        .each(function(index, value) { // iterate each element that is added / updated / remove
                            if (value.trim()) {
                                var messageParams = $.map(value.split(elementSplitter), notEmpty);
                                var hierarchy = $.map(messageParams[0]
                                    .split('/'),
                                    notEmpty); // get the location of the element we are modifying

                                switch (hierarchy.length) {
                                case 1: // event root element
                                {
                                    var eventAttributes = $.map(messageParams[1].split('~')[1]
                                        .split(';'),
                                        notEmpty); // split element to attributes
                                    $(eventAttributes)
                                        .each(function(i, attribute) { // iterate for all updated attributes
                                            var splittedAttributed = $.map(attribute.split('='), notEmpty);
                                            eventData[splittedAttributed[0]] = splittedAttributed[1];
                                        });
                                    break;
                                }
                                default: // elements inside of event element
                                {
                                    scope.processEventRow(eventData, messageParams[1], hierarchy);
                                    break;
                                }
                                }
                            }
                        });
                    return eventData;
                };

                vm.processEventRow = function (eventData, messageParam, hierarchy) {

                    var message = messageParam.split(pathSplitter);
                    var splittedPath = $.map(message, notEmpty)[0].split('/');
                    var attributes = message[1].split('~');
                    var action = attributes[0];
                    var eventAttributes = $.map(attributes[1].split(';'), notEmpty);

                    var obj = eventData;
                    if (action == 'I') // insert action
                    {
                        for (var i = 1; i < hierarchy.length - 1 ; i++) // get the containing element
                        {
                            obj = obj[hierarchy[i]][splittedPath[i - 1]];
                        }
                        if (obj[hierarchy[hierarchy.length - 1]] == undefined) // if array for the path doesn't exists create
                        {
                            obj[hierarchy[hierarchy.length - 1]] = {};
                        }
                        obj[hierarchy[hierarchy.length - 1]][splittedPath[hierarchy.length - 2]] = {}; // create empty elment
                        obj = obj[hierarchy[hierarchy.length - 1]][splittedPath[hierarchy.length - 2]];
                    }
                    else if (action == 'U') // update action
                    {
                        for (var i = 1; i < hierarchy.length ; i++) // get the object we want to update
                        {
                            try{
                                obj = obj[hierarchy[i]][splittedPath[i - 1]];
                            } catch (e) {
                                console.log('failed to update field. hierarchy:');
                                console.log(hierarchy);
                                console.error(e);
                            }
                        }
                    }
                    else if (action == 'D') // delete action
                    {
                        for (var i = 1; i < hierarchy.length - 1; i++) {
                            obj = obj[hierarchy[i]][splittedPath[i - 1]];
                        }
                        obj[hierarchy[hierarchy.length - 1]][splittedPath[hierarchy.length - 2]] = undefined; // delete element
                        return;
                    }

                    $(eventAttributes).each(function (i, attribute) {
                        var splittedAttributed = $.map(attribute.split('='), notEmpty);
                        obj[splittedAttributed[0]] = splittedAttributed[1];
                    });

                    return {
                        action: action,
                        incidentType: parseInt(obj.TY),
                        position: parseInt(obj.PO),
                        second: parseInt(obj.SE),
                        period: obj.PE,
                        player: obj.PL
                    };
                }

                vm.processUpdates = function (snapshot, updates) {
                    // Add array for updates
                    snapshot.Updates = [];
                    // Load updates by each row
                    for (var i = 0; i < updates.length; i++) {
                        // Can be few actions in a row
                        var updateRows = updates[i].split('|EV');

                        var setRootValue = function (snapshot, update, rootFieldsStart) {
                            //console.log('root update', update)
                            // Root field updates (i.e. match time updates)
                            var fieldsCut = update.substring(!rootFieldsStart ? 6 : rootFieldsStart);
                            var rootFields = fieldsCut.split(';');
                            for (var i = 0; i < rootFields.length; i++) {
                                var splitted = rootFields[i].split('=');
                                if (splitted.length == 2) {
                                    snapshot[splitted[0]] = splitted[1];
                                }
                            }
                        }

                        if (updateRows.length <= 2) {
                            setRootValue(snapshot, updates[i]);
                        } else {
                            // If update contains time update
                            if (updateRows[1].indexOf('~TS=') >= 0) {
                                setRootValue(snapshot, updateRows[1], 3);
                            }
                            // Ierarchy updates
                            var updatesInLine = updateRows.slice(2);
                            for (var u = 0; u < updatesInLine.length; u++) {
                                var messageParams = $.map(updatesInLine[u].split(elementSplitter), notEmpty);
                                var hierarchy = $.map(messageParams[0].split('/'), notEmpty);
                                snapshot.Updates.push(vm.processEventRow(snapshot, messageParams[1], hierarchy));
                            }
                        }
                    }
                };

                vm.getData = function (urlParams) {

                    var scope = this;

                    var urlExists = urlParams.address !== undefined && urlParams.eventId !== undefined && urlParams.providerId !== undefined;
                    var url = urlExists ? urlParams.address + '/' + urlParams.eventId + '/' + urlParams.providerId : "/js/example/current_snapshot.txt";

                    var resultObject;

                    return $.get(url, function (msg) {

                        var data = msg.split(eventSplitter);
                        
                        // Get snapshot
                        var messages = data[1];

                        // Parse snapshot
                        if (!messages) return;
                        var snapshot = scope.processMessage(messages);
                       
                        // Put all incidents to update array for snapshot
                        snapshot.Updates = [];
                        for (var incidentId in snapshot.IN) {
                            var incident = snapshot.IN[incidentId];
                            if (!incident || !incident.TY) continue;
                            snapshot.Updates.push({
                                action: "I",
                                incidentType: incident.TY,
                                position: incident.PO,
                                second: parseInt(incident.SE),
                                period: incident.PE,
                                id: incidentId
                            });
                        }
                        resultObject = snapshot;
                    }).then(function () {

                        return resultObject;
                    });
                };

            return vm;
        });
}());