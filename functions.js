
function showHistory(history_record,fan_rules,id2chinese) {
    // <li class="list-group-item">An item</li>
    all_record = []
    for (const key in history_record) {
        all_record = all_record.concat(history_record[key])
    }
    all_record.sort(function(a, b){return parseInt(b.split(":")[1])-parseInt(a.split(":")[1])});
    $("#history").empty()

    overall_points = {"up":0,"left":0,"right":0,"down":0,}
    all_record.forEach(each => {
        total_points = 0
        chinese_hu = ""
        fields = each.split(":")

        total = parseInt(fields[5])
        
        fields[2].split(",").forEach(each => {
            if (each!="") {
                total+=fan_rules[each]
                chinese_hu+=id2chinese[each]+" "
            }
        });
        
        n_key = fields[0]
        if(fields[4]=="-"){ // if loose
            if(fields[0].slice(-1)=="*"){
                total_points = -Math.pow(2,total+1-1)
                n_key = fields[0].slice(0,-1)
            }
            else total_points = -Math.pow(2,total-1)
            
        } else{ // if win
            fields[3].split(",").forEach(each => {
                if (each!="") {
                    if (each.slice(-1)=="*"){
                        total_points+=Math.pow(2,(total+1)-1)
                    }else{
                        total_points+=Math.pow(2,total-1)
                    }
                }
            });
        }
        // pow = (Math.abs(total_points)-1<0)?0:Math.abs(total_points)-1
        overall_points[n_key]+=total_points

        
        game_result = ""
        if (total_points>0){
            game_result = "赢"
        }else{
            game_result = "输"
        }
        new_list = "<li class='list-group-item d-flex justify-content-end swipe-container'>\
            <div class='swap-item d-flex'>\
                <div class='swipe-heure'>"+player_names[n_key]+" "+game_result+"</div>\
                <div class='swipe-text flex-grow-1'>"+chinese_hu+": "+total_points+"分</div>\
                <div class='swipe-menu'><i class='fa fa-lg fa-ellipsis-v'></i></div>\
            </div>\
            <a href='#' class='swipe-btn swipe-left d-flex align-items-center justify-content-center'><i class='fa fa-lg fa-info'></i></a>\
            <a href='#'' class='swipe-btn swipe-right d-flex align-items-center justify-content-center' id='history-"+fields[1]+"'><i class='far fa-trash-alt'></i></a>\
        </li>"
        $("#history").append(new_list)
    });
    for (const key in overall_points) {
        $("#"+key+"-score").text(overall_points[key])
    }
}

function saveNames(player_name) {
    localStorage.setItem("names", JSON.stringify(player_names));
}



function deleteHistory(player_names) {
    history_record={}
    for (const key in player_names) {
        history_record[key] = []
    }
    $("#history").empty()
}

function deleteOneHistoryByTime(history_record,t) {
    for (const key in history_record) {
        for (let i = 0; i < history_record[key].length; i++) {
            element = history_record[key][i];
            time = element.split(":")[1]
            if (time==t){
                history_record[key].splice(i,1)
                i--
            }
        }
    }
}