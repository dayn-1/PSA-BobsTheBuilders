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
        maxHeight: '400px', // Adjust the height as needed
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollView;