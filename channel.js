//function retrieveDown(time) {
//    var test = 'http://roilphp.azurewebsites.net/log.php?t=Example_Well_1_json&c=w5min&tt=1483167300000&o=1&d=d'
//    var xmlhttp = new XMLHttpRequest();
//    xmlhttp.onreadystatechange = function () {
//        if (this.readyState == 4 && this.status == 200) {
//            var Ttt = JSON.parse(this.responseText);
//            console.log(Ttt)
//            document.getElementById("m").innerHTML = this.responseText;
//        }
//    };
//    xmlhttp.open("GET", test, true);
//    xmlhttp.send();
//}
//
//function retrieveUp(time){
//    
//}
//
//
//function start() {
//    channels.element = document.getElementById('m');
//    createDataArray();
//    channels.data = dataArray;
//    channels.createAll();
//    setScroll();
//}
//
//function append() {
//    channels.append()
//}
//
//function ten() {
//    for (channels.visibleElementNumber = 45; channels.visibleElementNumber < 50; channels.visibleElementNumber = channels.visibleElementNumber) {
//        channels.append()
//    }
//}
//
//function renderAll() {
//    for (u = 1; channels.visibleElementNumber < channels.channels.length; channels.visibleElementNumber++) {
//        channels.append()
//    }
//}
//
//function prepend() {}
//
//function slideForward() {}
//
//function slideBack() {}
//var dataArray = []
//
//function createDataArray() {
//    for (ii = 0; ii < 100; ii++) {
//        dataArray.push(generateNewTestC())
//    }
//}
//var prevID = 0
//
//function generateNewTestC() {
//    var prevDT = testC.DateTime.data[testC.DateTime.data.length - 1]
//    var prevHD = testC.HoleDepth.data[testC.HoleDepth.data.length - 1]
//    var prevBD = testC.BitDepth.data[testC.BitDepth.data.length - 1]
//    var prevG = testC.Gamma.data[testC.Gamma.data.length - 1]
//    var D = {
//        ID: prevID++
//        , DateTime: {
//            left: 0
//            , right: 0
//            , data: []
//        }
//        , HoleDepth: {
//            left: testC.HoleDepth.left
//            , right: testC.HoleDepth.right
//            , data: []
//        }
//        , BitDepth: {
//            left: testC.BitDepth.left
//            , right: testC.BitDepth.right
//            , data: []
//        }
//        , Gamma: {
//            left: testC.Gamma.left
//            , right: testC.Gamma.right
//            , data: []
//        }
//    }
//    for (i = 0; i < 100; i++) {
//        prevDT += 1
//        prevHD = prevHD + Math.floor((Math.random() * ((1300 - prevHD) / 10)) + (Math.random() * (40) - 20) + 1)
//        prevBD = prevBD + Math.floor((Math.random() * ((1300 - prevBD) / 10)) + (Math.random() * (40) - 20) + 1)
//        prevG = prevG + Math.floor((Math.random() * ((90 - prevG) / 10)) + (Math.random() * (18) - 9) + 1)
//        D.DateTime.data.push(prevDT)
//        D.HoleDepth.data.push(prevHD)
//        D.BitDepth.data.push(prevBD)
//        D.Gamma.data.push(prevG)
//    }
//    D.DateTime.left = D.DateTime.data[0]
//    D.DateTime.right = D.DateTime.data[D.DateTime.data.length - 1]
//    testC = D;
//    return D
//}
//var testC = {
//    ID: 0
//    , DateTime: {
//        left: 0
//        , right: 600
//        , data: [100, 200, 300, 400, 500]
//    }
//    , HoleDepth: {
//        left: 1100
//        , right: 1500
//        , data: [1200, 1250, 1400, 1400, 1475]
//    }
//    , BitDepth: {
//        left: 1100
//        , right: 1500
//        , data: [1200, 1250, 1400, 1350, 1475]
//    }
//    , Gamma: {
//        left: 30
//        , right: 150
//        , data: [88, 80, 65, 110, 125]
//    }
//}
//var margin = 200 //$(".mypara").offset().top,
//timeout = null;
//
//function setScroll() {
//    $(channels.element).scroll(function () {
//        if (!timeout) {
//            timeout = setTimeout(function () {
//                console.log('scroll');
//                clearTimeout(timeout);
//                timeout = null;
//                if ($(channels.element).scrollTop() <= margin) {
//                    // alert('Top');
//                    channels.prepend()
//                }
//                if ($(channels.element).scrollTop() >= $(channels.element).prop('scrollHeight') - $(channels.element).height() - margin) {
//                    //alert('Bottom');
//                    channels.append()
//                }
//            }, 250);
//        }
//    });
//}