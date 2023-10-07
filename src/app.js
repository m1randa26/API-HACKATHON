const express = require('express');
const app = express();
const port = 3000;

const conektaController = require('./controllers/methodController');

app.use(express.json());

app.post('/create_client', conektaController.createClient);

app.post('/create_order', (req, res) => {
    const { name, quantity, unit_price } = req.body;
    conektaController.createOrder(name, quantity, unit_price)
      .then(response => {
        console.log(response.data);
        res.json(response.data);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      });
  });

app.post('/create_payment', (req, res) => {
    const { amount, order_id } = req.body;
    conektaController.createPayment(order_id, amount)
        .then(response => {
            console.log(response);
            res.json(response.data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: 'An error ocurred'});
        });
});

app.listen(port, () => {
  console.log(`API de Conekta escuchando en http://localhost:${port}`);
});
