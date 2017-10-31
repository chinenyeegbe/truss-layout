import TrussLayout from './manager.js';
import {_addStyle} from './utils.js';

let layout = (function () {
    var attachEvent = document.attachEvent;
    var isIE = navigator.userAgent.match(/Trident/);
    var requestFrame = (function () {
        var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
            function (fn) {
                return window.setTimeout(fn, 20);
            };
        return function (fn) {
            return raf(fn);
        };
    })();

    var cancelFrame = (function () {
        var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
            window.clearTimeout;
        return function (id) {
            return cancel(id);
        };
    })();

    function resizeListener(e) {
        var win = e.target || e.srcElement;
        if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
        win.__resizeRAF__ = requestFrame(function () {
            var trigger = win.__resizeTrigger__;
            trigger.__resizeListeners__.forEach(function (fn) {
                fn.call(trigger, e);
            });
        });
    }

    function objectLoad() {
        this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
        this.contentDocument.defaultView.addEventListener('resize', resizeListener);
    }

    let addResizeListener = function (element, fn) {
        if (!element.__resizeListeners__) {
            element.__resizeListeners__ = [];
            if (attachEvent) {
                element.__resizeTrigger__ = element;
                element.attachEvent('onresize', resizeListener);
            } else {
                if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
                var obj = element.__resizeTrigger__ = document.createElement('object');
                obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
                obj.__resizeElement__ = element;
                obj.onload = objectLoad;
                obj.type = 'text/html';
                if (isIE) element.appendChild(obj);
                obj.data = 'about:blank';
                if (!isIE) element.appendChild(obj);
            }
        }
        element.__resizeListeners__.push(fn);
    };

    let removeResizeListener = function (element, fn) {
        element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
        if (!element.__resizeListeners__.length) {
            if (attachEvent) element.detachEvent('onresize', resizeListener);
            else {
                element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
                element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
            }
        }
    };

    return {
        addEvent: addResizeListener,
        removeEvent: removeResizeListener
    };
})();
// export  TrussLayout;
function _init(_conf) {
    let elem = document.createElement('div'),
        instance,
        conf = {},
        configuration = parseConfig(_conf || {}),
        _parent = configuration.container;
    // set element height and width
    elem.style.height = '100%';
    elem.style.width = '100%';
    //elem.style.margin = '5px';
    elem.style.position = 'relative';
    elem.id = 'trussLayoutContainer';

    if (configuration.enableContainerDrag) {
        let startX, 
            startY, 
            startWidth, 
            startHeight,
            initDrag = (e) =>{
                startX = e.clientX;
                startY = e.clientY;
                startWidth = parseInt(document.defaultView.getComputedStyle(elem).width, 10);
                startHeight = parseInt(document.defaultView.getComputedStyle(elem).height, 10);
                document.documentElement.addEventListener('mousemove', doDrag, false);
                document.documentElement.addEventListener('mouseup', stopDrag, false);
            },
            doDrag = (e) => {
                elem.style.width = (startWidth + e.clientX - startX) + 'px';
                elem.style.height = (startHeight + e.clientY - startY) + 'px';
            },
            stopDrag = () => {
                document.documentElement.removeEventListener('mousemove', doDrag, false);
                document.documentElement.removeEventListener('mouseup', stopDrag, false);
            },
            resizerStyle =  {
                width: '7px',
                height: '7px',
                background: 'blue',
                position: 'absolute',
                right: '0',
                bottom: '0',
                borderRadius: '50% 0 0 0',
                cursor: 'se-resize'
            };

        elem.addEventListener('click', function init() {
            elem.removeEventListener('click', init, false);
            elem.className = elem.className + ' resizable';
            let resizer = document.createElement('div');
            // resizer.className = 'resizer';
            _addStyle(resizer, resizerStyle);

            elem.appendChild(resizer);
            resizer.addEventListener('mousedown', initDrag, false);
        }, false);

        layout.addEvent(elem, function (e) {
            let newHeight = e.target.innerHeight,
                newWidth = e.target.innerWidth,
                ch = (conf.height - newHeight),
                cw = (conf.width - newWidth);
    
            instance.resizeLayout(ch ? (-1 * ch) : 0, cw ? (-1 * cw) : 0);
            conf.height = newHeight;
            conf.width = newWidth;
        });
    }

    _parent.appendChild(elem);
    // creating instance of truss layout
    instance = new TrussLayout(elem);
    instance.setConfigaration(configuration);

    conf.height = elem.offsetHeight;
    conf.width = elem.offsetWidth;

    return instance;
}

function parseConfig (conf) {
    let config = {
            background : '#ccc',
            containerBackground : '#fff',
            sliderBackground : '#F2F2F2',
            sliderHoverColor: '#d7dcea',
            buttonTextColor: '#fff',
            buttonBackgroung: '#4679BD',
            container : document.getElementsByTagName('body')[0],
            enableContainerDrag: true
        },
        temp = {};

    // user config merged with the default config
    for(let i in config) {
        if(conf.hasOwnProperty(i)) {
            temp[i] = conf[i];
        } else {
            temp[i] = config[i];
        }
    }  

    return temp;
}

export {
    _init as init
};

