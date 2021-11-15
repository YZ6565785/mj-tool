selected_player = ""
new_name = ""

total_fan = 0
hu_fan = 1
fan = 0
zhuang_fan = 0
zimo_fan = 0
qyj_fan = 0
fan_rules = {
    "hu":1,
    "qys":3,
    "ytl":3,
    "ddh":2,
    "qxd":3,
    "dh":5,
    "th":6,
    "zimo":1,
    "zhuang":1,
    "qyj":1,
    "g":1,
}
id2chinese = {
    "th":"天胡",
    "dh":"地胡",
    "qxd":"七小对",
    "ytl":"一条龙",
    "qys":"清一色",
    "ddh":"对对胡",
    "hu":"小屁胡",
    "zimo":"自摸",
    "zhuang":"庄家",
    "qyj":"去幺九",
    "qyj":"去幺九",
    "g":"杠",
}
record = ""
targets = ""
targets_zhuang = ""

gang_left = ""
gang_right = []
zhuang = ""


player_names = {"up":"上","left":"左","right":"右","down":"下"}
var names = localStorage.getItem('names');
if (!(names===null)){
    player_names = JSON.parse(names)
    localStorage.setItem("names", JSON.stringify(player_names));
}

history_record = []
var array = localStorage.getItem('history');
if (!(array===null)){
    history_record = JSON.parse(array)
    if (!Array.isArray(history_record)) history_record = []
    localStorage.setItem("history", JSON.stringify(history_record));
}

// setter methods
function setFan(v) {
    fan = v
    $("#fan-value").text(fan)
}
function setHuFan(fan_rules, hu_list) {
    hu_fan = 0
    hu_list.forEach(each => {
        hu_fan+=fan_rules[each]
    });
}
function setZimoFan(v) {
    zimo_fan = v
    $("#zimo-value").text(zimo_fan)
}

function setZhuangFan(v) {
    zhuang_fan = v
    $("#zhuang-value").text(zhuang_fan)
}

function setQyjFan(v) {
    qyj_fan = v
    $("#qyj-value").text(qyj_fan)
}

function resetAllFan() {
    fan = 0
    $("#fan-value").text(fan)
    $(".hu-check").map(function(){
        if ($(this).attr("id")!="hu"){
            $(this).prop("checked",false)
        }else{
            $(this).prop("checked",true)
        }
    })
    zimo_fan = 0
    $("#zimo-value").text(zimo_fan)
    zhuang_fan = 0
    $("#zhuang-value").text(zhuang_fan)
    setTotalFan()
}

function setTotalFan(recordModal, player_names, fan_rules, selected_player, fan) {
    total_fan = fan
    record = ""
    $(".hu-check").map(function(){
        
        if ($(this).prop("checked")){
            // if i am zhuang, no need to choose others
            if($(this).attr("id")=="zhuang") {
                $(".zhuang-check").hide()
                $(".zhuang-check").prop("checked",false)
                $(".zhuang-name").hide()
            }
            $("#"+$(this).attr("id")+"-lb").show()
            record+=$(this).attr("id")+","
            total_fan+=fan_rules[$(this).attr("id")]
        }else{
            if($(this).attr("id")=="zhuang") {
                $(".zhuang-check").show()
                $(".zhuang-name").show()
            }
            $("#"+$(this).attr("id")+"-lb").hide()
        }
        $("#zhuang-lb").text("")
        $("#zhuang-lb").hide()
        
    })
    recordModal.querySelector('.modal-title').textContent = '为 ' + player_names[selected_player] + "记分, 合计：" + total_fan + "番"
}
function saveRecord() {
    if (record!="") {
        time_now = Date.now()
        targets.split(",").forEach(each => {
            if (each!="") {
                history_record.push(each+":"+time_now+":"+record+":"+selected_player+":"+"-"+":"+fan)
            }
        });
        history_record.push(selected_player+":"+time_now+":"+record+":"+targets+":"+"+"+":"+fan)
        localStorage.setItem("history", JSON.stringify(history_record));
    }else{
        localStorage.setItem("history", JSON.stringify(history_record));
    }
}
function saveZhuangRecord() {
    time_now = Date.now()
    if (gang_left==zhuang) record+="zhuang,"
    gang_right.forEach(each => {
        if (each==zhuang) each+="*"
        history_record.push(each+":"+time_now+":"+record+":"+gang_left+":"+"-"+":"+0)
    });
    
    targets=""
    gang_right.forEach(each => {
        if (each==zhuang) targets+=(each+"*,")
        else targets+=each+","
    });
    history_record.push(gang_left+":"+time_now+":"+record+":"+targets+":"+"+"+":"+0)
    localStorage.setItem("history", JSON.stringify(history_record));

}


showHistory(history_record,fan_rules,id2chinese)

var changeNameModal = document.getElementById('changeNameModal')
changeNameModal.addEventListener('show.bs.modal', function (event) {
    // Button that triggered the modal
    var button = event.relatedTarget
    // Extract info from data-bs-* attributes
    var recipient = button.getAttribute('seat')
    var recipient = player_names[button.getAttribute("id")]
    // If necessary, you could initiate an AJAX request here
    // and then do the updating in a callback.
    //
    // Update the modal's content.
    var modalTitle = changeNameModal.querySelector('.modal-title')
    var modalBodyInput = changeNameModal.querySelector('.modal-body input')

    modalTitle.textContent = 'Change Name for ' + recipient
    modalBodyInput.value = recipient
    selected_player = $(button).attr("id")
})

var recordModal = document.getElementById('recordModal')
recordModal.addEventListener('show.bs.modal', function (event) {
    // Button that triggered the modal
    var button = event.relatedTarget

    selected_player = $(button).attr("id")
    setTotalFan(recordModal, player_names, fan_rules, selected_player, fan)
    
})

function showAlert(msg) {
    $("#alert-msg").text(msg)
    $("#alertModal").addClass("show")
    $("#alertModal").css({"display":"block"})
}

function closeAlert() {
    $("#alertModal").removeClass("show")
    $("#alertModal").css({"display":"none"})
}

$(document).ready(function() {
    $(".swipe-menu").click(function(){
        if($(this).parent().hasClass("swap-open")){
            $(".swap-item").removeClass("swap-open");
        }else{
            $(".swap-item").removeClass("swap-open");
            $(this).parent().addClass("swap-open");
        }
    });
    $(".swipe-right").click(function () {
        t = $(this).attr("id").split("-")[1]
        deleteOneHistoryByTime(history_record,t)
        saveRecord()
        showHistory(history_record,fan_rules,id2chinese)
        location.reload();
    })
    $("#delete-btn").click(function() {
        deleteHistory(player_names)
        saveRecord()
        overall_points = {"up":0,"left":0,"right":0,"down":0,}
        for (const key in overall_points) {
            $("#"+key+"-score").text(overall_points[key])
        }
    })
    $("#btn-record").click(function(){
        if (selected_player!="") {
            saveRecord()
            showHistory(history_record,fan_rules,id2chinese)
            location.reload();
        }
    })
    $("#btn-change-name").click(function(){
        if (selected_player!="") {
            player_names[selected_player] = $("#player-name").val()
            $("#"+selected_player+"-name").text(player_names[selected_player])
            saveNames(player_names)
        }
    })

    $(".alert-close").click(function () {
        closeAlert()
    })

    
    // record a hu
    $(".hu-check, .zhuang-check").on("input proportychange", function () {
        if (targets==""){
            showAlert("请先选胡谁！")
        }
        hu_checked = $(".hu-check, #hu").prop("checked")
        bigger_hu_checked = $(this).attr("id")!="hu" && $(this).hasClass("hu-type")
        
        if (hu_checked && $(this).attr("id")=="hu"){
            $(".hu-check").map(function(){
                if ($(this).attr("id")!="hu"){
                    $(this).prop("checked",false)
                }
            })
        }
        if (bigger_hu_checked ){
            $("#hu").prop("checked",false)
        }

        hu_list = $(".hu-check").map(function(){
            if ($(this).prop("checked")){
                return $(this).attr("id")
            }
        }).get()
        setHuFan(fan_rules, hu_list)
        setTotalFan(recordModal, player_names, fan_rules, selected_player, fan)
    })
    $(".fan-btn").click(function () {
        if ($(this).attr("name")=="minus-fan"){
            fan--
            if (fan<0) fan=0
        }else{
            fan++
        }
        setFan(fan)
        setTotalFan(recordModal, player_names, fan_rules, selected_player, fan)
    })

    $("#zimo").on("input proportychange", function () {
        v = ($(this).prop("checked"))?1:0
        setZimoFan(v)
        setTotalFan(recordModal, player_names, fan_rules, selected_player, fan)
    })

    $("#zhuang").on("input proportychange", function () {
        v = ($(this).prop("checked"))?1:0
        if (v==1){
            $("#target-zhuang-lb").text("")
            $("#target-zhuang-lb").hide()
        }
        setZhuangFan(v)
        setTotalFan(recordModal, player_names, fan_rules, selected_player, fan)
    })

    $("#qyj").on("input proportychange", function () {
        v = ($(this).prop("checked"))?1:0
        setQyjFan(v)
        setTotalFan(recordModal, player_names, fan_rules, selected_player, fan)
    })
    
    $(".game-table").click(function() {
        // ################################################
        // buttons for game table
        // ################################################
        gang_left = ""
        gang_right = []
        zhuang = ""
        $(".gang-left").prop("checked",false)
        $(".gang-right").prop("checked",false)
        $(".gang-zhuang").prop("checked",false)

        let ind = 0
        for (const key in player_names) {
            $(".gang-left-name").eq(ind).text(player_names[key])
            $(".gang-right-name").eq(ind).text(player_names[key])
            $(".gang-zhuang-name").eq(ind).text(player_names[key])
            ind++
        }
    })

    $(".gang-left, .gang-right, .gang-zhuang").on("input proportychange", function () {
        which_name = $(this).attr("name")
        key = $(this).attr("id").split("-")[2]
        if (which_name=="g-left") gang_left = key
        if (which_name=="g-right"){
            gang_right = []
            $(".gang-right").map(function () {
                if ($(this).prop("checked")){
                    gang_right.push($(this).attr("id").split("-")[2])
                }
            })
        }
        if (which_name=="g-zhuang") zhuang = key; record="g,"
        
        console.log(gang_left);
        console.log(gang_right);
        console.log(zhuang);
    })

    $("#btn-gang").click(function(){
        if (gang_left=="" || gang_right == [] || zhuang==""){
            showAlert("请选择"+((zhuang=="")?"庄家":"对象"))
        }else{
            saveZhuangRecord()
            showHistory(history_record,fan_rules,id2chinese)
            location.reload();
        }

    })

    $(".player").click(function() {
        // ################################################
        // buttons for player icon
        // ################################################
        selected_player = $(this).attr("id")
        
        if ($(".player-icon").attr("class").includes("fa-user-circle")){
            setTotalFan(recordModal, player_names, fan_rules, selected_player, fan)
            ind = 0
            zhuang_names = $(".zhuang-name")
            for (const key in player_names) {
                if (key!=selected_player) {
                    $("#t"+(ind+1)).attr("name",key)
                    $(".target-name").eq(ind).text(player_names[key])
                    $("#z"+(ind+1)).attr("name",key)
                    $(".zhuang-check").eq(ind).attr("key",key)
                    $(".zhuang-name").eq(ind).text(player_names[key]+"是庄")
                    ind++
                }
            }
        }else{
            new_name = ""
            $("#player-name").val(new_name)
            $("#player-name").focus()
        }
        // select target player
        $(".target-check").on("input proportychange", function () {
            $("#target-zhuang-lb").text("")
            $("#target-zhuang-lb").hide()
            $(".zhuang-check").map(function () {
                console.log($(this).attr("key"));
                if ($(this).prop("checked")) {
                    targets_zhuang = $(this).attr("key")
                }
            })
            
            targets = $(".target-check").map(function(){
                if ($(this).prop("checked")&&($(this).attr("name")==targets_zhuang)){
                    $("#target-zhuang-lb").text("胡"+player_names[targets_zhuang]+"二倍")
                    $("#target-zhuang-lb").show()
                    return $(this).attr("name")+"*"
                }else if($(this).prop("checked")){
                    return $(this).attr("name")
                }
            }).get().toString()
        })
    })
});