function timeConv(ts) {
    if (ts.trim() != '') {
        var inp_ts = ts.trim().replace(/[^0-9]/g, "");
        var tz = "Europe/Moscow";
        var date = new Date();
        var out_date = "";
        var ms = "";
        if (utc.checked) tz = "UTC";
        if (inp_ts.length == 10) ms = "000";
        else if (inp_ts.length == 13) ;
        else {
            out_date = "Неверная длина timestamp!";
        };
        date.setTime(inp_ts + ms);
        if (out_date == "") {
            var options = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                timeZone: tz
            };
            out_date = date.toLocaleDateString("ru", options);
        
        }
    }
    else out_date = "А конвертировать-то нечего ¯\\_(ツ)_/¯";
    showResult("date_result", ["clean2","run_copy2"], out_date);
}

function audit() {
    if (domain_name.value !== "") {
        domain = domain_name.value;
    } else domain = "vo.megafon.ru";
    var auditUrls = {
        "193.201.230.183": "http://10.50.194.3:8084?domain=",
        "195.9.78.70": "http://10.200.225.207:8080?domain=",
        "185.2.224.12": "http://172.16.1.252:9080/?domain=",
        "79.170.228.100": "http://10.100.0.1:8080/?domain=",
        "91.247.60.40": "http://history0:8080/?domain=",
        "109.69.176.249": "http://10.69.194.50:8080?domain=",
        "188.186.156.140": "http://10.3.0.177:8081?domain=",
        "5.3.4.140": "http://10.3.1.240:8081?domain=",
        "80.67.213.60": "http://10.100.3.51:7080?domain=",
        "81.95.224.170": "http://10.100.11.50:8080?domain=",
        "185.2.115.250": "http://10.100.6.102:8080?domain=",
        "109.69.177.187": "http://10.100.32.102:8080?domain="
    }
    $.post("aux_tools.php", {dn: domain},
        function (data) {
            if (!auditUrls[data]) showResult("audit_result", ["clean"], "Некорректное имя домена!");
            else {
                var prefix = auditUrls[data];
                var now = new Date();
                var dat_beg = now.toISOString().slice(0,10);
                var dat_end = dat_beg;
                var time_beg = "00:00:01";
                var time_end = "23:59:59";
                if (d_beg.value !== "") dat_beg = d_beg.value;
                if (t_beg.value !== "") {
                    if (t_beg.value.length == 5) time_beg = t_beg.value + ":00";
                    else time_beg = t_beg.value;
                }
                if (d_end.value !== "") dat_end = d_end.value;
                if (t_end.value !== "") {
                    if (t_end.value.length == 5) time_end = t_end.value + ":00";
                    else time_end = t_end.value;
                };
                ts_beg = Date.parse(dat_beg + "T" + time_beg + ".000+03:00")/1000;
                ts_end = Date.parse(dat_end + "T" + time_end + ".000+03:00")/1000;
                var grep_str = "";
                var caseSens = "i";
                if (case_sens.checked) caseSens = "";
                if (for_grep.value !== "") grep_str = " | grep  -" + caseSens + "E \"" + for_grep.value.trim() + "\"";
                var tail = " # c " + dat_beg + " " + time_beg + " до " + dat_end + " " + time_end;
                var result = "curl \"" + prefix + domain + "&f=" + ts_beg + "&t=" + ts_end + "\" | sed 's/\\],\\[\"/\\],\\n\\[\"/g'" + grep_str + tail;
                showResult("audit_result", ["clean","run_copy"], result);
            }
        }
    );


    // if (mf.checked) {
    //   prefix = "http://10.50.194.3:8084?domain=";
    //   var domain = "vo.megafon.ru";
    // } else if (mgts.checked) {
    //     prefix = "http://10.200.225.207:8080?domain=";
    //     var domain = "admin.vats.mgts.ru";
    // } else if (kc.checked) {
    //     prefix = "http://172.16.1.252:9080/?domain=";
    //     var domain = "vpbx.kcell.kz";
    // } else if (mc.checked) {
    //     prefix = "http://10.100.0.1:8080/?domain=";
    //     var domain = "pbx.moldcell.md";
    // } else if (bl.checked) {
    //     prefix = "http://:8080/?domain=";
    //     var domain = "ats.beeline.kg";
    // } else if (dc.checked) {
    //     prefix = "http://10.69.194.50:8080?domain=";
    //     var domain = "ucdemo.enforta.ru";
    // };
  }

// $(function audit_placeholder() {
//     $('.platform>label').click(function () {
//         var type = $(this).attr("for");
//         var ph = "";
//         switch (type) {
//             case "mf": ph = "vo.megafon.ru"; break;
//             case "mgts": ph = "admin.vats.mgts.ru"; break;
//             case "kc": ph = "vpbx.kcell.kz"; break;
//             case "mc": ph = "pbx.moldcell.md"; break;
//             case "bl": ph = "ats.beeline.kg"; break;
//             case "dc": ph = "ucdemo.enforta.ru"; break;
//         };
//         $('#domain_name').attr("placeholder", ph);
//     })
// })

function cleanForm(i) {
    $("#" + i).parent().siblings(".text_result").slideUp(300);
    $("#" + i).hide();
    $("#" + i).siblings().hide();
    $("#" + i).parents("form").trigger("reset");
    if (i === "clean4") {
        $("#filter").slideUp(300);
        $("#filter").trigger("reset");
    } else if (i === "clean1") {
        $("#numbers_count").hide()
    } else if (i === "clean6") {
        $("#prefs_tabs").slideUp(300,"swing", function () {
            $("#prefs_edit_result").hide().html("");
            $("#tree1").html("");
            $("#run_copy6").hide();            
        });

    }
}

function num_proc() {
    //обработка введенных номеров
    var data = document.getElementById("inp_data").value;
    if (data.trim() != "") {
        var inp_separator = (data.trim().indexOf("\n") > 0) ? "\n" : " ";
        var inp_arr = data.trim().split(inp_separator);
        var result_arr = [];
        inp_arr.forEach(element => {
            var num = element;
            num = num.trim().replace(/[^0-9]/g, "");
            if (num.length == 10) num = "7" + num;
            else if (num.length == 11 && num.slice(0,1) == "8") num = num.replace(/^8/, "7");
            else if (num.length == 11 && num.slice(0,1) == "7");
            else if (num != "") num = num + " (!Некорректный формат номера!)";
            if (result_arr.includes(num) === false && num != "") result_arr.push(num);
        });
        
        //вывод в нужном формате
        var result = "";
        var wrong_num = 0;
        var out_sep = "<br/>";
        var prefix = "";
        var suffix = "";
        var in_file_first = "";
        var in_file_next = "";
        var sleepVal = "";
        
        for (i=0; i<result_arr.length; i++){
            if (result_arr[i].match(/Некорректный формат номера/) !== null) {
                wrong_num = 1;
                break;
            }
        };
        if (wrong_num == 1) { //при некорректных номерах
            result = "<b>В списке есть некорректные номера!</b><br/><br/>" + result_arr.join(out_sep);
        } else {
            var out_type = $('.tab_label[active]').index();
            switch (out_type) {
                case 0: result = result_arr.join(out_sep); //В столбец
                break;
                case 1: 
                    var cust_sep = document.getElementById("cust_separator").value; //в строку
                    if (cust_sep != "") out_sep = cust_sep;
                    else {
                        switch (document.getElementById("out_separator").value) {
                            case "1": out_sep = " "; break;
                            case "2": out_sep = ","; break;
                            case "3": out_sep = ";"; break;
                            default: out_sep = " ";
                        }; 
                    };
                    result = result_arr.join(out_sep);
                    break;
                case 2: 
                    if (document.getElementById("in_file").checked) { //команда mfbossi
                    in_file_first = ' > result.txt';
                    in_file_next = ' >> result.txt';
                    };
                    prefix = 'echo "*Result*"' + in_file_first + '; for i in ';
                    out_sep = ' ';
                    sleepVal = Math.floor(sleep.value) > 0 ? '; sleep ' + Math.floor(sleep.value) : "";
                    switch (document.getElementById("mfb_type").value) {
                        case "1": suffix = '; do echo "---$i---"' + in_file_next + '; mfbossi activate subscriber $i' +in_file_next + sleepVal + '; echo "OK"' + in_file_next + '; done'; break;
                        case "2": suffix = '; do echo "---$i---"' + in_file_next + '; mfbossi deactivate subscriber $i' + in_file_next + sleepVal + '; echo "OK"' + in_file_next + '; done'; break;
                        case "3": suffix = '; do echo "---$i---"' + in_file_next + '; mfbossi get subscriber $i trunk' + in_file_next + sleepVal + '; echo "OK"' + in_file_next + '; done'; break;
                    };
                    result = prefix + result_arr.join(out_sep) + suffix;
                    break;
                case 3: //curl
                    if (document.getElementById("curl").hasAttribute("active")) { //проверка статуса услуг
                        if (document.getElementById("in_file1").checked) { 
                            in_file_first = ' > result.xml';
                            in_file_next = ' >> result.xml';
                        };    
                        prefix = 'echo "<RESULT>"' + in_file_first + '; for i in ';
                        out_sep = ' ';
                        var curl_7005 = "";
                        var curl_7032 = "";
                        var curl_7024 = "";
                        sleepVal = Math.floor(sleep1.value) > 0 ? '; sleep ' + Math.floor(sleep1.value) : "";
                        if (document.getElementById("7005").checked) curl_7005 = 'echo "<SRV_7005>"' + in_file_next + '; curl "http://10.236.26.171/v1/OSA/service_status?ACCOUNT=VATS&MSISDN=$i&PWD='+_psw+'&SERVICE_ID=7005"' + in_file_next + '; echo "</SRV_7005>"' + in_file_next + '; ';
                        if (document.getElementById("7032").checked) curl_7032 = 'echo "<SRV_7032>"' + in_file_next + '; curl "http://10.236.26.171/v1/OSA/service_status?ACCOUNT=VATS&MSISDN=$i&PWD='+_psw+'&SERVICE_ID=7032"' + in_file_next + '; echo "</SRV_7032>"' + in_file_next + '; ';
                        if (document.getElementById("7024").checked) curl_7024 = 'echo "<SRV_7024>"' + in_file_next + '; curl "http://10.236.26.171/v1/OSA/service_status?ACCOUNT=VATS&MSISDN=$i&PWD='+_psw+'&SERVICE_ID=7024"' + in_file_next + '; echo "</SRV_7024>"' + in_file_next + '; ';
                        suffix = '; do echo "<NUM_$i>"' + in_file_next + '; ' + curl_7005 + curl_7032 + curl_7024 + 'echo "</NUM_$i>"' + in_file_next + sleepVal + ';done; echo "</RESULT>"' + in_file_next;
                        result = htmlspecialchars(prefix + result_arr.join(out_sep) + suffix);
                        document.getElementById("analize").style.display = "block";
                    }
                    else if (document.getElementById("curl1").hasAttribute("active")) { //вкл/выкл услуги
                        if (document.getElementById("in_file1").checked) { 
                            in_file_first = ' > result.txt';
                            in_file_next = ' >> result.txt';
                        };    
                        prefix = 'echo "*Result*"' + in_file_first + '; for i in ';
                        out_sep = ' ';
                        var srv = '';
                        var action_idx = document.getElementById("action").value;
                        var srv_idx = document.getElementById("srv").value;
                        var sec_rnd = '';
                        var action = '';
                        switch(srv_idx) {
                            case "1": srv = '7005'; break;
                            case "2": srv = '7032'; break;
                            case "3": srv = '7024'; break;
                        };
                        if (action_idx == '1' && srv_idx.match(/[12]/) !== null) action = "service_add";
                        else if (action_idx == '1' && srv_idx == '3') action = "vats_add_phase1";
                        else if (action_idx == '2' && srv_idx.match(/[12]/) !== null) action = "service_del";
                        else if (action_idx == '2' && srv_idx == '3') action = "vats_rem_phase1";
                        suffix = '; do echo "---$i---"' + in_file_next + '; curl "http://10.236.26.171/v1/OSA/' + action + '?ACCOUNT=VATS&MSISDN=$i&PWD='+_psw+'&SERVICE_ID=' + srv + '"' + in_file_next + sleepVal + '; echo "OK"' + in_file_next + '; done';
                        sec_rnd = (srv == '7024') ? '; echo "Подождите..."; sleep 10; for i in ' + result_arr.join(out_sep) + suffix.replace("_phase1","_phase2") : "";
                        result = prefix + result_arr.join(out_sep) + suffix + sec_rnd;
                    }
                    break;                    
            };
        };
        document.getElementById("numbers_count").innerHTML = "Всего номеров: " + result_arr.length;
        document.getElementById("numbers_count").style.display = "block";
    } 
    else result = "<b>Введите номера в тектовое поле!</b>";
    showResult("numbers_result",["clean1","run_copy1"],result)
}

function utfConv () {
    var utf_str = $("#utf_str").val();
    $.ajax({
        type: "POST",
        url: "utf_conv.php",
        data: ({inp_str: utf_str}),
        dataType: "html",
        success: function (resp) {
            showResult("conv_result",["clean3","run_copy3"],resp)
        }
    });
}

function showResult (field, buttons, text) {
    if ($("#" + field).css("display") == "block") {
        $("#" + field).slideUp(300, "swing", function (){$("#" + field).html(text)})
    }
    else {
        $("#" + field).html(text)
    }
    $("#" + field).slideDown(300, "swing", function (){
        if (field === "parse_result" && buttons.length !== 0) {
            $("#filter").slideDown(300, "swing", function (){colorTable()})
        } else if (field === "prefs_result") {$("#tree1").slideDown(300)}
    });
    for (var i = 0; i < buttons.length; i++) {
        $("#" + buttons[i]).show();
    }
}

function colorTable() {
    $("#parse_result td").each(function(){
        if ($(this).index() != 0 && $(this).html() == "OFF") $(this).css("background-color", "rgb(250, 100, 100)");
        else if ($(this).index() != 0 && $(this).html() == "ON") $(this).css("background-color", "rgb(103, 187, 81)");
        else if ($(this).index() != 0) $(this).css("background-color", "rgb(240, 230, 140)");
    });
}

function xmlParse() {
    var xml = $("#inp_xml").val().trim();
    $.ajax({
        type: "POST",
        url: "parse_xml.php",
        data: ({curl_output: xml}),
        dataType: "html",
        success: function (resp) {
            if (resp.match("SimpleXMLElement")) {
                console.log(resp);
                resp = "<b>Что-то не так с введенным XML :-(</b> (подробнее - см. консоль)";
            }
            showResult("parse_result",["clean4","run_copy4"],resp);
        }
    });

}

function filter () {
    var srv_ = $("#srv").val();
    var status_ = $("#status").val();
    $.ajax({
        type: "POST",
        url: "parse_xml.php",
        data: ({srv: srv_, status: status_}),
        dataType: "html",
        success: function (resp) {
            showResult("filter_result",["clean5","run_copy5"],resp)
        }
    });
}

function activeNums() {
    var result = "";
    uCount.innerHTML = "";
    iCount.innerHTML = "";
    aCount.innerHTML = "";
    if (users.value.trim() != "") {
        var nums = users.value.trim().split(" ");
        uCount.innerHTML = nums.length;
        if (inactive.value.trim() != "") {
            var numsOff = inactive.value.trim().split(" ");
            iCount.innerHTML = numsOff.length;
            for (var i = 0; i<numsOff.length;i++) {
                var n = nums.indexOf(numsOff[i]);
                if (n !== -1) nums.splice(n,1);
            }
        };
        result = nums.join(" ");
        aCount.innerHTML = "Активных номеров: " + nums.length;
    };
    if (result != "") {
        numArrs_result.innerHTML = result;
        $("#numArrs_result").slideDown(300);
        $("#run_copy5").show();
        $("#aCount").show();
    } else {
        $("#numArrs_result").slideUp(300, "swing", function () {numArrs_result.innerHTML = result});
        $("#run_copy5").hide();
        $("#aCount").hide();
    }
    

}

function prefConv(prefs) {
    if (!prefs.trim()) {
        showResult("prefs_result",["clean6"],"А конвертировать-то нечего ¯\\_(ツ)_/¯");
        return null
    }
    var parsedPrefs = JSON.stringify(ITooLabs.CData.decode(prefs));
    var jPrefs = JSON.parse(parsedPrefs);
    function jObjProc(obj) {
        var result = "";
        for (var p in obj) {
            if (obj[p] === null) {result += '<li>' + p + ' : null</li>'}
            else {
                switch (typeof(obj[p])) {
                    case "string": result += '<li>' + p + ' : <span style="color: green">"' + obj[p] + '"</span></li>';break;
                    case "boolean": result += '<li>' + p + ' : <span style="color: purple">' + obj[p] + '</span></li>';break;
                    case "number": result += '<li>' + p + ' : <span style="color: lightskyblue">' + obj[p] + '</span></li>';break;
                    case "object": 
                    if (Array.isArray(obj[p])) result += '<li><details><summary>' + p + ' : <span style="color: red">' + jArrProc(obj[p]) + '</span></li>';
                    else result += '<li><details><summary>' + p + ' : <span style="color: yellow">' + jObjProc(obj[p]) + '</span></li>';
                    break;
                } 
            }
            };
        return "{ " + Object.keys(obj).length + " }</summary><ul style = 'list-style-type:none'>" + result + "</ul></details>";
    }
    function jArrProc(arr) {
        var result = "";
        for (var i=0;i<arr.length;i++) {
            if (arr[i] === null) {result += '<li>' + i + ' : null</li>'}
            else {
                switch (typeof(arr[i])) {
                    case "string": result += '<li>' + i + ' : <span style="color: green">"' + arr[i] + '"</span></li>';break;
                    case "boolean": result += '<li>' + i + ' : <span style="color: purple">' + arr[i] + '</span></li>';break;
                    case "number": result += '<li>' + i + ' : <span style="color: lightskyblue">' + arr[i] + '</span></li>';break;
                    case "object": 
                    if (Array.isArray(arr[i])) result += '<li><details><summary>' + i + ' : <span style="color: red">' + jArrProc(arr[i]) + '</span></li>';
                    else result += '<li><details><summary>' + i + ' : <span style="color: yellow">' + jObjProc(arr[i]) + '</span></li>';
                    break;
                } 
            }
        };
        return "[ " + arr.length + " ]</summary><ul style = 'list-style-type:none'>" + result + "</ul></details>";
    }
    prefs_result.innerHTML = parsedPrefs;
    var fill = function () {
        tree1.innerHTML = jObjProc(jPrefs);
        var options = "<option value ='all' selected>Все</option>";
        for (p in jPrefs) {
            options += "<option value ='"+p+"'>"+p+"</option>"
        }
        prefs_block.innerHTML = options;
        $("#edit1>textarea").val(JSON.stringify(jPrefs,null,4));
        $("#prefs_tabs").slideDown(300);
    }
    
    if ($("#prefs_tabs").css("display") == "block") {
        $("#prefs_tabs").slideUp(300, "swing", fill)
    }
    else {
        fill();
        $("#clean6").slideDown(300);
    }

    // showResult("prefs_result",["clean6","run_copy6","open_prefs_edit"],parsedPrefs);

    
}


function changeBlock() {
    var jObj = JSON.parse(prefs_result.innerHTML);
    var bName = prefs_block.value;   
    if (bName == "all") {
        $("#edit1>textarea").val(JSON.stringify(jObj,null,4))
    } else {
        $("#edit1>textarea").val("{\n    \""+bName+"\": "+JSON.stringify(jObj[bName],null,4)+"\n}")
    }

}

function jToCLI() {
    try {
        var j = JSON.parse($("#edit1>textarea").val());
    } catch (e) {
        var errMsg = "[ERROR] Could not parse JSON: " + e
    }
    if (errMsg) {
        var result = "<b style='color: red'>"+errMsg+"</b>"
    } else {
        var data = ITooLabs.CData.encode(j);
        var command = "";
        var jObj = JSON.parse(prefs_result.innerHTML);
        if (jObj["AccountName"]) {
            if (prefs_block.value == "all") command = "SETACCOUNTPREFS " + jObj["AccountName"];
            else command = "UPDATEACCOUNTPREFS " + jObj["AccountName"];
        } else if (jObj["AdminDomainName"]) {
            if (prefs_block.value == "all") command = "SETDOMAINSETTINGS <Имя домена>";
            else command = "UPDATEDOMAINSETTINGS <Имя домена>";
        } else if (jObj["CustomProps"]) {
            if (prefs_block.value == "all") command = "SETACCOUNTDEFAULTPREFS <Имя домена>";
            else command = "UPDATEACCOUNTDEFAULTPREFS <Имя домена>";
        }
        var result = command + " " + data;
    }
    showResult("prefs_edit_result",["run_copy6"],result);
}

function tlnConv() {
    var result = "А конвертировать-то нечего ¯\\_(ツ)_/¯";
    if (tln_str.value.trim()){
        try {
            var a = JSON.parse(tln_str.value.trim());
        } catch (e) {
            var errMsg = "[ERROR] Could not parse JSON: " + e
        }
        if (errMsg) {
            result = "<b style='color: red'>"+errMsg+"</b>"
        } else {
            if (!(Array.isArray(a))) {
                result = "Введенные данные не преобразуются в массив.\r\nВставьте значение свойства telnums <b style='color: red'>от знака '[' до знака ']'</b>"
            } else {
                var tlnObj = {};
                for (var i=0;i<a.length;i++){
                    var tn = a[i]["telnum"];
                    tlnObj[tn] = {};
                    tlnObj[tn]["city"] = a[i]["cityId"];
                    tlnObj[tn]["color"] = a[i]["color"]
                }
                var j = {};
                j.domru_telnums = tlnObj;
                result = ITooLabs.CData.encode(j);
            }
        }
    }
    showResult("tln_result",["clean7","run_copy7"],result);
}

function eventsCounter (e) {
    $.post("tools_usage.php", {ts: Date.now(),tool: e},
        function (data) {
            // console.log(data)
        }
    );
}

function stat() {
    var now = new Date();
    var start;
    var end = now.getTime();
    if (document.getElementById("period_week").checked) {start = end - (7*24*3600*1000); showStat()}
    else if (document.getElementById("period_month").checked) {start = now.setMonth(now.getMonth()-1); showStat()}
    else if (document.getElementById("period_custom").checked) {
        $(document).on('change','#customPeriodSet>input', function () {
            var startVal = document.getElementById('dateStart').value;
            var endVal = document.getElementById('dateEnd').value;
            if (startVal !== "") {
                start = Date.parse(startVal + "T00:00:01.000+03:00");
                if (endVal !== "") end = Date.parse(endVal + "T23:59:59.000+03:00");
            }
            console.log("startVal = "+startVal+"\nendVal = "+endVal);
            showStat()
        });
    }
    function showStat(){
        var json = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Использование инструментов'
            },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Количество использований'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                headerFormat: '<span style="font-size: 15px font-family: \'Verdana, sans-serif\'">{point.point.name}</span><br/>',
                pointFormat: '<b style="font-family: \'Verdana, sans-serif\'">{point.y}</b>'
            },
            series: [{
                name: 'Инструменты',
                data: [
                    // ['Аудит', 24],
                    // ['Обработка номеров', 20],
                    // ['Конвертер timestamp', 14],
                    // ['Конвертер UTF', 7],
                    // ['Парсинг XML', 13],
                    // ['Выборка номеров', 0],
                    // ['Активные номера в домене', 2],
                    // ['Парсер префсов', 12],
                    // ['Изменение префсов', 4],
                    // ['Из drbossi в префсы', 1]
                ],
                dataLabels: false
                // {
                //     enabled: true,
                //     // rotation: -90,
                //     color: '#FFFFFF',
                //     align: 'right',
                //     format: '{point.y}', // one decimal
                //     y: 30, // 10 pixels down from the top
                //     style: {
                //         fontSize: '13px',
                //         fontFamily: 'Verdana, sans-serif'
                //     }
                // }
            }]
        };

        $.post("tools_usage.php", {showStat: true, start: start, end: end},
            function (data) {
                var pattern = {
                    "run_audit": "Аудит",
                    "run_num_proc": "Обработка номеров",
                    "run_timeConv":"Конвертер timestamp",
                    "run_utfConv":"Конвертер UTF",
                    "run_parse":"Парсинг XML",
                    "run_filter":"Выборка номеров",
                    "active_nums":"Активные номера в домене",
                    "run_prefConv":"Парсер префсов",
                    "run_prefEdit":"Изменение префсов",
                    "run_tlnConv":"Из drbossi в префсы",
                    "run_copy8":"Создание промокодов"
                };
                var countOfRuns = {};
                for (i in pattern) {
                    countOfRuns[i] = data.split(i).length - 1;
                    data = data.replace(new RegExp(i,"g"),pattern[i]);
                    json.series[0]["data"].push([pattern[i], countOfRuns[i]])
                }
                document.getElementsByClassName("mainStatTable")[0].innerHTML = data
                $('#container').highcharts(json)
            }
        );
    }

};

function bandScroll (i) {
    var classes = i.className.split(" ");
    var direction = classes[classes.length-1];
    var master = $(i).closest(".master")[0];
    var masterWidth = master.clientWidth;
    var curScrn = $(master).find(".bandScreen:visible")[0];
    var curScrnNum = $(curScrn).attr("scrnIndex");
    var band = master.querySelector(".band");
    if (direction === "next") {
        var nextScrn = curScrn.nextElementSibling;
        if (nextScrn) {
            nextScrn.style.display = "block";
            $(band).animate({left:0-masterWidth},300,"swing",function(){
                $(curScrn).hide();
                band.style.left=0;
                $(master).find(".prev").css("visibility","unset");
                if (nextScrn.hasAttribute("scrnResult")) {
                    $(master).find(".toStart,.run_copy").show();
                    $(master).find(".next").css("visibility","hidden");
                }
            })
        }
        
    }
    else if (direction === "prev") {
        var prevScrn = curScrn.previousElementSibling;
        if (prevScrn){
            prevScrn.style.display = "block";
            band.style.left = 0-masterWidth;
            $(band).animate({left:0},300,"swing",function(){
                $(curScrn).hide();
                if (curScrn.hasAttribute("scrnResult")) {
                    $(master).find(".toStart,.run_copy").hide();
                    $(master).find(".next").css("visibility","unset")
                }
                if (curScrnNum=="2") $(master).find(".prev").css("visibility","hidden");
            })
        }
    }
    else if (direction === "toStart") {

        band.firstElementChild.style.display = "block";
        band.style.left = 0-masterWidth;
        $(band).animate({left:0},300,"swing",function(){
            $(curScrn).hide();
            $(master).find(".toStart,.run_copy").hide();
            $(master).find(".next").css("visibility","unset")
            $(master).find(".prev").css("visibility","hidden");
            $(master).parents("form").trigger("reset");
            $(master).find("div").each(function(){this.removeAttribute("style")})
        })
    };
};

function generatePromo (i) {
    // переключение отображения
    switch (i.id) {
        case "demo": $("#promoWizard .if_demo").show(); $("#promoWizard .if_option").hide(); break;
        case "option": $("#promoWizard .if_demo").hide(); $("#promoWizard .if_option").show(); break;
        case "singleUse": $("#promoWizard .if_singleUse").show(); $("#promoWizard .if_multiUse").hide(); break;
        case "multiUse": $("#promoWizard .if_singleUse").hide(); $("#promoWizard .if_multiUse").show(); break;    
        case "offline": $("#promoWizard .if_offline").show(); break;    
        case "online": $("#promoWizard .if_offline").hide(); break;    
    };
    if ($("#offline:checked")[0]&&$("#singleUse:checked")[0]) $("#promoEmail").parent().show();
    else $("#promoEmail").parent().hide();
    
    // обработка значений
    var essence, start, limited, toEmail, offline;
    essence=start=limited=toEmail=offline = "";
    var errList = [];
    if (document.getElementById("option").checked) {
        var optList = [];
        $("#options>input:checked").each(function (i,e) {optList.push(e.value)});
        if (optList.length==0) errList.push("Не выбраны опции");
        var period = document.getElementById("period").value;
        if (period.match(/^\d+$/)==null) errList.push("Срок пользования опциями");
        var clientTypeList = [];
        $("#clientType>input:checked").each(function (i,e) {clientTypeList.push(e.value)});
        if (clientTypeList.length==0) errList.push("Не выбран тип клиентов");
        essence = "of using '"+optList.join(",")+"' extensions for "+period+" months for '"+clientTypeList.join(",")+"' customers";
        var champNameTail = optList.join("-")+"_"+period+"m";
        
    } else if (document.getElementById("demo").checked) {
        var demoExt = document.getElementById("demoExt").value;
        if (demoExt.match(/^\d+$/)==null) errList.push("Срок продления демо");
        essence = "of demo prolongation for "+demoExt+" days";
        var champNameTail = "demo_"+demoExt+"d";
    }
    if (document.getElementById("offline").checked) {
        offline = " offline";
        toEmail = "to email '"+document.getElementById("promoEmail").value+"'";
        if (document.getElementById("promoEmail").value.match(/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/)==null&&document.getElementById("singleUse").checked) errList.push("E-Mail");
    } else if (document.getElementById("online").checked) {offline, toEmail = "";}
    if (document.getElementById("singleUse").checked) {
        start = "mfbossi make "+document.getElementById("promoCount").value+offline+" promocode ";
        if (document.getElementById("promoCount").value.match(/^\d+$/)==null) errList.push("Количество промокодов");
    }
    else if (document.getElementById("multiUse").checked) {
        start = "mfbossi add reusable"+offline+" promocode "+document.getElementById("multiUsePromo").value+" ";
        toEmail = "";
        limited = " limited "+document.getElementById("multiUseCount").value;
        if (document.getElementById("multiUsePromo").value=="") errList.push("Промокод");
        if (document.getElementById("multiUseCount").value=="") errList.push("Количество возможных активаций");
    }

    var champName = " at 'promo_"+new Date().toISOString().slice(0,10)+"_"+champNameTail+"' campaign ";
    var desc = "with '"+document.getElementById("champingDesc").value+"' description ";
    var till = "till '"+document.getElementById("dateTill").value+"' ";
    if (document.getElementById("champingDesc").value=="") errList.push("Название промокампании");
    if (document.getElementById("dateTill").value=="") errList.push("Срок активации");
    if (errList.length!=0) {
        document.getElementById("promo_result").innerText = "Не заполнены или некорректно заполнены следующие поля:\n\n"+errList.join("\n");
        document.getElementById("promo_result").style.backgroundColor = "rgba(255, 106, 106, 0.425)";
    } else {
        document.getElementById("promo_result").innerHTML = start+essence+champName+desc+till+limited+toEmail;
        document.getElementById("promo_result").removeAttribute("style")
    }
    document.getElementById("promo_result").style.display = "block";
    
     
}
