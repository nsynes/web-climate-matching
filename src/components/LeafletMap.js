import React from 'react'
import LocateControl from './LocateControl';
import './LeafletMap.css';
import { Map as LeafletMap, TileLayer, Marker, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import {  iconTree  } from './IconTree';
import Loading from './Loading';

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          currentPos: null,
          apiResponse: '',
          maxValue: null,
          loading: false,
          noResults: false,
        };
    }

    handleMapClick = (e) => {
        if ( !this.state.loading && this.state.apiResponse === '' ) {
            this.setState({
                currentPos: e.latlng,
                noResults: false
            });
        }
    }

    refreshResults = () => {
        this.setState({
            currentPos: null,
            apiResponse: '',
            noResults: false
        });
    }

    matchClimate = () => {
        this.setState({
            apiResponse: '',
            loading: true,
            noResults: false
        })
        fetch(`/testAPI?lat=${this.state.currentPos.lat}&lon=${this.state.currentPos.lng}`)
        .then(res => {
            if ( res.ok ) {
                return res.text()
            } else {
                return ''
            }
        })
        .then(res => {
            if ( res ) {
                let resObj = JSON.parse(res);
                let maxValue = Math.max.apply(Math, resObj.features.map(function(o) { return o.properties.cd; }))
                this.setState({
                    apiResponse: resObj,
                    maxValue: maxValue,
                    loading: false
                 })
            } else {
                this.setState({
                    apiResponse: '',
                    maxValue: null,
                    loading: false,
                    noResults: true
                 })
            }
        });
    }

    perc2color = (value) => {
        const percentage = (value / this.state.maxValue) * 100

        const g = 255;
        const r = Math.round(255 - 2.55 * percentage);
        const b = 0
        const h = r * 0x10000 + g * 0x100 + b * 0x1;
        return '#' + ('000000' + h.toString(16)).slice(-6);
    }


    render() {

        let setStyle = (feature) => {
            let colour = this.perc2color(feature.properties.cd);
            let geojsonMarkerOptions = {
                fillColor: colour,
                color: colour,
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            let halfWidth = 0.083333335

            let latlng = {
                lng: feature.geometry.coordinates[0],
                lat: feature.geometry.coordinates[1]
            }
            var bounds = [[latlng.lat-halfWidth, latlng.lng-halfWidth], [latlng.lat+halfWidth, latlng.lng+halfWidth]];
            return L.rectangle(bounds, geojsonMarkerOptions)
        };

        return (
            <div>
                { this.state.loading && <Loading
                    width='48px'
                    height='48px'/> }
                <LeafletMap
                    className={ !this.state.loading && this.state.apiResponse === '' ? 'select-location' : ''}
                    ref='map'
                    style={{height: 600}}
                    center={[50, 10]}
                    zoom={4}
                    maxZoom={19}
                    attributionControl={true}
                    zoomControl={true}
                    doubleClickZoom={true}
                    scrollWheelZoom={true}
                    dragging={true}
                    animate={true}
                    easeLinearity={0.35}
                    onClick={this.handleMapClick}>
                    <LocateControl />
                    <TileLayer
                        url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    />
                    { this.state.noResults && <span className='no-results'>No results for selected location.</span>}
                    { this.state.currentPos && <Marker position={this.state.currentPos} icon={iconTree} draggable={false}>
                        </Marker> }
                    { this.state.apiResponse && <GeoJSON
                        key={'geojson01'}
                        data={this.state.apiResponse}
                        pointToLayer={setStyle.bind(this)}>
                    </GeoJSON> }
                </LeafletMap>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <div style={{width: '80%'}}>
                        <p className='title'>Climate matching tool</p>
                        {
                        this.state.apiResponse !== '' ?
                            <button onClick={this.refreshResults}>Refresh</button> :
                            !this.state.currentPos || this.state.loading ?
                                <button disabled>Calculate</button> :
                                <button onClick={this.matchClimate}>Calculate</button>
                        }
                        <p className='paragraph'>
                            This is a web demo version of the climate matching tool based on the methods in <a href='https://doi.org/10.1093/forestry/cpi014' target='_blank' rel="noopener noreferrer">Broadmeadow et al. (2005)</a>,
                            and briefly discussed <a href='https://nicksynes.com/2019/08/11/climate-matching-tool/' target='_blank' rel="noopener noreferrer">here</a>.
                            This demo does not include any of the parameter options available in the full version of the tool.
                        </p>
                        <p className='paragraph'>
                            The tool identifies locations in Europe where the current climate is most similar to the future climate of a selected point.
                            In this demo the future climate is for 2070, and is based on the HadGEM2-AO general circulation model, and representative concentration pathway 4.5.
                        </p>
                        <p className='paragraph'>
                            Select a location on the map, then click 'Calculate' to start.
                        </p>
                        <br />
                    </div>
                </div>
            </div>
        );
    }
}

export default Map;