'use strict';

var React = require('react-native');
var {Component, PropTypes, TouchableOpacity, StyleSheet, View, Text} = React;

class SectionList extends Component {

  constructor(props, context) {
    super(props, context);

    this.onSectionSelect = this.onSectionSelect.bind(this);
  }

  onSectionSelect(sectionId) {
    this.props.onPress && this.props.onPress(sectionId);
  }

  render() {
    var SectionComponent = this.props.component;
    var sections = this.props.sections.map((section, index) => {
      var title = this.props.getSectionListTitle ?
        this.props.getSectionListTitle(section) :
        section;

      return SectionComponent ?
        <SectionComponent
          key={index}
          sectionId={section}
          title={title}
          onPress={this.onSectionSelect}
        /> :
        <TouchableOpacity
          key={index}
          onPress={() => this.onSectionSelect(section)}>
          <View style={styles.item}><Text style={styles.text}>{title}</Text></View>
        </TouchableOpacity>;
    });

    return (
      <View style={[styles.container, this.props.style]}>
        {sections}
      </View>
    );
  }
}

SectionList.propTypes = {

  /**
   * A component to render for each section item
   */
  component: PropTypes.func,

  /**
   * Function to provide a title the section list items.
   */
  getSectionListTitle: PropTypes.func,

  /**
   * Function to be called upon pressing a sction list item
   */
  onPress: PropTypes.func,

  /**
   * The sections to render
   */
  sections: PropTypes.array.isRequired,

  /**
   * A style to apply to the section list container
   */
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
  ])
};

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'transparent',
    alignItems:'center',
    justifyContent:'center',
    right: 0,
    top: 0,
    bottom: 0,
    width: 15
  },

  item: {
    padding: 0
  },

  text: {
    fontWeight: '700',
    color: '#008fff'
  }
});

module.exports = SectionList;
