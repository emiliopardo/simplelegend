/* eslint-disable no-console */
/**
 * @module M/control/SimplelegendControl
 */

import SimplelegendImplControl from 'impl/simplelegendcontrol';
import template from 'templates/simplelegend';
import templateClean from 'templates/simplelegendClean';

export default class SimplelegendControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(config) {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(SimplelegendImplControl)) {
      M.exception('La implementación usada no puede crear controles SimplelegendControl');
    }
    // 2. implementation of this control
    const impl = new SimplelegendImplControl();
    super(impl, 'Simplelegend');

    this.pos1 = 0;
    this.pos2 = 0;
    this.pos3 = 0;
    this.pos4 = 0;
    
    if (config) {
      this.config = config;
      this.title = config.title
      this.draggable = config.draggable;
      this.layers = config.layers;

      this.template = template
    } else {
      this.title = 'Leyenda'
      this.draggable = true;
      this.template = templateClean
    }
    this.legendIsOpen = true;
    this.setLegend();

  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  createView(map) {
    return new Promise((success, fail) => {
      const html = M.template.compileSync(this.template, this.templateVars);
      // Añadir código dependiente del DOM
      this.element = html;
      this.addEvents(html);
      success(html);
    });
  }

  addEvents(html) {

    this.legendShowHide = html.querySelector('button#legend-Show-Hide');
    this.legendTitle = html.querySelector('div#simple-legend-title');
    this.legendBody = html.querySelector('div#simple-legend-body');

    if (this.draggable) {
      // console.log('es draggable')
      this.legendTitle.style.cursor = 'move';
    } else {
      // console.log('no es dragable')
      this.legendTitle.style.cursor = 'initial';
    }

    let mapId = this.getImpl().getMapId(this.map_);
    // QuerySelectors

    this.mapDiv = document.getElementById(mapId);
    this.legendPanel = document.getElementsByClassName('m-legend-panel')[0];

    // EventListener
    html.addEventListener('dragstart', (e) => {
      //console.log('dragstart');
      // get the mouse cursor position at startup:
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;
    })

    this.mapDiv.addEventListener('dragover', (e) => {
      //console.log('dragover');
      // calculate the new cursor position:
      this.pos1 = this.pos3 - e.clientX;
      this.pos2 = this.pos4 - e.clientY;
    })

    html.addEventListener('dragend', (e) => {
      //console.log('dragend')
      html.style.top = (html.offsetTop - this.pos2) + "px";
      html.style.left = (html.offsetLeft - this.pos1) + "px";
    })

    this.legendShowHide.addEventListener('click',(e)=>{
      console.log('Mostar Ocultar Leyenda');
      this.showHideLegend();
    })
  }


  /**
   * This function gets activation button
   *
   * @public
   * @function
   * @param {HTML} html of control
   * @api stable
   */
  getActivationButton(html) {
    return html.querySelector('.m-simplelegend button');
  }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api stable
   */
  equals(control) {
    return control instanceof SimplelegendControl;
  }

  // Add your own functions
  setLegend() {
    let legendList = new Array()
    let legendElement
    if (this.layers) {
      for (let index = 0; index < this.layers.length; index++) {
        let layer = this.layers[index]
        // LAYER VECTOR
        if (this.checkLayerTypeVector(layer)) {
          legendElement = {
            title: layer.legend,
            name: layer.name,
            image: this.vectorLegend(layer)
          }
          // LAYER RASTER
        } else {
          legendElement = {
            title: layer.legend,
            name: layer.name,
            image: this.rasterLegend(layer)
          }
        }
        legendList.push(legendElement)
      }
      this.templateVars = { vars: { title: this.title, draggable: this.draggable, legendElements: legendList } };
    } else {
      this.templateVars = { vars: { title: this.title, draggable: this.draggable } };
    }
  }

  updateLegend(layers) {
    let legendList = new Array()
    let legendElement

    if (Array.isArray(layers)) {
      for (let index = 0; index < layers.length; index++) {
        let layer = layers[index]
        legendElement = {
          title: layer.legend,
          name: layer.name,
          image: null
        }
        legendList.push(legendElement)
      }
    } else {
      let layer = layers;
      legendElement = {
        title: layer.legend,
        name: layer.name,
        image: null
      }

      legendList.push(legendElement)
    }
    this.template = template
    this.templateVars = { vars: { title: this.title, draggable: this.draggable, legendElements: legendList } };
    this.MakeQuerablePromise(this.createView()).then((data) => {
      let simpleLegendContainer = document.getElementById('simple-legend-container')
      simpleLegendContainer.innerHTML = data.innerHTML;
      if (Array.isArray(layers)) {
        for (let index = 0; index < layers.length; index++) {
          const layer = layers[index];
          this.updateImage(layer);

        }
      } else {
        let layer = layers;
        this.updateImage(layer);
      }
      this.legendShowHide = document.querySelector('button#legend-Show-Hide');
      this.legendShowHide.addEventListener('click',(e)=>{
        this.showHideLegend();
      })
    })
  }

  showHideLegend(){

    let legendBody = document.querySelector('div#simple-legend-body');
    if (this.legendIsOpen){
      legendBody.style.display = 'none';
      this.legendIsOpen = false;
      console.log(this.legendShowHide.classList)
      this.legendShowHide.classList.remove('g-cartografia-menos2')
      this.legendShowHide.classList.add('g-cartografia-mas2')
      
    }else {
      legendBody.style.display = 'block';
      this.legendIsOpen = true;
      // this.legendShowHide.
      console.log(this.legendShowHide.classList)
      this.legendShowHide.classList.remove('g-cartografia-mas2')
      this.legendShowHide.classList.add('g-cartografia-menos2')
    }
    

  }

  updateImage(layer) {
    if (this.checkLayerTypeVector(layer)) {
      this.vectorLegend(layer)
    } else {
      this.rasterLegend(layer)
    }
  }

  MakeQuerablePromise(promise) {
    // Don't modify any promise that has been already modified.
    if (promise.isFulfilled) return promise;
    // Set initial state
    var isPending = true;
    var isRejected = false;
    var isFulfilled = false;
    // Observe the promise, saving the fulfillment in a closure scope.
    var result = promise.then(
      function (v) {
        isFulfilled = true;
        isPending = false;
        return v;
      },
      function (e) {
        isRejected = true;
        isPending = false;
        throw e;
      }
    );
    result.isFulfilled = () => { return isFulfilled; };
    result.isPending = () => { return isPending; };
    result.isRejected = () => { return isRejected; };
    return result;
  }

  rasterLegend(layer) {
    layer.on(M.evt.LOAD, this.getRasterLengendImage(layer))
  }

  vectorLegend(layer) {
    layer.on(M.evt.LOAD, this.getVectorLegendImage(layer))
  }

  getRasterLengendImage(layer) {
    let imgLegend = layer.getLegendURL();
    if (imgLegend instanceof Promise) {
      let myPromise = this.MakeQuerablePromise(imgLegend);
      myPromise.then((data) => {
        let img = document.getElementById('img_' + layer.name)
        img.src = data;
      })
    } else {
      let img = document.getElementById('img_' + layer.name)
      img.src = layer.getLegendURL();
    }
  }

  getVectorLegendImage(layer) {
    layer.on(M.evt.CHANGE_STYLE,()=>{
    let estilo = layer.getStyle();
    let imgLegend = estilo.toImage();
    if (imgLegend instanceof Promise) {
      let myPromise = this.MakeQuerablePromise(imgLegend);
      myPromise.then((data) => {
        let img = document.getElementById('img_' + layer.name)
        img.src = data;
      })
    } else {
      let img = document.getElementById('img_' + layer.name);
      img.src = imgLegend;

    }
  })
  }

  checkLayerTypeVector(layer) {
    let type = false
    if (layer instanceof M.layer.Vector) {
      type = true
    }
    return type
  }
}
