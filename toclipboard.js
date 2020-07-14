function toClipboard (i) {
    if (i.id.match(/run_copy[45]/) !== null) {
        var divId = $(i).parent().siblings(".text_result").attr('id');
        var element = document.getElementById(divId);
        
        var range = document.createRange();
        range.selectNode(element);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        try {
            document.execCommand('copy');
        } catch (error) {
            console.log("Copy to clipboard error!");
        }
        window.getSelection().removeAllRanges();
    } else {
        var text = $(i).parent().siblings(".text_result").html();
        var temp = $("<textarea>");
        $("body").append(temp);
        $(temp).html(text).select();
        try {
            document.execCommand('copy');
        } catch (error) {
            console.log("Copy to clipboard error!");
        }
        $(temp).remove();
    }
    
    var done = $("<div class='done'>Скопировано</div>");
    var doneHide = function () {
        $(".done").hide(200, "linear", function (){$(".done").remove()});
    };
    $(i).parent().siblings(".text_result").append(done);
    $(".done").show(200,"linear",function(){setTimeout(doneHide, 1000)});

}
