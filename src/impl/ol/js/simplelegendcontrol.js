/* eslint-disable no-console */

/**
 * @module M/impl/control/SimplelegendControl
 */
export default class SimplelegendControl extends M.impl.Control {
  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {HTMLElement} html of the plugin
   * @api stable
   */
  addTo(map, html) {

    // super addTo - don't delete
    super.addTo(map, html);
  }

  getMapId(map){

    //console.log(map.getImpl().map_.values_.target)
    const olMap = map.getImpl();

    return olMap.map_.values_.target;

  }


}
