import React from 'react';

interface ScrollViewProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const ScrollView: React.FC<ScrollViewProps> = ({ children, style }) => {
  return (
    <div
      style={{
        overflowY: 'scroll',
        maxHeight: '100vh', // Set the height to the viewport height
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollView;
