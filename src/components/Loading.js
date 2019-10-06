import React from 'react';
import PropType from 'prop-types';
import './Loading.css';

const Loading = (props) => {
    const { width, height } = props;

    return <div className="loading" style={{ width, height }} />;
}

Loading.defaultProps = {
  width: '28px',
  height: '28px',
};

Loading.propTypes = {
    width: PropType.string,
    height: PropType.string,
}

export default Loading;