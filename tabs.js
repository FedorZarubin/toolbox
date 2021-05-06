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
    $('.item').click(function (){
        $(this).attr("active", "");
        $(this).siblings().removeAttr("active");
        });
    $('.item input,.item select,.item label').click(function (event){event.stopPropagation()})
})

function htmlspecialchars(html){
    var div =  document.createElement('div');
    div.innerText = html;
    return div.innerHTML;
  }