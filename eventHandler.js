$(function eventHandler () {
    $(document).on('click', '.go', function (event) {
        var fType = event.target.id;
        var fTypeCl = event.target.className;
        var countedEvents = ["run_audit","run_num_proc","run_timeConv","run_utfConv","run_parse","run_filter","active_nums","run_prefConv","run_prefEdit","run_tlnConv","run_copy8"];
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
        else if (fType === "run_tlnConv") tlnConv();
        if (countedEvents.indexOf(fType)>=0) eventsCounter(fType);
    });
    if (document.getElementById('all_requests')) stat();
    $(document).on('click','[name="period"]', function () {
        if(document.getElementById('period_custom').checked) $('#customPeriodSet').slideDown(300);
        else $('#customPeriodSet').slideUp(300);
        stat()
    });
    $(document).on('input','#nums_arrs textarea', function () {activeNums()});
    $(document).on('click','#window_close', function () {$(".window").fadeOut(300)});
    $(document).on('change','#prefs_block', function () {changeBlock()});
    $(document).on('click','.master .go', function () {bandScroll(this)});
    $(document).on('change','#promoWizard input,#promoWizard textarea', function () {generatePromo(this)});
})