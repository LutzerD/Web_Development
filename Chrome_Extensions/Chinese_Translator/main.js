chrome.runtime.onMessage.addListener( 
    function(request, sender, sendResponse) {
        //console.log(request)
        if (request.method == "getSelection") {

            sendResponse({data:window.getSelection().toString(), code:1});
         }else if (request.method == "getSelecc"){
            sel = window.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(request.texto));
            }
            sendResponse({data:"Input" + request.texto+", Output" + sel.toString(), code:5});
        }else if (request.method == "getTsChin"){
            sendResponse({data:document.getElementById("result_box").innerText, code:2});
        }else if (request.method == "getPin"){
            sendResponse({data:document.getElementById("res-translit").innerText, code:2});
        }else if(request.title){
            document.title = request.title;
            setTimeout(function(){        
                document.title = '';
            },1000)
            sendResponse({data:request, code:6});
        }else{
            sendResponse({data:request, code:3});
        }
    }
)