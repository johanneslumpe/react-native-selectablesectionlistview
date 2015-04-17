'use strict';
/* jshint esnext: true */

var React = require('react-native');
var {Component, ListView, StyleSheet, View, PropTypes} = React;
var UIManager = require('NativeModules').UIManager;
var merge = require('merge');

var SectionHeader = require('./SectionHeader');
var SectionList = require('./SectionList');
var CellWrapper = require('./CellWrapper');

class SelectableSectionsListView extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (prev, next) => prev !== next
      }),
      offsetY: 0
    };

    this.renderFooter = this.renderFooter.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);

    this.onScroll = this.onScroll.bind(this);
    this.onScrollAnimationEnd = this.onScrollAnimationEnd.bind(this);
    this.scrollToSection = this.scrollToSection.bind(this);

    // used for dynamic scrolling
    // always the first cell of a section keyed by section id
    this.cellTagMap = {};
    this.sectionTagMap = {};
    this.updateTagInCellMap = this.updateTagInCellMap.bind(this);
    this.updateTagInSectionMap = this.updateTagInSectionMap.bind(this);
  }

  componentDidMount() {
    // push measuring into the next tick
    setTimeout(() => {
      UIManager.measure(this.refs.view.getNodeHandle(), (x,y,w,h) => {
        this.containerHeight = h;
      });
    }, 0);

    // only if we have an object, the sidebar will show
    // without it we don't need to know the total height
    if (!Array.isArray(this.props.data)) {
      this.calculateTotalHeight();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.calculateTotalHeight(nextProps.data);
    }
  }

  calculateTotalHeight(data) {
    data = data || this.props.data;
    this.totalHeight = Object.keys(data)
      .reduce((carry, key) => {
        carry += data[key].length * this.props.cellHeight;
        carry += this.props.sectionHeaderHeight;
        return carry;
      }, 0);
  }

  updateTagInSectionMap(tag, section) {
    this.sectionTagMap[section] = tag;
  }

  updateTagInCellMap(tag, section) {
    this.cellTagMap[section] = tag;
  }

  scrollToSection(section) {
    if (!this.props.useDynamicHeights) {
      var cellHeight = this.props.cellHeight;
      var sectionHeaderHeight = this.props.sectionHeaderHeight;
      var keys = Object.keys(this.props.data);
      var index = keys.indexOf(section);

      var numcells = 0;
      for (var i = 0; i < index; i++) {
        numcells += this.props.data[keys[i]].length;
      }

      sectionHeaderHeight = index * sectionHeaderHeight;
      var y = numcells * cellHeight + sectionHeaderHeight;
      var maxY = this.totalHeight-this.containerHeight;
      y = y > maxY ? maxY : y;

      this.refs.listview.refs.listviewscroll.scrollTo(y, 0);
    } else {
      // this breaks, if not all of the listview is pre-rendered!
      UIManager.measure(this.cellTagMap[section], (x,y,w,h) => {
        y = y-this.props.sectionHeaderHeight;
        this.refs.listview.refs.listviewscroll.scrollTo(y, 0);
      });
    }

    this.props.onScrollToSection && this.props.onScrollToSection(section);
  }

  renderSectionHeader(sectionData, sectionId) {
    var updateTag = this.props.useDynamicHeights ?
      this.updateTagInSectionMap :
      null;

    var title = this.props.getSectionTitle ?
      this.props.getSectionTitle(sectionId) :
      sectionId;

    return (
      <SectionHeader
        component={this.props.sectionHeader}
        title={title}
        sectionId={sectionId}
        sectionData={sectionData}
        updateTag={updateTag}
      />
    );
  }

  renderFooter() {
    var Footer = this.props.footer;
    return Footer ?
      <Footer /> :
      <View />;
  }

  renderRow(item, sectionId, index) {
    var CellComponent = this.props.cell;
    index = parseInt(index, 10);

    var props = {
      sectionId,
      index,
      item,
      offsetY: this.state.offsetY,
      onSelect: this.props.onCellSelect
    };

    return index === 0 && this.props.useDynamicHeights ?
      <CellWrapper
        updateTag={this.updateTagInCellMap}
        component={CellComponent} {...props} {...this.props.cellProps} /> :
      <CellComponent {...props} {...this.props.cellProps} />;
  }

  onScroll(e) {
    var offsetY = e.nativeEvent.contentOffset.y;
    if (this.props.updateScrollState) {
      this.setState({
        offsetY
      });
    }

    this.props.onScroll && this.props.onScroll(e);
  }

  onScrollAnimationEnd(e) {
    if (this.props.updateScrollState) {
      this.setState({
        offsetY: e.nativeEvent.contentOffset.y
      });
    }
  }

  render() {
    var data = this.props.data;
    var dataIsArray = Array.isArray(data);
    var sectionList;
    var renderSectionHeader;
    var dataSource;

    if (dataIsArray) {
      dataSource = this.state.dataSource.cloneWithRows(data);
    } else {
      sectionList = !this.props.hideSectionList ?
        <SectionList
          style={this.props.sectionListStyle}
          onPress={this.scrollToSection}
          sections={Object.keys(data)}
          getSectionListTitle={this.props.getSectionListTitle}
          component={this.props.sectionListItem}
        /> :
        null;

      renderSectionHeader = this.renderSectionHeader;
      dataSource = this.state.dataSource.cloneWithRowsAndSections(data);
    }

    var props = merge(this.props, {
      onScroll: this.onScroll,
      onScrollAnimationEnd: this.onScrollAnimationEnd,
      dataSource,
      renderFooter: this.renderFooter,
      renderRow: this.renderRow,
      renderSectionHeader
    });

    props.style = void 0;

    return (
      <View ref="view" style={[styles.container, this.props.style]}>
        <ListView
          ref="listview"
          {...props}
        />
        {sectionList}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

var stylesheetProp = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.object,
]);

SelectableSectionsListView.propTypes = {
  /**
   * The data to render in the listview
   */
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,

  /**
   * Whether to show the section listing or not
   */
  hideSectionList: PropTypes.bool,

  /**
   * Functions to provide a title for the section header and the section list
   * items. If not provided, the section ids will be used (the keys from the data object)
   */
  getSectionTitle: PropTypes.func,
  getSectionListTitle: PropTypes.func,

  /**
   * Callback which should be called when a cell has been selected
   */
  onCellSelect: PropTypes.func,

  /**
   * Callback which should be called when the user scrolls to a section
   */
  onScrollToSection: PropTypes.func,

  /**
   * The cell element to render for each row
   */
  cell: PropTypes.func.isRequired,

  /**
   * A custom element to render for each section list item
   */
  sectionListItem: PropTypes.func,

  /**
   * A custom element to render for each section header
   */
  sectionHeader: PropTypes.func,

  /**
   * A custom element to render as footer
   */
  footer: PropTypes.func,

  /**
   * An object containing additional props, which will be passed
   * to each cell component
   */
  cellProps: PropTypes.object,

  /**
   * The height of the section header component
   */
  sectionHeaderHeight: PropTypes.number.isRequired,

  /**
   * The height of the cell component
   */
  cellHeight: PropTypes.number.isRequired,

  /**
   * Whether to determine the y postion to scroll to by calculating header and
   * cell heights or by using the UIManager to measure the position of the
   * destination element. This is an exterimental feature
   */
  useDynamicHeights: PropTypes.bool,

  /**
   * Whether to set the current y offset as state and pass it to each
   * cell during re-rendering
   */
  updateScrollState: PropTypes.bool,

  /**
   * Styles to pass to the container
   */
  style: stylesheetProp,

  /**
   * Styles to pass to the section list container
   */
  sectionListStyle: stylesheetProp

};

module.exports = SelectableSectionsListView;
