const dark14 = '#393939';
const dark16 = '#494949';
const dark18 = '#505050';

const darkStyleOverride = {
    'layers': [
        {
            'id': 'background',
            'paint': { 'background-color': '#464646' }
        },
        {
            'id': 'region_water_index',
            'paint': { 'fill-color': '#414550' }
        },
        {
            'id': 'region-bathymetry-index',
            'paint': { 'fill-color': '#040c18' }
        },
        {
            'id': 'region_island_index',
            'paint': { 'fill-color': '#565656' }
        },
        {
            'id': 'region-river-index',
            'paint': { 'fill-color': '#414550' }
        },
        {
            'id': 'fill-vnairport-index',
            'paint': { 'fill-color': '#626473' }
        },
        {
            'id': 'region_vnbuilding_index',
            'paint': { 'fill-color': '#555555' }
        },
        {
            'id': 'fill-vnbuilding-school-index',
            'paint': { 'fill-color': '#e5dec9' }
        },
        {
            'id': 'fill-vnbuilding-hospital-index',
            'paint': { 'fill-color': '#ffe2e2' }
        },
        {
            'id': 'fill-vnbuilding-park-index',
            'paint': { 'fill-color': '#C8DF9F' }
        },
        {
            'id': 'fill-vnbusstation-index',
            'paint': { 'fill-color': '#3f7b72' }
        },
        {
            'id': 'fill-vnpark-index',
            'paint': { 'fill-color': '#5c6b4d' }
        },
        {
            'id': 'line-vntunnel-hemlo-index',
            'paint': {
                'line-color': {
                    'base': 1, 'stops': [
                        [0, '#BBB'],
                        [14, '#BBB'],
                        [15, '#999']
                    ]
                }
            }
        },
        {
            'id': 'line-vntunnel-huyenlo-index',
            'paint': {
                'line-color': {
                    'base': 1,
                    'stops': [
                        [0, '#BBB'],
                        [14, '#BBB'],
                        [15, '#999']
                    ]
                }
            }
        },
        {
            'id': 'line-vntunnel-tinhlo-index',
            'paint': { 'line-color': '#2a2a2a' }
        },
        {
            'id': 'line-vntunnel-huyenlo-index',
            'paint': {
                'line-color': {
                    'base': 1, 'stops': [
                        [0, '#F2822C'],
                        [11, '#F2822C'],
                        [12, 'hsl(26, 87%, 34%)']
                    ]
                }
            }
        },
        {
            'id': 'line-vntunnel-caotoc-index',
            'add': true
        },
        {
            'id': 'fill-vntunnel-hemlo-index',
            'paint': { 'line-color': '#fff', 'line-opacity': 0.5 }
        },
        {
            'id': 'fill-vntunnel-huyenlo-index',
            'paint': { 'line-color': '#fff', 'line-opacity': 0.5 }
        },
        {
            'id': 'fill-vntunnel-tinhlo-index',
            'paint': {
                'line-color': '#5a5a5a',
                'line-opacity': 0.5
            }
        },
        {
            'id': 'fill-vntunnel-quoclo-index',
            'paint': { 'line-color': '#F2822C', 'line-opacity': 0.5 }
        },
        {
            'id': 'fill-vntunnel-caotoc-index',
            'add': true
        },
        {
            'id': 'line-vnferry-hemlo-index',
            'paint': { 'line-color': '#FFF' }
        },
        {
            'id': 'line-vnferry-huyenlo-index',
            'paint': { 'line-color': '#FFF' }
        },
        {
            'id': 'line-vnferry-tinhlo-index',
            'paint': { 'line-color': '#E6B100' }
        },
        {
            'id': 'line-vnferry-quoclo-index',
            'paint': { 'line-color': '#F2822C' }
        },
        {
            'id': 'line-vnferry-caotoc-index',
            'paint': { 'line-color': '#943232' }
        },
        {
            'id': 'line-vnroad-hemlo-index',
            'paint': { 'line-color': '#3d3d3d' }
        },
        {
            'id': 'line-vnroad-huyenlo-index',
            'paint': { 'line-color': '#373737' }
        },
        {
            'id': 'line-vnroad-tinhlo-index',
            'paint': { 'line-color': '#393939' }
        },
        {
            'id': 'line-vnroad-quoclo-index',
            'paint': {
                'line-color': {
                    'base': 1,
                    'stops': [
                        [0, '#F2822C'],
                        [11, '#F2822C'],
                        [12, 'hsl(26, 87%, 34%)']
                    ]
                }
            }
        },
        {
            'id': 'line-vnroad-caotoc-index',
            'paint': {
                'line-color': {
                    'base': 1,
                    'stops': [
                        [0, '#cc3737'],
                        [11, '#cc3737'],
                        [12, '#943232']
                    ]
                }
            }
        },
        {
            'id': 'fill-vnroad-hemlo-index',
            'paint': { 'line-color': dark18 }
        },
        {
            'id': 'fill-vnroad-huyenlo-index',
            'paint': {
                'line-color': {
                    'stops': [
                        [16, dark16],
                        [18, dark18]
                    ]
                }
            }
        },
        {
            'id': 'fill-vnroad-tinhlo-index',
            'paint': {
                'line-color': {
                    'stops': [
                        [14, dark14],
                        [16, dark16],
                        [18, dark18]
                    ]
                }
            }
        },
        {
            'id': 'fill-vnroad-quoclo-index',
            'paint': { 'line-color': '#F2822C' }
        },
        {
            'id': 'fill-vnroad-caotoc-index',
            'paint': {
                'line-color': '#cc3737'
            }
        },
        {
            'id': 'line-vnbridge-hemlo-index',
            'paint': { 'line-color': '#2a2a2a' }
        },
        {
            'id': 'line-vnbridge-huyenlo-index',
            'paint': { 'line-color': '#2a2a2a' }
        },
        {
            'id': 'line-vnbridge-tinhlo-index',
            'paint': { 'line-color': '#2a2a2a' }
        },
        {
            'id': 'line-vnbridge-quoclo-index',
            'paint': {
                'line-color': {
                    'base': 1,
                    'stops': [
                        [0, '#F2822C'],
                        [11, '#F2822C'],
                        [12, 'hsl(26, 87%, 34%)']
                    ]
                }
            }
        },
        {
            'id': 'line-vnbridge-caotoc-index',
            'paint': {
                'line-color': {
                    'base': 1,
                    'stops': [
                        [0, '#cc3737'],
                        [11, '#cc3737'],
                        [12, '#943232']
                    ]
                }
            }
        },
        {
            'id': 'fill-vnbridge-hemlo-index',
            'paint': { 'line-color': dark18 }
        },
        {
            'id': 'fill-vnbridge-huyenlo-index',
            'paint': {
                'line-color': {
                    'stops': [
                        [16, dark16],
                        [18, dark18]
                    ]
                }
            }
        },
        {
            'id': 'fill-vnbridge-tinhlo-index',
            'paint': {
                'line-color': {
                    'stops': [
                        [14, dark14],
                        [16, dark16],
                        [18, dark18]
                    ]
                }
            }
        },
        {
            'id': 'fill-vnbridge-quoclo-index',
            'paint': { 'line-color': '#F2822C' }
        },
        {
            'id': 'fill-vnbridge-caotoc-index',
            'paint': { 'line-color': '#cc3737' }
        },
        {
            'id': 'line-vnborder-halo-index',
            'add': true
        },
        {
            'id': 'line-vnborder-1-1-index',
            'paint': { 'line-color': '#933' }
        },
        {
            'id': 'line-vnborder-1-0-index',
            'paint': { 'line-color': 'rgba(15, 15, 15, 1)' }
        },
        {
            'id': 'line-vnborder-2-index',
            'paint': { 'line-color': '#666' }
        },
        {
            'id': 'line-vnborder-2-conflict-index',
            'paint': { 'line-color': '#933' }
        },
        {
            'id': 'line-vnborder-3-index',
            'paint': { 'line-color': '#666' }
        },
        {
            'id': 'line-vnrailway-line-index',
            'paint': { 'line-color': '#444' }
        },
        {
            'id': 'line-vnrailway-track-index',
            'paint': { 'line-color': '#444' }
        },
        {
            'id': 'region_building3d_index',
            'paint': { 'fill-extrusion-color': 'rgba(82, 82, 82, 1)' }
        },
        {
            'id': 'label_vnmarine_line_index',
            'paint': { 'text-color': '#111' }
        },
        {
            'id': 'label-vnriver-index',
            'paint': { 'text-color': '#ffffff' }
        },
        {
            'id': 'label-vnroad-hemlo-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#222'
            }
        },
        {
            'id': 'label-vnroad-huyenlo-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#222'
            }
        },
        {
            'id': 'label-vnroad-tinhlo-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#222'
            }
        },
        {
            'id': 'label-vnroad-quoclo-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#222',
                'text-halo-width': 1.2
            }
        },
        {
            'id': 'label-vnroad-caotoc-index',
            'paint': { 'text-halo-width': 1.2 }
        },
        {
            'id': 'label-vnpoi-hospital-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#933',
                'text-halo-width': 1
            }
        },
        {
            'id': 'label-vnpoi-park-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#30722b',
                'text-halo-width': 1
            }
        },
        {
            'id': 'label-vnpoi-police-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#714c12',
                'text-halo-width': 1
            }
        },
        {
            'id': 'label-vnpoi-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#374C51',
                'text-halo-width': 1
            }
        },
        {
            'id': 'label-vnadmin-10-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#613000'
            }
        },
        {
            'id': 'label-vnadmin-789-index',
            'paint': {
                'text-color': '#aaaaaa',
                'text-halo-color': '#3c1e00'
            }
        },
        {
            'id': 'label-vnadmin-456-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#613000'
            }
        },
        {
            'id': 'label-vncities-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#800',
                'text-halo-width': 1
            }
        },
        {
            'id': 'label-vnadmin-12-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#333'
            }
        },
        {
            'id': 'label_wcountry_index'
        },
        {
            'id': 'label-wcapitals-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#933',
                'text-halo-width': 1
            }
        },
        {
            'id': 'label-vnisland-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#005291'
            }
        },
        {
            'id': 'label-wcontient-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#333'
            }
        }
    ]
};

export default darkStyleOverride;
