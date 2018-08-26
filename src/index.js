import React, { Component } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';

let sourceUrl = "http://localhost:1221";

class MyPDF extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      imgStream: ''
    }
  }

  componentDidMount() {
    $.get(
      sourceUrl + "/page?index=" + this.props.page + "&size=9", (res) => {
        let resp = JSON.parse(res);
        console.log(resp.result);
        if (resp.result) {
            this.setState({
              imgStream: "data:image/png;base64,"+resp.result
            })
        } else if (resp.error) {
          this.setState({
            success: false
          })
        }
      })
  }

  render() {
    return (
      <div>
          <img src={this.state.imgStream} />
      </div>
    )
  }
}

render(
  <MyPDF page="1"/>,
  document.getElementById('app')
);