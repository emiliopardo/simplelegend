import M$plugin$Simplelegend from '/home/epardo/proyectos/simplelegend/src/facade/js/simplelegend';
import M$control$SimplelegendControl from '/home/epardo/proyectos/simplelegend/src/facade/js/simplelegendcontrol';
import M$impl$control$SimplelegendControl from '/home/epardo/proyectos/simplelegend/src/impl/ol/js/simplelegendcontrol';

if (!window.M.plugin) window.M.plugin = {};
if (!window.M.control) window.M.control = {};
if (!window.M.impl) window.M.impl = {};
if (!window.M.impl.control) window.M.impl.control = {};
window.M.plugin.Simplelegend = M$plugin$Simplelegend;
window.M.control.SimplelegendControl = M$control$SimplelegendControl;
window.M.impl.control.SimplelegendControl = M$impl$control$SimplelegendControl;
