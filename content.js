function goToUrl(){
    let url = myUrl.value;
    let urlLower = url.toLowerCase();
    if (urlLower.substr(0, 7) != 'http://' && urlLower.substr(0, 8) != 'https://') {
      url = 'http://' + url;
      myUrl.value = url;
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
            ${layout.title}
          </div>
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

function setupDevices(allLayouts, url) {
    let myInput = document.querySelector("#myOptions");
    let sb = []; 
    let content = [];
    for (let i = 0; i < allLayouts.length; i++) {
        let layout = allLayouts[i];
        let id = `device_${i}`;
        content.push(setupDevice(layout, id, false, url));
        sb.push(`<div><label class='my-checkbox-label'><input type='checkbox' checked onClick='toggle(event, "${id}")'>${layout.title}</label></div>`);
        layout.boxId = id;
        layout.boxIdWeb = "wv_"+id;
        id = id + "_r";
        layout.boxIdFlipped = id;
        layout.boxIdWebFlipped = "wv_" + id;
        content.push(setupDevice(layout, id, true, url));
        sb.push(`<div><label class='my-checkbox-label'><input type='checkbox' checked onClick='toggle(event, "${id}")'>${layout.title} (flipped)</label></div>`);
        sb.push('<br/>');
    }
    document.querySelector("#myContainer").innerHTML = content.join("\n");
    myInput.innerHTML = sb.join("");
}

var LAYOUTS = [
  {
    name: "Galaxy S5",
    width: 360,
    height: 640,
    title: "Galaxy S5"
  },
  {
    name: "Pixel 2",
    width: 411,
    height: 731,
    title: "Pixel 2"
  },
  {
    name: "Pixel 2 XL",
    width: 411,
    height: 823,
    title: "Pixel 2 XL"
  },
  {
    name: "iPhone 5/SE",
    width: 320,
    height: 568,
    title: "iPhone 5/SE"
  },
  {
    name: "iPhone 6/7/8",
    width: 375,
    height: 667,
    title: "iPhone 6/7/8"
  },
  {
    name: "iPhone 6/7/8 Plus",
    width: 414,
    height: 736,
    title: "iPhone 6/7/8 Plus"
  },
  {
    name: "iPhone X",
    width: 375,
    height: 812,
    title: "iPhone X"
  },
  {
    name: "iPad",
    width: 1024,
    height: 768,
    title: "iPad"
  },
  {
    name: "iPad Pro",
    width: 1366,
    height: 1024,
    title: "iPad Pro"
  }
];

setupDevices(LAYOUTS, "");


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
adjustScale();
