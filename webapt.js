(function(){
    var aptFrame = document.getElementById('aptframe')
    ,   aptFrameContent = aptFrame.contentWindow
    ,   sentScripts = false;
    var sendScriptsToFrame= function(){
        var scripts = document.getElementsByTagName("script")
        ,   scriptsLen = scripts.length
        ,   curScript
        ,   dataset
        ,   i
        ,   scriptUrls = [];
        if(sentScripts){
            return;
        }
        sentScripts = true;
        // Send the iframe the script URLs, so it can download them in parallel if necessary
        for(i = 0; i < scriptsLen; i++){
            curScript = scripts[i];
            dataset = curScript.dataset;
            if(!dataset.src){
                continue;
            }
            scriptUrls.push([dataset.src, dataset.package, dataset.version]);
        }
        aptFrameContent.postMessage(scriptUrls, "*");
        // TODO: Need to block execution until the frame returned something
        delayUntilDone();
    };
    var registerFrameEvent = function(){
        // Get ready to receive stuff from the frame
        window.addEventListener('message', function(e){
            var type = e.data[0];
            if(type == "code"){
                eval(e.data[1]);
            }
            else if(type == "load"){
                sendScriptsToFrame();
            }
        }, false);

        // The frame was loaded, kick everything off
        aptFrame.addEventListener("load", sendScriptsToFrame, false);
    };

    registerFrameEvent();
})();
