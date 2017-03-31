"use strict";var hasClass=function(b,c){return b.classList?b.classList.contains(c):!!b.className.match(new RegExp("(\\s|^)"+c+"(\\s|$)"))},addClass=function(b,c){b.classList?b.classList.add(c):hasClass(b,c)||(b.className+=" "+c)},removeClass=function(b,c){if(b.classList)b.classList.remove(c);else if(hasClass(b,c)){var d=new RegExp("(\\s|^)"+c+"(\\s|$)");b.className=b.className.replace(d," ")}},windowScrollable=function(){return document.documentElement.scrollHeight!==document.documentElement.clientHeight},encodeQuery=function(b){var c=[],d=encodeURIComponent;for(var e in b)c.push(d(e)+"="+d(b[e]));return"?"+c.join("&")},queryValue=function(b){var c=new RegExp("[\\?&]"+b.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]")+"=([^&#]*)").exec(window.location.search);return c=null===c?"":decodeURIComponent(c[1].replace(/\+/g," ")),c.indexOf(",")===-1?c:c.split(",")},isUrl=function(b){var c=document.createElement("a");return c.href=b,c.host&&c.host!=window.location.host},requestShortUrl=function(b,c){var d=new XMLHttpRequest,e="https://www.googleapis.com/urlshortener/v1/url",f="AIzaSyCpo6kHvq4c_lkLo1SHVgI3SjaPkyvFrMI";d.open("POST",e+"?key="+f),d.setRequestHeader("Content-Type","application/json"),d.onload=function(){return c(d)},d.send('{"longUrl": "'+b+'"}')},$$linkItem=document.querySelector("#link-item-template"),$mainList=document.querySelector("#m-list"),$addLinkWidget=document.querySelector("#m-list__add-widget"),$addLinkInput=document.querySelector(".m-list__add-widget__inner__input"),$addLinkBtn=document.querySelector("#m-list__add-widget__inner__btn"),$footBtn=document.querySelector("#f-bar__btn"),$footNumLinks=document.querySelector("#num-links-text"),$shortenedUrl=document.querySelector("#shortened-url"),$tutorial=document.querySelector("#tutorial"),$infoBtn=document.querySelector("#info-btn"),$closeInfoBtn=document.querySelector("#close-info-btn"),$infoModal=document.querySelector("#info-modal");$infoBtn.addEventListener("click",function(){return $infoModal.hidden=!1}),$closeInfoBtn.addEventListener("click",function(){return $infoModal.hidden=!0}),$footBtn.addEventListener("click",function(a){return handleFootBtn(a)}),$addLinkWidget.addEventListener("keydown",function(a){return handleAddLinkWidgetInput(a)}),$addLinkBtn.addEventListener("click",function(a){return handleAddLinkWidgetBtn(a,$addLinkInput)});var getUrls=function(){var b=$mainList.querySelectorAll("a"),c=[],d=!0,e=!1,f=void 0;try{for(var h,g=b[Symbol.iterator]();!(d=(h=g.next()).done);d=!0){var i=h.value;c[c.length]=i.href}}catch(a){e=!0,f=a}finally{try{!d&&g.return&&g.return()}finally{if(e)throw f}}return c},addLink=function(b,c,d){var e=b.content;e.querySelector(".m-list__link-item").href=c,e.querySelector(".m-list__link-item__inner__text__content").textContent=c,$mainList.insertBefore(document.importNode(b.content,!0),d);var f=document.querySelectorAll(".m-list__link-item__inner__btn"),g=f[f.length-1];return g.addEventListener("click",function(a){return removeLink(a)}),removeClass($footBtn,"disabled"),$footBtn.disabled=!1,"is-presenting"!=document.body.className&&(document.body.className="is-editing",$footBtn.disabled=!1,removeClass($footBtn,"glow"),void(0==document.querySelectorAll(".m-list__link-item").length&&(addClass($footBtn,"disabled"),$footBtn.disabled=!0)))},removeLink=function(b){if("is-presenting"==document.body.className)return!1;var c=b.target.parentElement.parentElement.parentElement;return b.preventDefault(),c.style.backgroundColor="#f23",c.style.color="#fff",setTimeout(function(){c.style.backgroundColor="#fff"},150),setTimeout(function(){c.parentElement.removeChild(c)},300),removeClass($footBtn,"disabled"),$footBtn.disabled=!1,"is-presenting"!=document.body.className&&(document.body.className="is-editing",$footBtn.disabled=!1,removeClass($footBtn,"glow"),void(document.querySelectorAll(".m-list__link-item").length-1==0&&(addClass($footBtn,"disabled"),$footBtn.disabled=!0)))},urlsFromParams=queryValue("urls"),urlsArr=urlsFromParams;"string"==typeof urlsFromParams&&(urlsArr=[urlsFromParams]);var _iteratorNormalCompletion2=!0,_didIteratorError2=!1,_iteratorError2=void 0;try{for(var _iterator2=urlsArr[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=!0){var u=_step2.value;""!=u&&addLink($$linkItem,u,$addLinkWidget)}}catch(a){_didIteratorError2=!0,_iteratorError2=a}finally{try{!_iteratorNormalCompletion2&&_iterator2.return&&_iterator2.return()}finally{if(_didIteratorError2)throw _iteratorError2}}document.querySelectorAll(".m-list__link-item").length>0&&($tutorial.style.display="none");var handleAddLinkWidgetInput=function(b){var c=b.keyCode;if(13!=c)return!1;var d=b.target,e=d.value;isUrl(e)&&""!=e?(addLink($$linkItem,e,$addLinkWidget),d.value="",d.placeholder="Add a URL to shorten..."):(d.placeholder="Enter a valid URL (e.g. http://example.com)",d.value="",removeClass(d,"shake-me"),setTimeout(function(){return addClass(d,"shake-me")},0)),windowScrollable()&&window.scrollTo(0,document.body.scrollHeight)},handleAddLinkWidgetBtn=function(b,c){var d=c,e=d.value;isUrl(e)&&""!=e?(addLink($$linkItem,e,$addLinkWidget),d.value="",d.placeholder="Add a URL to shorten...",d.focus()):(d.placeholder="Enter a valid URL (e.g. http://example.com)",d.value="",d.focus(),removeClass(d,"shake-me"),setTimeout(function(){return addClass(d,"shake-me")},0)),windowScrollable()&&window.scrollTo(0,document.body.scrollHeight)},handleFootBtn=function(b){var c=document.body.className;if("is-presenting"==c)document.body.className="is-editing",setTimeout(function(){$addLinkWidget.style.backgroundColor="#fff"},0),$addLinkWidget.querySelector("input").focus(),addClass($footBtn,"disabled"),$footBtn.disabled=!0,$tutorial.style.display="none",windowScrollable()&&window.scrollTo(0,document.body.scrollHeight);else if("is-editing"==c)document.body.className="is-shortening",addClass($footBtn,"glow"),$footNumLinks.innerText=document.querySelectorAll(".m-list__link-item").length,requestShortUrl(window.location.hostname+encodeQuery({urls:getUrls()}),function(a){200===a.status?$shortenedUrl.innerText=JSON.parse(a.responseText).id.substring(8):$shortenedUrl.innerText="Error! Try again later."}),setTimeout(function(){document.querySelector("#shortened-url-pre").hidden=!1,document.querySelector("#shortened-url-post").hidden=!0},0);else if("is-shortening"==c&&"Error! Try again later."!=$shortenedUrl.innerText){var e="https://"+$shortenedUrl.innerText;$footBtn.dataset.clipboardText=e}};