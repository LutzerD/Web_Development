var tsWinID = null;
var tsTabID = null;

var exWinID = null;
var exTabID = null;

var translated_text= null;

var tsLang = "zh-CN";
var targetLang = "en";

var combo_counter =0;


function getExWindows(win) {
  exWinID = win.id;
}

function getTsWindows(win) {
  tsWinID = win.id;
}

function getExTabs(){
  chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {  
      exTabID = tabs[0].id;
  });
}

function getTxTabs(){
  chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {  
    tsTabID = tabs[0].id;
  });
}

function getTS(){
  chrome.windows.getCurrent(getTsWindows);
  getTxTabs();
}

function getEX(){
  chrome.windows.getCurrent(getExWindows);
  getExTabs();
}

function loggo(){
  console.log("Ex winid, tabid:",exWinID,exTabID);
  console.log("TS winid, tabid:",tsWinID,tsTabID);
}

chrome.browserAction.onClicked.addListener(function(tab) {
  console.log("Initial:",tab)
  
  loggo();
  getEX();

  chrome.windows.create({url: "https://translate.google.ca" , height:1,width:1});
//chrome.windows.create({url: "https://translate.google.ca" });
  getTS();

  if(exWinID){
    chrome.windows.update(exWinID,{focused: true});
  }

  console.log("End:");
  loggo();
});


function getchincb(){
  var meth;
  if(tsLang == "pin"){
    meth = "getPin";
  }else{
    meth = "getTsChin";
  }

  chrome.tabs.sendMessage(tsTabID, {method: meth}, function(response){   
    console.log(response);
    if(response.data){
      replaceo(response.data)
    }else{
      console.log("Skippt swapping words. :C")
    }
  });
}


function swap_langs(){

  if(combo_counter + 1> 5)
    combo_counter = 0;
  else
    combo_counter++;

  if(combo_counter == 0){
    targetLang = "en";
    tsLang = "zh-CN";
  }else if(combo_counter == 1){
    targetLang = "en";
    tsLang = "pin";
  }else if(combo_counter == 2){
    targetLang = "zh-CN";
    tsLang = "en";
  }else if(combo_counter == 3){
    targetLang = "zh-CN";
    tsLang = "pin";
  }else if(combo_counter == 4){
    targetLang = "pin";
    tsLang = "en";
  }else{
    targetLang = "pin";
    tsLang = "zh-CN";
  }

  chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {      
    chrome.tabs.sendMessage(tabs[0].id, {title:targetLang+tsLang}, function(response){        
      console.log("resp:",response);
    });
  });

}

function cbpls(){
  setTimeout(function() { getchincb();},2000);
}

function getTranslatedText(){
  chrome.windows.update(exWinID,{focused: true});
  chrome.tabs.update(tsTabID,{active:true}, cbpls());

  chrome.windows.update(exWinID,{focused: false});
  chrome.tabs.update(tsTabID,{active:false})
  if(exWinID){
    chrome.windows.update(exWinID,{focused: true});
  }
}

function upTsTab(tb){
  tsTabID = tb.id;
}

function updTsTab(tb){
  tsTabID = tb.id;
  getTranslatedText();
}

function replaceo(ss){
  chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {      
        chrome.tabs.sendMessage(tabs[0].id, {method: "getSelecc", texto:ss}, function(response){        
          console.log("resp:",response)
        });
  });
}


function toggle(){
  chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {      
      chrome.tabs.sendMessage(tabs[0].id, {method: "getSelection"}, function(response){        
        console.log("resp:",response)
        if(response){
          r = "" + response.data;
          r = r.replace(/ /g,"%20");
          r = r.replace(/,/g,"%2C"); 
          r = r.replace(/↵/g,"%0A");
          r = r.replace(/\//g,"%2F");
          //. == .
          //!==!/
          var tempa= "en";
          var tempb= "en";
          
          if(targetLang != "en")
            tempa = "zh-CN";
          
          if(tsLang != "en")
            tempb = "zh-CN";
          
          var str = "https://translate.google.ca/#"+tempa+"/"+tempb+"/"+r;
          console.log("got em!",r,str)
          chrome.tabs.update(tsTabID,{url: str.toString()},updTsTab);
          console.log("Updated")

        }
      });
  });
} 

chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
  if (command == "toggle-feature"){
    toggle()
  }else if (command == "skeet"){
    swap_langs()
  }
});