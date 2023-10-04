import { makeStyles } from '@mui/styles';
const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    stepper: {
      // Customize stepper styles here
      // @ts-ignore
      [theme.breakpoints.down('sm')]: {
        // Styles for screens smaller than or equal to 600px wide (adjust as needed)
        // @ts-ignore
        padding: theme.spacing(2),
      },
    },
    stepLabel: {
      // Customize step label styles here
      // @ts-ignore
      [theme.breakpoints.down('sm')]: {
        // Styles for screens smaller than or equal to 600px wide (adjust as needed)
        fontSize: '14px',
      },
    },
    // Add more styles for other components as needed
  }));
  
  export default useStyles;