import Simplelegend from 'facade/simplelegend';

const map = M.map({
  container: 'mapjs',
});

const configSimpleLegend ={
  title: 'Leyenda',
  layers: [
    {
      id: 1,
      name: 'direst_transporte_2018',
      title: 'Sector Transporte y almacenamiento',
      style: 'direst_transporte',
      url: 'http://www.juntadeandalucia.es/institutodeestadisticaycartografia/geoserver-ieca/direst/wms?',
    },
    {
      id: 2,
      name: 'direst_servicios_2018',
      title: 'Sector Servicios sanitarios, educativos y resto de servicios',
      style: 'direst_servicios',
      url: 'http://www.juntadeandalucia.es/institutodeestadisticaycartografia/geoserver-ieca/direst/wms?',
    },
    {
      id: 3,
      name: 'direst_industria_2018',
      title: 'Sector Industria',
      style: 'direst_industria',
      url: 'http://www.juntadeandalucia.es/institutodeestadisticaycartografia/geoserver-ieca/direst/wms?',
    },
    {
      id: 4,
      name: 'direst_hosteleria_2018',
      title: 'Sector Hostelería',
      style: 'direst_hosteleria',
      url: 'http://www.juntadeandalucia.es/institutodeestadisticaycartografia/geoserver-ieca/direst/wms?',
    },
    {
      id: 5,
      name: 'direst_energia_2018',
      title: 'Sector Energía, agua y resíduos',
      style: 'direst_energia',
      url: 'http://www.juntadeandalucia.es/institutodeestadisticaycartografia/geoserver-ieca/direst/wms?',
    },
    {
      id: 6,
      name: 'direst_construccion_2018',
      title: 'Sector Construcción',
      style: 'direst_construccion',
      url: 'http://www.juntadeandalucia.es/institutodeestadisticaycartografia/geoserver-ieca/direst/wms?',
    },
    {
      id: 7,
      name: 'direst_comercio_2018',
      title: 'Sector Comercio',
      style: 'direst_comercio',
      url: 'http://www.juntadeandalucia.es/institutodeestadisticaycartografia/geoserver-ieca/direst/wms?',
    }
  ]
}


const configSimpleLegend1 ={
  title: 'Leyenda',
  layers: [
    {
      id: 1,
      name: 'direst_transporte_2018',
      title: 'Sector Transporte y almacenamiento',
      style: 'direst_transporte',
      url: 'http://www.juntadeandalucia.es/institutodeestadisticaycartografia/geoserver-ieca/direst/wms?',
    }
  ]
}
const mp = new Simplelegend(configSimpleLegend);
//const mp = new Simplelegend(configSimpleLegend1);

map.addPlugin(mp);

mp.on(M.evt.ADDED_TO_MAP, ()=>{
  console.log('se cargo el plugin');
})
