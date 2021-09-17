/* eslint-disable no-console */
/**
 * @module M/control/SimplelegendControl
 */

import SimplelegendImplControl from 'impl/simplelegendcontrol';
import template from 'templates/simplelegend';

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

    this.title = config.title;
    this.layers = config.layers;
    this.draggable = config.draggable;
    this.pos1 = 0;
    this.pos2 = 0;
    this.pos3 = 0;
    this.pos4 = 0;
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
      const html = M.template.compileSync(template, this.templateVars);
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
    for (let index = 0; index < this.layers.length; index++) {
      const layer = this.layers[index];
      let legendElement = {
        title: layer.title,
        name: layer.name,
        image: layer.url + 'service=WMS&version=1.1.1&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=' + layer.name + '&style=' + layer.style
      }
      legendList.push(legendElement)

    }
    this.templateVars = { vars: { title: this.title, draggable: this.draggable, legendElements: legendList } };
  }

  updateLegend(layers) {
    if (Array.isArray(layers)) {
      this.legendBody.innerHTML = '';
      console.log('es array');
      for (let index = 0; index < layers.length; index++) {
        const layer = layers[index];
        let imageURL = layer.url + 'service=WMS&version=1.1.1&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=' + layer.options.params.layers + '&style=' + layer.options.params.styles

        this.legendBody.innerHTML += '<div id="legend_' + layer.name + '" class="simple-legend-content">\n' +
          '<label class="simple-legend-content-title">' + layer.legend + '</label>\n' +
          '<img src="' + imageURL + '" alt="' + layer.legend + '" class ="simple-legend-content-image"></img>\n' +
          '</div>';

      }
    } else {
      let layer = layers;
      console.log('no es array')
      this.legendBody.innerHTML = '';
      let imageURL = layer.url + 'service=WMS&version=1.1.1&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=' + layer.options.params.layers + '&style=' + layer.options.params.styles

      this.legendBody.innerHTML += '<div id="legend_' + layer.name + '" class="simple-legend-content">\n' +
        '<label class="simple-legend-content-title">' + layer.legend + '</label>\n' +
        '<img src="' + imageURL + '" alt="' + layer.legend + '" class ="simple-legend-content-image"></img>\n' +
        '</div>';
    }

    //console.log(layers)





  }

}
