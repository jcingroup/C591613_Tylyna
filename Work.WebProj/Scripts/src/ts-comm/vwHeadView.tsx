import * as React  from 'react';

export const HeadView = ({  }) => {
    return (
        <ul className="breadcrumb">
            <li>
                <i className="fa-caret-right"></i> { }
                {gb_menuname}
            </li>
            <li>
                <i className="fa-angle-right"></i> { }
                {gb_caption}
            </li>
        </ul>
    );
}