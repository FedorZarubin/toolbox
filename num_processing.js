function num_proc() {
    //обработка введенных номеров
    var data = document.getElementById("inp_data").value;
    var inp_separator = "";
    if (document.getElementById("inp_separator").value == 1) {
        inp_separator = "\n";
    } else if (document.getElementById("inp_separator").value == 2) {
        inp_separator = " ";
    };
    if (data.trim() != "") {

        var inp_arr = data.trim().split(inp_separator);
        var result_arr = [];
        inp_arr.forEach(element => {
            var num = element;
            num = num.trim().replace(/[^0-9]/g, "");
            if (num.length == 10) num = "7" + num;
            else if (num.length == 11 && num.slice(0,1) == "8") num = num.replace(/^8/, "7");
            else if (num.length == 11 && num.slice(0,1) == "7");
            else num = num + " (!Некорректный формат номера!)";
            if (result_arr.includes(num) === false) result_arr.push(num);
        });
        
        //вывод в нужном формате
        var result = "";
        var wrong_num = 0;
        var out_sep = "<br/>";
        var prefix = "";
        var suffix = "";
        var in_file_first = "";
        var in_file_next = "";
        
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
                case 1: var cust_sep = document.getElementById("cust_separator").value; //в строку
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
                case 2: if (document.getElementById("in_file").checked) { //команда mfbossi
                    in_file_first = ' > result.txt';
                    in_file_next = ' >> result.txt';
                };
                prefix = 'echo "*Result*"' + in_file_first + '; for i in ';
                out_sep = ' ';
                switch (document.getElementById("mfb_type").value) {
                    case "1": suffix = '; do echo "---$i---"' + in_file_next + '; mfbossi activate subscriber $i' +in_file_next +'; sleep ' + document.getElementById("sleep").value + '; echo "OK"' + in_file_next + '; done'; break;
                    case "2": suffix = '; do echo "---$i---"' + in_file_next + '; mfbossi deactivate subscriber $i' + in_file_next + '; sleep ' + document.getElementById("sleep").value + '; echo "OK"' + in_file_next + '; done'; break;
                    case "3": suffix = '; do echo "---$i---"' + in_file_next + '; mfbossi get subscriber $i trunk' + in_file_next + '; sleep ' + document.getElementById("sleep").value + '; echo "OK"' + in_file_next + '; done'; break;
                };
                result = prefix + result_arr.join(out_sep) + suffix;
                break;
                case 3: if (document.getElementById("in_file1").checked) { //curl
                    in_file_first = ' > result.txt';
                    in_file_next = ' >> result.txt';
                };
                if (document.getElementById("curl").hasAttribute("active")) { //проверка статуса услуг
                    prefix = 'echo "<RESULT>"' + in_file_first + '; for i in ';
                    out_sep = ' ';
                    var curl_7005 = "";
                    var curl_7032 = "";
                    var curl_7024 = "";
                    if (document.getElementById("7005").checked) curl_7005 = 'echo "<SRV_7005>"' + in_file_next + '; curl "http://10.236.26.171/v1/OSA/service_status?ACCOUNT=VATS&MSISDN=$i&PWD=ZxRwgAKG&SERVICE_ID=7005"' + in_file_next + '; echo "</SRV_7005>"' + in_file_next + '; ';
                    if (document.getElementById("7032").checked) curl_7032 = 'echo "<SRV_7032>"' + in_file_next + '; curl "http://10.236.26.171/v1/OSA/service_status?ACCOUNT=VATS&MSISDN=$i&PWD=ZxRwgAKG&SERVICE_ID=7032"' + in_file_next + '; echo "</SRV_7032>"' + in_file_next + '; ';
                    if (document.getElementById("7024").checked) curl_7024 = 'echo "<SRV_7024>"' + in_file_next + '; curl "http://10.236.26.171/v1/OSA/service_status?ACCOUNT=VATS&MSISDN=$i&PWD=ZxRwgAKG&SERVICE_ID=7024"' + in_file_next + '; echo "</SRV_7024>"' + in_file_next + '; ';
                    suffix = '; do echo "<NUM_$i>"' + in_file_next + '; ' + curl_7005 + curl_7032 + curl_7024 + 'echo "</NUM_$i>"' + in_file_next + '; sleep ' + document.getElementById("sleep1").value + ';done; echo "</RESULT>"' + in_file_next;
                    result = htmlspecialchars(prefix + result_arr.join(out_sep) + suffix);
                    document.getElementById("analize").style.display = "block";
                }
                else if (document.getElementById("curl1").hasAttribute("active")) { //вкл/выкл услуги
                    prefix = 'echo "*Result*"' + in_file_first + '; for i in ';
                    out_sep = ' ';
                    var note = '';
                    var action_idx = document.getElementById("action").value;
                    var srv_idx = document.getElementById("srv").value;
                    var srv = '';
                    var action = '';
                    switch(srv_idx) {
                        case "1": srv = '7005'; break;
                        case "2": srv = '7032'; break;
                        case "3": srv = '7024'; note = " # после завершения phase1 вручную исправить на phase2 и запустить заново"; break;
                    };
                    if (action_idx == '1' && srv_idx.match(/[12]/) !== null) action = "service_add";
                    else if (action_idx == '1' && srv_idx == '3') action = "vats_add_phase1";
                    else if (action_idx == '2' && srv_idx.match(/[12]/) !== null) action = "vats_add_phase1";
                    else if (action_idx == '2' && srv_idx == '3') action = "vats_rem_phase1";
                    suffix = '; do echo "---$i---"' + in_file_next + '; curl "http://10.236.26.171/v1/OSA/' + action + '?ACCOUNT=VATS&MSISDN=$i&PWD=ZxRwgAKG&SERVICE_ID=' + srv + '"' + in_file_next + '; sleep ' + document.getElementById("sleep1").value + '; echo "OK"' + in_file_next + '; done';
                    result = prefix + result_arr.join(out_sep) + suffix + note;
                }
                break;                    
            };
        };
        document.getElementById("numbers_count").innerHTML = "Всего номеров: " + result_arr.length;
        document.getElementById("numbers_count").style.display = "block";
    } 
    else result = "<b>Введите номера в тектовое поле!</b>";
    document.getElementById("numbers_result").innerHTML = result;
    $("#numbers_result").slideDown(500);
    document.getElementById("clean1").style.display = "block";
    }