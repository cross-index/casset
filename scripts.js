document.addEventListener('DOMContentLoaded', () => {
    const registerButton = document.getElementById('registerButton');
    const submitVoteButton = document.getElementById('submitVoteButton');
    const getResultButton = document.getElementById('getResultButton');

    // Registrar investidor
    registerButton.addEventListener('click', async () => {
        const investorAddress = document.getElementById('investorAddress').value;
        if (!investorAddress) {
            document.getElementById('registerMessage').innerText = 'Por favor, insira um endereço Ethereum válido.';
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ investorAddress })
            });
            const data = await response.json();
            document.getElementById('registerMessage').innerText = data.message;
        } catch (error) {
            document.getElementById('registerMessage').innerText = 'Erro ao registrar o investidor.';
            console.error(error);
        }
    });

    // Carregar candidatos altcoin
    async function loadAltcoinCandidates() {
        try {
            const response = await fetch('/api/altcoins');
            const candidates = await response.json();
            const candidatesDiv = document.getElementById('altcoinCandidates');
            candidatesDiv.innerHTML = '';

            candidates.forEach((candidate, index) => {
                const label = document.createElement('label');
                label.innerText = `Altcoin ${candidate.altcoinName}:`;
                
                const input = document.createElement('input');
                input.type = 'number';
                input.min = '1';
                input.placeholder = 'Rank';
                input.id = `preference-${index}`;

                candidatesDiv.appendChild(label);
                candidatesDiv.appendChild(input);
                candidatesDiv.appendChild(document.createElement('br'));
            });
        } catch (error) {
            console.error('Erro ao carregar candidatos altcoin:', error);
        }
    }

    // Votar
    submitVoteButton.addEventListener('click', async () => {
        const investorAddress = document.getElementById('investorAddress').value;
        if (!investorAddress) {
            document.getElementById('voteMessage').innerText = 'Por favor, registre-se primeiro.';
            return;
        }

        const preferences = [];
        document.querySelectorAll('[id^="preference-"]').forEach(input => {
            const rank = parseInt(input.value, 10);
            if (!isNaN(rank)) {
                preferences.push(rank);
            }
        });

        if (preferences.length === 0) {
            document.getElementById('voteMessage').innerText = 'Por favor, insira suas preferências de votação.';
            return;
        }

        try {
            const response = await fetch('/api/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ investorAddress, preferences })
            });
            const data = await response.json();
            document.getElementById('voteMessage').innerText = data.message;
        } catch (error) {
            document.getElementById('voteMessage').innerText = 'Erro ao votar.';
            console.error(error);
        }
    });

    // Obter resultados
    getResultButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/tally');
            const result = await response.json();
            document.getElementById('resultDisplay').innerText = `Resultado da eleição: ${JSON.stringify(result)}`;
        } catch (error) {
            console.error('Erro ao obter resultados:', error);
        }
    });

    // Carregar candidatos ao iniciar a página
    loadAltcoinCandidates();
});