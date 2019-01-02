function replacer(match, offset, string) {
  // p1 is nondigits, p2 digits, and p3 non-alphanumerics
  return match.substr(0,2)+ match.substr(1,1)+ match.substr(2,1);

}

function esketit(){
    document.querySelectorAll('*').forEach(function(node) {
      try{
        inner_html_left = (node.innerHTML.split('<'));
        for (i = 0; i < inner_html_left.length; i++){
          inner_html_right = inner_html_left[i].split('>');
          for (j = 0; i < inner_html_right.length; i+=2){
            a = inner_html_right[j].replace(/\byet\b/gi, replacer);
            if (a != inner_html_right[j] && a!= null){
              node.innerHTML = a;
            }
          }
        }
      }finally{
  
      }
    });
    console.log(document.title);
  
  }    esketit();
  
  