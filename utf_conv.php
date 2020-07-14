<?php
    if(!empty($_POST['inp_str'])){
        require 'dbconfig.php';
        $DB->query("SET NAMES 'utf8'");
        $inp_string = $_POST['inp_str'];
        $out_arr = array();
        preg_match_all('/\\d{2,6}|[.,!@#$%^&*()-=_+ <>"№\']/', $inp_string, $matches);
        $i = 0;
        while ($i < count($matches[0])){
            if($matches[0][$i] == '208' or $matches[0][$i] == '209'){
                $cur_code = $matches[0][$i].$matches[0][$i+1];
                $i++;
                $q_result = $DB -> query ("SELECT symb FROM utf_symb WHERE id_symb = $cur_code");
                $raw = $q_result->fetch(PDO::FETCH_ASSOC);
                $cur_symb = $raw[symb];

            } elseif (preg_match('/[.,!@#$%^&*()-=_+ <>"№\']/',$matches[0][$i])) {
                $cur_symb = $matches[0][$i];
            }
            else {
                $cur_code = $matches[0][$i];
                $q_result = $DB -> query ("SELECT symb FROM utf_symb WHERE id_symb = $cur_code");
                $raw = $q_result->fetch(PDO::FETCH_ASSOC);
                $cur_symb = $raw[symb];
            };

            array_push($out_arr, $cur_symb);
            unset($cur_symb);
            $i++;
        }
        $out_str = implode("",$out_arr);
        }

    else $out_str = '!Исходная строка пуста!';
    echo $out_str;
?>