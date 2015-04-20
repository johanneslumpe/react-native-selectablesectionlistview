'use strict';

var React = require('react-native');
var {Component, PropTypes, StyleSheet, View, Text} = React;
var UIManager = require('NativeModules').UIManager;

var noop = () => {};
var returnTrue = () => true;

class SectionList extends Component {

  constructor(props, context) {
    super(props, context);

    this.onSectionSelect = this.onSectionSelect.bind(this);
    this.resetSection = this.resetSection.bind(this);
    this.detectAndScrollToSection = this.detectAndScrollToSection.bind(this);
    this.lastSelectedIndex = null;
  }

  onSectionSelect(sectionId, fromTouch) {
    this.props.onSectionSelect && this.props.onSectionSelect(sectionId);

    if (!fromTouch) {
      this.lastSelectedIndex = null;
    }
  }

  resetSection() {
    this.lastSelectedIndex = null;
  }

  detectAndScrollToSection(e) {
    var ev = e.nativeEvent;
    var rect = {width:1, height:1, x: ev.locationX, y: ev.locationY};

    UIManager.measureViewsInRect(rect, e.target, noop, (frames) => {
      if (frames.length) {
        var index = frames[0].index;
        if (this.lastSelectedIndex !== index) {
          this.lastSelectedIndex = index;
          this.onSectionSelect(this.props.sections[index], true);
        }
      }
    });
  }

  render() {
    var SectionComponent = this.props.component;
    var sections = this.props.sections.map((section, index) => {
      var title = this.props.getSectionListTitle ?
        this.props.getSectionListTitle(section) :
        section;

      var child = SectionComponent ?
        <SectionComponent
          sectionId={section}
          title={title}
        /> :
        <View
          style={styles.item}>
          <Text style={styles.text}>{title}</Text>
        </View>;

      return (
        <View key={index} pointerEvents="none">
          {child}
        </View>
      );
    });

    return (
      <View style={[styles.container, this.props.style]}
        onStartShouldSetResponder={returnTrue}
        onMoveShouldSetResponder={returnTrue}
        onResponderGrant={this.detectAndScrollToSection}
        onResponderMove={this.detectAndScrollToSection}
        onResponderRelease={this.resetSection}
      >
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
   * Function to be called upon selecting a section list item
   */
  onSectionSelect: PropTypes.func,

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
