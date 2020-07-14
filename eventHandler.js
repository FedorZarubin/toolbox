$(function eventHandler () {
    $(document).on('click', '.go', function () {
        var fType = event.target.id;
        var fTypeCl = event.target.className;
        if (fType.match(/^clean.*/) !== null) cleanForm(fType);
        else if (fType === "run_audit") audit();
        else if (fType === "run_num_proc") num_proc();
        else if (fType === "run_timeConv") timeConv(tmstmp.value);
        else if (fTypeCl.match(/run_copy/) !== null) toClipboard(this);
        else if (fType === "run_utfConv") utfConv();
        else if (fType === "run_parse") xmlParse();
        else if (fType === "run_filter") filter();
        else if (fType === "active_nums") $(".window").fadeIn(300);
        else if (fType === "run_prefConv") prefConv(inPrefs.value);
        else if (fType === "run_prefEdit") jToCLI();
    });
    $(document).on('input','#nums_arrs textarea', function () {activeNums()});
    $(document).on('click','#window_close', function () {$(".window").fadeOut(300)});
    $(document).on('change','#prefs_block', function () {changeBlock()});
})