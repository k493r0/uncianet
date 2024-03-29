import React, {Component} from 'react';
import Block from './Block';
import {Link} from "react-router-dom";

class Blocks extends Component {
  state = {blocks: []};

  componentDidMount() {
    fetch(`${document.location.origin}/api/blocks`)
      .then(res => res.json())
      .then(blocks => this.setState({blocks}));
  }

  render(){

    console.log('this.state', this.state)

    return (
        <div>
          <div><Link to='/'>Home</Link></div>
          <h3>Blocks</h3>
          {
            this.state.blocks.map(block => {
              return (
                  <Block key={block.hash} block={block} />
              );
            })
          }
        </div>
    )
  }
}

export default Blocks;