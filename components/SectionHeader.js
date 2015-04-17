'use strict';

var React = require('react-native');
var {Component, PropTypes, View, Text} = React;

class SectionHeader extends Component {

  componentDidMount() {
    this.props.updateTag && this.props.updateTag(this.refs.view.getNodeHandle(), this.props.sectionId);
  }

  render() {
    var SectionComponent = this.props.component;
    var content = SectionComponent ?
      <SectionComponent {...this.props} /> :
      <Text>{this.props.title}</Text>;

    return (
      <View ref="view">
        {content}
      </View>
    );
  }
}

SectionHeader.propTypes = {

  /**
   * The id of the section
   */
  sectionId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),

  /**
   * A component to render for each section item
   */
  component: PropTypes.func,

  /**
   * A function used to propagate the root nodes handle back to the parent
   */
  updateTag: PropTypes.func

};

module.exports = SectionHeader;
