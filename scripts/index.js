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
    "mg":1,
    "ag":2,
    "jgd":3,
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
    "mg":"明杠",
    "ag":"暗杠",
    "jgd":"金钩钓"
}
record = ""
targets = ""
targets_zhuang = ""

gang_left = ""
gang_right = []
zhuang = "down"
gang_type = 1

player_choose_list = []

g_last_record_time = -1;

function resetAllFan() {
    $("#target-zhuang-lb").text("")
    $("#target-zhuang-lb").hide()

    $("#fan-value").text(fan)
    
    $(".record-check").prop("checked",false)
    
    $(".hu-check").map(function(){
        if ($(this).attr("id")!="hu"){
            $(this).prop("checked",false)
        }else{
            $(this).prop("checked",true)
        }
    })
    $("#zimo-value").text(zimo_fan)
    $("#zhuang-value").text(zhuang_fan)
    setTotalFan(recordModal, player_names, fan_rules, selected_player, fan)
}
function resetAll() {
    resetAllFan()
    for (const key in player_names) {
        $("."+key+"-profile-status").text("未选")
        $("."+key+"-profile-status").css({"background":"#999"})
    }
}
function doneAndClear() {
    selected_player = ""
    new_name = ""

    total_fan = 0
    hu_fan = 1
    fan = 0
    zhuang_fan = 0
    zimo_fan = 0
    qyj_fan = 0

    record = ""
    targets = ""
    targets_zhuang = ""
    gang_left = ""
    gang_right = []
    // zhuang = ""
    gang_type = 1

    player_choose_list = []

}

///////////////////////////////////////////
// user storage
///////////////////////////////////////////
player_names = {"up":"上","left":"左","right":"右","down":"下"}
player_indices = {"up":"1","left":"2","right":"3","down":"4"}
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
settings = {"max-limit":8}
var array = localStorage.getItem('settings');
if (!(array===null)){
    settings = JSON.parse(array)
    localStorage.setItem("settings", JSON.stringify(settings));
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
    })
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

function setTotalFan(recordModal, player_names, fan_rules, selected_player, fan) {
    total_fan = fan
    record = ""

    if (zhuang==selected_player){
        $("#zhuang-lb").show()
        total_fan+=fan_rules["zhuang"]
        record+="zhuang,"
    }else{
        $("#zhuang-lb").hide()
    }

    $(".hu-check").map(function(){
        if ($(this).prop("checked")){
            $("#"+$(this).attr("id")+"-lb").show()
            record+=$(this).attr("id")+","
            total_fan+=fan_rules[$(this).attr("id")]
        }else{
            $("#"+$(this).attr("id")+"-lb").hide()
        }
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
    if (player_choose_list.length <= 1) return 

    record=((gang_type==1)?"mg,":"ag,")

    time_now = Date.now()
    if (player_choose_list[0]==zhuang) record+="zhuang,"

    var winner = player_choose_list[0]
    for (let i = 1; i < player_choose_list.length; i++) {
        let each = player_choose_list[i]
        
        if (each==zhuang) each+="*"
        history_record.push(each+":"+time_now+":"+record+":"+winner+":"+"-"+":"+0)
    }
    
    targets=""
    for (let i = 1; i < player_choose_list.length; i++) {
        let each = player_choose_list[i]

        if (each==zhuang) targets+=(each+"*,")
        else targets+=each+","
    }
    // gang_right.forEach(each => {
    //     if (each==zhuang) each+="*"
    //     history_record.push(each+":"+time_now+":"+record+":"+gang_left+":"+"-"+":"+0)
    // });
    
    // targets=""
    // gang_right.forEach(each => {
    //     if (each==zhuang) targets+=(each+"*,")
    //     else targets+=each+","
    // });
    history_record.push(winner+":"+time_now+":"+record+":"+targets+":"+"+"+":"+0)
    localStorage.setItem("history", JSON.stringify(history_record));

}

function setZhuangByInd( player_ind ) {
    let ind = 1;
    for ( const key in player_names ) {
        if ( ind == player_ind ) {
            zhuang = key;
            $("."+key+"-profile-image").css({"background":"#E59934"});
        }
        else{
            $("."+key+"-profile-image").css({"background":"#512DA8"});
        }
        ind++;
    }
    
    $("#choose-zhuang").text(player_names[zhuang]);
    new_record_time = Date.now();
    console.log("Since last set zhuang: " + (new_record_time-g_last_record_time)/1000 + " seconds");
    g_last_record_time = new_record_time;
}
// end of setters //

function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(settings));
}

showMaxLimit(settings["max-limit"])
showHistory(history_record,fan_rules,id2chinese,settings)

var changeNameModal = document.getElementById('changeNameModal')
changeNameModal.addEventListener('show.bs.modal', function (event) {
    // Button that triggered the modal
    var button = event.relatedTarget
    // Extract info from data-bs-* attributes
    var recipient = player_names[button.getAttribute("id")]
    // If necessary, you could initiate an AJAX request here
    // and then do the updating in a callback.
    //
    // Update the modal's content.
    var modalTitle = changeNameModal.querySelector('.modal-title')
    var modalBodyInput = changeNameModal.querySelector('.modal-body input')

    modalTitle.textContent = '为 “' + recipient + '” 更改昵称'
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

function showProfileImage(){
    for (const key in player_names) {
        fields = player_names[key].split(" ")
        if (fields.length<=1 && player_names[key].length<=3){
            initials = player_names[key]
        }else{
            initials = ""
            for (let i = 0; i < fields.length; i++) {
                if (i==3) break
                initials += fields[i].charAt(0)
            }
        }
        $("."+key+"-profile-image").text(initials)
        $("."+key+"-profile-image").css({"height":wid*0.8,"width":wid*0.8,"line-height":wid*0.8+"px"})
    }
}

function setupPlayerChoose() {
    targets=""
    $("#target-zhuang-lb").hide()
    for (const key in player_names) {
        if (player_choose_list.includes(key)){
            if (player_choose_list.indexOf(key)==0){
                $("."+key+"-profile-status").text("赢")
                $("."+key+"-profile-status").css({"background":"#1F6650"})
            }else{
                
                $("."+key+"-profile-status").text("输")
                $("."+key+"-profile-status").css({"background":"#EA5E5E"})

                if (key==zhuang){
                    $("#target-zhuang-lb").text("胡"+player_names[zhuang]+"二倍")
                    $("#target-zhuang-lb").show()
                    targets+=(key+"*,")
                }else{
                    targets+=(key+",")
                }
            }
        }else{
            $("."+key+"-profile-status").text("未选")
            $("."+key+"-profile-status").css({"background":"#999"})
        }
    }
}

$(document).ready(function() {
    wid = $(".player").width()
    $(".player, .game-table").height(wid)
    $(".player, .game-table").css({"font-size":wid*0.7})
    // show the profile with initials
    showProfileImage()
    $(".profile-status").css({
        "height":wid/3*0.8,"width":wid/3*0.8,"top":-wid*0.8,
        "left":wid/2*0.8,
        "font-size": wid/8*0.8+"px",
        "line-height": wid/3*0.8+"px"})
    $(".player-icon, .player-name").css({"display":"none"})
    $(".hu-label, .fan-btn").css({"min-width":"100px"})
    // default zhuang
    $("#choose-zhuang").text(player_names['down'])
    $("#zhuang-bar").val(4)
    $(".down-profile-image").css({"background":"#E59934"})


    player_key_list = $(".player").map(function () {
        return $(this).attr("id")
    })
    for (let i = 0; i < player_key_list.length; i++) {
        n = player_names[player_key_list[i]]
        $("#"+player_key_list[i]+"-name").text(n)
    }

    $("#edit-btn").click(function() {
        // ################################################
        // buttons for player icon
        // ################################################
        class_str = $(".player-icon").attr("class")
        // go to edit mode
        if ($(".player-icon").css("display")=="none"){
            $(".player-icon, .player-name").css({"display":"block"})
            $(".profile-image").css({"display":"none"})
            $("#edit-btn").text("完成")
            $(".player-icon").css({"color":"#D06224"})
            $(".player").map(function () {
                $(this).attr("data-bs-target","#changeNameModal")
            })
        }else{ // go back to normal mode
            $(".player-icon, .player-name").css({"display":"none"})
            $(".profile-image").css({"display":"flow-root"})
            $("#edit-btn").text("编辑玩家")
            $(".player-icon").css({"color":"black"})
            $(".player").map(function () {
                $(this).attr("data-bs-target","#recordModal")
            })
            showProfileImage()
            // $(".player").attr("data-bs-target","#changeNameModal")
        }
    })

    $("#player-name").change(function () {
        player_key = $(this).attr("id")
        new_name = $(this).val()
    })
    $("#player-name").click(function () {
        $(this).select()
    })
    
})

$(document).ready(function() {
    // reset functions or init functions
    
    
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

    
    // record a hu or set record
    $(".hu-check, .zhuang-check").on("input proportychange", function () {
        if (targets==""){
            showAlert("请先选胡谁！");
        }
        hu_checked = $(".hu-check, #hu").prop("checked");
        bigger_hu_checked = $(this).attr("id")!="hu" && $(this).hasClass("hu-type");
        
        // jgd and ddh cannot be selected at the same time
        if ($(this).attr("id")=="ddh" && $(this).prop("checked")) $("#jgd").prop("checked",false);
        if ($(this).attr("id")=="jgd" && $(this).prop("checked")) $("#ddh").prop("checked",false);

        // hu cannot be selected if a bigger hu is selected, vice verse.
        if (hu_checked && $(this).attr("id")=="hu"){
            $(".hu-check").map(function(){
                if ($(this).attr("id")!="hu"){
                    $(this).prop("checked",false);
                }
            })
        }
        if (bigger_hu_checked ){
            $("#hu").prop("checked",false);
        }


        hu_list = $(".hu-check").map(function(){
            if ($(this).prop("checked")){
                return $(this).attr("id");
            }
        }).get();
        setHuFan(fan_rules, hu_list);
        setTotalFan(recordModal, player_names, fan_rules, selected_player, fan);
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
    
    $(".gang-btn").click(function() {
        // ################################################
        // buttons for gang
        // ################################################
        if ($(this).attr("id")=="mg-btn") {
            $("#gangModalLabel").text("明杠"); 
            gang_type=1;
        }
        else if ($(this).attr("id")=="ag-btn") {
            $("#gangModalLabel").text("暗杠"); 
            gang_type=2;
        }
    })


    $(".player").click(function() {
        // ################################################
        // buttons for player icon
        // ################################################
        doneAndClear();
        resetAll();

        selected_player = $(this).attr("id");
        player_choose_list.push(selected_player);
        setupPlayerChoose();
        
        if ($(".player-icon").css("display")=="none"){
            setZhuangFan((selected_player==zhuang)?1:0);
            setTotalFan(recordModal, player_names, fan_rules, selected_player, fan);
        }else{
            new_name = "";
            $("#player-name").val(new_name);
            $("#player-name").focus();
        }
    })

    $(".player-choose").click(function() {
        // ################################################
        // buttons for player icon
        // ################################################
        this_player = $(this).attr("player-id");
        if (selected_player!=this_player){
            if (player_choose_list.includes(this_player)){
                var index = player_choose_list.indexOf(this_player);
                if (index !== -1) player_choose_list.splice(index, 1);
            }else{
                player_choose_list.push(this_player);
            }
        }
        setupPlayerChoose()
    });
});

// select target zhuang player
$(document).on("input proportychange",".zhuang-check", function () {
    $("#target-zhuang-lb").text("")
    $("#target-zhuang-lb").hide()
    targets_zhuang = $(this).attr("key")
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

$(document).on("click","#btn-record",function(){
    if (selected_player!="") {
        const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
        const alert = (message, type) => {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = [
                `<div class="alert alert-${type} alert-dismissible" role="alert">`,
                `   <div>${message}</div>`,
                '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                '</div>'
            ].join('');
            alertPlaceholder.append(wrapper)
        }

        saveRecord()
        {
            new_record_time = Date.now();
            TIMEOUT_TO_NEW_ZHUANG = 90;
            // if last record is more than TIMEOUT_TO_NEW_ZHUANG seconds ago, 
            // then we use the new record to choose zhuang
            if ( ((new_record_time - g_last_record_time)/1000) > TIMEOUT_TO_NEW_ZHUANG ) { 
                player_ind = player_indices[selected_player];
                setZhuangByInd(player_ind);
                alert('庄家被重置为：' + player_names[selected_player], 'warning')
            }
        }
        showHistory(history_record,fan_rules,id2chinese,settings)
        doneAndClear()
        resetAll()
    }
})

$(document).on("click",".btn-cancel",function(){
    doneAndClear()
    resetAll()
})

$(document).on("click","#btn-gang",function(){
    // if (gang_left=="" || gang_right == [] || zhuang==""){
    //     showAlert("请选择"+((zhuang=="")?"庄家":"对象"))
    // }else{
    //     saveZhuangRecord()
    //     showHistory(history_record,fan_rules,id2chinese,settings)
    // }
    saveZhuangRecord()
    showHistory(history_record,fan_rules,id2chinese,settings)

    doneAndClear()
    resetAll()

})

$(document).on("click",".swipe-menu",function(){
    if($(this).parent().hasClass("swap-open")){
        $(".swap-item").removeClass("swap-open");
    }else{
        $(".swap-item").removeClass("swap-open");
        $(this).parent().addClass("swap-open");
    }
});

$(document).on("click",".swipe-right",function () {
    t = $(this).attr("id").split("-")[1]
    deleteOneHistoryByTime(history_record,t)
    showHistory(history_record,fan_rules,id2chinese,settings)
    doneAndClear()
    saveRecord()
})

$(document).on("click","#delete-btn",function() {
    deleteHistory(player_names)
    doneAndClear()
    saveRecord()
    overall_points = {"up":0,"left":0,"right":0,"down":0,}
    for (const key in overall_points) {
        $("#"+key+"-score").text(overall_points[key])
    }
    
})

$(document).on("input proportychange", "#limit-bar", function () {
    settings["max-limit"] = $(this).val()
    $("#max-limit").text($(this).val())
    saveSettings()
    showHistory(history_record,fan_rules,id2chinese,settings)
    doneAndClear()
})

// choose zhuang
$(document).on("input proportychange", "#zhuang-bar", function () {
    setZhuangByInd($(this).val());
})