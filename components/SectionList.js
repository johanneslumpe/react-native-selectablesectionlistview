'use strict';

var React = require('react-native');
var {Component, PropTypes, TouchableOpacity, StyleSheet, View, Text} = React;
var UIManager = require('NativeModules').UIManager;

var noop = () => {};

class SectionList extends Component {

  constructor(props, context) {
    super(props, context);

    this.onSectionSelect = this.onSectionSelect.bind(this);
    this.lastSelectedIndex = null;
  }

  onSectionSelect(sectionId, fromTouch) {
    this.props.onPress && this.props.onPress(sectionId);

    if (!fromTouch) {
      this.lastSelectedIndex = null;
    }
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
      <View style={[styles.container, this.props.style]} onMoveShouldSetResponder={(e) => {
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
        }} >
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
