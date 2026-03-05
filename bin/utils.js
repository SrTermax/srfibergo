const chalk = require("chalk");

function validatePort(port) {
  const portNum = parseInt(port);
  if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
    return { valid: false, port: "3000" };
  }
  return { valid: true, port: portNum.toString() };
}

function logError(message) {
  console.log(chalk.red(`❌ ${message}`));
}

function logSuccess(message) {
  console.log(chalk.green(`✅ ${message}`));
}

function logInfo(message) {
  console.log(chalk.blue(`🚀 ${message}`));
}

function logWarning(message) {
  console.log(chalk.yellow(`⚠️  ${message}`));
}

function printNextSteps(projectName, port) {
  console.log(chalk.yellow(`\n📝 Próximos passos:`));
  console.log(chalk.white(`   cd ${projectName}`));
  console.log(chalk.white(`   go mod tidy`));
  console.log(chalk.white(`   go run main.go`));
  console.log(chalk.white(`\n🌐 Acesse: http://localhost:${port}`));
}

module.exports = {
  validatePort,
  logError,
  logSuccess,
  logInfo,
  logWarning,
  printNextSteps,
};
