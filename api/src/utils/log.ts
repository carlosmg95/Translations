import chalk from 'chalk';

type log = {
  [funcName: string]: (message: string) => void;
};

const log: log = {
  error(message: string) {
    console.log(`${chalk.red.bold('[error]')} ${chalk.red(message)}`);
  },
  info(message: string) {
    console.log(`${chalk.blue.bold('[info]')} ${chalk.blue(message)}`);
  },
  greet(message: string) {
    console.log(chalk.green.bold(message));
  },
  mutation(message: string) {
    console.log(`${chalk.blue.bold('[info]')} ${chalk.cyan(message)}`);
  },
  query(message: string) {
    console.log(`${chalk.blue.bold('[info]')} ${chalk.magenta(message)}`);
  },
};

export default log;
