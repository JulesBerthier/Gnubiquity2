$( "#pepper" ).click(function() {
  removeScripts();

  //On ajoute les scripts nécessaires au robot
  $.getScript("js/qi2.js");
  $.getScript("js/pepper.js");
});

$( "#nao" ).click(function() {
  removeScripts();

  //On ajoute les scripts nécessaires au robot
  $.getScript("js/qi1.js");
  $.getScript("js/nao.js");
});


function removeScripts() {
    //On supprime les scripts robots non nécessaires
    removeScript('js/nao.js')
    removeScript('js/pepper.js')
    //On supprime les librairies non nécessaires
    removeScript('js/qi1.js')
    removeScript('js/qi2.js')
}

function removeScript(url) {
    $('html').find('script').filter(function(){ return $(this).attr('src') === url}).remove();
}
