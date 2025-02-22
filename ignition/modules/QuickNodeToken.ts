// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const QuickNodeTokenModule = buildModule("QuickNodeTokenModule", (m) => {
  const quickNodeToken = m.contract("QuickNodeToken");

  return { quickNodeToken };
});

module.exports = QuickNodeTokenModule;