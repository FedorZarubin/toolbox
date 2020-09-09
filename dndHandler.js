$(function () {
    
    const dndEvents = ['dragover', 'dragleave', 'drop'];
    var dropAreas = document.getElementsByClassName("dropArea");
    dndEvents.forEach(eventName => {
        for (var i=0;i<dropAreas.length;i++) dropAreas[i].addEventListener(eventName, dndHandler, true)
            })
        });
function dndHandler(event) {
    event.preventDefault()
    event.stopPropagation()
    if (event.type == "dragover") {
        event.currentTarget.classList.add('drag')
    }
    else if (event.type == "dragleave") {
        event.currentTarget.classList.remove('drag')
    }
    else if (event.type == "drop") {
        event.currentTarget.classList.remove('drag');
        var file = event.dataTransfer.files[0];
        var errText = "";
        if (event.dataTransfer.files.length > 1) {
            errText =  '<b style="color:#a80000">Вы патаетесь загрузить несколько файлов. Выберите какой-то один.</b>';
        } else if (file.type !== "text/xml" && file.type !== "text/plain") {
            errText =  '<b style="color:#a80000">Неверный формат файла</b>';
        } else {
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function() {
                inp_xml.innerHTML= reader.result;
            };
            reader.onerror = function() {
                errText = "Ошибка чтения файла (см. консоль)";
                console.log(reader.error);
            };
        };
        if (errText != "") {
            showResult("parse_result",[],errText);
            setTimeout(cleanForm, 5000, "clean4");
        }
    }
}
 n