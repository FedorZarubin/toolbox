$(function tabs_select () {
    $('.tab_label').click(function () {
        var position = $(this).index();
        var items = $(this).parent().siblings().children(".tab_content");
        $(this).attr("active", "");
        $(this).siblings().removeAttr("active");
        items.eq(position).attr("active", "");
        items.eq(position).siblings().removeAttr("active");
        return false;
        })
})

$(function items_select () {          
    $('.item>span').click(function (){
        $(this).parent().attr("active", "");
        $(this).parent().siblings().removeAttr("active");
        return false;
        })
})

function htmlspecialchars(html){
    var div =  document.createElement('div');
    div.innerText = html;
    return div.innerHTML;
  }