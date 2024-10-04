const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545'); // Conectando ao provedor Ethereum local

const governanceContractABI = [
  // ABI do contrato de governança omitido para brevidade
];

const governanceContractAddress = '0x1234567890abcdef1234567890abcdef12345678'; // Endereço fictício
const governanceContract = new web3.eth.Contract(governanceContractABI, governanceContractAddress);

// Função para registrar um investidor
async function registerInvestor(investorAddress) {
  try {
    await governanceContract.methods.registerVoter(investorAddress).send({ from: investorAddress });
    console.log(`Investidor ${investorAddress} registrado com sucesso.`);
  } catch (error) {
    console.error('Erro ao registrar investidor:', error);
  }
}

// Função para registrar um voto com preferências
async function castVote(investorAddress, preferences) {
  try {
    await governanceContract.methods.vote(preferences).send({ from: investorAddress });
    console.log(`Voto registrado com sucesso por ${investorAddress}`);
  } catch (error) {
    console.error('Erro ao registrar voto:', error);
  }
}

// Função para obter a lista de candidatos (altcoins)
async function getAltcoinCandidates() {
  try {
    const candidates = await governanceContract.methods.getCandidates().call();
    console.log('Candidatos Altcoin:', candidates);
    return candidates;
  } catch (error) {
    console.error('Erro ao obter candidatos altcoin:', error);
  }
}

// Função para obter as preferências do investidor
async function getInvestorPreferences(investorAddress) {
  try {
    const preferences = await governanceContract.methods.getVoterPreferences(investorAddress).call();
    return preferences;
  } catch (error) {
    console.error('Erro ao obter preferências do investidor:', error);
  }
}

// Função para contabilizar os votos
async function tallyVotes() {
  try {
    const result = await governanceContract.methods.tallyVotes().call();
    console.log('Resultado da eleição:', result);
    return result;
  } catch (error) {
    console.error('Erro ao contabilizar votos:', error);
  }
}

module.exports = {
  registerInvestor,
  castVote,
  getAltcoinCandidates,
  getInvestorPreferences,
  tallyVotes
};