import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { View } from 'react-native';

const PagerView = forwardRef<any, any>((props, ref) => {
  const { children, initialPage = 0, onPageSelected } = props;
  const pages = React.Children.toArray(children);

  const [page, setPageState] = useState(initialPage);

  useImperativeHandle(ref, () => ({
    setPage: (index: number) => {
      setPageState(index);
      onPageSelected?.({ nativeEvent: { position: index } });
    },
  }));

  return <View>{pages[page]}</View>;
});

export default PagerView;
