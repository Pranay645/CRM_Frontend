import { Box } from '@mui/material';
import Steps from './../StepWizard/Steps'

const Stepper = () => {

  return (
  <Box component="main" sx={{ flexGrow: 1, p: 2, m: 2 }}>
  <Steps/>
  </Box>

  );
};

export default Stepper;