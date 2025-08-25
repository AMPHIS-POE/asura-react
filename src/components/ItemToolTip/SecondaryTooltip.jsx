import React from 'react';
import ReactDOM from 'react-dom';
import parse from 'html-react-parser';
import './SecondaryTooltip.css';

const SecondaryTooltip = ({ data, position, isVisible }) => {
  if (!isVisible || !data) return null;

  return ReactDOM.createPortal(
    <div
      className="secondary-tooltip"
      style={{ top: position.y, left: position.x }}
    >
      {data.title && <div className="secondary-tooltip-header">{data.title}</div>}
      <div className="secondary-tooltip-body">
        {parse(data.content)}
      </div>
    </div>,
    document.body
  );
};

export default SecondaryTooltip;