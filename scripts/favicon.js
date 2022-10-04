var number = 0
var fName = "favicon-animation/frame_0" + number + "_delay-0.05s.gif"

setInterval(function() {
    if (number == 11) {
        number = 0
    }

    var fName = "favicon-animation/frame_0" + number + "_delay-0.05s.gif"
    $("link[rel='icon']").remove();
    $("link[rel='shortcut icon']").remove();
    $("head").append('<link rel="icon" href="' + fName + '" type="image/gif">');
    number++
}, 1000);