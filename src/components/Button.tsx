import React from 'react';
import { Box, Button } from 'native-base';

interface ButtonProps {
  handle: () => void;
}

const PageButton = ({ handle }: ButtonProps) => {
  return (
    <Box alignItems="center">
      <Button
        onPress={handle}
        bg="#2196F3"
        style={{
          width: 'auto',
          borderRadius: 10,
          height: 60,
        }}
        _text={{
          color: 'white',
          fontWeight: 'bold',
          width: '400px',
          textAlign: 'center',
        }}
      >
        LOGIN
      </Button>
    </Box>
  );
};

export default PageButton;
