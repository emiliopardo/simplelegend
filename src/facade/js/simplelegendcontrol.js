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
    // QuerySelectors

    // EventListener
    html.addEventListener('mousedown', this.mouseDown)
    document.addEventListener('mouseup', this.mouseUp)
    document.addEventListener('mousemove', this.mousePosition)
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
  setLegend(){
    let legendList = new Array()
    for (let index = 0; index < this.layers.length; index++) {
      const layer = this.layers[index];
      let legendElement = {
        title :layer.title,
        name: layer.name,
        image: layer.url + 'service=WMS&version=1.1.1&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=' + layer.name + '&style=' + layer.style
      }

      legendList.push(legendElement)


      
    }

    console.log(legendList);


    
    this.templateVars = { vars: { title: this.title, layerTitle: this.layers[0].title, layerlegendImage: this.layers[0].url + 'service=WMS&version=1.1.1&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=' + this.layers[0].name + '&style=' + this.layers[0].style } };

    this.templateVars = { vars: { title: this.title, legendElements: legendList} };
    
  }

}
