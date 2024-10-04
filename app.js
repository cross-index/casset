const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { registerInvestor, castVote, getAltcoinCandidates, getInvestorPreferences, tallyVotes } = require('./VotingBackend');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos para o frontend
app.use(express.static(path.join(__dirname, 'public')));

// Rota para obter a lista de candidatos altcoin
app.get('/api/altcoins', async (req, res) => {
  try {
    const candidates = await getAltcoinCandidates();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao obter candidatos altcoin' });
  }
});

// Rota para registrar um investidor
app.post('/api/register', async (req, res) => {
  const { investorAddress } = req.body;
  try {
    await registerInvestor(investorAddress);
    res.status(200).json({ message: `Investidor ${investorAddress} registrado com sucesso` });
  } catch (error) {
    res.status(500).json({ error: 'Falha ao registrar investidor' });
  }
});

// Rota para registrar um voto
app.post('/api/vote', async (req, res) => {
  const { investorAddress, preferences } = req.body;
  try {
    await castVote(investorAddress, preferences);
    res.status(200).json({ message: `Voto registrado com sucesso para ${investorAddress}` });
  } catch (error) {
    res.status(500).json({ error: 'Falha ao registrar voto' });
  }
});

// Rota para obter as preferências do investidor
app.get('/api/preferences/:investorAddress', async (req, res) => {
  const { investorAddress } = req.params;
  try {
    const preferences = await getInvestorPreferences(investorAddress);
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao obter preferências do investidor' });
  }
});

// Rota para contabilizar os votos
app.get('/api/tally', async (req, res) => {
  try {
    const result = await tallyVotes();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao contabilizar votos' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});