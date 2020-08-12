<html>
<head>
    <meta charset="utf-8">
    <title>Curl result analisis</title>
    <link rel="icon" href="itl_icon.ico" type="image/vnd.microsoft.icon"></link>
    <link rel="stylesheet" href="/toolbox/style_tabs.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="/toolbox/tabs.js"></script>
    <script src="/toolbox/toclipboard.js"></script>
    <script src="/toolbox/functions.js"></script>
    <script src="/toolbox/eventHandler.js"></script>
</head>
<body>
<div class="fieldset" id="analisis">
    <form method="POST" name="curl_result">
        <header>Анализ результатов curl</header>
        <label>Введите результат curl:</label><br/>
        <textarea type="text" name="curl_output" id = "inp_xml" autocomplete="off" rows="15" cols="80"></textarea>
        <input type="button" class="go" id="run_parse" value="Go!"/>
        <div class = 'text_result' id='parse_result'></div>
        <div class="flex">
            <div class="go hidden" id="clean4"><img src="/toolbox/icons/clean_40x40.png"/> Очистить форму</div>
            <div class="go hidden run_copy" id="run_copy4"> <img src="/toolbox/icons/copy_40x40.png"/> Скопировать результат</div>
        </div>

    </form>

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
        
        <input type="button" class="go" id="run_filter" value="Go!"/>
        <div class = 'text_result' id='filter_result'></div>
        <div class="flex">
            <div class="go hidden" id="clean5"><img src="/toolbox/icons/clean_40x40.png"/> Очистить форму</div>
            <div class="go hidden run_copy" id="run_copy5"><img src="/toolbox/icons/copy_40x40.png"/> Скопировать результат</div>
        </div>

    </form>
</div>
</body>
