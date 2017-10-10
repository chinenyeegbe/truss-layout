import TrussLayout from './manager.js';
// export  TrussLayout;
function _init (_parent) {
    !_parent && (_parent = document.getElementsByTagName('body')[0]);
    return new TrussLayout(_parent);
}

export {_init as init};
