import React from "react";
import { withLeaflet } from "react-leaflet";
import Locate from "leaflet.locatecontrol";

class LocateControl extends React.Component {
  componentDidMount() {
    const { map } = this.props.leaflet;

    const lc = new Locate({locateOptions: {maxZoom: 17}})
    lc.addTo(map);

  }

  render() {
    return null;
  }
}

export default withLeaflet(LocateControl);