import React from 'react';

import TinyKeepVisualizer from './algorithms/map_generation/tinykeep/TinyKeepVisualizer';

const algorithms = {
    mapGeneration: {
        tinykeep: "tinykeep"
    }
}

export default class ProceduralGenerationVisualizer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            algorithm: algorithms.mapGeneration.tinykeep,

        }
    }

    render () {
        return (
            <div>
                <TinyKeepVisualizer/>
            </div>
          );
    }
}