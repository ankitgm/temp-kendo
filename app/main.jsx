import * as React from 'react';
import * as ReactDOM from 'react-dom';

import '@progress/kendo-react-animation';
import {
  TreeView,
  processTreeViewItems,
  handleTreeViewCheckChange,
} from '@progress/kendo-react-treeview';

const treeData = [
  {
    text: 'Furniture',
    expanded: true,
    items: [
      { text: 'Tables & Chairs' },
      { text: 'Sofas' },
      { text: 'Occasional Furniture' },
    ],
  },
  {
    text: 'Decor',
    expanded: true,
    items: [
      { text: 'Bed Linen' },
      { text: 'Curtains & Blinds' },
      { text: 'Carpets' },
    ],
  },
];

class App extends React.Component {
  state = {
    data: treeData,
    check: {
      ids: [],
      applyCheckIndeterminate: true,
    },
    expand: {
      ids: [],
      idField: 'text',
    },
    select: [''],
  };
  onItemClick = (event) => {
    this.setState({ select: [event.itemHierarchicalIndex] });
  };
  onExpandChange = (event) => {
    let ids = this.state.expand.ids.slice();
    const index = ids.indexOf(event.item.text);
    index === -1 ? ids.push(event.item.text) : ids.splice(index, 1);
    this.setState({ expand: ids, idField: 'text' });
  };
  onCheckChange = (event) => {
    const settings = {
      singleMode: false,
      checkChildren: true,
      checkParents: true,
    };
    this.setState({
      check: handleTreeViewCheckChange(
        event,
        this.state.check,
        treeData,
        settings
      ),
    });
  };

  handleSearch = () => {
    let value = document.querySelector('.k-textbox').value;
    let newData = this.search(treeData, value);
    this.setState({ data: newData });
  };

  search = (items, term) => {
    return items.reduce((acc, item) => {
      if (this.contains(item.text, term)) {
        acc.push(item);
      } else if (item.items && item.items.length > 0) {
        let newItems = this.search(item.items, term);
        if (newItems && newItems.length > 0) {
          acc.push({
            text: item.text,
            items: newItems,
            expanded: item.expanded,
          });
        }
      }
      return acc;
    }, []);
  };

  contains = (text, term) => {
    return text.toLowerCase().indexOf(term.toLowerCase()) >= 0;
  };

  render() {
    return (
      <div>
        <input className="k-textbox" onChange={this.handleSearch} />
        <hr />
        <TreeView
          data={processTreeViewItems(this.state.data, {
            select: this.state.select,
            check: this.state.check,
            expand: this.state.expand,
          })}
          expandIcons={true}
          checkboxes={true}
          onExpandChange={this.onExpandChange}
          aria-multiselectable={true}
          onItemClick={this.onItemClick}
          onCheckChange={this.onCheckChange}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('my-app'));
