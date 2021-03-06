
function showMaxLimit(v) {
    $("#max-limit").text(v)
    $("#limit-bar").val(v)

}
function showHistory(history_record,fan_rules,id2chinese,settings) {
    history_record.sort(function(a, b){return parseInt(b.split(":")[1])-parseInt(a.split(":")[1])});
    $("#history").empty()

    overall_points = {"up":0,"left":0,"right":0,"down":0,}
    history_record.forEach(each => {
        total_points = 0
        fields = each.split(":")
        
        chinese_hu = ""
        total = parseInt(fields[5])
        
        fields[2].split(",").forEach(each => {
            if (each!="") {
                total+=fan_rules[each]
                chinese_hu+=id2chinese[each]+" "
            }
        });
        
        n_key = fields[0]
        if(fields[4]=="-"){ // if loose
            total_each = total
            if(fields[0].slice(-1)=="*"){
                total_each=total+1
                n_key = fields[0].slice(0,-1)
            }
            
            // set max limit
            if (total_each>settings["max-limit"]) {
                points=Math.pow(2,settings["max-limit"]-1)
            }else{
                points=Math.pow(2,total_each-1)
            }
            total_points = -points
            
        } else{ // if win
            fields[3].split(",").forEach(each => {
                if (each!="") {
                    total_each = total
                    if (each.slice(-1)=="*"){
                        total_each = total+1
                    }
                    
                    // set max limit
                    if (total_each>settings["max-limit"]) {
                        points=Math.pow(2,settings["max-limit"]-1)
                    }else{
                        points=Math.pow(2,total_each-1)
                    }
                    total_points+=points
                }
            });
        }
        
        

        overall_points[n_key]+=total_points
        

        if (parseInt(fields[5])>0) chinese_hu+="加"+parseInt(fields[5])+"杠 "
        
        if (fields[4]=="-") chinese_hu+="共"+(Math.log2(Math.abs(total_points))+1)+"番"


        game_result = ""
        if (total_points>0){
            game_result = "up"
            info_color = "#1F6650"
        }else{
            game_result = "down"
            info_color = "#EA5E5E"
        }
        new_list = "<li class='list-group-item d-flex justify-content-end swipe-container'>\
            <div class='swap-item d-flex'>\
                <div class='swipe-heure' style='color:"+info_color+";"+((total_points>0)?"font-size:25px;":"")+"'>"+player_names[n_key]+" <i class='fas fa-thumbs-"+game_result+"'></i></div>\
                <div class='swipe-text flex-grow-1'>"+chinese_hu+": "+total_points+"分</div>\
                <div class='swipe-menu'><i class='fa fa-lg fa-ellipsis-v'></i></div>\
            </div>\
            <a href='#' class='swipe-btn swipe-left d-flex align-items-center justify-content-center'><i class='fa fa-lg fa-info'></i></a>\
            <a href='#'' class='swipe-btn swipe-right d-flex align-items-center justify-content-center' id='history-"+fields[1]+"'><i class='far fa-trash-alt' style='color:#AC0C0C'></i></a>\
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
    history_record=[]
    $("#history").empty()
}

function deleteOneHistoryByTime(history_record,t) {
    for (let i = 0; i < history_record.length; i++) {
        element = history_record[i];
        time = element.split(":")[1]
        if (time==t){
            history_record.splice(i,1)
            i--
        }
    }
}