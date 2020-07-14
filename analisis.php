<?php
    session_start ();

?>

<html>
<head>
    <meta charset="utf-8">
    <title>Curl result analisis</title>
    <link rel="icon" href="itl_icon.ico" type="image/vnd.microsoft.icon"></link>
    <link rel="stylesheet" href="style_tabs.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="/functions.js"></script>
    <script src="/eventHandler.js"></script>
    <script src="/toclipboard.js"></script>
</head>
<body>
<div class="fieldset" id="analisis">
    <form method="POST" name="curl_result">
    <!-- <div class="flex"><div class = "link_go"><a href="/">Вернуться на главную</a></div></div> -->
        <header>Анализ результатов curl</header>
        <label>Введите результат curl:</label><br/>
        <textarea type="text" name="curl_output" id = "inp_xml" autocomplete="off" rows="15" cols="80"><?=preg_replace("/<\?xml.*\?>/","",$_SESSION["curl_output"])?></textarea>
        <!-- <input type = "submit" name = "parse" value = "Go!" /> -->
        <input type="button" class="go" id="run_parse" value="Go!"/>
        <div class = 'text_result' id='parse_result'></div>
        <div class="flex">
            <div class="go hidden" id="clean4"><img src="/icons/clean_40x40.png"/> Очистить форму</div>
            <div class="go hidden run_copy" id="run_copy4"><img src="/icons/copy_40x40.png"/> Скопировать результат</div>
        </div>

    </form>

<?php
if(isset($_POST["parse"])){
    $_SESSION["curl_output"] = $_POST["curl_output"];
    //setcookie ("curl_output",$_SESSION["curl_output"], time() + 3600);
    $inp_data = preg_replace("/<\?xml.*\?>/","",$_POST["curl_output"]);
    //echo htmlspecialchars($inp_data);
    $xml = new SimpleXMLElement($inp_data);
    require 'dbconfig.php';
    $clear_tbl = $DB->prepare("DELETE FROM srv_status");
    $clear_tbl->execute();
    $insert = $DB->prepare("INSERT INTO srv_status (NUM, SRV_7005, SRV_7032, SRV_7024) VALUES (:NUM, :SRV_7005, :SRV_7032, :SRV_7024)");
    foreach ($xml as $subscriber) {
        $NUM = substr($subscriber->getName(),4,11);
        $SRV_7005 = "";
        $SRV_7032 = "";
        $SRV_7032 = "";
        if ($subscriber->SRV_7005->SELFCARE->SERVICE_STATUS_ID == 4) $SRV_7005 = "ON";
        elseif ($subscriber->SRV_7005->SELFCARE->SERVICE_STATUS_ID == 6) $SRV_7005 = "OFF";
        elseif ($subscriber->SRV_7005->SELFCARE->SERVICE_STATUS_ID == 1) $SRV_7005 = "NOT ORDERED";
        elseif ($subscriber->SRV_7005->SELFCARE->SERVICE_STATUS_ID == 2) $SRV_7005 = "ORDERED /WAIT FOR PAYMENT";
        elseif ($subscriber->SRV_7005->SELFCARE->SERVICE_STATUS_ID == 3) $SRV_7005 = "ORDERED /WAIT FOR ADD";
        elseif ($subscriber->SRV_7005->SELFCARE->SERVICE_STATUS_ID == 5) $SRV_7005 = "WAIT FOR DELETE";
        
        elseif ($subscriber->SRV_7005->SELFCARE->ERROR) $SRV_7005 = $subscriber->SRV_7005->SELFCARE->REASON;
        else $SRV_7005 = "-";

        if ($subscriber->SRV_7032->SELFCARE->SERVICE_STATUS_ID == 4) $SRV_7032 = "ON";
        elseif ($subscriber->SRV_7032->SELFCARE->SERVICE_STATUS_ID == 6) $SRV_7032 = "OFF";
        elseif ($subscriber->SRV_7032->SELFCARE->SERVICE_STATUS_ID == 1) $SRV_7032 = "NOT ORDERED";
        elseif ($subscriber->SRV_7032->SELFCARE->SERVICE_STATUS_ID == 2) $SRV_7032 = "ORDERED /WAIT FOR PAYMENT";
        elseif ($subscriber->SRV_7032->SELFCARE->SERVICE_STATUS_ID == 3) $SRV_7032 = "ORDERED /WAIT FOR ADD";
        elseif ($subscriber->SRV_7032->SELFCARE->SERVICE_STATUS_ID == 5) $SRV_7032 = "WAIT FOR DELETE";
        elseif ($subscriber->SRV_7032->SELFCARE->ERROR) $SRV_7032 = $subscriber->SRV_7032->SELFCARE->REASON;
        else $SRV_7032 = "-";

        if ($subscriber->SRV_7024->SELFCARE->SERVICE_STATUS_ID == 4) $SRV_7024 = "ON";
        elseif ($subscriber->SRV_7024->SELFCARE->SERVICE_STATUS_ID == 6) $SRV_7024 = "OFF";
        elseif ($subscriber->SRV_7024->SELFCARE->SERVICE_STATUS_ID == 1) $SRV_7024 = "NOT ORDERED";
        elseif ($subscriber->SRV_7024->SELFCARE->SERVICE_STATUS_ID == 2) $SRV_7024 = "ORDERED /WAIT FOR PAYMENT";
        elseif ($subscriber->SRV_7024->SELFCARE->SERVICE_STATUS_ID == 3) $SRV_7024 = "ORDERED /WAIT FOR ADD";
        elseif ($subscriber->SRV_7024->SELFCARE->SERVICE_STATUS_ID == 5) $SRV_7024 = "WAIT FOR DELETE";
        elseif ($subscriber->SRV_7024->SELFCARE->ERROR) $SRV_7024 = $subscriber->SRV_7024->SELFCARE->REASON;
        else $SRV_7024 = "-";

        $values = array('NUM' => $NUM, 'SRV_7005' => $SRV_7005, 'SRV_7032' => $SRV_7032, 'SRV_7024' => $SRV_7024);
        $insert->execute($values);
    };
    $main_select = $DB->query("SELECT * FROM srv_status");
    echo "<div class = 'text_result' id='result_tbl' onclick=toClipboard(this)>";
    echo "<table>
    <tr><i><b><th>Номер</th><th>Мультифон</th><th>eMotion</th><th>inServices</th></b></i></tr>";
    while ($row = $main_select->fetch(PDO::FETCH_ASSOC)) {
        echo "<tr><td>".$row['NUM']."</td><td>".$row['SRV_7005']."</td><td>".$row['SRV_7032']."</td><td>".$row['SRV_7024']."</td></tr>";
    }
    echo "</table>
    // </div>
    </div>";
    $_SESSION["sec_div_visible"] = 1;
};
if ($_SESSION["sec_div_visible"] == 1) {
    echo "</div>";
    echo "<div class='fieldset' id='filter'>
    <form method='POST' name='filter'>
        <label>Выбрать номера, где </label><select name='srv'>
                <option value ='1' selected>любой сервис</option>
                <option value ='2'>Мультифон</option>
                <option value ='3'>eMotion</option>
                <option value ='4'>inServices</option>
        </select>
        <select name='status'>
                <option value ='1' selected>включен</option>
                <option value ='2'>выключен</option>
                <option value ='3'>другое или ошибка</option>
        </select>
        
        <input type = 'submit' name = 'select' value = 'Go!' />
    </form>";
    if (isset($_POST["select"])){
        switch ($_POST["status"]) {
            case "1": $status = " LIKE 'ON'"; break;
            case "2": $status = " LIKE 'OFF'"; break;
            case "3": $status = " NOT IN ('ON', 'OFF', '-')"; break;
        };

        switch ($_POST["srv"]) {
            case "1": $srv = " SRV_7005".$status." OR SRV_7032".$status." OR SRV_7032".$status; break;
            case "2": $srv = " SRV_7005".$status; break;
            case "3": $srv = " SRV_7032".$status; break;
            case "4": $srv = " SRV_7024".$status; break;
        };
        $q_string = "SELECT (NUM) FROM srv_status WHERE".$srv;
        //echo $q_string;
        require 'dbconfig.php';
        $custom_select = $DB->query($q_string);
        echo "<div class = 'text_result' id='filter_result' onclick=toClipboard(this)>";
            while ($row = $custom_select->fetch(PDO::FETCH_ASSOC)){
                echo $row['NUM']."<br/>";
            };

        echo "</div>";
    }
}
?>
</div>
<div class='fieldset' id='filter'>
    <form method='POST' name='filter'>
        <label>Выбрать номера, где </label><select name='srv' id="srv">
                <option value ='1' selected>любой сервис</option>
                <option value ='2'>Мультифон</option>
                <option value ='3'>eMotion</option>
                <option value ='4'>inServices</option>
        </select>
        <select name='status' id="status">
                <option value ='1' selected>включен</option>
                <option value ='2'>выключен</option>
                <option value ='3'>другое или ошибка</option>
        </select>
        
        <!-- <input type = 'submit' name = 'select' value = 'Go!' /> -->
        <input type="button" class="go" id="run_filter" value="Go!"/>
        <div class = 'text_result' id='filter_result'></div>
        <div class="flex">
            <div class="go hidden" id="clean5"><img src="/icons/clean_40x40.png"/> Очистить форму</div>
            <div class="go hidden run_copy" id="run_copy5"><img src="/icons/copy_40x40.png"/> Скопировать результат</div>
        </div>

    </form>
</div>
</body>

