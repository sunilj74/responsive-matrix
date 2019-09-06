function goToUrl(){
    let url = myUrl.value;
    let urlLower = url.toLowerCase();
    if(url.length>0){
      if (urlLower.substr(0, 7) != 'http://' && urlLower.substr(0, 8) != 'https://') {
        url = 'http://' + url;
        myUrl.value = url;
      }
    }
    for (let i = 0; i < LAYOUTS.length; i++) {
      let element = document.querySelector("#" + LAYOUTS[i].boxIdWeb);
      if (element != null) {
        element.src = url;
      }
      element = document.querySelector("#" + LAYOUTS[i].boxIdWebFlipped);
      if (element != null) {
        element.src = url;
      }
    }
}

function setZoom(zoom){
    mySlider.value = zoom;
    myZoom.value = zoom;
    adjustScale();
}

function copyUrl(id){
    let element = document.querySelector("#" + id);
    if (element != null) {
      navigator.clipboard.writeText(element.src);
    }
}

function navigateView(backward, id){
    let element = document.querySelector("#"+id);
    if(element!=null){
      if(backward){
        element.goBack();
      }
      else{
        element.goForward();
      }
    }
}

function adjustScale() {
    let zoom = mySlider.value / 100;
    myContainer.style.transform = `scale(${zoom})`;
    let width = (myContainerOuter.offsetWidth / zoom) - 50;
    myContainer.style.width = `${width}px`;
}

function setupDevice(layout, id, rotated, url){
    let width = layout.width;
    let height = layout.height;
    if(rotated){
      width = layout.height;
      height = layout.width;
    }
    let wvstyle = `min-width:${layout.width}px; width:${width}px; height:${height}px;`;
    let device = `
    <div class="my-device" id="${id}">
        <div class="my-title-bar">
          <div class="my-title">
            ${layout.name}
          </div>
          <button class="my-title-button" onClick="copyUrl('wv_${id}')">
            <i class="material-icons my-title-icon">clear_all</i>
          </button>
          <button class="my-title-button" onClick="navigateView(true,'wv_${id}')">
            <i class="material-icons my-title-icon">arrow_left</i>
          </button>
          <button class="my-title-button" onClick="navigateView(false,'wv_${id}')">
            <i class="material-icons my-title-icon">arrow_right</i>
          </button>
        </div>
        <webview 
          id="wv_${id}" 
          useragent="Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36" 
          class="web-view" 
          style="${wvstyle}" 
          src="${url}">
        </webview>
    </div>
    `;

    return device;
}

function toggle(event, id){
  let device = document.querySelector("#"+id);
  if(device!=null){
    let display = event.target.checked ? "flex" : "none";
    device.style.display = display;
  }
}

function setupDevices() {
    let allLayouts = LAYOUTS;
    let url = myUrl.value;
    let myInput = document.querySelector("#myOptions");
    let os = myOS.value;
    let type = myType.value;
    let flipped = myFlipped.value;

    let sb = []; 
    let content = [];
    for (let i = 0; i < allLayouts.length; i++) {
        let layout = allLayouts[i];
        if(os.length>0 && layout.os != os) continue;
        if (layout.type != type) continue;
        let id = `device_${i}`;
        content.push(setupDevice(layout, id, "Y"==flipped, url));
        sb.push(`<div><label class='my-label'><input type='checkbox' checked onClick='toggle(event, "${id}")'>${layout.name}</label></div>`);
        layout.boxId = id;
        layout.boxIdWeb = "wv_"+id;
    }
    document.querySelector("#myContainer").innerHTML = content.join("\n");
    myInput.innerHTML = sb.join("");
}


let myUrl = document.getElementById("myUrl");
myUrl.addEventListener("keyup", function(event){
    if(event.keyCode === 13){
      goToUrl();
    }
});
let myContainerOuter = document.querySelector("#myContainerOuter");
let myContainer = document.querySelector("#myContainer");
let myZoom = document.getElementById("myZoom");
let mySlider = document.getElementById("mySlider");
let myOS = document.getElementById("myOS");
let myType = document.getElementById("myType");
let myFlipped = document.getElementById("myFlipped");

myOS.addEventListener("change", function (event) {
  setupDevices();
});

myType.addEventListener("change", function(event) {
  setupDevices();
});

myFlipped.addEventListener("change", function(event) {
  setupDevices();
});

myZoom.addEventListener("keyup", function(event){
    if(event.keyCode===13){
      mySlider.value = myZoom.value;
      adjustScale();
    }

});

mySlider.addEventListener("change", function(event){
    adjustScale();
});

mySlider.addEventListener("input", function (event) {
  myZoom.value = mySlider.value;
});
setupDevices();
adjustScale();
