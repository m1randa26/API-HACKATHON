const { CustomersApi, Configuration } = require("conekta");

const apikey = "key_lwzBcgiOetQJC5dZI0FHZN5";
const config = new Configuration({ accessToken: apikey });
const client = new CustomersApi(config);

const axios = require('axios');

const connection = require('../db');

const createClient = async (req, res) => {
  const customerData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone
  };

  try {
    const response = await client.createCustomer(customerData);
    const customerResponse = response.data;
    const custumer_id = customerResponse.id;

    connection.query('INSERT INTO custumers (customer_id) VALUES (?)', [custumer_id], (error, results, fields) => {
      if (error) {
        console.error('Error al guardar en la base de datos:', error);
        res.json({ success: false, error: error.message });
      } else {
        console.log('Cliente guardado en la base de datos');
        res.json({ success: true, custumer_id });
      }
    });
    res.json({ success: true, customerId: customerResponse.id });
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.json({ success: false, error: error.message });
  }
};

const createOrder = (name, quantity, unit_price) => {
  const options = {
    method: 'POST',
    url: 'https://api.conekta.io/orders',
    headers: {
      accept: 'application/vnd.conekta-v2.1.0+json',
      'Accept-Language': 'es',
      'content-type': 'application/json',
      authorization: 'Bearer key_lwzBcgiOetQJC5dZI0FHZN5'
    },
    data: {
      customer_info: { customer_id: 'cus_2ugsmEZ5SbaSweSvj' },
      pre_authorize: false,
      currency: 'MXN',
      line_items: [{ name: name, quantity: quantity, unit_price: unit_price * 100 }]
    }
  };
  console.log("Hola")
  return axios.request(options);
}

const createPayment = (order_id, amount) => {
  const options = {
    method: 'POST',
    url: `https://api.conekta.io/orders/${order_id}/charges`,
    headers: {
      accept: 'application/vnd.conekta-v2.1.0+json',
      'content-type': 'application/json',
      authorization: 'Bearer key_lwzBcgiOetQJC5dZI0FHZN5'
    },
    data: { payment_method: { type: 'cash' }, amount: amount * 100 }
  };

  return axios.request(options);
}

module.exports = {
  createClient,
  createOrder,
  createPayment
};