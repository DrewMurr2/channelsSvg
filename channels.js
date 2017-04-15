var channels = {
    containerID: "m"
    , maxChannelsVisible: 60
    , tableName: "Example_Well_1_json"
    , channelSizes: ['5min', '15min', '1hour', '3hours', '12hours', '1day']
    , channelSizeIndex: 3
    , zoomLevels: [20, 30, 40, 50, 60, 70, 80, 90, 100]
    , zoomLevelIndex: 3
    , zoomOut: function () {
        if (channels.zoomLevelIndex == channels.zoomLevels.length - 1) {
            if (channels.channelSizeIndex < channels.channelSizeIndex - 1) channels.changeChannelSize(channelSizes[channels.channelSizeIndex++])
        }
        else {
            channels.zoomLevelIndex += 1
            $('.channel').css('height', channels.zoomLevels[channels.zoomLevelIndex])
        }
    }
    , zoomIn: function () {}
    , windowSpan: function () {
        var startT
        var endT
        channels.visibleChannels().forEach(function (channel) {
            if (!startT || channel.attr('startT') < startT) startT = channel.attr('startT')
            if (!endT || channel.attr('endT') > endT) endT = channel.attr('endT')
        })
        if (startT && endT) return {
            start: startT
            , end: endT
        }
        else return undefined
    }
    , centerWindowTime: function () {
        var span = channels.windowSpan()
        if (span) return span.end - span.start
        else return undefined
    }
    , visibleChannels: function () {
        return $('.channel')
    }
    , topChannel: {
        channel: function () {
            return channels.visibleChannels().first()
        }
        , channelType: function () {
            return channels.topChannel.channel().attr('channelType') * 1 || 0
        }
        , startTime: function () {
            return channels.topChannel.channel().attr('startT') || 9983167300000
        }
        , endTime: function () {
            return channels.topChannel.channel().attr('endT') || 9983167300000
        }
        , toggle: function () {
            return ((channels.topChannel.channelType() + 1) % 2) || 0
        }
    }
    , bottomChannel: {
        channel: function () {
            return channels.visibleChannels().last()
        }
        , channelType: function () {
            return channels.bottomChannel.channel().attr('channelType') * 1 || 0
        }
        , startTime: function () {
            return channels.bottomChannel.channel().attr('startT') || 10
        }
        , endTime: function () {
            return channels.bottomChannel.channel().attr('endT') || 10
        }
        , toggle: function () {
            return ((channels.bottomChannel.channelType() + 1) % 2) || 0
        }
    }
    , changeChannelSize: function (newSize) {
        channels.clear();
    }
    , clear: function () {
        $(channels.element()).html('')
        channels.data = []
    }
    , element: function () {
        return $(document.getElementById(channels.containerID))
    }
    , dataOver: function (time) {
        var counter = 0
        channels.data.forEach(function (channel) {
            if (channel.RealStartTime > time) counter += 1
        })
        return counter
    }
    , dataUnder: function (time) {
        var counter = 0
        channels.data.forEach(function (channel) {
            if (channel.RealStartTime < time) counter += 1
        })
        return counter
    }
    , data: []
    , visible: []
    , channels: []
    , visibleElementNumber: 0
    , append: function (number) {
        var visChannels = channels.visibleChannels().length
        var appendElement = function (element) {
            $(channels.element).append(element)
            visChannels++
            while (visChannels > channels.maxChannelsCreated) {
                channels.visibleChannels().first().remove()
                visChannels -= 1
            }
        }
        var i = 0;
        while (channels.data[i].RealStartTime < windowEnd) i++;
        for (i = i; i < number; i++) appendElement(channels.newChannel.create(i))
    }
    , createAll: function () {
        for (io = 0; io < channels.data.length; io++) {
            channels.channels.push(channels.newChannel.create(io))
        }
    }
    , start: function () {
        var goGetEm = function () {
            channels.retrieveDown(function () {
                if (channels.data.length < 20) goGetEm()
                else channels.append(channels.maxChannelsVisible)
            })
        }
        goGetEm()
        channels.functions.setScroll()
    }
    , append: function (number) {
        var stT = channels.bottomChannel.startTime()
        if (stT >= channels.data[channels.data.length - 1].RealStartTime) channels.retrieveDown()
        else {
            if (!number) number = 1
            var counter = 0
            for (appendi = 0; appendi < channels.data.length && counter < number; appendi++) {
                if (channels.data[appendi].RealStartTime > stT) {
                    channels.element().append(channels.newChannel.create(appendi, channels.bottomChannel.toggle() * 1))
                    if (channels.visibleChannels().length > channels.maxChannelsVisible) channels.topChannel.channel().remove()
                    counter++
                }
                if (appendi >= channels.data.length - 1) channels.retrieveDown()
            }
        }
    }
    , prepend: function (number) { ///////// Prepend has not been updated to the level of append - I am testing append now.
        if (!number) number = 1
        var stT = channels.topChannel.startTime()
        var counter = 0
        for (prependi = channels.data.length - 1; prependi >= 0 && counter < number; prependi--) {
            prependi
            if (channels.data[prependi].RealStartTime < stT) {
                channels.element().prepend(channels.newChannel.create(prependi, channels.topChannel.toggle() * 1))
                if (channels.visibleChannels().length > channels.maxChannelsVisible) channels.bottomChannel.channel().remove()
                counter++
            }
        }
    }
    , retrieveDown: function (successCallback) {
        var time
        if (channels.data.length) time = channels.data[channels.data.length - 1].RealStartTime
        else time = 10
        channels.retrieve(time, 'd', successCallback)
    }
    , retrieveUp: function (successCallback) {
        var time
        if (channels.data.length) time = channels.data[0].RealStartTime
        else time = 9983167300000
        channels.retrieve(time, 'u', successCallback)
    }
    , retrieveZoom: function () {}
    , retrieve: function (time, direction, successCallback) {
        var zoomLevel = 'w3hours'
        var offset = 5
        var url = 'http://roilphp.azurewebsites.net/log.php?t=' + channels.tableName + '&c=' + zoomLevel + '&tt=' + time + '&o=' + offset + '&d=' + direction
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                check = this.responseText
                var incomingData = JSON.parse(this.responseText);
                incomingData.data.forEach(function (d) {
                    insertData(d)
                })

                function insertData(d) {
                    i = channels.data.length;
                    while (i && d.RealStartTime < channels.data[i - 1].RealStartTime) {
                        channels.data[i] = channels.data[i - 1];
                        i--
                    }
                    channels.data[i] = d;
                    if (i > 0 && channels.data[i].RealStartTime == channels.data[i - 1].RealStartTime) channels.data.splice(i, 1)
                }
                if (successCallback) successCallback()
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
    , newChannel: {
        create: function (index, channelType) {
            var data = channels.data[index]

            function scaleArray(arr, left, right) {
                var newArr = []
                arr.forEach(function (val) {
                    newArr.push((val - left) * (100 / (right - left)))
                })
                return newArr
            }
            data.scaledDates = scaleArray(data.RealDates, data.RealStartTime, data.RealEndTime)
            data.Tracks.forEach(function (track) {
                track.scaledValues = scaleArray(track.Values, channels.functions.Arraymin(track.Values), channels.functions.Arraymax(track.Values))
            })
            var channel = ""
            var color = 0
            var colors = ['red', 'green', 'purple']
            var chanClasses = ["odd", "even"]
            var polyStart = '<polyline class = "polyTrack specificChannel" points="'
            var polyEnd = '"   style="fill:none;stroke:color;stroke-width:.5%"/>'
            var viewBox = 'viewBox="xx xy yx yy"'
            var startChan = '<svg class="track" height="100%" width="100%"  preserveAspectRatio="none"  viewBox="0 0 100 100" >' //viewBox="1200 0 300 600" 
            var endChan = '</svg>'
            var returnCorners = function () {
                var boxHeight = 200
                var boxBottom = 150
                var boxTop = 100
                var startCorners = '<svg width="100%" height="100%" viewBox="0 0 1000 1000"  preserveAspectRatio="none"  class="corner">'
                var topLeft = '<polygon points="0,0 ' + boxBottom + ',0 ' + boxTop + ',' + boxHeight + ' 0,' + boxHeight + '"\
  style="fill:lime;stroke:purple;stroke-width:5;fill-rule:evenodd;" />'
                var topRight = '<polygon points="' + (1000 - boxBottom) + ',0 1000,0 1000,' + boxHeight + ' ' + (1000 - boxTop) + ',' + boxHeight + '"\
  style="fill:lime;stroke:purple;stroke-width:5;fill-rule:evenodd;" />'
                var bottomLeft = '<polygon points="0,1000 0,' + (1000 - boxHeight) + ' ' + boxTop + ',' + (1000 - boxHeight) + ' ' + boxBottom + ',1000"\
  style="fill:lime;stroke:purple;stroke-width:5;fill-rule:evenodd;" />'
                var bottomRight = '<polygon points="' + (1000 - boxBottom) + ',1000 1000,1000 1000,' + (1000 - boxHeight) + ' ' + (1000 - boxTop) + ',' + (1000 - boxHeight) + '"\
  style="fill:lime;stroke:purple;stroke-width:5;fill-rule:evenodd;" />'
                var tlCorner = '<text x="0" y="' + boxHeight * .6 + '" fill="red" font-size="' + 50 + '">17:30</text>'
                var endCorners = '</svg>'
                return startCorners + topLeft + topRight + bottomLeft + bottomRight + tlCorner + endCorners
            }

            function returnPolyline(track) {
                var rPL = startChan;
                rPL += polyStart.replace('specificChannel', track.Name)
                for (i = 0; i < data.RealDates.length; i++) {
                    rPL += track.scaledValues[i]
                    rPL += ','
                    rPL += data.scaledDates[i]
                    rPL += ' '
                }
                rPL += polyEnd.replace('color', colors[color++ % colors.length]);
                rPL += endChan
                return rPL
            }
            channel = '<div startT="' + data.RealStartTime + '" endT="' + data.RealEndTime + '" class="channel ' + chanClasses[channelType * 1] + '" channelType="' + channelType + '">';
            data.Tracks.forEach(function (track) {
                channel += returnPolyline(track);
            });
            channel += returnCorners()
            channel += "</div>";
            return channel
        }
        , topLeftMnemonic: ""
        , topLeftKey: ""
        , topRightMnemonic: ""
        , topRightKey: ""
        , bottomLeftMnemonic: ""
        , bottomLeftKey: ""
        , bottomRightMnemonic: ""
        , bottomRightKey: ""
    }
    , functions: {
        setScroll: function () {
            var margin = 20
            var timeout = null
            channels.element().scroll(function () {
                if (!timeout) {
                    timeout = setTimeout(function () {
                        console.log('scroll');
                        clearTimeout(timeout);
                        timeout = null;
                        if (channels.element().scrollTop() <= margin) {
                            // alert('Top');
                            channels.prepend(5)
                        }
                        if (channels.element().scrollTop() >= channels.element().prop('scrollHeight') - channels.element().height() - margin) {
                            //alert('Bottom');
                            channels.append(5)
                        }
                    }, 250);
                }
            });
        }
        , Arraymax: function (array) {
            return Math.max.apply(Math, array);
        }
        , Arraymin: function (array) {
            return Math.min.apply(Math, array);
        }
    }
}
var check