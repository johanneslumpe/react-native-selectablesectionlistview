# react-native-selectablesectionlistview

A Listview with a sidebar to directly jump to sections.

Please file issues for missing features or bugs.

I apologize for the bad name.

## Usage

The most basic way to use this component is as follows:

```javascript
var SelectableSectionsListView = require('react-native-selectablesectionlistview');

// inside your render function
<SelectableSectionsListView
  data={yourData}
  cell={YourCellComponent}
  cellHeight={100}
  sectionHeaderHeight={22.5}
/>
```

## Props

### data
The data to render in the listview

### hideSectionList
Whether to show the section listing or not. *Note: If the data your are providing to
the component is an array, the section list will automatically be hidden.*

### getSectionTitle
Function to provide titles for the section headers

### getSectionListTitle
Function to provide titles for the section list items

### onCellSelect
Callback which should be called when a cell has been selected

### onScrollToSection
Callback which should be called when the user scrolls to a section

### cell
The cell component to render for each row

### sectionListItem
A custom component to render for each section list item

### sectionHeader
A custom component to render for each section header

### footer
A custom component to render as footer

### cellProps
An object containing additional props, which will be passed to each cell component

### sectionHeaderHeight
The height of the section header component

### cellHeight
The height of the cell component

### useDynamicHeights
Whether to determine the y postion to scroll to by calculating header and cell heights or by using the UIManager to measure the position of the destination element. **This is an exterimental feature**

### updateScrollState
Whether to set the current y offset as state and pass it to each cell during re-rendering

### style
Styles to pass to the container

### sectionListStyle
Styles to pass to the section list container
