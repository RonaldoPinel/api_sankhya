const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const x_token = process.env.X_TOKEN;

let accessToken = '';

async function gerarToken() {
    try {
        const response = await fetch('https://api.sandbox.sankhya.com.br/authenticate', {
            method: 'POST',
            headers: {
                'X-Token': x_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: client_id,
                client_secret: client_secret
            })
        });

        const data = await response.json();
        accessToken = data.access_token;

        console.log('🔄 Token renovado');
    } catch (err) {
        console.error('Erro ao gerar token:', err);
    }
}

gerarToken();
setInterval(gerarToken, 4 * 60 * 1000);

app.get('/token', async (req, res) => {
    try {
        if (!accessToken) {
            await gerarToken(); // força gerar se ainda não existe
        }

        res.json({ token: accessToken });
    } catch (err) {
        res.status(500).json({ erro: 'Falha ao gerar token' });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});


