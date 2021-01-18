const auth = require('../middleware/auth');
const config = require('config');
const db = require('mongoose');
const {Loan} = require('../models/loan');
const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    await Loan.find({}).then(eachOne => {
        res.json(eachOne);
        })
});

router.get('/:id', async (req, res) => {
  const loan = await Loan.findById(req.params.id);
  if (!loan) return res.status(404).send('Loan application not found.');
  res.send(loan);
});
/*
router.post('/new', async (req, res) => {
    let loan = new Loan(req.body, ['merchantId', 'amount', 'status', 'documents']);   
    await loan.save();
      
    res.send(loan);
});
*/
router.put('/:id', async (req, res) => {
  const loan = await Loan.findByIdAndUpdate(req.params.id, {
      merchantId: req.body.merchantId,
      amount: req.body.amount,
      status: req.body.status,
      documents: req.body.documents
    }
  );
  if (!loan) return res.status(404).send('Loan application not found.');

  res.send(loan);
});

module.exports = router;