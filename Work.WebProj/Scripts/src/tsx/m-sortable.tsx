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

        constructor() {
            super();
            this.sortableGroup = this.sortableGroup.bind(this);
            this.render = this.render.bind(this);

            this.state = {
                list: [1, 2, 3, 4, 5, 6, 7, 8]
            }
        }
        static defaultProps: BaseDefine.GridFormPropsBase = {

        }
        sortableGroup(componentBackingInstance) {
            if (componentBackingInstance) {
                console.log('hello', componentBackingInstance);
            }
        }
        render() {

            var outHtml: JSX.Element = null;
            outHtml = (
                <div>
                    <ol className="upload-img list-inline" ref={this.sortableGroup}>
                        {
                            this.state.list.map((item, i) => {
                                return <li></li>;
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