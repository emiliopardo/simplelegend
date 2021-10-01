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
      this.title = config.title
      this.draggable = config.draggable;
      this.layers = config.layers;
      
      this.template = template
    } else {
      this.title = 'Leyenda'
      this.draggable = true;
      this.template = templateClean
    }
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
    let leyenda
    let layer
    if (this.layers) {
      for (let index = 0; index < this.layers.length; index++) {
        layer = this.layers[index]
        // LAYER VECTOR
        if (layer instanceof M.layer.Vector) {
          let legendElement = {
            title: layer.legend,
            name: layer.name,
            //pixel blanco
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII='
          }
          legendList.push(legendElement)
          layer.on(M.evt.LOAD, function () {
            let estilo = layer.getStyle();
            leyenda = estilo.toImage();
            if (leyenda instanceof Promise) {
              leyenda.then(function (response) {
                let image = document.getElementById('img_' + layer.name);
                image.src = response;
              });
            }
          })
          // LAYER RASTER
        } else {
          let legendElement = {
            title: layer.legend,
            name: layer.name,
            image: layer.getLegendURL()
          }
          legendList.push(legendElement)
        }
        console.log(layer)
      }

      this.templateVars = { vars: { title: this.title, draggable: this.draggable, legendElements: legendList } };
    } else{
      this.templateVars = { vars: { title: this.title, draggable: this.draggable } };
    }
  }

  updateLegend(layers) {
    let legendBody = this.legendBody
    legendBody.innerHTML = '';
    let leyenda
    if (Array.isArray(layers)) {
      for (let index = 0; index < layers.length; index++) {
        const layer = layers[index];
        if (layer instanceof M.layer.Vector) {
          layer.on(M.evt.LOAD, function () {
            let estilo = layer.getStyle();
            leyenda = estilo.toImage();
            if (leyenda instanceof Promise) {
              leyenda.then(function (response) {
                legendBody.innerHTML += '<div id="legend_' + layer.name + '" class="simple-legend-content">\n' +
                  '<label class="simple-legend-content-title">' + layer.legend + '</label>\n' +
                  '<img src="' + response + '" alt="' + layer.legend + '" class ="simple-legend-content-image"></img>\n' +
                  '</div>';
              });
              console.log(legendBody)
            }
          })
        } else {
          legendBody.innerHTML += '<div id="legend_' + layer.name + '" class="simple-legend-content">\n' +
            '<label class="simple-legend-content-title">' + layer.legend + '</label>\n' +
            '<img src="' + layer.getLegendURL() + '" alt="' + layer.legend + '" class ="simple-legend-content-image"></img>\n' +
            '</div>';

        }
      }
    } else {
      let layer = layers;
      if (layer instanceof M.layer.Vector) {
        layer.on(M.evt.LOAD, function () {
          let estilo = layer.getStyle();
          leyenda = estilo.toImage();
          if (leyenda instanceof Promise) {
            leyenda.then(function (response) {
              legendBody.innerHTML += '<div id="legend_' + layer.name + '" class="simple-legend-content">\n' +
                '<label class="simple-legend-content-title">' + layer.legend + '</label>\n' +
                '<img src="' + response + '" alt="' + layer.legend + '" class ="simple-legend-content-image"></img>\n' +
                '</div>';
            });
          }
        })
      } else {
        legendBody.innerHTML += '<div id="legend_' + layer.name + '" class="simple-legend-content">\n' +
          '<label class="simple-legend-content-title">' + layer.legend + '</label>\n' +
          '<img src="' + layer.getLegendURL() + '" alt="' + layer.legend + '" class ="simple-legend-content-image"></img>\n' +
          '</div>';
      }
    }
  }
}
