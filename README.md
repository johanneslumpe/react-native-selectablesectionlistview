# react-native-selectablesectionlistview

A Listview with a sidebar to directly jump to sections.

Please file issues for missing features or bugs.

I apologize for the bad name.

![How it looks](http://lum.pe/sectionlistview.gif)

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

You can find a more complete example below

## Props

All props are passed through to the underlying `ListView`, so you can specify all the available props for `ListView` normally - except the following, which are defined internally and will be overwritten:

* `onScroll`
* `onScrollAnimationEnd`
* `dataSource`
* `renderFooter`
* `renderRow`
* `renderSectionHeader`

### data
`array|object`, **required**  
The data to render in the listview

### hideSectionList
`boolean`  
Whether to show the section listing or not. *Note: If the data your are providing to
the component is an array, the section list will automatically be hidden.*

### getSectionTitle
`function`  
Function to provide titles for the section headers

### getSectionListTitle
`function`  
Function to provide titles for the section list items

### onCellSelect
`function`  
Callback which should be called when a cell has been selected

### onScrollToSection
`function`  
Callback which should be called when the user scrolls to a section

### cell
`function` **required**  
The cell component to render for each row

### sectionListItem
`function`  
A custom component to render for each section list item

### sectionHeader
`function`  
A custom component to render for each section header

### footer
`function`  
A custom component to render as footer

### cellProps
`object`  
An object containing additional props, which will be passed to each cell component

### sectionHeaderHeight
`number` **required**  
The height of the section header component

### cellHeight
`number` **required**  
The height of the cell component

### useDynamicHeights
`boolean`  
Whether to determine the y postion to scroll to by calculating header and cell heights or by using the UIManager to measure the position of the destination element.  
**This is an experimental feature**

### updateScrollState
`boolean`  
Whether to set the current y offset as state and pass it to each cell during re-rendering

### style
`object|number`  
Styles to pass to the container

### sectionListStyle
`object|number`  
Styles to pass to the section list container

## Example

```javascript
class SectionHeader extends Component {
  render() {
    // inline styles used for brevity, use a stylesheet when possible
    var textStyle = {
      textAlign:'center',
      color:'#fff',
      fontWeight:'700',
      fontSize:16
    };

    var viewStyle = {
      backgroundColor: '#ccc'
    };
    return (
      <View style={viewStyle}>
        <Text style={textStyle}>{this.props.title}</Text>
      </View>
    );
  }
}

class SectionItem extends Component {
  render() {
    return (
      <Text style={{color:'#f00'}}>{this.props.title}</Text>
    );
  }
}

class Cell extends Component {
  render() {
    return (
      <View style={{height:30}}>
        <Text>{this.props.item}</Text>
      </View>
    );
  }
}

class MyComponent extends Component {

  constructor(props, context) {
    super(props, context);
    
    this.state = {
      data: {
        A: ['some','entries','are here'],
        B: ['some','entries','are here'],
        C: ['some','entries','are here'],
        D: ['some','entries','are here'],
        E: ['some','entries','are here'],
        F: ['some','entries','are here'],
        G: ['some','entries','are here'],
        H: ['some','entries','are here'],
        I: ['some','entries','are here'],
        J: ['some','entries','are here'],
        K: ['some','entries','are here'],
        L: ['some','entries','are here'],
        M: ['some','entries','are here'],
        N: ['some','entries','are here'],
        O: ['some','entries','are here'],
        P: ['some','entries','are here'],
        Q: ['some','entries','are here'],
        R: ['some','entries','are here'],
        S: ['some','entries','are here'],
        T: ['some','entries','are here'],
        U: ['some','entries','are here'],
        V: ['some','entries','are here'],
        X: ['some','entries','are here'],
        Y: ['some','entries','are here'],
        Z: ['some','entries','are here'],
      }
    };
  }

  render() {
    return (
      <SelectableSectionsListView
        data={this.state.data}
        cell={Cell}
        cellHeight={30}
        sectionListItem={SectionItem}
        sectionHeader={SectionHeader}
        sectionHeaderHeight={22.5}
      />
    );
  }
}

```
