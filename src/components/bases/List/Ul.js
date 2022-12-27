import React, {Component} from "react";

export class Ul extends Component
{
    render ()
    {
        return (
            <ul className={this.props.className}>{ this.props.children }</ul>
        );
    }
}



Ul.defaultProps ={
    className: ''
};
