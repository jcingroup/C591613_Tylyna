import $ = require('jquery');
import React = require('react');
import ReactDOM = require('react-dom');
import Moment = require('moment');
import Sortable = require('sortablejs');

namespace SortableTest {
    interface FormState<G, F> extends BaseDefine.GirdFormStateBase<G, F> {
        searchData?: {
            keyword: string
            is_folder: boolean,
            parent_menu_id: number
        }
        folder?: server.Option[]
    }

    export class GridForm extends React.Component<any, { list: Array<number> }>{
        _sortable: any;
        constructor() {
            super();
            this.sortableGroup = this.sortableGroup.bind(this);
            this.render = this.render.bind(this);

            this.state = {
                list: [5, 6, 7, 8, 9, 10, 11, 12]
            }
            this._sortable = null;
        }
        static defaultProps: BaseDefine.GridFormPropsBase = {

        }
        sortableGroup(componentBackingInstance) {
            if (componentBackingInstance) {
                let _this = this;

                let options = {
                    draggable: "li",
                    group: "shared",
                    onSort: function (evt) {
                        var itemEl = evt.item;
                        //console.log('sort', itemEl);

                        var data_array = _this.state.list;
                        //alert('submit move')
                        //console.log(evt.oldIndex, evt.newIndex);
                        data_array.movesort(evt.oldIndex, evt.newIndex);

                        var parms = [];
                        data_array.forEach((item, i) => {
                            parms.push(item);
                        })
                        //console.log('sortable', data_array);
                    },
                    onUpdate: function (evt) {
                        var itemEl = evt.item;  // dragged HTMLElement
                        //console.log('update', itemEl);
                        // + indexes from onEnd
                    }
                };

                this._sortable = Sortable.create(componentBackingInstance, options);
            }
        }
        render() {

            var outHtml: JSX.Element = null;
            outHtml = (
                <div>
                    <ol ref={this.sortableGroup}>
                        {
                            this.state.list.map((item, i) => {
                                return <li key={item}>{item}</li>;
                            })
                        }
                    </ol>
                </div>
            );


            return outHtml;
        }
    }
}

var dom = document.getElementById('page_content');
ReactDOM.render(<SortableTest.GridForm />, dom);