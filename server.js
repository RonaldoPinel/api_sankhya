const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

const client_id = process.env.'0acc22fa-ad6b-42f8-a220-afe4234cc8ed';
const client_secret = process.env.'nEZo3ld2B9WjUVgOt4F6b0Ur8hd05cBn';
const x_token = process.env.'9ac9daa3-d4a7-4210-a328-3bfffc50f4c5';

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

app.get('/token', (req, res) => {
    res.json({ token: accessToken });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
