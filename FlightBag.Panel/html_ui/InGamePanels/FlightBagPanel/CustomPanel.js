var DEBUG = false;
var baseURL = 'https://flightbag.flighttracker.tech';
//var baseURL = 'https://localhost:44305';
//var baseURL = 'https://localhost:5001';

var vrMode = false;

class IngamePanelFlightBagPanel extends HTMLElement {

    connectedCallback() {
        Include.addScript("/JS/simvar.js", () => {
            if (DEBUG) {
                setTimeout(() => {
                    this.enableDebug();
                }, 1000);
            } else {
                setTimeout(() => {
                    this.initialize();
                }, 1000);
            }
        });
    }

    initialize() {
        var iframe = document.querySelector("#CustomPanelIframe");

        ButtonReload.addEventListener("click", () => {
            this.load(iframe);
        });

        ButtonVR.addEventListener("click", () => {
            vrMode = !vrMode;
            this.load(iframe);
        })

        this.load(iframe);
    }

    load(iframe) {
        if (iframe) {
            var url = baseURL + "?mode=MSFS";
            if (vrMode) {
                url += "&vr=true";
            }
            iframe.src = url;
        }
    }

    enableDebug() {
        if (typeof g_modDebugMgr != "undefined") {
            this.initialize();
            this.addDebugControls()
        }
        else {
            Include.addScript("/JS/debug.js", () => {
                if (typeof g_modDebugMgr != "undefined") {
                    this.initialize();
                    this.addDebugControls();
                } else {
                    setTimeout(() => {
                        this.enableDebug();
                    }, 2000);
                }
            });
        }
    }

    addDebugControls() {
        g_modDebugMgr.AddConsole(null);
        g_modDebugMgr.AddDebugButton("Source", () => {
            console.log('Source');
            console.log(window.document.documentElement.outerHTML);
        });
    }
}
window.customElements.define("ingamepanel-flightbag", IngamePanelFlightBagPanel);
checkAutoload();