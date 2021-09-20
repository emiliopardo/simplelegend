import Simplelegend from 'facade/simplelegend';

const map = M.map({
  container: 'mapjs',
});

map.addControls(['ScaleLine', 'Mouse', 'panzoombar', 'layerSwitcher']);


/*INICIO  TEST RASTER LAYER */

let layer = new M.layer.WMS({
  url: 'http://www.juntadeandalucia.es/institutodeestadisticaycartografia/geoserver-ieca/direst/wms?',
  name: 'direst_comercio_2018',
  legend: 'Sector Comercio',
  transparent: true
}, {
  params: {
    styles: 'direst_comercio',
    layers: 'direst_comercio_2018',
  }
});

let layer1 = new M.layer.WMS({
  url: 'http://www.juntadeandalucia.es/institutodeestadisticaycartografia/geoserver-ieca/direst/wms?',
  name: 'direst_transporte_2018',
  legend: 'Sector Transporte y almacenamiento',
  transparent: true
}, {
  params: {
    styles: 'direst_transporte',
    layers: 'direst_transporte_2018',
  }
});

let layer2 = new M.layer.WMS({
  url: 'http://www.juntadeandalucia.es/institutodeestadisticaycartografia/geoserver-ieca/direst/wms?',
  name: 'direst_construccion_2018',
  legend: 'Sector Construccion',
  transparent: true
}, {
  params: {
    styles: 'direst_construccion',
    layers: 'direst_construccion_2018',
  }
});

/*FIN TEST RASTER LAYER */


/*INICIO  TEST VECTOR LAYER */


//Capa ise:Agricultura

let agricultura = new M.layer.WFS({
  name: "Agricultura_Ganaderia_Pesca",
  url: "https://www.ideandalucia.es/services/ise/wfs?",
  namespace: "ise",
  legend: "Centros y equipamientos: Agricultura, ganadería y pesca",
  geometry: 'MPOINT',
  extract: true
}, {
  vendor: {
    getFeature: {
      'propertyName': 'Nombre,Tipo,Dependencia,Nivel1,Nivel2,Titularidad,Horario,Direccion,Edificio,Localidad,Municipio,Provincia,Telefono,Fax,Correo_electronico,web,geom'
    }
  }
});

//Asignación de Iconos

let agriculturaOCA = new M.style.Point({
  icon: {
    src: 'https://www.juntadeandalucia.es/institutodeestadisticaycartografia/mapa_equipamientos/geolocalizacion/iconos/Equipamientos/Agricultura/oca.png'
  }
});

let agriculturaAgroclimatica = new M.style.Point({
  icon: {
    src: 'https://www.juntadeandalucia.es/institutodeestadisticaycartografia/mapa_equipamientos/geolocalizacion/iconos/Equipamientos/Agricultura/agroclimatica.png'
  }
});
let agriculturaGrupodr = new M.style.Point({
  icon: {
    src: 'https://www.juntadeandalucia.es/institutodeestadisticaycartografia/mapa_equipamientos/geolocalizacion/iconos/Equipamientos/Agricultura/9_61_gdr.png'
  }
});

//Simbología categorizada

let categoriaAgricultura = new M.style.Category("Nivel2", {
  "Oficinas comarcales y locales agrarias": agriculturaOCA,
  "Información agroclimática": agriculturaAgroclimatica,
  "Grupos de Desarrollo Rural": agriculturaGrupodr
});

//Simbología Cluster
let clusterOptionsAgricultura = {
  ranges: [{
    min: 2,
    max: 100,
    style: new M.style.Point({
      fill: {
        color: 'f28d4e',
        opacity: 1
      },
      stroke: {
        color: '#FFFFFF'
      },
      radius: 12
    })
  }
  ],
  animated: true,
  hoverInteraction: false,
  displayAmount: true,
  selectedInteraction: true,
  maxFeaturesToSelect: 2,
  distance: 100,
  label: {
    font: 'bold 12px Comic Sans MS',
    color: '#FFFFFF'
  }
};

//Parámetros Opcionales Cluster
let vendorParameters = {
  distanceSelectFeatures: 25,
  convexHullStyle: {
    fill: {
      color: '#0000FF',
      opacity: 1
    },
    stroke: {
      color: '#0000FF',
      width: 1
    }
  }
}

//Creación del estilo Cluster
let clusterStyleAgricultura = new M.style.Cluster(clusterOptionsAgricultura, vendorParameters);

//Creación del estilo composite
let compositeAgricultura = categoriaAgricultura.add(clusterStyleAgricultura);

//asignación del estilo final
agricultura.setStyle(compositeAgricultura);


/*FIN  TEST VECTOR LAYER */



const configSimpleLegend1 = {
  title: 'Leyenda',
  draggable: true,
  layers: [layer
  ]
}


const configSimpleLegend2 = {
  title: 'Leyenda',
  draggable: true,
  layers: [layer, layer1, layer2
  ]
}


const configSimpleLegend3 = {
  title: 'Leyenda',
  draggable: true,
  layers: [agricultura
  ]
}


const configSimpleLegend4 = {
  title: 'Leyenda',
  draggable: true,
  layers: [layer,agricultura
  ]
}



// TEST 1 CAPA WMS

// map.addLayers([layer]);
// const mp = new Simplelegend(configSimpleLegend1);


// TEST 2 ARRAY CAPAS WMS

// map.addLayers([layer, layer1, layer2]);
// const mp = new Simplelegend(configSimpleLegend2);


//TEST 3 CAPA VECTOR

// const mp = new Simplelegend(configSimpleLegend3);
// map.addLayers([agricultura]);

//TEST 4 ARRAY CAPA RASTER Y VECTOR

const mp = new Simplelegend(configSimpleLegend4);
map.addLayers([layer,agricultura]);



map.addPlugin(mp);

// TEST ACTUALIZACIÓN

// setTimeout(() => { 
//   map.removeLayers(agricultura)
//   map.addLayers([layer]);
//   mp.updateLegend(layer) }
//   , 4000);

// setTimeout(() => {
//   map.removeLayers(layer)
//   map.addLayers([layer1, layer2]);
//   mp.updateLegend([layer1, layer2]);
// }
//   , 8000);
